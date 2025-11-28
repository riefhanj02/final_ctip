import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const footer = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 18,
        paddingTop: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 2,
    },
    tab: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 60,
    },
    activeTab: {
        backgroundColor: colors.surface,
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    activeTabIcon: {
        fontSize: 20,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
    },
    activeTabLabel: {
        color: colors.primary,
        fontWeight: 'bold',
    },
})