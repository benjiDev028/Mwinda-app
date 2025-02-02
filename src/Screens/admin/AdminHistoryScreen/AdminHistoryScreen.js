import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HISTORY_DATA = [
  {
    id: '1',
    action: 'User Creation',
    user: 'John Doe',
    date: '2024-03-15 14:30',
    status: 'success'
  },
  {
    id: '2',
    action: 'Data Update',
    user: 'Jane Smith',
    date: '2024-03-14 09:15',
    status: 'pending'
  },
  {
    id: '3',
    action: 'Account Deletion',
    user: 'Mike Johnson',
    date: '2024-03-13 16:45',
    status: 'error'
  },
];

const COLORS = {
  success: '#4CAF50',
  pending: '#FFC107',
  error: '#F44336',
  background: '#F8F9FA',
  primary: '#2C3E50',
};

export default function AdminHistoryScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const renderItem = ({ item, index }) => {
    const statusColor = COLORS[item.status];
    const iconName = {
      success: 'check-circle',
      pending: 'clock',
      error: 'alert-circle'
    }[item.status];

    return (
      <Animated.View 
        style={[
          styles.itemContainer,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0]
              })
            }]
          }
        ]}
      >
        <View style={styles.itemHeader}>
          <MaterialCommunityIcons 
            name={iconName} 
            size={24} 
            color={statusColor} 
          />
          <Text style={styles.actionText}>{item.action}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemBody}>
          <MaterialCommunityIcons name="account" size={16} color="#6C757D" />
          <Text style={styles.userText}>{item.user}</Text>
        </View>
        
        <View style={styles.itemFooter}>
          <MaterialCommunityIcons name="clock" size={16} color="#6C757D" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <Text style={styles.title}>Activity History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={HISTORY_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary
  },
  filterButton: {
    padding: 8,
    borderRadius: 8
  },
  listContent: {
    paddingBottom: 20
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: COLORS.primary
  },
  statusBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  itemBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  userText: {
    marginLeft: 8,
    color: '#6C757D'
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  dateText: {
    marginLeft: 8,
    color: '#6C757D',
    fontSize: 12
  }
});