import { adminService } from '@/services/admin';
import { instructorService } from '@/services/instructor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

interface LiveClass {
  _id: string;
  title: string;
  courseId: {
    _id: string;
    title: string;
  } | null;
  scheduledAt: string;
  status: 'scheduled' | 'live' | 'ended';
}

export default function InstructorDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [coursesCount, setCoursesCount] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch courses (to count instructor's assigned courses)
      const allCoursesRes = await adminService.getCourses();
      const allCourses = allCoursesRes.courses || allCoursesRes;
      const assigned = allCourses.filter(
        (c: any) => c.instructor?._id === user?.id || c.instructor === user?.id
      );
      setCoursesCount(assigned.length);

      // Fetch live classes
      const classesRes = await instructorService.getInstructorClasses();
      const list: LiveClass[] = classesRes.data || classesRes;
      const upcoming = list
        .filter((c) => c.status === 'scheduled' || c.status === 'live')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      setUpcomingClasses(upcoming.slice(0, 3)); // show top 3
    } catch (error) {
      console.error('Error fetching instructor dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

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
              <Text style={styles.welcomeText}>Welcome back, Instructor</Text>
              <Text style={styles.userName}>{user?.name || 'Instructor'}</Text>
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
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {coursesCount < 10 ? `0${coursesCount}` : coursesCount}
            </Text>
            <Text style={styles.statLabel}>Assigned Courses</Text>
            <View style={[styles.statAccent, { backgroundColor: '#1A6FD4' }]} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {upcomingClasses.length < 10 ? `0${upcomingClasses.length}` : upcomingClasses.length}
            </Text>
            <Text style={styles.statLabel}>Upcoming Live Classes</Text>
            <View style={[styles.statAccent, { backgroundColor: '#22C55E' }]} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push('/(instructor)/live-classes' as any)}
            >
              <View style={styles.quickActionIconBox}>
                <Ionicons name="videocam-outline" size={24} color="#1A6FD4" />
              </View>
              <Text style={styles.quickActionLabel}>Live Classes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push('/(instructor)/assignments' as any)}
            >
              <View style={styles.quickActionIconBox}>
                <Ionicons name="document-text-outline" size={24} color="#1A6FD4" />
              </View>
              <Text style={styles.quickActionLabel}>Assignments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push('/(instructor)/quizzes' as any)}
            >
              <View style={styles.quickActionIconBox}>
                <Ionicons name="help-circle-outline" size={24} color="#1A6FD4" />
              </View>
              <Text style={styles.quickActionLabel}>Quizzes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Classes */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          {upcomingClasses.map((item) => (
            <View key={item._id} style={styles.classCard}>
              <View style={styles.classCardInfo}>
                <Text style={styles.classTitle}>{item.title}</Text>
                <Text style={styles.courseTitle}>
                  Course: {item.courseId?.title || 'Unknown Course'}
                </Text>
                <Text style={styles.classTime}>
                  Scheduled: {new Date(item.scheduledAt).toLocaleString()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.status === 'live' ? '#EF4444' : '#1A6FD4' },
                ]}
              >
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
          {upcomingClasses.length === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons name="videocam-outline" size={32} color="#9CA3AF" />
              <Text style={styles.emptyText}>No upcoming classes scheduled</Text>
            </View>
          )}
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
    paddingBottom: 24,
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
    paddingBottom: 32,
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
    fontSize: 22,
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
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  classCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  classTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  courseTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  classTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
});