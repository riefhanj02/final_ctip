// Complete plant details database for all plants in the encyclopedia

const details = {
  // LOWLAND RAINFOREST PLANTS - COMMON SPECIES
  1: {
    scientificName: 'Alstonia_scholaris',
    commonName: "Devil's Tree, Pulai",
    family: 'Apocynaceae',
    species: 'A. scholaris',
    size: 'Large tree (up to 40m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Lowland and hill forests, roadside plantings',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      "Alstonia scholaris is a tall evergreen tree with white latex and whorled leaves. Its light timber is used for pencils, floats, and crates, while the bitter bark is valued in traditional medicine for treating fevers. The tree produces small fragrant white flowers and is commonly planted along roadsides.",
    whereToFind: 'Primary and secondary forests, roadside plantings across Malaysia.',
    heroImage: require('../../assets/image/pic1.png'),
    gallery: [
      require('../../assets/image/pic29.jpg'),
      require('../../assets/image/pic30.jpg'),
      require('../../assets/image/pic31.jpg'),
    ],
  },

  2: {
    scientificName: 'Antiaris toxicaria',
    commonName: 'Upas Tree',
    family: 'Moraceae',
    species: 'A. toxicaria',
    size: 'Large tree (up to 45m)',
    growth: 'Slow to moderate',
    lifespan: '100-200 years',
    conservation: 'Least Concern',
    habitat: 'Lowland and hill rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Antiaris toxicaria is famous for its highly toxic latex, which has been traditionally used as a primary ingredient in dart poison. It is a large buttressed tree with broad leaves and small fruits consumed by birds.',
    whereToFind: 'Primary and secondary lowland and hill forests.',
    heroImage: require('../../assets/image/pic2.png'),
    gallery: [
      require('../../assets/image/pic32.jpeg'),
      require('../../assets/image/pic33.jpg'),
      require('../../assets/image/pic34.jpeg'),
    ],
  },

  3: {
    scientificName: 'Artocarpus odoratissimus',
    commonName: 'Marang, Tarap',
    family: 'Moraceae',
    species: 'A. odoratissimus',
    size: 'Medium tree (15-25m)',
    growth: 'Moderate',
    lifespan: '40-80 years',
    conservation: 'Not Evaluated',
    habitat: 'Lowland rainforests, cultivated in villages',
    distribution: 'Native to Borneo (Sarawak, Sabah)',
    description:
      'Artocarpus odoratissimus is prized for its strong-smelling, sweet, and creamy fruit. The seeds are also edible when roasted. Native to Borneo, it is commonly cultivated in kampungs and orchards.',
    whereToFind: 'Village orchards, forest edges, and cultivated areas in Borneo.',
    heroImage: require('../../assets/image/pic3.png'),
    gallery: [
      require('../../assets/image/pic35.jpg'),
      require('../../assets/image/pic36.jpeg'),
      require('../../assets/image/pic37.jpg'),
    ],
  },

  4: {
    scientificName: 'Asplenium nidus',
    commonName: "Bird's Nest Fern, Paku Langsuir",
    family: 'Aspleniaceae',
    species: 'A. nidus',
    size: 'Medium fern (fronds up to 1.5m)',
    growth: 'Moderate',
    lifespan: '10-20 years',
    conservation: 'Least Concern',
    habitat: 'Epiphytic on trees in humid, shaded forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      "Asplenium nidus forms a distinctive nest-like rosette of bright green fronds. Young fronds are edible and eaten as a vegetable (sayur paku), and it's widely used as an ornamental plant.",
    whereToFind: 'On tree trunks and branches in humid forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic4.png'),
    gallery: [
      require('../../assets/image/pic38.jpeg'),
      require('../../assets/image/pic39.jpg'),
      require('../../assets/image/pic40.jpeg'),
    ],
  },

  79: {
    scientificName: 'Dillenia suffruticosa',
    commonName: 'Simpoh Air',
    family: 'Dilleniaceae',
    species: 'D. suffruticosa',
    size: 'Shrub to small tree (3-8m)',
    growth: 'Fast',
    lifespan: '10-25 years',
    conservation: 'Least Concern',
    habitat: 'Disturbed habitats, secondary forests, swampy areas',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Dillenia suffruticosa is a pioneer species that thrives in disturbed areas and is often one of the first plants to colonize cleared land. Its large, tough leaves are traditionally used for wrapping food such as tempeh and tapai.',
    whereToFind: 'Roadsides, forest edges, swampy areas, and disturbed habitats.',
    heroImage: require('../../assets/image/pic5.png'),
    gallery: [
      require('../../assets/image/pic41.jpeg'),
      require('../../assets/image/pic42.jpg'),
      require('../../assets/image/pic43.jpeg'),],
  },

  5: {
    scientificName: 'Etlingera elatior',
    commonName: 'Torch Ginger, Kantan',
    family: 'Zingiberaceae',
    species: 'E. elatior',
    size: 'Perennial herb (up to 6m)',
    growth: 'Fast',
    lifespan: '5-15 years',
    conservation: 'Not Evaluated',
    habitat: 'Humid, shady forest areas near streams',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Etlingera elatior grows in clumps in humid areas near streams and is widely cultivated. The unopened flower buds are a highly prized culinary ingredient, essential for dishes like laksa and asam pedas.',
    whereToFind: 'Forest clearings, near streams, and in gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic6.png'),
    gallery: [
      require('../../assets/image/pic44.jpg'),
      require('../../assets/image/pic45.jpg'),
      require('../../assets/image/pic46.jpg'),
    ],
  },

  6: {
    scientificName: 'Eurycoma longifolia',
    commonName: 'Tongkat Ali, Sengkayap',
    family: 'Simaroubaceae',
    species: 'E. longifolia',
    size: 'Small tree (5-15m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Vulnerable',
    habitat: 'Understory of lowland primary and secondary forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Eurycoma longifolia is famous for its roots, which are a key ingredient in traditional medicine and health supplements. The plant has compound leaves and small flowers, but populations are declining due to over-harvesting.',
    whereToFind: 'Deep forest understory, increasingly rare in the wild.',
    heroImage: require('../../assets/image/pic7.png'),
    gallery: [
      require('../../assets/image/pic47.webp'),
      require('../../assets/image/pic48.jpeg'),
      require('../../assets/image/pic49.jpeg'),
    ],
  },

  7: {
    scientificName: 'Ficus sundaica',
    commonName: 'Ara Bertih, Ara Punai',
    family: 'Moraceae',
    species: 'F. sundaica',
    size: 'Medium tree (10-20m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Lowland rainforests, riverbanks, coastal forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Ficus sundaica produces small figs that are an important food source for wildlife including birds and mammals. It is widespread and stable across its range.',
    whereToFind: 'Riverbanks, coastal forests, and lowland rainforests.',
    heroImage: require('../../assets/image/pic8.png'),
    gallery: [
      require('../../assets/image/pic50.webp'),
      require('../../assets/image/pic51.jpg'),
      require('../../assets/image/pic52.jpeg'),
    ],
  },

  65: {
    scientificName: 'Macaranga gigantea',
    commonName: 'Giant Mahang, Mahang Gajah',
    family: 'Euphorbiaceae',
    species: 'M. gigantea',
    size: 'Medium tree (15-30m)',
    growth: 'Very fast',
    lifespan: '20-40 years',
    conservation: 'Least Concern',
    habitat: 'Secondary forests, forest gaps, regenerating areas',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Macaranga gigantea is a fast-growing pioneer tree with large shield-shaped leaves. The light wood is used for pulp, packing cases, and disposable chopsticks. It is known for its symbiotic relationship with ants.',
    whereToFind: 'Logged areas, forest gaps, and regenerating forests.',
    heroImage: require('../../assets/image/pic9.png'),
    gallery: [
      require('../../assets/image/pic53.jpg'),
      require('../../assets/image/pic54.jpg'),
      require('../../assets/image/pic55.jpeg'),
    ],
  },

  80: {
    scientificName: 'Melastoma malabathricum',
    commonName: 'Singapore Rhododendron, Senduduk',
    family: 'Melastomataceae',
    species: 'M. malabathricum',
    size: 'Shrub (1-3m)',
    growth: 'Fast',
    lifespan: '10-20 years',
    conservation: 'Least Concern',
    habitat: 'Open disturbed areas, roadsides, forest edges',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Melastoma malabathricum is an extremely widespread pioneer species thriving in full sun. Its fruits are edible (staining the mouth dark purple), and various parts are used in traditional medicine for wounds and digestive issues.',
    whereToFind: 'Roadsides, abandoned land, forest edges throughout Malaysia.',
    heroImage: require('../../assets/image/pic10.png'),
    gallery: [
      require('../../assets/image/pic56.jpg'),
      require('../../assets/image/pic57.jpg'),
      require('../../assets/image/pic58.jpg'),
    ],
  },

  9: {
    scientificName: 'Shorea pinanga',
    commonName: 'Meranti Langgai Bukit',
    family: 'Dipterocarpaceae',
    species: 'S. pinanga',
    size: 'Large tree (up to 40m)',
    growth: 'Slow to moderate',
    lifespan: '100-200 years',
    conservation: 'Least Concern',
    habitat: 'Kerangas (heath forest) on sandy, acidic soils',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea pinanga is a source of Red Meranti timber and grows in kerangas forests on nutrient-poor sandy soils. It is considered common in its native range.',
    whereToFind: 'Heath forests on sandy soils in Borneo.',
    heroImage: require('../../assets/image/pic11.png'),
    gallery: [
      require('../../assets/image/pic59.jpeg'),
      require('../../assets/image/pic60.jpeg'),
      require('../../assets/image/pic61.jpeg'),
    ],
  },

  10: {
    scientificName: 'Shorea ochracea',
    commonName: 'Raruk',
    family: 'Dipterocarpaceae',
    species: 'S. ochracea',
    size: 'Large tree (up to 50m)',
    growth: 'Moderate',
    lifespan: '100-200 years',
    conservation: 'Least Concern',
    habitat: 'Mixed dipterocarp forests in lowlands',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Shorea ochracea is a source of Yellow Meranti timber. While still common, populations are declining due to logging and habitat conversion.',
    whereToFind: 'Lowland mixed dipterocarp forests.',
    heroImage: require('../../assets/image/pic12.png'),
    gallery: [
      require('../../assets/image/pic62.jpg'),
      require('../../assets/image/pic63.jpeg'),
      require('../../assets/image/pic64.jpeg'),
    ],
  },

  11: {
    scientificName: 'Aetoxylon sympetalum',
    commonName: 'Kayu Gaharu',
    family: 'Thymelaeaceae',
    species: 'A. sympetalum',
    size: 'Medium tree (10-20m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Not Evaluated',
    habitat: 'Peat swamp and kerangas forests',
    distribution: 'Sarawak, Sabah',
    description:
      'Aetoxylon sympetalum produces a lower-grade agarwood (incense wood). Population status is not well-known but it is heavily harvested.',
    whereToFind: 'Peat swamps and heath forests in Borneo.',
    heroImage: require('../../assets/image/pic13.png'),
    gallery: [
      require('../../assets/image/pic65.jpeg'),
      require('../../assets/image/pic66.jpeg'),
      require('../../assets/image/pic67.jpg'),
    ],
  },

  12: {
    scientificName: 'Calophyllum lanigerum',
    commonName: 'Bintangor',
    family: 'Calophyllaceae',
    species: 'C. lanigerum',
    size: 'Large tree (up to 40m)',
    growth: 'Moderate',
    lifespan: '80-150 years',
    conservation: 'Vulnerable',
    habitat: 'Mixed dipterocarp and swamp forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Calophyllum lanigerum is a source of timber and has been famously researched for Calanolide A, a compound with anti-HIV activity. It is threatened by logging and draining of peat swamp forests.',
    whereToFind: 'Swamp forests and mixed dipterocarp forests.',
    heroImage: require('../../assets/image/pic14.png'),
    gallery: [
      require('../../assets/image/pic68.jpg'),
      require('../../assets/image/pic69.jpg'),
      require('../../assets/image/pic70.jpg'),
    ],
  },

  13: {
    scientificName: 'Calophyllum teysmanii',
    commonName: 'Bintangor Gading',
    family: 'Calophyllaceae',
    species: 'C. teysmanii',
    size: 'Large tree (up to 35m)',
    growth: 'Moderate',
    lifespan: '80-150 years',
    conservation: 'Vulnerable',
    habitat: 'Peat swamp forests',
    distribution: 'Sarawak, Sabah',
    description:
      'Calophyllum teysmanii is a source of timber and contains compounds of medicinal interest. It is rare and threatened by habitat loss from peat swamp drainage.',
    whereToFind: 'Peat swamp forests in Borneo.',
    heroImage: require('../../assets/image/pic15.png'),
    gallery: [
      require('../../assets/image/pic71.jpeg'),
      require('../../assets/image/pic72.jpg'),
      require('../../assets/image/pic73.jpg'),
    ],
  },

  // LOWLAND RAINFOREST PLANTS - RARE SPECIES

  14: {
    scientificName: 'Aquilaria beccariana',
    commonName: 'Kayu Gaharu, Engkaras',
    family: 'Thymelaeaceae',
    species: 'A. beccariana',
    size: 'Medium tree (10-25m)',
    growth: 'Slow',
    lifespan: '50-100 years',
    conservation: 'Critically Endangered',
    habitat: 'Lowland and hill forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Aquilaria beccariana produces valuable agarwood resin used for incense and perfume. It is very rare and severely depleted due to illegal harvesting.',
    whereToFind: 'Scattered in remote lowland and hill forests, extremely rare.',
    heroImage: require('../../assets/image/pic16.png'),
    gallery: [
      require('../../assets/image/pic74.jpeg'),
      require('../../assets/image/pic75.jpg'),
      require('../../assets/image/pic76.jpeg'),
    ],
  },

  15: {
    scientificName: 'Aquilaria malaccensis',
    commonName: 'Kayu Gaharu',
    family: 'Thymelaeaceae',
    species: 'A. malaccensis',
    size: 'Large tree (up to 40m)',
    growth: 'Slow to moderate',
    lifespan: '100-200 years',
    conservation: 'Critically Endangered',
    habitat: 'Lowland and hill forests up to 750m',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Aquilaria malaccensis is the primary and most valuable source of agarwood. It is rare and heavily exploited across its range with severely declining populations.',
    whereToFind: 'Protected forests, extremely rare in accessible areas.',
    heroImage: require('../../assets/image/pic17.png'),
    gallery: [
      require('../../assets/image/pic77.jpg'),
      require('../../assets/image/pic78.jpg'),
      require('../../assets/image/pic79.jpeg'),
    ],
  },

  16: {
    scientificName: 'Aquilaria microcarpa',
    commonName: 'Kayu Gaharu',
    family: 'Thymelaeaceae',
    species: 'A. microcarpa',
    size: 'Small to medium tree (10-20m)',
    growth: 'Slow',
    lifespan: '50-80 years',
    conservation: 'Endangered',
    habitat: 'Lowland forests on sandy or alluvial soils',
    distribution: 'Sarawak, Sabah',
    description:
      'Aquilaria microcarpa is a source of agarwood. It is rare and threatened by over-exploitation and habitat loss.',
    whereToFind: 'Sandy lowland forests, very uncommon.',
    heroImage: require('../../assets/image/pic18.png'),
    gallery: [
      require('../../assets/image/pic80.jpeg'),
      require('../../assets/image/pic81.jpeg'),
      require('../../assets/image/pic82.jpeg'),
    ],
  },

  17: {
    scientificName: 'Didesmandra aspera',
    commonName: 'Simpor Pelagus',
    family: 'Melastomataceae',
    species: 'D. aspera',
    size: 'Shrub (2-4m)',
    growth: 'Slow',
    lifespan: '15-30 years',
    conservation: 'Endangered',
    habitat: 'Endemic to kerangas (heath) forests in Borneo',
    distribution: 'Sarawak, Sabah (Endemic to Borneo)',
    description:
      'Didesmandra aspera has ornamental potential but little is known about other uses. It is rare and localized within specific forest types.',
    whereToFind: 'Kerangas forests on sandy soils in Borneo.',
    heroImage: require('../../assets/image/pic19.png'),
    gallery: [
      require('../../assets/image/pic83.jpg'),
      require('../../assets/image/pic84.jpeg'),
      require('../../assets/image/pic85.jpg'),
    ],
  },

  18: {
    scientificName: 'Goniothalamus velutinus',
    commonName: 'Kayu Hujan Panas, Lim Panas',
    family: 'Annonaceae',
    species: 'G. velutinus',
    size: 'Small tree (5-10m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Endangered',
    habitat: 'Understory of lowland rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Goniothalamus velutinus is used in traditional medicine. It is very rare and known from only a few locations.',
    whereToFind: 'Deep forest understory, extremely rare.',
    heroImage: require('../../assets/image/pic20.png'),
    gallery: [
      require('../../assets/image/pic86.jpg'),
      require('../../assets/image/pic87.jpeg'),
      require('../../assets/image/pic88.jpeg'),
    ],
  },

  19: {
    scientificName: 'Koompassia excelsa',
    commonName: 'Tapang',
    family: 'Fabaceae',
    species: 'K. excelsa',
    size: 'Emergent giant (up to 88m)',
    growth: 'Slow',
    lifespan: '200-400 years',
    conservation: 'Vulnerable',
    habitat: 'Emergent tree in lowland rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Koompassia excelsa is one of the tallest tropical trees, famous for hosting giant honeybee hives. Its very hard timber is difficult to work. Large individuals are becoming less common.',
    whereToFind: 'Emergent layer of primary lowland forests.',
    heroImage: require('../../assets/image/pic21.png'),
    gallery: [
      require('../../assets/image/pic89.jpg'),
      require('../../assets/image/pic90.jpg'),
      require('../../assets/image/pic91.jpg'),
    ],
  },

  20: {
    scientificName: 'Koompassia malaccensis',
    commonName: 'Menggris',
    family: 'Fabaceae',
    species: 'K. malaccensis',
    size: 'Large tree (up to 60m)',
    growth: 'Moderate',
    lifespan: '150-300 years',
    conservation: 'Vulnerable',
    habitat: 'Lowland and swamp forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Koompassia malaccensis produces important heavy hardwood timber used for construction, flooring, and railway sleepers. Widespread but threatened by logging.',
    whereToFind: 'Lowland forests and swamps.',
    heroImage: require('../../assets/image/pic22.png'),
    gallery: [
      require('../../assets/image/pic92.jpg'),
      require('../../assets/image/pic93.jpg'),
      require('../../assets/image/pic94.jpeg'),
    ],
  },

  21: {
    scientificName: 'Shorea hemsleyana',
    commonName: 'Chengal Pasir',
    family: 'Dipterocarpaceae',
    species: 'S. hemsleyana',
    size: 'Large tree (up to 50m)',
    growth: 'Slow',
    lifespan: '150-250 years',
    conservation: 'Critically Endangered',
    habitat: 'Lowland dipterocarp forests on sandy or alluvial soils near coasts',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea hemsleyana produces highly durable and valuable heavy hardwood timber. It is extremely rare with severely fragmented populations, threatened by logging.',
    whereToFind: 'Coastal lowland forests, critically rare.',
    heroImage: require('../../assets/image/pic23.png'),
    gallery: [
      require('../../assets/image/pic95.jpg'),
      require('../../assets/image/pic96.jpg'),
      require('../../assets/image/pic97.jpg'),
    ],
  },

  22: {
    scientificName: 'Shorea macrophylla',
    commonName: 'Engkabang Jantong',
    family: 'Dipterocarpaceae',
    species: 'S. macrophylla',
    size: 'Large tree (up to 60m)',
    growth: 'Moderate',
    lifespan: '150-300 years',
    conservation: 'Endangered',
    habitat: 'Mixed dipterocarp forests, especially along riverbanks',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Shorea macrophylla produces illipe nuts, a major source of vegetable fat used for making chocolate, soap, and cosmetics. Populations are declining due to habitat loss and logging.',
    whereToFind: 'Riparian forests, declining in numbers.',
    heroImage: require('../../assets/image/pic24.png'),
    gallery: [
      require('../../assets/image/pic98.jpeg'),
      require('../../assets/image/pic99.jpeg'),
      require('../../assets/image/pic100.jpeg'),
    ],
  },

  23: {
    scientificName: 'Shorea palembanica',
    commonName: 'Engkabang Asu',
    family: 'Dipterocarpaceae',
    species: 'S. palembanica',
    size: 'Large tree (up to 55m)',
    growth: 'Moderate',
    lifespan: '150-250 years',
    conservation: 'Endangered',
    habitat: 'Swamps and alluvial soils near rivers in lowland forests',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea palembanica produces illipe nuts and timber. Population is declining due to habitat loss.',
    whereToFind: 'Swamp forests and riverine areas.',
    heroImage: require('../../assets/image/pic25.png'),
    gallery: [
      require('../../assets/image/pic101.jpg'),
      require('../../assets/image/pic102.jpeg'),
      require('../../assets/image/pic103.jpeg'),
    ],
  },

  24: {
    scientificName: 'Shorea seminis',
    commonName: 'Engkabang Terendak',
    family: 'Dipterocarpaceae',
    species: 'S. seminis',
    size: 'Large tree (up to 55m)',
    growth: 'Moderate',
    lifespan: '150-250 years',
    conservation: 'Endangered',
    habitat: 'Alluvial flats and riverbanks in lowland forests',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea seminis provides illipe nuts and light hardwood timber. Populations are declining and fragmented due to deforestation and dam construction.',
    whereToFind: 'Riverbanks and alluvial plains, increasingly rare.',
    heroImage: require('../../assets/image/pic26.png'),
    gallery: [
      require('../../assets/image/pic104.jpeg'),
      require('../../assets/image/pic105.jpeg'),
      require('../../assets/image/pic106.jpeg'),
    ],
  },

  25: {
    scientificName: 'Shorea splendida',
    commonName: 'Engkabang Bintang',
    family: 'Dipterocarpaceae',
    species: 'S. splendida',
    size: 'Large tree (up to 60m)',
    growth: 'Moderate',
    lifespan: '150-300 years',
    conservation: 'Critically Endangered',
    habitat: 'Mixed dipterocarp forests on clay-rich soils',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea splendida is a source of high-quality illipe nuts for fat production. Population is severely fragmented and declining due to logging and land conversion.',
    whereToFind: 'Clay-rich dipterocarp forests, very rare.',
    heroImage: require('../../assets/image/pic27.png'),
    gallery: [
      require('../../assets/image/pic107.jpeg'),
      require('../../assets/image/pic108.jpg'),
      require('../../assets/image/pic109.jpg'),
    ],
  },

  26: {
    scientificName: 'Shorea stenoptera',
    commonName: 'Engkabang Rusa',
    family: 'Dipterocarpaceae',
    species: 'S. stenoptera',
    size: 'Large tree (up to 65m)',
    growth: 'Moderate',
    lifespan: '150-300 years',
    conservation: 'Critically Endangered',
    habitat: 'Mixed dipterocarp forests on well-drained, yellow soils',
    distribution: 'Sarawak, Sabah',
    description:
      'Shorea stenoptera is the main commercial source of illipe nuts and also a source of Red Meranti timber. Very rare and severely threatened by habitat loss and agricultural expansion, especially oil palm.',
    whereToFind: 'Remaining dipterocarp forests, critically endangered.',
    heroImage: require('../../assets/image/pic28.png'),
    gallery: [
      require('../../assets/image/pic110.jpeg'),
      require('../../assets/image/pic111.jpeg'),
      require('../../assets/image/pic112.jpeg'),
    ],
  },

  // HIGHLAND & MONTANE FOREST SPECIES - COMMON

  27: {
    scientificName: 'Areca triandra',
    commonName: 'Pinang Borneo',
    family: 'Arecaceae',
    species: 'A. triandra',
    size: 'Medium palm (5-10m)',
    growth: 'Moderate',
    lifespan: '30-50 years',
    conservation: 'Least Concern',
    habitat: 'Understory of lowland to hill rainforests',
    distribution: 'Sarawak, Sabah (Borneo)',
    description:
      'Areca triandra has nuts that are sometimes used as a substitute for betel nut. It is relatively common and widespread in Borneo.',
    whereToFind: 'Forest understory in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic113.png'),
    gallery: [
      require('../../assets/image/pic114.jpeg'),
      require('../../assets/image/pic115.jpeg'),
      require('../../assets/image/pic116.jpeg'),
    ],
  },

  28: {
    scientificName: 'Areca subcaulis',
    commonName: 'Pinang Pici',
    family: 'Arecaceae',
    species: 'A. subcaulis',
    size: 'Small palm (3-6m)',
    growth: 'Slow',
    lifespan: '20-40 years',
    conservation: 'Vulnerable',
    habitat: 'Understory of rainforests, Endemic to Borneo',
    distribution: 'Sarawak, Sabah (Endemic to Borneo)',
    description:
      'Areca subcaulis has ornamental potential. Locally common in certain areas but vulnerable to habitat loss.',
    whereToFind: 'Shaded forest understory in Borneo.',
    heroImage: require('../../assets/image/pic117.png'),
    gallery: [
      require('../../assets/image/pic118.jpg'),
      require('../../assets/image/pic119.jpeg'),
      require('../../assets/image/pic120.jpeg'),
    ],
  },

  29: {
    scientificName: 'Cycas rumphii',
    commonName: 'Paku Gajah, Paku Laut',
    family: 'Cycadaceae',
    species: 'C. rumphii',
    size: 'Small cycad (2-5m)',
    growth: 'Very slow',
    lifespan: '100-200 years',
    conservation: 'Vulnerable',
    habitat: 'Coastal forests and rocky headlands',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (coastal areas)',
    description:
      'Cycas rumphii is an ornamental plant. Seeds are poisonous but can be processed into edible starch. Populations are declining due to coastal development and harvesting.',
    whereToFind: 'Coastal cliffs and beaches throughout Malaysia.',
    heroImage: require('../../assets/image/pic121.png'),
    gallery: [
      require('../../assets/image/pic122.webp'),
      require('../../assets/image/pic123.jpeg'),
      require('../../assets/image/pic124.jpg'),
    ],
  },

  30: {
    scientificName: 'Huperzia squarrosa',
    commonName: 'Ekor Tupai',
    family: 'Lycopodiaceae',
    species: 'H. squarrosa',
    size: 'Epiphytic fern (trailing to 1m)',
    growth: 'Moderate',
    lifespan: '10-20 years',
    conservation: 'Least Concern',
    habitat: 'Epiphyte on tree branches in humid rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Huperzia squarrosa is a popular ornamental hanging plant. Widespread but can be locally threatened by over-collection.',
    whereToFind: 'On tree branches in humid forests.',
    heroImage: require('../../assets/image/pic125.png'),
    gallery: [
      require('../../assets/image/pic126.jpg'),
      require('../../assets/image/pic127.jpeg'),
      require('../../assets/image/pic128.jpeg'),
    ],
  },

  31: {
    scientificName: 'Johannesteijsmannia altifrons',
    commonName: 'Ekor Buaya',
    family: 'Arecaceae',
    species: 'J. altifrons',
    size: 'Small palm (2-4m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Vulnerable',
    habitat: 'Understory of lowland dipterocarp forests, often in damp valleys',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Johannesteijsmannia altifrons has large diamond-shaped undivided leaves. Leaves are used for temporary roofing (attap) and it is highly sought after as an ornamental. Patchily distributed and threatened by habitat loss and illegal collection.',
    whereToFind: 'Shaded valleys in lowland dipterocarp forests.',
    heroImage: require('../../assets/image/pic129.png'),
    gallery: [
      require('../../assets/image/pic130.jpeg'),
      require('../../assets/image/pic131.jpg'),
      require('../../assets/image/pic132.jpeg'),
    ],
  },

  32: {
    scientificName: 'Monophyllaea glauca',
    commonName: 'One-leaf Plant',
    family: 'Gesneriaceae',
    species: 'M. glauca',
    size: 'Small herb (10-30cm)',
    growth: 'Slow',
    lifespan: '5-15 years',
    conservation: 'Least Concern',
    habitat: 'Damp, shaded limestone cliffs and cave entrances',
    distribution: 'Sarawak, Sabah (limestone areas)',
    description:
      'Monophyllaea glauca is an ornamental plant of scientific interest due to its unique single-leaf morphology. Abundant but restricted to limestone habitats.',
    whereToFind: 'Limestone caves and cliffs in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic133.png'),
    gallery: [
      require('../../assets/image/pic134.jpeg'),
      require('../../assets/image/pic135.jpg'),
      require('../../assets/image/pic136.jpeg'),
    ],
  },

  81: {
    scientificName: 'Nepenthes_rafflesiana',
    commonName: 'Periok Kera, Entuyut',
    family: 'Nepenthaceae',
    species: 'N. rafflesiana',
    size: 'Climbing vine (up to 15m)',
    growth: 'Moderate',
    lifespan: '10-30 years',
    conservation: 'Least Concern',
    habitat: 'Peat swamp forests, kerangas, and disturbed lowland areas',
    distribution: 'Sarawak, Sabah (Borneo)',
    description:
      'Nepenthes_rafflesiana is a carnivorous plant popular in horticulture. Stems were once used as rope. Widespread and relatively common in suitable habitats.',
    whereToFind: 'Peat swamps and heath forests in Borneo.',
    heroImage: require('../../assets/image/pic137.png'),
    gallery: [
      require('../../assets/image/pic138.jpg'),
      require('../../assets/image/pic139.jpeg'),
      require('../../assets/image/pic140.jpg'),
    ],
  },

  82: {
    scientificName: 'Phalaenopsis amabilis',
    commonName: 'Normah Orchid',
    family: 'Orchidaceae',
    species: 'P. amabilis',
    size: 'Epiphytic orchid (leaves 20-40cm)',
    growth: 'Slow',
    lifespan: '10-30 years',
    conservation: 'Least Concern',
    habitat: 'Epiphyte on tree trunks and branches in lowland rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Phalaenopsis amabilis is a highly valued ornamental plant and one of the parent species for many hybrid orchids. Native to the region and widely distributed.',
    whereToFind: 'Tree trunks in lowland forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic141.png'),
    gallery: [
      require('../../assets/image/pic142.jpeg'),
      require('../../assets/image/pic143.webp'),
      require('../../assets/image/pic144.jpeg'),
    ],
  },

  33: {
    scientificName: 'Rhododendron fallacinum',
    commonName: 'Petagar Hamzar',
    family: 'Ericaceae',
    species: 'R. fallacinum',
    size: 'Shrub (1-3m)',
    growth: 'Slow',
    lifespan: '20-50 years',
    conservation: 'Least Concern',
    habitat: 'Epiphytic or terrestrial in montane forests',
    distribution: 'Sarawak, Sabah (montane areas)',
    description:
      'Rhododendron fallacinum has high ornamental value with attractive flowers. Locally common in high-altitude habitats.',
    whereToFind: 'Montane forests above 1000m elevation.',
    heroImage: require('../../assets/image/pic145.png'),
    gallery: [
      require('../../assets/image/pic146.jpeg'),
      require('../../assets/image/pic147.jpeg'),
      require('../../assets/image/pic148.jpeg'),
    ],
  },

  34: {
    scientificName: 'Rhododendron javanicum',
    commonName: 'Javan Rhododendron',
    family: 'Ericaceae',
    species: 'R. javanicum',
    size: 'Shrub (2-4m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Least Concern',
    habitat: 'Evergreen montane shrub',
    distribution: 'Sabah, Sarawak (montane areas)',
    description:
      'Rhododendron javanicum is an ornamental shrub common in montane forests with orange-red flowers.',
    whereToFind: 'Montane forests in Sabah and Sarawak.',
    heroImage: require('../../assets/image/pic149.png'),
    gallery: [
      require('../../assets/image/pic150.jpeg'),
      require('../../assets/image/pic151.jpeg'),
      require('../../assets/image/pic152.jpeg'),
    ],
  },

  // HIGHLAND & MONTANE FOREST SPECIES - RARE AND ENDEMIC

  35: {
    scientificName: 'Areca jugahpunya',
    commonName: 'Pinang Jugah',
    family: 'Arecaceae',
    species: 'A. jugahpunya',
    size: 'Small palm (3-5m)',
    growth: 'Slow',
    lifespan: '20-40 years',
    conservation: 'Critically Endangered',
    habitat: 'Lowland rainforests, recently described endemic to Sarawak',
    distribution: 'Sarawak (Endemic - very limited area)',
    description:
      'Areca jugahpunya is commonly used for recreational chewing with betel leaves as a mild stimulant, and also for its traditional medicinal properties. Extremely rare and known only from a very small area.',
    whereToFind: 'Restricted to a tiny area in Sarawak, critically endangered.',
    heroImage: require('../../assets/image/pic153.png'),
    gallery: [
      require('../../assets/image/pic154.jpeg'),
      require('../../assets/image/pic155.jpeg'),
      require('../../assets/image/pic156.jpeg'),
    ],
  },

  36: {
    scientificName: 'Licuala orbicularis',
    commonName: 'Biris',
    family: 'Arecaceae',
    species: 'L. orbicularis',
    size: 'Small palm (2-4m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Endangered',
    habitat: 'Understory of shady, humid rainforests',
    distribution: 'Sarawak, Sabah',
    description:
      'Licuala orbicularis is a highly prized ornamental palm with perfectly circular, pleated leaves. Rare and localized; threatened by illegal collection for the plant trade.',
    whereToFind: 'Shaded forest understory, increasingly rare.',
    heroImage: require('../../assets/image/pic157.png'),
    gallery: [
      require('../../assets/image/pic158.jpeg'),
      require('../../assets/image/pic159.jpg'),
      require('../../assets/image/pic160.jpg'),
    ],
  },

  37: {
    scientificName: 'Pinanga mirabilis',
    commonName: 'Pinang Tudong Pelandok',
    family: 'Arecaceae',
    species: 'P. mirabilis',
    size: 'Small palm (2-4m)',
    growth: 'Slow',
    lifespan: '20-40 years',
    conservation: 'Critically Endangered',
    habitat: 'Understory of lowland to hill forests, Endemic to Borneo',
    distribution: 'Sarawak, Sabah (Endemic to Borneo)',
    description:
      'Pinanga mirabilis has ornamental potential due to its large size and clustering habit. Extremely rare with a highly restricted distribution.',
    whereToFind: 'Very restricted distribution in Borneo forests.',
    heroImage: require('../../assets/image/pic161.png'),
    gallery: [
      require('../../assets/image/pic162.jpeg'),
      require('../../assets/image/pic163.jpeg'),
      require('../../assets/image/pic164.jpeg'),
    ],
  },

  38: {
    scientificName: 'Salacca magnifica',
    commonName: 'Salak',
    family: 'Arecaceae',
    species: 'S. magnifica',
    size: 'Small palm (2-4m)',
    growth: 'Slow',
    lifespan: '20-40 years',
    conservation: 'Endangered',
    habitat: 'Understory of wet lowland rainforests, Endemic to western Sarawak',
    distribution: 'Western Sarawak (Endemic)',
    description:
      'Salacca magnifica is an ornamental plant with large, undivided leaves. Fruit is not palatable. Uncommon and threatened by deforestation.',
    whereToFind: 'Western Sarawak wet forests, rare.',
    heroImage: require('../../assets/image/pic165.png'),
    gallery: [
      require('../../assets/image/pic166.jpg'),
      require('../../assets/image/pic167.jpeg'),
      require('../../assets/image/pic168.jpg'),
    ],
  },

  39: {
    scientificName: 'Nepenthes macrophylla',
    commonName: 'Large-Leaved Pitcher',
    family: 'Nepenthaceae',
    species: 'N. macrophylla',
    size: 'Climbing vine (up to 10m)',
    growth: 'Slow',
    lifespan: '15-40 years',
    conservation: 'Endangered',
    habitat: 'Rare montane pitcher plant',
    distribution: 'Sarawak, Sabah (montane areas)',
    description:
      'Nepenthes macrophylla is a rare carnivorous plant of botanical interest. Found in montane habitats.',
    whereToFind: 'High-altitude forests in Sarawak and Sabah, very rare.',
    heroImage: require('../../assets/image/pic169.png'),
    gallery: [
      require('../../assets/image/pic170.webp'),
      require('../../assets/image/pic171.jpg'),
      require('../../assets/image/pic172.jpeg'),
    ],
  },

  40: {
    scientificName: 'Nepenthes burbidgeae',
    commonName: 'Burbidge Pitcher',
    family: 'Nepenthaceae',
    species: 'N. burbidgeae',
    size: 'Climbing vine (up to 8m)',
    growth: 'Slow',
    lifespan: '15-40 years',
    conservation: 'Endangered',
    habitat: 'Highland carnivorous plant, small population',
    distribution: 'Sabah (Mount Kinabalu area)',
    description:
      'Nepenthes burbidgeae is found only in Mount Kinabalu area with small isolated populations. Botanical and ornamental interest.',
    whereToFind: 'Mount Kinabalu highlands, Sabah.',
    heroImage: require('../../assets/image/pic173.png'),
    gallery: [
      require('../../assets/image/pic174.jpeg'),
      require('../../assets/image/pic175.jpeg'),
      require('../../assets/image/pic176.jpeg'),
    ],
  },

  41: {
    scientificName: 'Paphiopedilum superbiens',
    commonName: 'Superb Slipper Orchid',
    family: 'Orchidaceae',
    species: 'P. superbiens',
    size: 'Small orchid (20-40cm)',
    growth: 'Very slow',
    lifespan: '20-50 years',
    conservation: 'Endangered',
    habitat: 'Rare orchid on montane limestone habitats',
    distribution: 'Sarawak (limestone areas)',
    description:
      'Paphiopedilum superbiens is very rare and threatened. Found on limestone cliffs with ornamental and conservation value.',
    whereToFind: 'Limestone cliffs in Sarawak, critically rare.',
    heroImage: require('../../assets/image/pic177.png'),
    gallery: [
      require('../../assets/image/pic178.jpg'),
      require('../../assets/image/pic179.jpg'),
      require('../../assets/image/pic180.jpeg'),
    ],
  },

  42: {
    scientificName: 'Paphiopedilum malipoense',
    commonName: 'Malipo Slipper Orchid',
    family: 'Orchidaceae',
    species: 'P. malipoense',
    size: 'Small orchid (15-30cm)',
    growth: 'Very slow',
    lifespan: '20-50 years',
    conservation: 'Endangered',
    habitat: 'High-altitude orchid, small populations',
    distribution: 'Sabah, Sarawak (high altitude areas)',
    description:
      'Paphiopedilum malipoense is rare and threatened by collection. High ornamental value.',
    whereToFind: 'High-altitude forests in Sabah and Sarawak.',
    heroImage: require('../../assets/image/pic181.png'),
    gallery: [
      require('../../assets/image/pic182.jpeg'),
      require('../../assets/image/pic183.avif'),
      require('../../assets/image/pic184.jpeg'),
    ],
  },

  43: {
    scientificName: 'Phalaenopsis cornu-cervi',
    commonName: 'Narrow Leaf Begonia',
    family: 'Orchidaceae',
    species: 'P. cornu-cervi',
    size: 'Small to medium (20-30cm)',
    growth: 'Moderate',
    lifespan: '10-20 years',
    conservation: 'Not threatened (CITES Appendix II)',
    habitat: 'Lowland to montane forests, epiphytic on trees in humid areas, sea level to 1200m',
    distribution: 'Throughout Borneo (Sabah, Sarawak, Kalimantan), also Thailand, Myanmar, Southeast Asia',
    description:
      'Phalaenopsis cornu-cervi produces successive flowers on flattened, branching inflorescences resembling deer antlers. Flowers are small, waxy, yellow-green with reddish-brown bars. Blooms multiple times per year with flowers opening sequentially over months.',
    whereToFind: 'Lowland and hill forests throughout Sabah and Sarawak, often on trees near rivers and in humid valleys.',
    heroImage: require('../../assets/image/pic185.png'),
    gallery: [
      require('../../assets/image/pic186.jpeg'),
      require('../../assets/image/pic187.jpg'),
      require('../../assets/image/pic188.jpeg'),
    ],
  },

  44: {
    scientificName: 'Begonia serotina',
    commonName: 'Serotine Begonia',
    family: 'Begoniaceae',
    species: 'B. serotina',
    size: 'Small shrub (30-60cm)',
    growth: 'Moderate',
    lifespan: '5-15 years',
    conservation: 'Not Assessed',
    habitat: 'Small montane shrub',
    distribution: 'Sabah, Sarawak (montane areas)',
    description:
      'Begonia serotina is uncommon in highlands with ornamental value.',
    whereToFind: 'Highland forests in Sabah and Sarawak.',
    heroImage: require('../../assets/image/pic189.png'),
    gallery: [
      require('../../assets/image/pic190.jpeg'),
      require('../../assets/image/pic191.jpeg'),
      require('../../assets/image/pic192.jpeg'),
    ],
  },

  45: {
    scientificName: 'Medinilla cummingii',
    commonName: 'Medinilla',
    family: 'Melastomataceae',
    species: 'M. cummingii',
    size: 'Epiphytic shrub (1-2m)',
    growth: 'Slow',
    lifespan: '10-25 years',
    conservation: 'Not Assessed',
    habitat: 'Small epiphytic shrub in montane forests',
    distribution: 'Sabah, Sarawak (montane forests)',
    description:
      'Medinilla cummingii is an ornamental epiphyte localized in montane areas with attractive flowers.',
    whereToFind: 'Montane forest epiphyte in Sabah and Sarawak.',
    heroImage: require('../../assets/image/pic193.png'),
    gallery: [
      require('../../assets/image/pic194.jpeg'),
      require('../../assets/image/pic195.jpg'),
      require('../../assets/image/pic196.jpeg'),
    ],
  },

  46: {
    scientificName: 'Cyrtandra cumingii',
    commonName: 'Himalayan Bellflower',
    family: 'Gesneriaceae',
    species: 'C. cumingii',
    size: 'Small understory plant (30-80cm)',
    growth: 'Moderate',
    lifespan: '5-15 years',
    conservation: 'Not Assessed',
    habitat: 'Small understory plant',
    distribution: 'Sabah, Sarawak',
    description:
      'Cyrtandra cumingii is an uncommon ornamental understory plant with tubular flowers.',
    whereToFind: 'Forest understory in Sabah and Sarawak.',
    heroImage: require('../../assets/image/pic197.png'),
    gallery: [
      require('../../assets/image/pic198.jpeg'),
      require('../../assets/image/pic199.jpeg'),
      require('../../assets/image/pic200.jpeg'),
    ],
  },

  47: {
    scientificName: 'Rhododendron lochiae',
    commonName: 'Rhododendron',
    family: 'Ericaceae',
    species: 'R. lochiae',
    size: 'Shrub (1-3m)',
    growth: 'Slow',
    lifespan: '30-60 years',
    conservation: 'Not Assessed',
    habitat: 'Montane shrub with pink flowers',
    distribution: 'Sabah (high altitude areas)',
    description:
      'Rhododendron lochiae is restricted to high altitudes with ornamental pink flowers.',
    whereToFind: 'High-altitude areas in Sabah.',
    heroImage: require('../../assets/image/pic201.png'),
    gallery: [
      require('../../assets/image/pic202.jpeg'),
      require('../../assets/image/pic203.jpeg'),
      require('../../assets/image/pic204.jpeg'),
    ],
  },

  // MANGROVE & COASTAL PLANTS

  83: {
    scientificName: 'Avicennia alba',
    commonName: 'Api-api Hitam',
    family: 'Acanthaceae',
    species: 'A. alba',
    size: 'Medium tree (10-25m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Pioneer species on newly formed mudflats at seaward edge of mangroves',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (all coastal areas)',
    description:
      'Avicennia alba is important for land stabilization and coastal protection. Wood used as firewood. Abundant in its mangrove habitat.',
    whereToFind: 'Seaward edge of mangrove forests throughout Malaysian coasts.',
    heroImage: require('../../assets/image/pic205.png'),
    gallery: [
      require('../../assets/image/pic206.jpg'),
      require('../../assets/image/pic207.jpeg'),
      require('../../assets/image/pic208.jpeg'),
    ],
  },

  48: {
    scientificName: 'Avicennia lanata',
    commonName: 'Api-api Bulu',
    family: 'Acanthaceae',
    species: 'A. lanata',
    size: 'Small tree (5-15m)',
    growth: 'Moderate',
    lifespan: '40-80 years',
    conservation: 'Least Concern',
    habitat: 'Inner mangrove forests, often on sandy substrates',
    distribution: 'Sarawak, Sabah (coastal areas)',
    description:
      'Avicennia lanata wood is used for smoking fish and as firewood. Less common than other Avicennia species, threatened by mangrove habitat loss.',
    whereToFind: 'Inner mangrove zones in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic209.png'),
    gallery: [
      require('../../assets/image/pic210.jpg'),
      require('../../assets/image/pic211.jpeg'),
      require('../../assets/image/pic212.jpg'),
    ],
  },

  84: {
    scientificName: 'Avicennia marina',
    commonName: 'Api-api Merah, Grey Mangrove',
    family: 'Acanthaceae',
    species: 'A. marina',
    size: 'Medium tree (8-20m)',
    growth: 'Fast',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Wide range of habitats within mangrove forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (all coastal areas)',
    description:
      'Avicennia marina is salt-tolerant and used for firewood. Has traditional medicinal uses. Widespread and abundant in mangrove ecosystems.',
    whereToFind: 'Throughout mangrove forests in Malaysia.',
    heroImage: require('../../assets/image/pic213.png'),
    gallery: [
      require('../../assets/image/pic214.jpeg'),
      require('../../assets/image/pic215.jpeg'),
      require('../../assets/image/pic216.jpeg'),
    ],
  },

  85: {
    scientificName: 'Avicennia officinalis',
    commonName: 'Api-api Sudu',
    family: 'Acanthaceae',
    species: 'A. officinalis',
    size: 'Medium tree (8-15m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Landward side of mangrove forests, tidal riverbanks',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (coastal areas)',
    description:
      'Avicennia officinalis bark is used for tanning; leaves used as fodder and in traditional medicine. Widespread and common in mangrove forests.',
    whereToFind: 'Landward mangrove zones throughout Malaysia.',
    heroImage: require('../../assets/image/pic217.jpg'),
    gallery: [
      require('../../assets/image/pic218.jpg'),
      require('../../assets/image/pic219.jpg'),
      require('../../assets/image/pic220.jpg'),
    ],
  },

  86: {
    scientificName: 'Casuarina equisetifolia',
    commonName: 'Rhu Laut',
    family: 'Casuarinaceae',
    species: 'C. equisetifolia',
    size: 'Large tree (15-35m)',
    growth: 'Fast',
    lifespan: '40-80 years',
    conservation: 'Least Concern',
    habitat: 'Sandy coasts and beaches',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (all coastal areas)',
    description:
      'Casuarina equisetifolia is excellent for coastal erosion control and as a windbreak. Wood used for firewood. Common along coastlines.',
    whereToFind: 'Sandy beaches and coastal areas throughout Malaysia.',
    heroImage: require('../../assets/image/pic221.png'),
    gallery: [
      require('../../assets/image/pic222.jpeg'),
      require('../../assets/image/pic223.jpg'),
      require('../../assets/image/pic224.jpg'),
    ],
  },

  49: {
    scientificName: 'Lumnitzera littorea',
    commonName: 'Teruntum Merah',
    family: 'Combretaceae',
    species: 'L. littorea',
    size: 'Small tree (5-12m)',
    growth: 'Slow',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Landward side of mangrove forests, on firm mud',
    distribution: 'Sarawak, Sabah (coastal mangroves)',
    description:
      'Lumnitzera littorea produces very durable and termite-resistant timber used for bridges and poles. Common in the landward mangrove zone.',
    whereToFind: 'Landward mangrove areas in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic225.jpg'),
    gallery: [
      require('../../assets/image/pic226.jpg'),
      require('../../assets/image/pic227.jpg'),
      require('../../assets/image/pic228.jpg'),
    ],
  },

  50: {
    scientificName: 'Lumnitzera racemosa',
    commonName: 'Black Mangrove',
    family: 'Combretaceae',
    species: 'L. racemosa',
    size: 'Small tree (5-15m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Tidal zones supporting aquatic life',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (mangrove areas)',
    description:
      'Lumnitzera racemosa supports aquatic life and provides coastal protection. Widespread in mangroves.',
    whereToFind: 'Tidal zones in mangroves throughout Malaysia.',
    heroImage: require('../../assets/image/pic229.png'),
    gallery: [
      require('../../assets/image/pic230.jpg'),
      require('../../assets/image/pic231.jpeg'),
      require('../../assets/image/pic232.jpeg'),
    ],
  },

  87: {
    scientificName: 'Sonneratia alba',
    commonName: 'Perepat, Mangrove Apple',
    family: 'Lythraceae',
    species: 'S. alba',
    size: 'Medium tree (10-20m)',
    growth: 'Fast',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Seaward fringe of mangrove forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (coastal areas)',
    description:
      'Sonneratia alba wood is used for firewood and construction. Flowers attract nectar-feeding bats. Common in its coastal habitat.',
    whereToFind: 'Seaward mangrove fringe throughout Malaysian coasts.',
    heroImage: require('../../assets/image/pic233.png'),
    gallery: [
      require('../../assets/image/pic234.jpg'),
      require('../../assets/image/pic235.jpg'),
      require('../../assets/image/pic236.jpeg'),
    ],
  },

  88: {
    scientificName: 'Sonneratia caseolaris',
    commonName: 'Pedada',
    family: 'Lythraceae',
    species: 'S. caseolaris',
    size: 'Medium tree (10-20m)',
    growth: 'Fast',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Brackish water along riverbanks and estuaries',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (estuaries)',
    description:
      'Sonneratia caseolaris fruit is edible (sour) and it is an important habitat for fireflies. Common in suitable riverine mangrove habitats.',
    whereToFind: 'Estuaries and riverbanks throughout Malaysia.',
    heroImage: require('../../assets/image/pic237.png'),
    gallery: [
      require('../../assets/image/pic238.jpg'),
      require('../../assets/image/pic239.jpg'),
      require('../../assets/image/pic240.jpg'),
    ],
  },

  51: {
    scientificName: 'Excoecaria agallocha',
    commonName: 'Blind-your-eye Mangrove',
    family: 'Euphorbiaceae',
    species: 'E. agallocha',
    size: 'Medium tree (8-15m)',
    growth: 'Moderate',
    lifespan: '40-80 years',
    conservation: 'Least Concern',
    habitat: 'Coastal swamp tree with toxic sap',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (mangrove areas)',
    description:
      'Excoecaria agallocha has toxic sap that can cause blindness if it contacts eyes. Used for coastal protection and has medicinal uses (with caution). Common in mangrove areas.',
    whereToFind: 'Mangrove forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic241.png'),
    gallery: [
      require('../../assets/image/pic242.webp'),
      require('../../assets/image/pic243.jpg'),
      require('../../assets/image/pic244.jpeg'),
    ],
  },

  52: {
    scientificName: 'Aegiceras corniculatum',
    commonName: 'Black Mangrove',
    family: 'Myrsinaceae',
    species: 'A. corniculatum',
    size: 'Small tree (3-8m)',
    growth: 'Moderate',
    lifespan: '30-60 years',
    conservation: 'Least Concern',
    habitat: 'Tolerates tidal inundation',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (mangrove areas)',
    description:
      'Aegiceras corniculatum is used for coastal stabilization. Widespread in mangroves.',
    whereToFind: 'Mangrove areas throughout Malaysia.',
    heroImage: require('../../assets/image/pic245.png'),
    gallery: [
      require('../../assets/image/pic246.jpg'),
      require('../../assets/image/pic247.jpg'),
      require('../../assets/image/pic248.jpg'),
    ],
  },

  53: {
    scientificName: 'Kandelia obovata',
    commonName: 'Red Mangrove',
    family: 'Rhizophoraceae',
    species: 'K. obovata',
    size: 'Medium tree (5-10m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Low intertidal zones, stabilizes mudflats',
    distribution: 'Sabah, Sarawak, Peninsular Malaysia (mangrove areas)',
    description:
      'Kandelia obovata is important for coastal protection and mudflat stabilization. Common in suitable habitats.',
    whereToFind: 'Intertidal zones in mangroves throughout Malaysia.',
    heroImage: require('../../assets/image/pic249.png'),
    gallery: [
      require('../../assets/image/pic250.jpeg'),
      require('../../assets/image/pic251.jpeg'),
      require('../../assets/image/pic252.jpeg'),
    ],
  },

  54: {
    scientificName: 'Xylocarpus granatum',
    commonName: 'Cannonball Mangrove',
    family: 'Meliaceae',
    species: 'X. granatum',
    size: 'Medium tree (8-20m)',
    growth: 'Slow',
    lifespan: '80-150 years',
    conservation: 'Least Concern',
    habitat: 'Coastal forests with round woody fruits',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (mangrove forests)',
    description:
      'Xylocarpus granatum has distinctive large round woody fruits. Used for coastal stabilization. Common in mangrove forests.',
    whereToFind: 'Mangrove forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic253.jpg'),
    gallery: [
      require('../../assets/image/pic254.jpeg'),
      require('../../assets/image/pic255.jpg'),
      require('../../assets/image/pic256.jpeg'),
    ],
  },

  55: {
    scientificName: 'Ceriops tagal',
    commonName: 'Spurred Mangrove',
    family: 'Rhizophoraceae',
    species: 'C. tagal',
    size: 'Small tree (3-10m)',
    growth: 'Slow',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Brackish water tolerance',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (mangrove areas)',
    description:
      'Ceriops tagal is important for coastal ecosystem. Widespread in mangroves.',
    whereToFind: 'Mangrove areas throughout Malaysia.',
    heroImage: require('../../assets/image/pic257.png'),
    gallery: [
      require('../../assets/image/pic258.jpg'),
      require('../../assets/image/pic259.jpeg'),
      require('../../assets/image/pic260.jpg'),
    ],
  },

  56: {
    scientificName: 'Bruguiera parviflora',
    commonName: 'Orange Mangrove',
    family: 'Rhizophoraceae',
    species: 'B. parviflora',
    size: 'Small tree (5-12m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Tidal swamp tree',
    distribution: 'Sarawak, Sabah (mangrove areas)',
    description:
      'Bruguiera parviflora is less common than other Bruguiera species. Used for coastal protection.',
    whereToFind: 'Tidal swamps in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic261.png'),
    gallery: [
      require('../../assets/image/pic262.jpg'),
      require('../../assets/image/pic263.jpg'),
      require('../../assets/image/pic264.jpeg'),
    ],
  },

  57: {
    scientificName: 'Pongamia pinnata',
    commonName: 'Indian Beech',
    family: 'Fabaceae',
    species: 'P. pinnata',
    size: 'Medium tree (10-25m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Coastal and riverside tree, nitrogen-fixing',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (coastal/riverside areas)',
    description:
      'Pongamia pinnata has medicinal properties and produces timber. It is nitrogen-fixing and common along coasts.',
    whereToFind: 'Coastal areas and riversides throughout Malaysia.',
    heroImage: require('../../assets/image/pic265.png'),
    gallery: [
      require('../../assets/image/pic266.jpg'),
      require('../../assets/image/pic267.jpeg'),
      require('../../assets/image/pic268.jpg'),
    ],
  },

  // CULTIVATED, ORNAMENTAL AND USEFUL PLANTS

  58: {
    scientificName: 'Aeschynanthus radicans',
    commonName: 'Lipstick Plant',
    family: 'Gesneriaceae',
    species: 'A. radicans',
    size: 'Trailing vine (up to 2m)',
    growth: 'Moderate',
    lifespan: '5-15 years',
    conservation: 'Not Evaluated',
    habitat: 'Epiphytic vine in lowland and hill rainforests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Aeschynanthus radicans is popular as an ornamental houseplant for its bright red tubular flowers. Common in suitable forest habitats.',
    whereToFind: 'Forest understory and cultivated in homes throughout Malaysia.',
    heroImage: require('../../assets/image/pic269.png'),
    gallery: [
      require('../../assets/image/pic270.jpeg'),
      require('../../assets/image/pic271.jpg'),
      require('../../assets/image/pic272.jpeg'),
    ],
  },

  59: {
    scientificName: 'Begonia cucullata',
    commonName: 'Riang, Telinga Gajah',
    family: 'Begoniaceae',
    species: 'B. cucullata',
    size: 'Small herb (15-40cm)',
    growth: 'Fast',
    lifespan: '3-8 years',
    conservation: 'Not Evaluated',
    habitat: 'Non-native, originates from South America',
    distribution: 'Cultivated throughout Malaysia (Origin: South America)',
    description:
      'Begonia cucullata is commonly grown as a bedding plant in gardens and parks. Present as cultivated and occasionally escaped.',
    whereToFind: 'Gardens and parks throughout Malaysia.',
    heroImage: require('../../assets/image/pic273.png'),
    gallery: [
      require('../../assets/image/pic274.jpeg'),
      require('../../assets/image/pic275.jpg'),
      require('../../assets/image/pic276.jpeg'),
    ],
  },

  89: {
    scientificName: 'Clitoria ternatea',
    commonName: 'Butterfly Pea',
    family: 'Fabaceae',
    species: 'C. ternatea',
    size: 'Climbing vine (2-3m)',
    growth: 'Fast',
    lifespan: '3-5 years',
    conservation: 'Not Evaluated',
    habitat: 'Naturalized, originates from tropical Asia',
    distribution: 'Naturalized in all states of Malaysia',
    description:
      'Clitoria ternatea flowers are famously used as natural blue food coloring and for making tea. Very common, both wild and cultivated.',
    whereToFind: 'Roadsides, gardens, and wild areas throughout Malaysia.',
    heroImage: require('../../assets/image/pic277.png'),
    gallery: [
      require('../../assets/image/pic278.webp'),
      require('../../assets/image/pic279.jpeg'),
      require('../../assets/image/pic280.jpg'),
    ],
  },

  60: {
    scientificName: 'Shorea macroptera',
    commonName: 'Meranti Merah',
    family: 'Dipterocarpaceae',
    species: 'S. macroptera',
    size: 'Large tree (up to 60m)',
    growth: 'Moderate',
    lifespan: '150-300 years',
    conservation: 'Vulnerable',
    habitat: 'Large canopy tree in lowland forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Shorea macroptera is a valuable timber tree declining due to logging throughout Malaysia.',
    whereToFind: 'Lowland dipterocarp forests, declining.',
    heroImage: require('../../assets/image/pic281.png'),
    gallery: [
      require('../../assets/image/pic282.jpg'),
      require('../../assets/image/pic283.jpg'),
      require('../../assets/image/pic284.jpeg'),
    ],
  },

  61: {
    scientificName: 'Dipterocarpus caudiferus',
    commonName: 'Keruing Tembaga',
    family: 'Dipterocarpaceae',
    species: 'D. caudiferus',
    size: 'Large tree (up to 50m)',
    growth: 'Moderate',
    lifespan: '150-250 years',
    conservation: 'Vulnerable',
    habitat: 'Tall emergent tree, resin-producing',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Dipterocarpus caudiferus produces resin and timber. Threatened by habitat loss across Malaysia.',
    whereToFind: 'Lowland forests, threatened.',
    heroImage: require('../../assets/image/pic285.png'),
    gallery: [
      require('../../assets/image/pic286.jpeg'),
      require('../../assets/image/pic287.jpeg'),
      require('../../assets/image/pic288.jpg'),
    ],
  },

  62: {
    scientificName: 'Dryobalanops lanceolata',
    commonName: 'Kapur Bukit',
    family: 'Dipterocarpaceae',
    species: 'D. lanceolata',
    size: 'Large tree (up to 55m)',
    growth: 'Moderate',
    lifespan: '150-250 years',
    conservation: 'Vulnerable',
    habitat: 'Canopy tree with aromatic resin',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Dryobalanops lanceolata has aromatic resin and timber. Populations declining throughout Malaysia.',
    whereToFind: 'Hill and lowland forests, declining.',
    heroImage: require('../../assets/image/pic289.png'),
    gallery: [
      require('../../assets/image/pic290.jpg'),
      require('../../assets/image/pic291.jpg'),
      require('../../assets/image/pic292.jpg'),
    ],
  },

  63: {
    scientificName: 'Eugenia cumini',
    commonName: 'Java Plum',
    family: 'Myrtaceae',
    species: 'E. cumini',
    size: 'Medium tree (10-20m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Fruit tree, small to medium size',
    distribution: 'Cultivated in all Malaysian states',
    description:
      'Eugenia cumini produces edible dark purple fruits. Common in cultivation throughout Malaysia.',
    whereToFind: 'Gardens and orchards throughout Malaysia.',
    heroImage: require('../../assets/image/pic293.png'),
    gallery: [
      require('../../assets/image/pic294.jpg'),
      require('../../assets/image/pic295.jpg'),
      require('../../assets/image/pic296.jpg'),
    ],
  },

  90: {
    scientificName: 'Syzygium aqueum',
    commonName: 'Water Apple',
    family: 'Myrtaceae',
    species: 'S. aqueum',
    size: 'Small tree (5-15m)',
    growth: 'Fast',
    lifespan: '30-60 years',
    conservation: 'Least Concern',
    habitat: 'Medium-sized tree with bell-shaped fruits',
    distribution: 'Cultivated in all Malaysian states',
    description:
      'Syzygium aqueum is widely cultivated for its bell-shaped watery fruits throughout Malaysia.',
    whereToFind: 'Home gardens and orchards throughout Malaysia.',
    heroImage: require('../../assets/image/pic297.png'),
    gallery: [
      require('../../assets/image/pic300.jpg'),
      require('../../assets/image/pic301.jpg'),
      require('../../assets/image/pic302.jpg'),
    ],
  },

  91: {
    scientificName: 'Durio zibethinus',
    commonName: 'Durian',
    family: 'Malvaceae',
    species: 'D. zibethinus',
    size: 'Large tree (25-50m)',
    growth: 'Moderate',
    lifespan: '80-150 years',
    conservation: 'Not Threatened (Cultivated)',
    habitat: 'Large fruit tree with thorny trunk',
    distribution: 'All states of Malaysia (Native to Borneo & Peninsular Malaysia)',
    description:
      'Durio zibethinus is Malaysia\'s famous "king of fruits" with thorny exterior and creamy flesh. Extensively cultivated in all states.',
    whereToFind: 'Orchards and plantations throughout Malaysia.',
    heroImage: require('../../assets/image/pic303.png'),
    gallery: [
      require('../../assets/image/pic304.jpeg'),
      require('../../assets/image/pic305.jpeg'),
      require('../../assets/image/pic306.jpg'),
    ],
  },

  92: {
    scientificName: 'Artocarpus heterophyllus',
    commonName: 'Jackfruit',
    family: 'Moraceae',
    species: 'A. heterophyllus',
    size: 'Large tree (10-25m)',
    growth: 'Moderate',
    lifespan: '60-100 years',
    conservation: 'Not Threatened',
    habitat: 'Large tropical tree with massive fruits',
    distribution: 'Cultivated in all Malaysian states',
    description:
      'Artocarpus heterophyllus produces massive edible fruits. Commonly cultivated across Malaysia.',
    whereToFind: 'Home gardens and fruit orchards throughout Malaysia.',
    heroImage: require('../../assets/image/pic307.png'),
    gallery: [
      require('../../assets/image/pic308.jpeg'),
      require('../../assets/image/pic309.jpeg'),
      require('../../assets/image/pic310.jpeg'),
    ],
  },

  64: {
    scientificName: 'Ficus deltoidea',
    commonName: 'Mas Cotek',
    family: 'Moraceae',
    species: 'F. deltoidea',
    size: 'Small shrub (1-3m)',
    growth: 'Slow',
    lifespan: '20-50 years',
    conservation: 'Least Concern',
    habitat: 'Small shrub with medicinal leaves and fruits',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Ficus deltoidea is a medicinal shrub used in traditional medicine throughout Malaysia.',
    whereToFind: 'Forest edges and cultivated for medicine.',
    heroImage: require('../../assets/image/pic311.png'),
    gallery: [
      require('../../assets/image/pic312.jpeg'),
      require('../../assets/image/pic313.jpeg'),
      require('../../assets/image/pic314.jpeg'),
    ],
  },

  93: {
    scientificName: 'Ficus microcarpa',
    commonName: 'Chinese Banyan',
    family: 'Moraceae',
    species: 'F. microcarpa',
    size: 'Large tree (15-25m)',
    growth: 'Fast',
    lifespan: '100-200 years',
    conservation: 'Least Concern',
    habitat: 'Urban and forest growth',
    distribution: 'All states of Malaysia (urban and forest areas)',
    description:
      'Ficus microcarpa is widespread in urban areas as shade tree and ornamental. Very common across all Malaysian states.',
    whereToFind: 'Urban streets, parks, and forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic315.png'),
    gallery: [
      require('../../assets/image/pic316.jpg'),
      require('../../assets/image/pic317.jpeg'),
      require('../../assets/image/pic318.jpeg'),
    ],
  },

  8: {
    scientificName: 'Macaranga gigantea',
    commonName: 'Macaranga',
    family: 'Euphorbiaceae',
    species: 'M. gigantea',
    size: 'Medium tree (15-30m)',
    growth: 'Very fast',
    lifespan: '20-40 years',
    conservation: 'Not Assessed',
    habitat: 'Pioneer species in disturbed forests',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Macaranga gigantea is important for soil stabilization in regenerating forests.',
    whereToFind: 'Logged areas and forest gaps throughout Malaysia.',
    heroImage: require('../../assets/image/pic319.png'),
    gallery: [
      require('../../assets/image/pic320.jpg'),
      require('../../assets/image/pic321.jpg'),
      require('../../assets/image/pic322.jpeg'),
    ],
  },

  66: {
    scientificName: 'Hedychium coronarium',
    commonName: 'White Ginger Lily',
    family: 'Zingiberaceae',
    species: 'H. coronarium',
    size: 'Perennial herb (1-2m)',
    growth: 'Fast',
    lifespan: '5-15 years',
    conservation: 'Not Threatened',
    habitat: 'Fragrant flowering ginger in tropical gardens',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Hedychium coronarium is a fragrant ornamental grown in gardens throughout Malaysia.',
    whereToFind: 'Gardens and landscaping throughout Malaysia.',
    heroImage: require('../../assets/image/pic323.png'),
    gallery: [
      require('../../assets/image/pic324.jpg'),
      require('../../assets/image/pic325.jpg'),
      require('../../assets/image/pic326.jpeg'),
    ],
  },

  67: {
    scientificName: 'Alpinia zerumbet',
    commonName: 'Shell Ginger',
    family: 'Zingiberaceae',
    species: 'A. zerumbet',
    size: 'Perennial herb (2-3m)',
    growth: 'Fast',
    lifespan: '5-15 years',
    conservation: 'Not Threatened',
    habitat: 'Ornamental and culinary uses',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Alpinia zerumbet is widely cultivated for ornamental and herbal uses across Malaysia.',
    whereToFind: 'Gardens and herb gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic327.png'),
    gallery: [
      require('../../assets/image/pic328.jpg'),
      require('../../assets/image/pic329.jpeg'),
      require('../../assets/image/pic330.jpeg'),
    ],
  },

  94: {
    scientificName: 'Curcuma longa',
    commonName: 'Turmeric',
    family: 'Zingiberaceae',
    species: 'C. longa',
    size: 'Perennial herb (0.6-1m)',
    growth: 'Fast',
    lifespan: '1-2 years (rhizome persists)',
    conservation: 'Not Threatened',
    habitat: 'Rhizome used for cooking and medicine',
    distribution: 'Malaysia (Cultivated in all states)',
    description:
      'Curcuma longa is extensively cultivated for culinary and medicinal use in all Malaysian states.',
    whereToFind: 'Home gardens and farms throughout Malaysia.',
    heroImage: require('../../assets/image/pic331.png'),
    gallery: [
      require('../../assets/image/pic332.jpg'),
      require('../../assets/image/pic333.jpeg'),
      require('../../assets/image/pic334.jpeg'),
    ],
  },

  68: {
    scientificName: 'Curcuma zedoaria',
    commonName: 'Zedoary',
    family: 'Zingiberaceae',
    species: 'C. zedoaria',
    size: 'Perennial herb (0.8-1.5m)',
    growth: 'Moderate',
    lifespan: '3-8 years',
    conservation: 'Not Threatened',
    habitat: 'Aromatic rhizome, traditional medicine',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Curcuma zedoaria is used in traditional medicine across Malaysia with medicinal and ornamental value.',
    whereToFind: 'Traditional medicine gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic335.png'),
    gallery: [
      require('../../assets/image/pic336.jpeg'),
      require('../../assets/image/pic337.jpeg'),
      require('../../assets/image/pic338.jpg'),
    ],
  },

  95: {
    scientificName: 'Hibiscus rosa-sinensis var. alba',
    commonName: 'White Hibiscus',
    family: 'Malvaceae',
    species: 'H. rosa-sinensis var. alba',
    size: 'Shrub (2-4m)',
    growth: 'Fast',
    lifespan: '15-30 years',
    conservation: 'Not Threatened',
    habitat: 'Decorative flowering shrub',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Hibiscus rosa-sinensis var. alba is a popular ornamental shrub with large white flowers in gardens throughout Malaysia.',
    whereToFind: 'Gardens and landscapes throughout Malaysia.',
    heroImage: require('../../assets/image/pic339.png'),
    gallery: [
      require('../../assets/image/pic340.jpeg'),
      require('../../assets/image/pic341.jpg'),
      require('../../assets/image/pic342.jpeg'),
    ],
  },

  96: {
    scientificName: 'Ixora chinensis',
    commonName: 'Jungle Flame',
    family: 'Rubiaceae',
    species: 'I. chinensis',
    size: 'Shrub (1-3m)',
    growth: 'Moderate',
    lifespan: '15-25 years',
    conservation: 'Not Threatened',
    habitat: 'Shrub with clustered flowers for urban landscaping',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Ixora chinensis is widely planted for urban landscaping with colorful flower clusters in all Malaysian states.',
    whereToFind: 'Urban landscaping and gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic343.png'),
    gallery: [
      require('../../assets/image/pic344.jpeg'),
      require('../../assets/image/pic345.jpg'),
      require('../../assets/image/pic346.jpeg'),
    ],
  },

  97: {
    scientificName: 'Bougainvillea glabra',
    commonName: 'Paper Flower',
    family: 'Nyctaginaceae',
    species: 'B. glabra',
    size: 'Climbing vine (3-12m)',
    growth: 'Fast',
    lifespan: '20-40 years',
    conservation: 'Not Threatened',
    habitat: 'Climbers with colorful bracts in gardens',
    distribution: 'Cultivated throughout Malaysia (Origin: South America)',
    description:
      'Bougainvillea glabra is a very popular ornamental climber with colorful bracts cultivated throughout Malaysia.',
    whereToFind: 'Gardens, fences, and walls throughout Malaysia.',
    heroImage: require('../../assets/image/pic347.png'),
    gallery: [
      require('../../assets/image/pic348.jpeg'),
      require('../../assets/image/pic349.jpg'),
      require('../../assets/image/pic350.jpg'),
    ],
  },

  98: {
    scientificName: 'Plumeria obtusa',
    commonName: 'Singapore Plumeria',
    family: 'Apocynaceae',
    species: 'P. obtusa',
    size: 'Small tree (3-8m)',
    growth: 'Moderate',
    lifespan: '30-50 years',
    conservation: 'Not Threatened',
    habitat: 'Fragrant flowers, commonly planted in parks',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Plumeria obtusa is commonly planted in parks and gardens with fragrant white flowers across Malaysia.',
    whereToFind: 'Parks, temples, and gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic351.png'),
    gallery: [
      require('../../assets/image/pic352.jpeg'),
      require('../../assets/image/pic353.jpg'),
      require('../../assets/image/pic354.jpg'),
    ],
  },

  69: {
    scientificName: 'Cymbidium finlaysonianum',
    commonName: 'Finlayson Orchid',
    family: 'Orchidaceae',
    species: 'C. finlaysonianum',
    size: 'Epiphytic orchid (30-60cm)',
    growth: 'Slow',
    lifespan: '15-30 years',
    conservation: 'Not Assessed',
    habitat: 'Epiphytic orchid, decorative',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Cymbidium finlaysonianum is a decorative epiphyte found in forests and cultivated for ornamental purposes.',
    whereToFind: 'Forest trees and orchid collections.',
    heroImage: require('../../assets/image/pic355.png'),
    gallery: [
      require('../../assets/image/pic356.webp'),
      require('../../assets/image/pic357.jpg'),
      require('../../assets/image/pic358.jpeg'),
    ],
  },

  70: {
    scientificName: 'Dendrobium nobile',
    commonName: 'Noble Dendrobium',
    family: 'Orchidaceae',
    species: 'D. nobile',
    size: 'Epiphytic orchid (30-60cm)',
    growth: 'Moderate',
    lifespan: '15-40 years',
    conservation: 'Not Threatened',
    habitat: 'Epiphytic orchid with beautiful flowers',
    distribution: 'Cultivated throughout Malaysia',
    description:
      'Dendrobium nobile is popular in horticulture with ornamental and medicinal value, cultivated throughout Malaysia.',
    whereToFind: 'Orchid nurseries and collections throughout Malaysia.',
    heroImage: require('../../assets/image/pic359.png'),
    gallery: [
      require('../../assets/image/pic360.jpg'),
      require('../../assets/image/pic361.webp'),
      require('../../assets/image/pic362.jpg'),
    ],
  },

  71: {
    scientificName: 'Calamus manan',
    commonName: 'Manau Rattan',
    family: 'Arecaceae',
    species: 'C. manan',
    size: 'Climbing palm (up to 100m)',
    growth: 'Moderate',
    lifespan: '30-60 years',
    conservation: 'Not Threatened',
    habitat: 'Climbing rattan used in furniture',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Calamus manan is commercially harvested for furniture and weaving throughout Malaysia.',
    whereToFind: 'Forests and rattan plantations in Malaysia.',
    heroImage: require('../../assets/image/pic363.png'),
    gallery: [
      require('../../assets/image/pic364.jpeg'),
      require('../../assets/image/pic365.jpg'),
      require('../../assets/image/pic366.jpeg'),
    ],
  },

  72: {
    scientificName: 'Calamus javensis',
    commonName: 'Java Rattan',
    family: 'Arecaceae',
    species: 'C. javensis',
    size: 'Climbing palm (up to 50m)',
    growth: 'Moderate',
    lifespan: '25-50 years',
    conservation: 'Not Threatened',
    habitat: 'Strong rattan used for crafts',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Calamus javensis is used for crafts and furniture across Malaysia. Common in trade.',
    whereToFind: 'Forests and plantations throughout Malaysia.',
    heroImage: require('../../assets/image/pic367.png'),
    gallery: [
      require('../../assets/image/pic368.jpeg'),
      require('../../assets/image/pic369.jpg'),
      require('../../assets/image/pic370.jpeg'),
    ],
  },

  73: {
    scientificName: 'Elaeocarpus bancanus',
    commonName: 'Batuan',
    family: 'Elaeocarpaceae',
    species: 'E. bancanus',
    size: 'Large tree (20-35m)',
    growth: 'Moderate',
    lifespan: '80-150 years',
    conservation: 'Not Threatened',
    habitat: 'Large tree with edible fruits',
    distribution: 'Sarawak, Sabah',
    description:
      'Elaeocarpus bancanus produces edible fruits and timber. Locally common in Sarawak and Sabah.',
    whereToFind: 'Lowland forests in Sarawak and Sabah.',
    heroImage: require('../../assets/image/pic371.jpg'),
    gallery: [
      require('../../assets/image/pic372.jpg'),
      require('../../assets/image/pic373.jpeg'),
      require('../../assets/image/pic374.jpeg'),
    ],
  },

  74: {
    scientificName: 'Scaphium macropodum',
    commonName: 'Malayan Mast Tree',
    family: 'Malvaceae',
    species: 'S. macropodum',
    size: 'Large tree (30-45m)',
    growth: 'Moderate',
    lifespan: '100-200 years',
    conservation: 'Not Threatened',
    habitat: 'Forest tree with seeds used in traditional medicine',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Scaphium macropodum seeds are used in traditional medicine throughout Malaysia. Produces timber.',
    whereToFind: 'Lowland forests throughout Malaysia.',
    heroImage: require('../../assets/image/pic375.png'),
    gallery: [
      require('../../assets/image/pic376.webp'),
      require('../../assets/image/pic377.jpeg'),
      require('../../assets/image/pic378.jpeg'),
    ],
  },

  75: {
    scientificName: 'Adenanthera pavonina',
    commonName: 'Red Sandalwood',
    family: 'Fabaceae',
    species: 'A. pavonina',
    size: 'Medium tree (10-20m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Ornamental and medicinal with bright red seeds',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Adenanthera pavonina has bright red seeds and is commonly grown as ornamental with herbal properties across Malaysia.',
    whereToFind: 'Parks, gardens, and roadsides throughout Malaysia.',
    heroImage: require('../../assets/image/pic379.png'),
    gallery: [
      require('../../assets/image/pic380.jpeg'),
      require('../../assets/image/pic381.jpeg'),
      require('../../assets/image/pic382.jpeg'),
    ],
  },

  76: {
    scientificName: 'Barringtonia racemosa',
    commonName: 'Powder-puff Tree',
    family: 'Lecythidaceae',
    species: 'B. racemosa',
    size: 'Medium tree (8-20m)',
    growth: 'Moderate',
    lifespan: '50-100 years',
    conservation: 'Least Concern',
    habitat: 'Coastal or riverside tree with large flowers',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia (coastal/riverside areas)',
    description:
      'Barringtonia racemosa has large powder-puff flowers and is used in traditional medicine. Common in coastal areas.',
    whereToFind: 'Coastal forests and riversides throughout Malaysia.',
    heroImage: require('../../assets/image/pic383.png'),
    gallery: [
      require('../../assets/image/pic384.jpeg'),
      require('../../assets/image/pic385.jpeg'),
      require('../../assets/image/pic386.jpeg'),
    ],
  },

  99: {
    scientificName: 'Ficus benjamina',
    commonName: 'Weeping Fig',
    family: 'Moraceae',
    species: 'F. benjamina',
    size: 'Large tree (15-30m)',
    growth: 'Fast',
    lifespan: '50-150 years',
    conservation: 'Not Threatened',
    habitat: 'Common indoor/outdoor ornamental tree',
    distribution: 'Cultivated in all Malaysian states',
    description:
      'Ficus benjamina is very commonly cultivated indoors and outdoors as shade tree in all Malaysian states.',
    whereToFind: 'Indoor spaces, parks, and gardens throughout Malaysia.',
    heroImage: require('../../assets/image/pic387.png'),
    gallery: [
      require('../../assets/image/pic388.jpeg'),
      require('../../assets/image/pic389.jpeg'),
      require('../../assets/image/pic390.jpg'),
    ],
  },

  100: {
    scientificName: 'Ficus elastica',
    commonName: 'Rubber Fig',
    family: 'Moraceae',
    species: 'F. elastica',
    size: 'Large tree (25-40m)',
    growth: 'Fast',
    lifespan: '100-200 years',
    conservation: 'Not Threatened',
    habitat: 'Rubber-producing tree, ornamental',
    distribution: 'Cultivated in all states of Malaysia',
    description:
      'Ficus elastica is widely cultivated as ornamental with large glossy leaves throughout Malaysia.',
    whereToFind: 'Indoor and outdoor landscaping throughout Malaysia.',
    heroImage: require('../../assets/image/pic391.png'),
    gallery: [
      require('../../assets/image/pic392.jpeg'),
      require('../../assets/image/pic393.jpg'),
      require('../../assets/image/pic394.jpg'),
    ],
  },

  77: {
    scientificName: 'Piper nigrum',
    commonName: 'Black Pepper',
    family: 'Piperaceae',
    species: 'P. nigrum',
    size: 'Climbing vine (up to 4m)',
    growth: 'Fast',
    lifespan: '15-30 years',
    conservation: 'Not Threatened',
    habitat: 'Climbing vine producing spice',
    distribution: 'Sarawak, Sabah (Native), cultivated throughout Malaysia',
    description:
      'Piper nigrum is commercially cultivated for spice, native to Sarawak and Sabah. Important cash crop.',
    whereToFind: 'Pepper plantations in Sarawak, Sabah, and other states.',
    heroImage: require('../../assets/image/pic395.png'),
    gallery: [
      require('../../assets/image/pic396.jpg'),
      require('../../assets/image/pic397.jpeg'),
      require('../../assets/image/pic398.jpeg'),
    ],
  },

  78: {
    scientificName: 'Gnetum gnemon',
    commonName: 'Melinjo',
    family: 'Gnetaceae',
    species: 'G. gnemon',
    size: 'Small tree (5-15m)',
    growth: 'Moderate',
    lifespan: '30-60 years',
    conservation: 'Not Threatened',
    habitat: 'Tropical tree with edible seeds and leaves',
    distribution: 'Sarawak, Sabah, Peninsular Malaysia',
    description:
      'Gnetum gnemon produces edible seeds and leaves. Commonly cultivated for food across Malaysia.',
    whereToFind: 'Home gardens and small farms throughout Malaysia.',
    heroImage: require('../../assets/image/pic399.png'),
    gallery: [
      require('../../assets/image/pic400.jpeg'),
      require('../../assets/image/pic401.jpeg'),
      require('../../assets/image/pic402.jpg'),
    ],
  },
};

