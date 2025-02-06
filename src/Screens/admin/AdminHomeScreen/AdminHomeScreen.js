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
import styles from './Styles';
const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#fec107';
const SECONDARY_COLOR = '#ffffff';
const NEUTRAL_COLOR = '#2c3e50';

export default function AdminHomeScreen() {
    const { authToken, userRole, logout } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [totalUser,setTotalUser] = useState(0); 
    
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

