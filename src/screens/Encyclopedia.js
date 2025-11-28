import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/EncyclopediaStyles";
import { useScrollHide } from "../hooks/useScrollHide";

export default function Encyclopedia({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();

  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  // Get search query from route params if provided
  const initialSearchQuery = route?.params?.q || "";
  const categories = [
    "Lowland Rainforest Plants",
    "Highland & Montane Forest Species",
    "Mangrove & Coastal Plants",
    "Cultivated Plants",
  ];

  const categoryPlants = {
    "Lowland Rainforest Plants": [
      {
        id: 1,
        name: "Alstonia_scholaris",
        subtitle: "Devil's tree, found across Malaysia.",
        image: require("../../assets/image/pic1.png"),
      },
      {
        id: 2,
        name: "Antiaris toxicaria",
        subtitle: "Known as the Upas Tree, native to Malaysia.",
        image: require("../../assets/image/pic2.png"),
      },
      {
        id: 3,
        name: "Artocarpus odoratissimus",
        subtitle: "Called marang or tarap, native to Borneo.",
        image: require("../../assets/image/pic3.png"),
      },
      {
        id: 4,
        name: "Asplenium nidus",
        subtitle: "Bird's Nest Fern, common in tropical forests.",
        image: require("../../assets/image/pic4.png"),
      },
      {
        id: 5,
        name: "Etlingera elatior",
        subtitle: "Torch Ginger or Kantan, used in local dishes.",
        image: require("../../assets/image/pic6.png"),
      },
      {
        id: 6,
        name: "Eurycoma longifolia",
        subtitle: "Tongkat Ali, a traditional medicinal plant.",
        image: require("../../assets/image/pic7.png"),
      },
      {
        id: 7,
        name: "Ficus sundaica",
        subtitle: "Ara Bertih/Ara Punai, a Bornean fig species often seen in Sarawak's rainforests.",
        image: require("../../assets/image/pic8.png"),
      },
      {
        id: 8,
        name: "Macaranga gigantea",
        subtitle: "Giant Mahang or Mahang Gajah, a common forest tree in Malaysia and Borneo.",
        image: require("../../assets/image/pic319.png"),
      },
      {
        id: 9,
        name: "Shorea pinanga",
        subtitle: "Meranti Langgai Bukit, grows in heath forests and yields Red Meranti timber.",
        image: require("../../assets/image/pic11.png"),
      },
      {
        id: 10,
        name: "Shorea ochracea",
        subtitle: "Raruk, a common tree in Malaysia and Borneo, source of Yellow Meranti timber.",
        image: require("../../assets/image/pic12.png"),
      },
      {
        id: 11,
        name: "Aetoxylon sympetalum",
        subtitle: "Kayu Gaharu, a common tree in Sarawak and Sabah, produces lower-grade agarwood.",
        image: require("../../assets/image/pic13.png"),
      },
      {
        id: 12,
        name: "Calophyllum lanigerum",
        subtitle: "Bintangor, common in Malaysia, source of timber and anti-HIV compounds.",
        image: require("../../assets/image/pic14.png"),
      },
      {
        id: 13,
        name: "Calophyllym teysmanii",
        subtitle: "Bintangor Gading, a peat swamp tree, known for timber and medicinal properties.",
        image: require("../../assets/image/pic15.png"),
      },
      {
        id: 14,
        name: "Aquilaria beccariana",
        subtitle: "Kayu gaharu/engkaras produces valuable agarwood in Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic16.png"),
      },
      {
        id: 15,
        name: "Aquilaria malaccensis",
        subtitle: "A type of Kayu gaharu, which is the most valuable agarwood species in Malaysia.",
        image: require("../../assets/image/pic17.png"),
      },
      {
        id: 16,
        name: "Aquilaria microcarpa",
        subtitle: "Another variant of Kayu gaharu that grows on sandy soils in Sarawak and Sabah.",
        image: require("../../assets/image/pic18.png"),
      },
      {
        id: 17,
        name: "Didesmandra aspera",
        subtitle: "Simpor pelagus is endemic to Borneo's kerangas forests.",
        image: require("../../assets/image/pic19.png"),
      },
      {
        id: 18,
        name: "Goniothalamus velutinus",
        subtitle: "Kayu hujan panas is a rare medicinal tree in Malaysia.",
        image: require("../../assets/image/pic20.png"),
      },
      {
        id: 19,
        name: "Koompassia excelsa",
        subtitle: "Tapang is Malaysia's tallest tree, hosting giant honeybees.",
        image: require("../../assets/image/pic21.png"),
      },
      {
        id: 20,
        name: "Koompassia malaccensis",
        subtitle: "Menggris produces extremely hard timber across Malaysia.",
        image: require("../../assets/image/pic22.png"),
      },
      {
        id: 21,
        name: "Shorea hemsleyana",
        subtitle: "Chengal Pasir has durable timber, found in coastal Sarawak and Sabah.",
        image: require("../../assets/image/pic23.png"),
      },
      {
        id: 22,
        name: "Shorea macrophylla",
        subtitle: "Engkabang jantong produces illipe nuts for chocolate throughout Malaysia.",
        image: require("../../assets/image/pic24.png"),
      },
      {
        id: 23,
        name: "Shorea palembanica",
        subtitle: "Engkabang asu grows in Sarawak and Sabah peat swamps.",
        image: require("../../assets/image/pic25.png"),
      },
      {
        id: 24,
        name: "Shorea seminis",
        subtitle: "Engkabang terendak produces illipe nuts along Sarawak and Sabah rivers.",
        image: require("../../assets/image/pic26.png"),
      },
      {
        id: 25,
        name: "Shorea splendida",
        subtitle: "Engkabang bintang produces premium illipe nuts in Sarawak and Sabah.",
        image: require("../../assets/image/pic27.png"),
      },
      {
        id: 26,
        name: "Shorea stenoptera",
        subtitle: "Engkabang rusa is the main illipe nut source in Sarawak and Sabah.",
        image: require("../../assets/image/pic28.png"),
      }
    ],

    "Highland & Montane Forest Species": [
      {
        id: 27,
        name: "Areca triandra",
        subtitle: "Pinang borneo is a palm with edible nuts found in Sarawak and Sabah.",
        image: require("../../assets/image/pic113.png"),
      },
      {
        id: 28,
        name: "Areca subacaulis",
        subtitle: "Pinang pici is an ornamental palm endemic to Borneo.",
        image: require("../../assets/image/pic117.png"),
      },
      {
        id: 29,
        name: "Cycas rumphii",
        subtitle: "Paku gajah is a coastal cycad found throughout Malaysia's coastlines.",
        image: require("../../assets/image/pic121.png"),
      },
      {
        id: 30,
        name: "Huperzia squarrosa",
        subtitle: "Ekor tupai is a popular ornamental fern across Malaysia.",
        image: require("../../assets/image/pic125.png"),
      },
      {
        id: 31,
        name: "Johannesteijsmannia altifrons",
        subtitle: "Ekor buaya is a fan palm used for roofing in Malaysia.",
        image: require("../../assets/image/pic129.png"),
      },
      {
        id: 32,
        name: "Monophyllaea glauca",
        subtitle: "One-leaf plant grows on limestone cliffs in Sarawak and Sabah.",
        image: require("../../assets/image/pic133.png"),
      },
      {
        id: 33,
        name: "Rhododendron fallacinum",
        subtitle: "Petagar Hamzar is a montane shrub in Sarawak and Sabah highlands.",
        image: require("../../assets/image/pic145.png"),
      },
      {
        id: 34,
        name: "Rhododendron javanicum",
        subtitle: "Javan Rhododendron grows in montane forests of Sabah and Sarawak.",
        image: require("../../assets/image/pic149.png"),
      },
      {
        id: 35,
        name: "Areca jugahpunya",
        subtitle: "Pinang jugah is extremely rare, endemic to a small area in Sarawak.",
        image: require("../../assets/image/pic153.png"),
      },
      {
        id: 36,
        name: "Licuala orbicularis",
        subtitle: "Biris has circular pleated leaves, found in Sarawak and Sabah.",
        image: require("../../assets/image/pic157.png"),
      },
      {
        id: 37,
        name: "Pinanga mirabilis",
        subtitle: "Pinang tudong pelandok is an extremely rare palm endemic to Borneo.",
        image: require("../../assets/image/pic161.png"),
      },
      {
        id: 38,
        name: "Salacca magnifica",
        subtitle: "Salak is endemic to western Sarawak's wet rainforests.",
        image: require("../../assets/image/pic165.png"),
      },
      {
        id: 39,
        name: "Nepenthes macrophylla",
        subtitle: "Large-Leaved Pitcher is a rare montane carnivorous plant in Sarawak and Sabah.",
        image: require("../../assets/image/pic169.png"),
      },
      {
        id: 40,
        name: "Nepenthes burbidgeae",
        subtitle: "Burbidge Pitcher is found only in Sabah's Mount Kinabalu area.",
        image: require("../../assets/image/pic173.png"),
      },
      {
        id: 41,
        name: "Paphiopedilum superbiens",
        subtitle: "Superb Slipper Orchid is endangered, found on Sarawak's limestone cliffs.",
        image: require("../../assets/image/pic177.png"),
      },
      {
        id: 42,
        name: "Paphiopedilum malipoense ",
        subtitle: "Malipo Slipper Orchid is rare in high-altitude areas of Sabah and Sarawak.",
        image: require("../../assets/image/pic181.png"),
      },
      {
        id: 43,
        name: "Phalaenopsis cornu-cervi",
        subtitle: "Narrow Leaf Begonia grows on montane slopes in Sarawak and Sabah.",
        image: require("../../assets/image/pic185.png"),
      },
      {
        id: 44,
        name: "Begonia serotina",
        subtitle: "Serotine Begonia is uncommon in Sabah and Sarawak highlands.",
        image: require("../../assets/image/pic189.png"),
      },
      {
        id: 45,
        name: "Medinilla cummingii",
        subtitle: "Medinilla is an ornamental epiphyte in Sabah and Sarawak montane forests.",
        image: require("../../assets/image/pic193.png"),
      },
      {
        id: 46,
        name: "Cyrtandra cumingii ",
        subtitle: "Himalayan Bellflower is an uncommon understory plant in Sabah and Sarawak.",
        image: require("../../assets/image/pic197.png"),
      },
      {
        id: 47,
        name: "Rhododendron lochiae ",
        subtitle: "Rhododendron is restricted to high altitudes in Sabah.",
        image: require("../../assets/image/pic201.png"),
      },
    ],

    "Mangrove & Coastal Plants": [
      {
        id: 48,
        name: "Avicennia lanata",
        subtitle: "Api-api bulu grows in inner mangrove forests of Sarawak and Sabah.",
        image: require("../../assets/image/pic209.png"),
      },
      {
        id: 49,
        name: "Lumnitzera littorea",
        subtitle: "Teruntum merah produces durable timber in Sarawak and Sabah mangroves.",
        image: require("../../assets/image/pic225.jpg"),
      },
      {
        id: 50,
        name: "Lumnitzera racemosa",
        subtitle: "Black Mangrove supports aquatic life in tidal zones across Malaysia.",
        image: require("../../assets/image/pic229.png"),
      },
      {
        id: 51,
        name: " Excoecaria agallocha",
        subtitle: "Blind-your-eye Mangrove has toxic sap, found in mangrove areas across Malaysia.",
        image: require("../../assets/image/pic241.png"),
      },
      {
        id: 52,
        name: "Aegiceras corniculatum",
        subtitle: "Black Mangrove tolerates tidal inundation in mangroves throughout Malaysia.",
        image: require("../../assets/image/pic245.png"),
      },
      {
        id: 53,
        name: "Kandelia obovata",
        subtitle: "Common Red Mangrove stabilizes mudflats in Sabah, Sarawak, and Peninsular Malaysia.",
        image: require("../../assets/image/pic249.png"),
      },
      {
        id: 54,
        name: "Xylocarpus granatum",
        subtitle: "Cannonball Mangrove has round woody fruits in Malaysian mangrove forests.",
        image: require("../../assets/image/pic253.jpg"),
      },
      {
        id: 55,
        name: "Ceriops tagal",
        subtitle: "Spurred Mangrove is widespread in brackish water areas across Malaysia.",
        image: require("../../assets/image/pic257.png"),
      },
      {
        id: 56,
        name: "Bruguiera parviflora",
        subtitle: "Orange Mangrove is less common than other species in Sarawak and Sabah.",
        image: require("../../assets/image/pic261.png"),
      },
      {
        id: 57,
        name: "Pongamia pinnata",
        subtitle: "Indian Beech is a nitrogen-fixing tree along Malaysian coasts and riversides.",
        image: require("../../assets/image/pic265.png"),
      }
    ],

    "Cultivated Plants": [
      {
        id: 58,
        name: "Aeschynanthus radicans",
        subtitle: "Lip-stick plant is a popular houseplant with red flowers found in Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic269.png"),
      },
      {
        id: 59,
        name: "Begonia cucullata",
        subtitle: "Riang is a bedding plant cultivated throughout Malaysia, originally from South America.",
        image: require("../../assets/image/pic273.png"),
      },
      {
        id: 60,
        name: "Shorea macroptera ",
        subtitle: "Meranti Merah is a timber tree declining due to logging in Sarawak, Sabah, and Peninsular Malaysia",
        image: require("../../assets/image/pic281.png"),
      },
      {
        id: 61,
        name: "Dipterocarpus caudiferus",
        subtitle: "Keruing Tembaga produces resin and timber across Malaysia, threatened by habitat loss.",
        image: require("../../assets/image/pic285.png"),
      },
      {
        id: 62,
        name: "Dryobalanops lanceolata",
        subtitle: "Kapur Bukit has aromatic resin and declining timber populations throughout Malaysia.",
        image: require("../../assets/image/pic289.png"),
      },
      {
        id: 63,
        name: "Eugenia cumini",
        subtitle: "Java Plum produces edible fruit, cultivated in all Malaysian states.",
        image: require("../../assets/image/pic293.png"),
      },
      {
        id: 64,
        name: "Ficus deltoidea",
        subtitle: "Mas Cotek is a medicinal shrub used in traditional medicine throughout Malaysia.",
        image: require("../../assets/image/pic311.png"),
      },
      {
        id: 65,
        name: "Macaranga gigantea",
        subtitle: "Macaranga is a pioneer tree for soil stabilization in Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic79.jpeg"),
      },
      {
        id: 66,
        name: "Hedychium coronarium",
        subtitle: "White Ginger Lily is a fragrant ornamental grown in gardens throughout Malaysia.",
        image: require("../../assets/image/pic323.png"),
      },
      {
        id: 67,
        name: "Alpinia zerumbet",
        subtitle: "Shell Ginger is widely cultivated for ornamental and herbal uses across Malaysia.",
        image: require("../../assets/image/pic327.png"),
      },
      {
        id: 68,
        name: "Curcuma zedoaria",
        subtitle: "Zedoary is used in traditional medicine across Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic335.png"),
      },
      {
        id: 69,
        name: "Cymbidium finlaysonianum ",
        subtitle: "Finlayson Orchid is a decorative epiphyte in Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic355.png"),
      },
      {
        id: 70,
        name: "Dendrobium nobile",
        subtitle: "Noble Dendrobium is popular in horticulture, cultivated throughout Malaysia.",
        image: require("../../assets/image/pic359.png"),
      },
      {
        id: 71,
        name: "Calamus manan",
        subtitle: "Manau Rattan is commercially harvested for furniture in Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic363.png"),
      },
      {
        id: 72,
        name: "Calamus javensis",
        subtitle: "Java Rattan is used for crafts and furniture across Malaysia.",
        image: require("../../assets/image/pic367.png"),
      },
      {
        id: 73,
        name: "Elaeocarpus bancanus",
        subtitle: "Batuan produces edible fruits, locally common in Sarawak and Sabah.",
        image: require("../../assets/image/pic371.jpg"),
      },
      {
        id: 74,
        name: "Scaphium macropodum",
        subtitle: "Malayan Mast Tree seeds are used in traditional medicine throughout Malaysia.",
        image: require("../../assets/image/pic375.png"),
      },
      {
        id: 75,
        name: "Adenanthera pavonina",
        subtitle: "Red Sandalwood has bright red seeds, commonly grown as ornamental across Malaysia.",
        image: require("../../assets/image/pic379.png"),
      },
      {
        id: 76,
        name: "Barringtonia racemosa",
        subtitle: "Powder-puff Tree has large flowers, common in coastal areas of Sarawak, Sabah, and Peninsular Malaysia.",
        image: require("../../assets/image/pic383.png"),
      },
      {
        id: 77,
        name: "Piper nigrum ",
        subtitle: "Black Pepper is commercially cultivated for spice, native to Sarawak and Sabah.",
        image: require("../../assets/image/pic395.png"),
      },
      {
        id: 78,
        name: "Gnetum gnemon",
        subtitle: "Melinjo produces edible seeds and leaves, commonly cultivated across Malaysia.",
        image: require("../../assets/image/pic399.png"),
      },
    ],
  };

  const featuredPlantsByCategory = {
    "Lowland Rainforest Plants": [
      {
        id: 79,
        name: "Dillenia suffruticosa",
        subtitle: "Simpoh Air, common in Sarawak forests.",
        image: require("../../assets/image/pic5.png"),
      },
      {
        id: 80,
        name: "Melastoma malabathricum",
        subtitle: "Singapore Rhododendron or Senduduk, a very common shrub across Malaysia and Borneo.",
        image: require("../../assets/image/pic10.png"),
      },
    ],

    "Highland & Montane Forest Species": [
      {
        id: 81,
        name: "",
        subtitle: "Carnivorous plant with insect-trapping pitchers.",
        image: require("../../assets/image/pic137.png"),
      },
      {
        id: 82,
        name: "Phalaenopsis amabilis",
        subtitle: "Elegant white orchid from cool forests.",
        image: require("../../assets/image/pic141.png"),
      },
    ],



    "Mangrove & Coastal Plants": [
      {
        id: 83,
        name: "Avicennia alba ",
        subtitle: "Api-api hitam is a pioneer mangrove species found along all Malaysian coasts.",
        image: require("../../assets/image/pic205.png"),
      },
      {
        id: 84,
        name: "Avicennia marina",
        subtitle: "Api-api merah is a salt-tolerant mangrove widespread across all Malaysian coastal areas.",
        image: require("../../assets/image/pic213.png"),
      },
      {
        id: 85,
        name: "Avicennia officinalis",
        subtitle: "Api-api sudu grows on landward mangrove zones throughout Malaysia.",
        image: require("../../assets/image/pic217.jpg"),
      },
      {
        id: 86,
        name: "Casuarina equisetifolia",
        subtitle: "Rhu laut is a coastal tree used for erosion control along all Malaysian beaches.",
        image: require("../../assets/image/pic221.png"),
      },
      {
        id: 87,
        name: "Sonneratia alba",
        subtitle: "Perepat grows on the seaward mangrove fringe throughout Malaysian coasts.",
        image: require("../../assets/image/pic233.png"),
      },
      {
        id: 88,
        name: "Sonneratia caseolaris",
        subtitle: "Pedada produces edible fruit and hosts fireflies along Malaysian estuaries.",
        image: require("../../assets/image/pic237.png"),
      },
    ],

    "Cultivated Plants": [
      {
        id: 89,
        name: "Clitoria ternatea",
        subtitle: "Butterfly pea produces blue flowers for food coloring, naturalized across all Malaysian states.",
        image: require("../../assets/image/pic277.png"),
      },
      {
        id: 90,
        name: "Syzygium aqueum",
        subtitle: "Water Apple is widely cultivated for its bell-shaped fruits throughout Malaysia.",
        image: require("../../assets/image/pic297.png"),
      },
      {
        id: 91,
        name: "Durio zibethinus",
        subtitle: "Durian is Malaysia's famous thorny fruit, extensively cultivated in all states.",
        image: require("../../assets/image/pic303.png"),
      },
      {
        id: 92,
        name: " Artocarpus heterophyllus",
        subtitle: "Jackfruit produces massive edible fruits, commonly cultivated across Malaysia.",
        image: require("../../assets/image/pic307.png"),
      },
      {
        id: 93,
        name: "Ficus microcarpa",
        subtitle: "Chinese Banyan is widespread in urban areas across all Malaysian states.",
        image: require("../../assets/image/pic315.png"),
      },
      {
        id: 94,
        name: "Curcuma longa",
        subtitle: "Turmeric is extensively cultivated for culinary and medicinal use in all Malaysian states.",
        image: require("../../assets/image/pic331.png"),
      },
      {
        id: 95,
        name: "Hibiscus rosa-sinensis var. alba ",
        subtitle: "White Hibiscus is a popular ornamental shrub in gardens throughout Malaysia.",
        image: require("../../assets/image/pic339.png"),
      },
      {
        id: 96,
        name: "Ixora chinensis",
        subtitle: "Jungle Flame is widely planted for urban landscaping in all Malaysian states.",
        image: require("../../assets/image/pic343.png"),
      },
      {
        id: 97,
        name: "Bougainvillea glabra",
        subtitle: "Paper Flower is a very popular ornamental climber cultivated throughout Malaysia.",
        image: require("../../assets/image/pic347.png"),
      },
      {
        id: 98,
        name: "Plumeria obtusa",
        subtitle: "Singapore Plumeria is commonly planted in parks and gardens across Malaysia.",
        image: require("../../assets/image/pic351.png"),
      },
      {
        id: 99,
        name: "Ficus benjamina ",
        subtitle: "Weeping Fig is very commonly cultivated indoors and outdoors in all Malaysian states.",
        image: require("../../assets/image/pic387.png"),
      },
      {
        id: 100,
        name: "Ficus elastica",
        subtitle: "Rubber Fig is widely cultivated as ornamental throughout Malaysia.",
        image: require("../../assets/image/pic391.png"),
      }
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState(
    "Lowland Rainforest Plants"
  );
  const [searchText, setSearchText] = useState(initialSearchQuery);

  // Update search text when route params change
  useEffect(() => {
    if (route?.params?.q) {
      setSearchText(route.params.q);
    }
  }, [route?.params?.q]);

  const matchesSearch = (plant, text) => {
    const lowerText = text.toLowerCase();
    return Object.values(plant).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(lowerText)
    );
  };

  const filteredPlants = categoryPlants[selectedCategory].filter((plant) =>
    matchesSearch(plant, searchText)
  );

  const featuredPlants = featuredPlantsByCategory[selectedCategory].filter(
    (plant) => matchesSearch(plant, searchText)
  );

  return (
    <SafeAreaView style={styles.fullScreen} edges={['left', 'right']}>
      <Header title="Plant Encyclopedia" navigation={navigation} isVisible={isVisible} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: footerHeight + 24,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tabButton,
                selectedCategory === cat && styles.tabButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory(cat);
                setSearchText("");
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === cat && styles.tabTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#6B7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, description, or keywords..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Discover Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 25 }}>
          <Text style={styles.sectionTitle}>Discover Plants</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={styles.squareCard}
                onPress={() => navigation.navigate("PlantDetails", { plant })}
              >
                <View style={styles.squareImageWrapper}>
                  <Image source={plant.image} style={styles.squarePlantImage} />
                </View>
                <View style={styles.squareTextWrapper}>
                  <Text style={styles.squarePlantName}>{plant.name}</Text>
                  <Text style={styles.squarePlantSubtitle}>
                    {plant.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginLeft: 20, color: "#6B7280" }}>
              No plants found.
            </Text>
          )}
        </ScrollView>

        {/* Featured Plants */}
        <View style={{ paddingHorizontal: 20, marginTop: 35 }}>
          <Text style={styles.sectionTitle}>Commonly Found Plants</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {featuredPlants.length > 0 ? (
            featuredPlants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={styles.featuredCard}
                onPress={() => navigation.navigate("PlantDetails", { plant })}
              >
                <View style={styles.halfCircleAccent} />
                <Image source={plant.image} style={styles.featuredImage} />
                <View style={styles.featuredTextWrapper}>
                  <Text style={styles.featuredPlantName}>{plant.name}</Text>
                  <Text style={styles.featuredPlantSubtitle}>
                    {plant.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginLeft: 20, color: "#6B7280" }}>
              No featured plants found.
            </Text>
          )}
        </ScrollView>
      </ScrollView>

      <Footer isVisible={isVisible} navigation={navigation} />
    </SafeAreaView>
  );
}