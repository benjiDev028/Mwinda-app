import { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList
} from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#fec107';
const SECONDARY_COLOR = '#ffffff';
const NEUTRAL_COLOR = '#2c3e50';

export default function AdminHomeScreen() {
    const { authToken, userRole, logout } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('dashboard');
    
    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerScale = useRef(new Animated.Value(0.8)).current;

    // États des données
    const [stats, setStats] = useState({
        totalUsers: 1452,
        activeClients: 234,
        pendingTickets: 12,
        resolvedIssues: 89
    });

    const [clientStories] = useState([
        { id: 1, client: 'Client A', action: 'Problème de paiement', status: 'En cours', date: '15:00' },
        { id: 2, client: 'Client B', action: 'Demande de support', status: 'Résolu', date: '14:30' },
        { id: 3, client: 'Client C', action: 'Mise à jour profil', status: 'Nouveau', date: '13:45' }
    ]);

    const [systemHealth] = useState({
        apiStatus: 'optimal',
        database: 'stable',
        uptime: '99.98%'
    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.spring(headerScale, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    const renderTabButton = (tabName, icon) => (
        <TouchableOpacity 
            style={[styles.tabButton, selectedTab === tabName && styles.activeTab]}
            onPress={() => setSelectedTab(tabName)}
        >
            <Icon 
                name={icon} 
                size={24} 
                color={selectedTab === tabName ? PRIMARY_COLOR : NEUTRAL_COLOR} 
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View 
                style={[
                    styles.header, 
                    { 
                        opacity: fadeAnim,
                        transform: [{ scale: headerScale }] 
                    }
                ]}
            >
                <View style={styles.headerTop}>
                    <Icon name="admin-panel-settings" size={40} color={PRIMARY_COLOR} />
                    <TouchableOpacity onPress={logout} style={styles.notificationButton}>
                        <Icon name="notifications" size={28} color={NEUTRAL_COLOR} />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.tabBar}>
                    {renderTabButton('dashboard', 'dashboard')}
                    {renderTabButton('clients', 'people-alt')}
                    {renderTabButton('analytics', 'analytics')}
                    {renderTabButton('settings', 'settings')}
                </View>
            </Animated.View>

            <ScrollView contentContainerStyle={styles.content}>
                {selectedTab === 'dashboard' && (
                    <>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                                <Text style={styles.statLabel}>Utilisateurs</Text>
                                <Icon name="trending-up" size={20} color="#4CAF50" />
                            </View>
                            
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>{stats.activeClients}</Text>
                                <Text style={styles.statLabel}>Clients actifs</Text>
                                <Icon name="group-work" size={20} color={PRIMARY_COLOR} />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Activités récentes</Text>
                            <FlatList
                                data={clientStories}
                                renderItem={({ item }) => (
                                    <View style={styles.storyCard}>
                                        <View style={styles.storyHeader}>
                                            <Text style={styles.clientName}>{item.client}</Text>
                                            <Text style={[styles.status, 
                                                item.status === 'Résolu' && styles.resolved,
                                                item.status === 'En cours' && styles.pending
                                            ]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                        <Text style={styles.storyAction}>{item.action}</Text>
                                        <Text style={styles.storyTime}>{item.date}</Text>
                                    </View>
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </>
                )}

                {selectedTab === 'clients' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gestion des clients</Text>
                        {/* Ajouter ici la logique de gestion des clients */}
                    </View>
                )}

                <View style={styles.systemHealth}>
                    <Text style={styles.healthTitle}>État du système</Text>
                    <View style={styles.healthItem}>
                        <Icon name="cloud" size={20} color="#2196F3" />
                        <Text style={styles.healthText}>API: {systemHealth.apiStatus}</Text>
                    </View>
                    <View style={styles.healthItem}>
                        <Icon name="storage" size={20} color="#4CAF50" />
                        <Text style={styles.healthText}>Base de données: {systemHealth.database}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: SECONDARY_COLOR,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
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