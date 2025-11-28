# Lambda Function Code for Sightings (Map)

To enable the Map feature to fetch real data, you need to add a `/sightings` endpoint to your Lambda function and API Gateway.

## Required Endpoint

**GET `/sightings`**
- **Query Parameters**:
  - `lat`: Center latitude (optional)
  - `lng`: Center longitude (optional)
  - `radius`: Search radius in km (optional, default 50)
  - `filter`: Filter type (e.g., 'Common', 'Rare') (optional)

## Lambda Function Code

Add this function to your existing Lambda file (or merge it into your handler):

```python
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal

# Helper to convert Decimal to float for JSON serialization
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

dynamodb = boto3.resource('dynamodb')
sightings_table = dynamodb.Table('Sightings') # Ensure this table exists

def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')
    path = event.get('path', '')
    query_params = event.get('queryStringParameters') or {}
    
    if http_method == 'GET' and path.endswith('/sightings'):
        return get_sightings(query_params)
    
    # ... existing routes ...
    
    return {
        'statusCode': 404,
        'body': json.dumps({'error': 'Not found'})
    }

def get_sightings(params):
    """
    Get sightings with optional filtering.
    Note: For a production app with geo-queries, use GeoLibrary or OpenSearch.
    For this project, we'll scan/query and filter in memory or use basic GSI.
    """
    try:
        # 1. Basic Scan or Query
        # If you have a GSI on 'rarity', you can use it.
        # Otherwise, we scan (okay for small datasets < 1000 items).
        
        filter_type = params.get('filter')
        
        scan_kwargs = {}
        if filter_type and filter_type != 'All':
            # Filter by rarity or habitat if your data model supports it
            # Assuming 'rarity' is an attribute
            scan_kwargs['FilterExpression'] = Attr('rarity').eq(filter_type)
            
            # If 'filter' maps to habitat (e.g. 'Mangrove'), handle that:
            if filter_type in ['Mangrove', 'Lowland', 'Montane']:
                 scan_kwargs['FilterExpression'] = Attr('habitat').eq(filter_type)

        response = sightings_table.scan(**scan_kwargs)
        items = response.get('Items', [])
        
        # 2. Simple Geo-filtering (Circular)
        # If lat/lng provided, filter by distance
        lat = params.get('lat')
        lng = params.get('lng')
        
        if lat and lng:
            center_lat = float(lat)
            center_lng = float(lng)
            radius_km = float(params.get('radius', 50))
            
            filtered_items = []
            for item in items:
                # Simple Haversine or Euclidean approximation
                # item['coord'] should be { 'latitude': ..., 'longitude': ... }
                if 'coord' in item:
                    item_lat = float(item['coord']['latitude'])
                    item_lng = float(item['coord']['longitude'])
                    
                    # Euclidean approx for speed (good enough for small areas)
                    # 1 deg lat ~ 111km
                    dy = (item_lat - center_lat) * 111
                    dx = (item_lng - center_lng) * 111 * 0.99 # adjust for equator
                    dist = (dx*dx + dy*dy) ** 0.5
                    
                    if dist <= radius_km:
                        item['distance'] = f"{dist:.1f} km"
                        filtered_items.append(item)
            items = filtered_items

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'data': items
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
```

## DynamoDB Table Structure

Create a table named `Sightings`:
- **Partition Key**: `id` (String)
- **Attributes**:
  - `title` (String)
  - `sub` (String)
  - `rarity` (String)
  - `habitat` (String)
  - `coord` (Map) -> `{ latitude: N, longitude: N }`
  - `updatedAt` (Number/String)

## API Gateway Configuration

1. Create Resource: `/sightings`
2. Create Method: `GET`
3. Integration: Lambda Function
4. **Enable CORS**
5. **Deploy API**
