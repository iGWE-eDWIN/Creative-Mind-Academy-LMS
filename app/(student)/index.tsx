import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  instructor: { name: string };
  progress: number;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  walletBalance: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificatesEarned: 0,
    walletBalance: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, statsRes, walletRes] = await Promise.all([
        api.get('/students/enrolled-courses?limit=5'),
        api.get('/students/dashboard-stats'),
        api.get('/wallet/balance'),
      ]);

      setRecentCourses(coursesRes.data.courses);
      setStats({
        ...statsRes.data,
        walletBalance: walletRes.data.balance,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <LinearGradient
      colors={[color, `${color}CC`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );

  const CourseCard = ({ course }: { course: Course }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(student)/course-player/${course._id}`)}
      style={styles.courseCard}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.instructor.name}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${course.progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{course.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(student)/profile')}>
            <Image
              source={{ uri: user?.profilePicture || 'https://via.placeholder.com/50' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard icon="book-outline" label="Enrolled" value={stats.enrolledCourses} color="#4F46E5" />
        <StatCard icon="checkmark-circle-outline" label="Completed" value={stats.completedCourses} color="#10B981" />
        <StatCard icon="document-outline" label="Certificates" value={stats.certificatesEarned} color="#F59E0B" />
      </View>

      {/* Wallet */}
      <TouchableOpacity
        onPress={() => router.push('/(student)/wallet')}
        style={styles.walletCard}
      >
        <View style={styles.walletContent}>
          <View style={styles.walletIcon}>
            <Ionicons name="wallet-outline" size={24} color="white" />
          </View>
          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletBalance}>
              ₦{stats.walletBalance.toLocaleString()}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
      </TouchableOpacity>

      {/* Recent Courses */}
      <View style={styles.recentCoursesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity onPress={() => router.push('/(student)/my-courses')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            onPress={() => router.push('/(student)/courses')}
            style={styles.quickActionItem}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="search-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.quickActionText}>Browse Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(student)/chat')}
            style={styles.quickActionItem}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="chatbubbles-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.quickActionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(student)/certificates')}
            style={styles.quickActionItem}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="medal-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.quickActionText}>Certificates</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -30,
    marginHorizontal: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  walletCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 10,
  },
  walletInfo: {
    marginLeft: 12,
  },
  walletLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  recentCoursesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    color: '#4F46E5',
    fontSize: 14,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  courseThumbnail: {
    height: 160,
    width: '100%',
  },
  courseContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  progressText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#4F46E5',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
  },
});