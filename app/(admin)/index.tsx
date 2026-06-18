import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

interface DashboardMetrics {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalEnrollments: number;
  revenue: {
    totalRevenue: number;
    pendingRevenue: number;
  };
  liveClasses: {
    totalClasses: number;
    activeClasses: number;
  };
  blockedUsers: number;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await adminService.getDashboardMetrics();
      setMetrics(data.metrics || data);
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMetrics();
  }, [fetchMetrics]);

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statDetails}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A6FD4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri:
                 user?.profilePicture ||
                  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200',
              }}
              style={styles.profileImage}
            />
            <View style={styles.headerTextGroup}>
              <Text style={styles.welcomeText}>System Administrator,</Text>
              <Text style={styles.userName}>{user?.name || 'Admin User'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
        }
      >
        <Text style={styles.sectionTitle}>Platform Overview</Text>

        <View style={styles.grid}>
          <StatCard
            title="Total Students"
            value={metrics?.totalStudents ?? 0}
            icon="people-outline"
            color="#1A6FD4"
          />
          <StatCard
            title="Total Instructors"
            value={metrics?.totalInstructors ?? 0}
            icon="school-outline"
            color="#22C55E"
          />
          <StatCard
            title="Total Courses"
            value={metrics?.totalCourses ?? 0}
            icon="book-outline"
            color="#F59E0B"
          />
          <StatCard
            title="Total Enrollments"
            value={metrics?.totalEnrollments ?? 0}
            icon="receipt-outline"
            color="#EC4899"
          />
          <StatCard
            title="Blocked Users"
            value={metrics?.blockedUsers ?? 0}
            icon="ban-outline"
            color="#EF4444"
          />
          <StatCard
            title="Live Classes"
            value={`${metrics?.liveClasses?.activeClasses ?? 0}/${metrics?.liveClasses?.totalClasses ?? 0}`}
            icon="videocam-outline"
            color="#8B5CF6"
          />
        </View>

        <Text style={styles.sectionTitle}>Financial Summary</Text>
        
        <View style={styles.financialCard}>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Total Revenue</Text>
              <Text style={styles.financeValue}>
                ₦{((metrics?.revenue?.totalRevenue ?? 0)).toLocaleString()}
              </Text>
            </View>
            <View style={styles.financeDivider} />
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Pending Revenue</Text>
              <Text style={styles.financeValue}>
                ₦{((metrics?.revenue?.pendingRevenue ?? 0)).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1E3D',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
  },
  header: {
    backgroundColor: '#0B1E3D',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTextGroup: {
    gap: 2,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '400',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDetails: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  statTitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  financialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  financeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  financeItem: {
    flex: 1,
  },
  financeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  financeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  financeDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});