export function getPlantDetails(id) {
  return details[id];
}

// Normalize scientific name by replacing underscores with spaces and trimming
const normalizeScientificName = (name) => {
  if (!name) return '';
  return name.toLowerCase().trim().replace(/_/g, ' ');
};

// Find plant ID by scientific name (case-insensitive, partial match)
// Searches across ALL categories in the encyclopedia
export function findPlantByScientificName(scientificName) {
  if (!scientificName) return null;

  const searchName = normalizeScientificName(scientificName);

  // First try exact match (normalized)
  for (const [id, plant] of Object.entries(details)) {
    if (plant.scientificName) {
      const plantName = normalizeScientificName(plant.scientificName);
      if (plantName === searchName) {
        return { id: parseInt(id), ...plant };
      }
    }
  }

  // Then try partial match (search term contains in plant name)
  for (const [id, plant] of Object.entries(details)) {
    if (plant.scientificName) {
      const plantName = normalizeScientificName(plant.scientificName);
      if (plantName.includes(searchName)) {
        return { id: parseInt(id), ...plant };
      }
    }
  }

  // Try reverse match (plant name contains in search term)
  for (const [id, plant] of Object.entries(details)) {
    if (plant.scientificName) {
      const plantName = normalizeScientificName(plant.scientificName);
      if (searchName.includes(plantName)) {
        return { id: parseInt(id), ...plant };
      }
    }
  }

  // Try word-by-word matching (handles cases like "Alstonia scholaris" vs "Alstonia_scholaris")
  const searchWords = searchName.split(/\s+/).filter(w => w.length > 0);
  if (searchWords.length >= 2) {
    for (const [id, plant] of Object.entries(details)) {
      if (plant.scientificName) {
        const plantName = normalizeScientificName(plant.scientificName);
        const plantWords = plantName.split(/\s+/).filter(w => w.length > 0);

        // Check if all search words are in plant name (order doesn't matter)
        const allWordsMatch = searchWords.every(word =>
          plantWords.some(plantWord => plantWord.includes(word) || word.includes(plantWord))
        );

        if (allWordsMatch && plantWords.length >= searchWords.length) {
          return { id: parseInt(id), ...plant };
        }
      }
    }
  }

  return null;
}