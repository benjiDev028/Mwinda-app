import { StyleSheet, Dimensions } from 'react-native';

const PRIMARY_COLOR = '#fec107';
const SECONDARY_COLOR = '#ffffff';
const NEUTRAL_COLOR = '#2c3e50';
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: SECONDARY_COLOR,
        padding: 20,
        elevation: 8,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    tabButton: {
        padding: 10,
        borderRadius: 8,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: PRIMARY_COLOR,
    },
    content: {
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: width * 0.45,
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: NEUTRAL_COLOR,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    section: {
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: NEUTRAL_COLOR,
        marginBottom: 15,
    },
    storyCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    clientName: {
        fontWeight: '600',
        color: NEUTRAL_COLOR,
    },
    status: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pending: {
        backgroundColor: '#FFF3CD',
        color: '#856404',
    },
    resolved: {
        backgroundColor: '#D4EDDA',
        color: '#155724',
    },
    storyAction: {
        color: '#666',
        fontSize: 14,
        marginBottom: 4,
    },
    storyTime: {
        color: '#999',
        fontSize: 12,
    },
    systemHealth: {
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
    },
    healthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: NEUTRAL_COLOR,
        marginBottom: 15,
    },
    healthItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    healthText: {
        marginLeft: 10,
        color: '#444',
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252',
    },
});

export default styles;