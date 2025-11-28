// components/S3Image.tsx
// S3 Image Component - Handles CORS, URL formatting, and error handling

import React, { useState } from 'react';
import { Image, Platform, StyleSheet, View, Text } from 'react-native';

interface S3ImageProps {
  source: { uri: string } | string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: any) => void;
  onLoad?: () => void;
}

export default function S3Image({
  source,
  style,
  resizeMode = 'cover',
  placeholder,
  fallback,
  onError,
  onLoad,
}: S3ImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Normalize source to URI string
  const uri = typeof source === 'string' ? source : source?.uri || '';

  // Format S3 URL if needed
  const formatS3Url = (url: string): string => {
    if (!url) return '';
    
    // If already a full URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's an S3 key, construct full URL
    // Assuming bucket name: smartplant-raw-uploads, region: us-east-1
    if (url.startsWith('uploads/') || !url.includes('/')) {
      const key = url.startsWith('uploads/') ? url : `uploads/${url}`;
      return `https://smartplant-raw-uploads.s3.us-east-1.amazonaws.com/${key}`;
    }
    
    return url;
  };

  const imageUri = formatS3Url(uri);

  // On web, use HTML img tag for better CORS handling
  if (Platform.OS === 'web') {
    // Merge styles properly for web (convert RN style to plain object)
    const webStyle: React.CSSProperties = {
      ...(style && typeof style === 'object' && !Array.isArray(style) ? style : {}),
      objectFit: resizeMode === 'cover' ? 'cover' : resizeMode,
      display: error ? 'none' : 'block',
    };
    
    // Handle React Native style arrays/flattened styles
    if (style && Array.isArray(style)) {
      style.forEach((s: any) => {
        if (s && typeof s === 'object') {
          Object.assign(webStyle, s);
        }
      });
    }
    
    return (
      <img
        src={imageUri}
        alt="Plant image"
        style={webStyle}
        onError={(e) => {
          console.warn('S3 Image failed to load:', imageUri);
          setError(true);
          if (onError) onError(e);
        }}
        onLoad={() => {
          setLoading(false);
          if (onLoad) onLoad();
        }}
        crossOrigin="anonymous"
      />
    );
  }

  // On native, use React Native Image
  if (error && fallback) {
    return <View style={style}>{fallback}</View>;
  }

  if (error) {
    return (
      <View style={[style, styles.errorContainer]}>
        <Text style={styles.errorText}>Image unavailable</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      resizeMode={resizeMode}
      onError={(e) => {
        console.warn('S3 Image failed to load:', imageUri);
        setError(true);
        if (onError) onError(e);
      }}
      onLoad={() => {
        setLoading(false);
        if (onLoad) onLoad();
      }}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

