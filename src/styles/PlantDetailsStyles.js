import { colors } from '../theme/colors';
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FDF6',
  },
  topCard: {
    height: height * 0.55,
    backgroundColor: '#E9F6EE',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCurve: {
    position: 'absolute',
    left: -width * 0.5,
    top: -height * 0.003, // makes the circle extend upward
    width: width * 1.1,
    height: width * 1.25,
    borderRadius: width * 0.60,
    backgroundColor: '#CDEBD2',
  },
  backCircle: {
    position: 'absolute',
    top: 38,
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    zIndex: 2,
  },
  leftImageWrap: {
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 40,
    marginTop: 15, // lower the plant a bit
    zIndex: 3,
  },
  mainImage: {
    width: width * 0.8, // make the image larger
    height: width * 0.8,
    resizeMode: 'contain',
    // no white background
  },
  rightStats: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: 30,
    paddingVertical: 40,
  },
  smallLabel: {
    fontFamily: 'Fustat-Medium',
    color: '#065F46',
    fontSize: 13,
  },
  smallValue: {
    fontFamily: 'Gabarito-Medium',
    color: '#083C2D',
    fontSize: 16,
    marginTop: 4,
  },
  detailPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    minHeight: height * 0.6,
    marginTop: -height * 0.08,
    elevation: 6,
    flexGrow: 1,
  },
  plantName: {
    fontFamily: 'Gabarito-Medium',
    fontSize: 30,
    marginTop:30,
    color: '#0F2F24',
  },
  scientificText: {
    fontFamily: 'Fustat-Regular',
    color: '#375A47',
    fontSize: 16,
    marginTop: 4,
    fontStyle: 'italic',
  },
  habitatLabel: {
    fontFamily: 'Gabarito-Medium',
    color: '#065F46',
    fontSize: 19,
    marginTop: 10,
  },
  habitatValue: {
    fontFamily: 'Fustat-Regular',
    color: '#374151',
    fontSize: 15,
    marginTop: 4,
  },
  familyText: {
    fontFamily: 'Fustat-Regular',
    color: '#083C2D',
    fontSize: 15,
    marginTop: 4,
  },
  description: {
    fontFamily: 'Fustat-Regular',
    color: '#374151',
    marginTop: 15,
    lineHeight: 20,
    fontSize: 16,
    textAlign: 'justify',
  },
  sectionTitle: {
    marginTop: 20,
    fontFamily: 'Gabarito-Medium',
    fontSize: 20,
    color: '#2F4F4F',
  },
  leafRow: {
    marginTop: 5,
  },
  leafImage: {
    width:  250,
    height: 250,
    marginRight:20,
    resizeMode: 'contain',
  },
});

export default styles;
