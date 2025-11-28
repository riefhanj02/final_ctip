import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/PlantDetailsStyles';
import { getPlantDetails } from '../data/plantDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlantDetails({ route, navigation }) {
  const { plant } = route.params || {};
  const details = getPlantDetails(plant?.id) || {};
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top half with left curve and plant image */}
      <View style={styles.topCard}>
        {/* Left-side curved green background */}
        <View style={styles.leftCurve} />

        {/* Back button */}
        <TouchableOpacity
          style={[styles.backCircle, { top: insets.top + 10 }]}
          onPress={() => navigation.navigate('Encyclopedia')}
        >
          <Ionicons name="chevron-back" size={22} color="#2F4F4F" />
        </TouchableOpacity>

        {/* Left plant image */}
        <View style={styles.leftImageWrap}>
          <Image source={details.heroImage || plant?.image} style={styles.mainImage} />
        </View>

        {/* Right full-height info section */}
        <View style={styles.rightStats}>
          <Text style={styles.smallLabel}>Size</Text>
          <Text style={styles.smallValue}>{details.size || 'Small'}</Text>

          <Text style={[styles.smallLabel, { marginTop: 14 }]}>Growth</Text>
          <Text style={styles.smallValue}>{details.growth || 'Slow'}</Text>

          <Text style={[styles.smallLabel, { marginTop: 14 }]}>Lifespan</Text>
          <Text style={styles.smallValue}>{details.lifespan || '10–20 y'}</Text>

          <Text style={[styles.smallLabel, { marginTop: 14 }]}>Conservation</Text>
          <Text style={styles.smallValue}>{details.conservation || 'Least Concern'}</Text>
        </View>
      </View>

      {/* Bottom detail section */}
      <View style={styles.detailPanel}>
        <Text style={styles.plantName}>{details.commonName || plant?.name}</Text>
        {/* scientific name, species, family */}
        <Text style={styles.scientificText}>
          {details.scientificName ? `${details.scientificName} • ${details.species || ''}` : ''}
        </Text>
        <Text style={[styles.scientificText, { marginTop: 6 }]}>{details.family || ''}</Text>

        <Text style={styles.description}>
          {details.description || plant?.subtitle || ''}
        </Text>
        
        {/* Habitat */}
        {details.habitat ? (
          <>
            <Text style={styles.habitatLabel}>Habitat</Text>
            <Text style={styles.habitatValue}>{details.habitat}</Text>
          </>
        ) : null}
        
        {/* Distribution */}
        {details.distribution ? (
          <>
            <Text style={styles.habitatLabel}>Distribution</Text>
            <Text style={styles.habitatValue}>{details.distribution}</Text>
          </>
        ) : null}
        
        {/* Where to find */}
        {details.whereToFind ? (
          <>
            <Text style={styles.habitatLabel}>Where to find</Text>
            <Text style={styles.habitatValue}>{details.whereToFind}</Text>
          </>
        ) : null}
        
        <Text style={styles.sectionTitle}>Real-life Pictures</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.leafRow}>
          {(details.gallery && details.gallery.length > 0
            ? details.gallery.slice(0, 5)
            : [
                require('../../assets/image/pic5.png'),
                require('../../assets/image/pic6.png'),
                require('../../assets/image/pic7.png'),
                require('../../assets/image/pic8.png'),
                require('../../assets/image/pic9.png'),
              ]
          ).map((img, idx) => (
            <View key={idx} style={styles.leafBox}>
              <Image source={img} style={styles.leafImage} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}