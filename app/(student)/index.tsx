// import { Ionicons } from '@expo/vector-icons';
// import React, { useCallback, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// interface Course {
//   id: string;
//   title: string;
//   thumbnail: string;
//   instructor: string;
//   progress: number;
// }

// interface RecommendedCourse {
//   id: string;
//   title: string;
//   thumbnail: string;
//   rating: number;
//   students: string;
//   isNew?: boolean;
// }

// const ENROLLED_COURSES: Course[] = [
//   {
//     id: '1',
//     title: 'Ethical Hacking...',
//     thumbnail: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?w=400',
//     instructor: 'Sarah Chen',
//     progress: 75,
//   },
//   {
//     id: '2',
//     title: 'Advanced UI Systems',
//     thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=400',
//     instructor: 'David Miller',
//     progress: 32,
//   },
// ];

// const RECOMMENDED_COURSES: RecommendedCourse[] = [
//   {
//     id: 'r1',
//     title: 'Neural Networks in Robotics',
//     thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?w=400',
//     rating: 4.8,
//     students: '1.2k',
//     isNew: true,
//   },
//   {
//     id: 'r2',
//     title: 'The Future of Decentralized Finance',
//     thumbnail: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?w=400',
//     rating: 4.9,
//     students: '850',
//     isNew: false,
//   },
//   {
//     id: 'r3',
//     title: 'Machine Learning Fundamentals',
//     thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?w=400',
//     rating: 4.7,
//     students: '3.4k',
//     isNew: false,
//   },
// ];

// const STATS = [
//   { id: 'enrolled', value: 12, label: 'Enrolled', color: '#1A6FD4' },
//   { id: 'completed', value: 8, label: 'Completed', color: '#22C55E' },
//   { id: 'awards', value: 5, label: 'Awards', color: '#F59E0B' },
// ];

// const QUICK_ACTIONS = [
//   { id: 'browse', icon: 'compass-outline' as const, label: 'Browse' },
//   { id: 'messages', icon: 'mail-outline' as const, label: 'Messages' },
//   { id: 'certs', icon: 'ribbon-outline' as const, label: 'Certs' },
// ];

// type SectionType =
//   | 'wallet'
//   | 'stats'
//   | 'quick-actions'
//   | 'continue-learning'
//   | 'recommended';

// interface DashboardSection {
//   id: string;
//   type: SectionType;
// }

// const SECTIONS: DashboardSection[] = [
//   { id: 'wallet', type: 'wallet' },
//   { id: 'stats', type: 'stats' },
//   { id: 'quick-actions', type: 'quick-actions' },
//   { id: 'continue-learning', type: 'continue-learning' },
//   { id: 'recommended', type: 'recommended' },
// ];

// function DashboardHeader() {
//   return (
//     <View style={styles.header}>
//       <View style={styles.headerContent}>
//         <View style={styles.headerLeft}>
//           <Image
//             source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200' }}
//             style={styles.profileImage}
//           />
//           <View style={styles.headerTextGroup}>
//             <Text style={styles.welcomeText}>Welcome back,</Text>
//             <Text style={styles.userName}>Alex Rivera</Text>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.bellButton}>
//           <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// function WalletSection() {
//   return (
//     <View style={styles.walletCard}>
//       <View style={styles.walletLeft}>
//         <View style={styles.walletIconBox}>
//           <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
//         </View>
//         <View style={styles.walletTextGroup}>
//           <Text style={styles.walletLabel}>Wallet Balance</Text>
//           <Text style={styles.walletAmount}>$1,240.50</Text>
//         </View>
//       </View>
//       <TouchableOpacity style={styles.topUpButton}>
//         <Text style={styles.topUpText}>Top Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// function StatsSection() {
//   return (
//     <View style={styles.statsRow}>
//       {STATS.map((stat) => (
//         <View key={stat.id} style={styles.statCard}>
//           <Text style={styles.statValue}>{stat.value < 10 ? `0${stat.value}` : `${stat.value}`}</Text>
//           <Text style={styles.statLabel}>{stat.label}</Text>
//           <View style={[styles.statAccent, { backgroundColor: stat.color }]} />
//         </View>
//       ))}
//     </View>
//   );
// }

// function QuickActionsSection() {
//   return (
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Quick Actions</Text>
//       <View style={styles.quickActionsRow}>
//         {QUICK_ACTIONS.map((action) => (
//           <TouchableOpacity key={action.id} style={styles.quickActionItem}>
//             <View style={styles.quickActionIconBox}>
//               <Ionicons name={action.icon} size={24} color="#1A6FD4" />
//             </View>
//             <Text style={styles.quickActionLabel}>{action.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

// function CourseCard({ course }: { course: Course }) {
//   return (
//     <TouchableOpacity style={styles.courseCard}>
//       <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
//       <View style={styles.courseContent}>
//         <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
//         <Text style={styles.courseInstructor}>Instructor: {course.instructor}</Text>
//         <View style={styles.progressRow}>
//           <Text style={styles.progressLabel}>Progress</Text>
//           <Text style={styles.progressPercent}>{course.progress}%</Text>
//         </View>
//         <View style={styles.progressTrack}>
//           <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function ContinueLearningSection() {
//   return (
//     <View style={styles.sectionContainer}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Continue Learning</Text>
//         <TouchableOpacity>
//           <Text style={styles.viewAllText}>View All</Text>
//         </TouchableOpacity>
//       </View>
//       {ENROLLED_COURSES.map((course) => (
//         <CourseCard key={course.id} course={course} />
//       ))}
//     </View>
//   );
// }

// function RecommendedCard({ course }: { course: RecommendedCourse }) {
//   return (
//     <TouchableOpacity style={styles.recommendedCard}>
//       <View style={styles.recommendedImageWrapper}>
//         <Image source={{ uri: course.thumbnail }} style={styles.recommendedImage} />
//         {course.isNew && (
//           <View style={styles.newBadge}>
//             <Text style={styles.newBadgeText}>NEW</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.recommendedContent}>
//         <Text style={styles.recommendedTitle} numberOfLines={2}>{course.title}</Text>
//         <View style={styles.ratingRow}>
//           <Ionicons name="star" size={12} color="#F59E0B" />
//           <Text style={styles.ratingText}>{course.rating}</Text>
//           <Text style={styles.studentsText}>({course.students} students)</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function RecommendedSection() {
//   return (
//     <View style={[styles.sectionContainer, styles.lastSection]}>
//       <Text style={styles.sectionTitle}>Recommended For You</Text>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.recommendedScroll}
//       >
//         {RECOMMENDED_COURSES.map((course) => (
//           <RecommendedCard key={course.id} course={course} />
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// function renderSection({ item }: { item: DashboardSection }) {
//   switch (item.type) {
//     case 'wallet':
//       return <WalletSection />;
//     case 'stats':
//       return <StatsSection />;
//     case 'quick-actions':
//       return <QuickActionsSection />;
//     case 'continue-learning':
//       return <ContinueLearningSection />;
//     case 'recommended':
//       return <RecommendedSection />;
//     default:
//       return null;
//   }
// }

// export default function StudentDashboard() {
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     setRefreshing(false);
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <FlatList
//         data={SECTIONS}
//         keyExtractor={(item) => item.id}
//         renderItem={renderSection}
//         ListHeaderComponent={<DashboardHeader />}
//         style={styles.list}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#1A6FD4"
//           />
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#0B1E3D',
//   },
//   list: {
//     flex: 1,
//     backgroundColor: '#F4F6FA',
//   },
//   listContent: {
//     paddingBottom: 24,
//   },

//   // Header
//   header: {
//     backgroundColor: '#0B1E3D',
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 32,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   profileImage: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   headerTextGroup: {
//     gap: 2,
//   },
//   welcomeText: {
//     color: 'rgba(255,255,255,0.75)',
//     fontSize: 13,
//     fontWeight: '400',
//   },
//   userName: {
//     color: '#FFFFFF',
//     fontSize: 22,
//     fontWeight: '700',
//     letterSpacing: -0.3,
//   },
//   bellButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Wallet
//   walletCard: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     marginTop: -20,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   walletLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   walletIconBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     backgroundColor: '#0B1E3D',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   walletTextGroup: {
//     gap: 2,
//   },
//   walletLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '400',
//   },
//   walletAmount: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#0F172A',
//     letterSpacing: -0.5,
//   },
//   topUpButton: {
//     backgroundColor: '#1A6FD4',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   topUpText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   // Stats
//   statsRow: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     marginTop: 16,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 16,
//     alignItems: 'center',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   statValue: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#0F172A',
//     letterSpacing: -0.5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//     fontWeight: '400',
//   },
//   statAccent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 4,
//     borderBottomLeftRadius: 14,
//     borderBottomRightRadius: 14,
//   },

//   // Section containers
//   sectionContainer: {
//     paddingHorizontal: 16,
//     marginTop: 24,
//   },
//   lastSection: {
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0F172A',
//     marginBottom: 14,
//     letterSpacing: -0.3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#1A6FD4',
//     fontWeight: '500',
//   },

//   // Quick Actions
//   quickActionsRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   quickActionItem: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 8,
//   },
//   quickActionIconBox: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 1.5,
//     borderColor: '#E2E8F0',
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   quickActionLabel: {
//     fontSize: 12,
//     color: '#374151',
//     fontWeight: '500',
//   },

//   // Course Cards (Continue Learning)
//   courseCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     marginBottom: 12,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   courseThumbnail: {
//     width: 100,
//     height: 100,
//   },
//   courseContent: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'space-between',
//   },
//   courseTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0F172A',
//     lineHeight: 20,
//     marginBottom: 2,
//   },
//   courseInstructor: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   progressRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   progressLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   progressPercent: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1A6FD4',
//   },
//   progressTrack: {
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#F59E0B',
//     borderRadius: 3,
//   },

//   // Recommended
//   recommendedScroll: {
//     paddingRight: 8,
//     gap: 12,
//   },
//   recommendedCard: {
//     width: 180,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   recommendedImageWrapper: {
//     position: 'relative',
//   },
//   recommendedImage: {
//     width: '100%',
//     height: 110,
//   },
//   newBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#EF4444',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//   },
//   newBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   recommendedContent: {
//     padding: 10,
//     gap: 6,
//   },
//   recommendedTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#0F172A',
//     lineHeight: 18,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0F172A',
//   },
//   studentsText: {
//     fontSize: 11,
//     color: '#6B7280',
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
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
import api from '../../services/api';

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  instructor: { name: string };
  progress: number;
}

interface RecommendedCourse {
  _id: string;
  title: string;
  thumbnail: string;
  instructor: { name: string };
  rating?: number;
  studentCount?: number;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  walletBalance: number;
}

type SectionType =
  | 'wallet'
  | 'stats'
  | 'quick-actions'
  | 'continue-learning'
  | 'recommended';

interface DashboardSection {
  id: string;
  type: SectionType;
}

const SECTIONS: DashboardSection[] = [
  { id: 'wallet', type: 'wallet' },
  { id: 'stats', type: 'stats' },
  { id: 'quick-actions', type: 'quick-actions' },
  { id: 'continue-learning', type: 'continue-learning' },
  { id: 'recommended', type: 'recommended' },
];

const QUICK_ACTIONS = [
  { id: 'browse', icon: 'compass-outline' as const, label: 'Browse', route: '/(student)/courses' },
  { id: 'messages', icon: 'mail-outline' as const, label: 'Messages', route: '/(student)/chat' },
  { id: 'certs', icon: 'ribbon-outline' as const, label: 'Certs', route: '/(student)/certificates' },
];

function DashboardHeader({ userName, profilePicture }: { userName: string; profilePicture?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
          onPress={() => router.push('/(student)/profile')}
          >
            <Image
            source={{ uri: profilePicture || 'https://via.placeholder.com/52' }}
            style={styles.profileImage}
          />
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName.split(' ')[0] || 'Student'}</Text>
          </View>
        </View>
        <TouchableOpacity 
        style={styles.bellButton}
        onPress={() => router.push('/(student)/notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WalletSection({ balance, onTopUp }: { balance: number; onTopUp?: () => void }) {
  return (
    <View style={styles.walletCard}>
      <View style={styles.walletLeft}>
        <View style={styles.walletIconBox}>
          <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.walletTextGroup}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>₦{balance.toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.topUpButton} onPress={onTopUp}>
        <Text style={styles.topUpText}>Top Up</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatsSection({ stats }: { stats: DashboardStats }) {
  const statItems = [
    { id: 'enrolled', value: stats.enrolledCourses, label: 'Enrolled', color: '#1A6FD4' },
    { id: 'completed', value: stats.completedCourses, label: 'Completed', color: '#22C55E' },
    { id: 'awards', value: stats.certificatesEarned, label: 'Awards', color: '#F59E0B' },
  ];

  return (
    <View style={styles.statsRow}>
      {statItems.map((stat) => (
        <View key={stat.id} style={styles.statCard}>
          <Text style={styles.statValue}>{stat.value < 10 ? `0${stat.value}` : `${stat.value}`}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <View style={[styles.statAccent, { backgroundColor: stat.color }]} />
        </View>
      ))}
    </View>
  );
}

function QuickActionsSection({ onActionPress }: { onActionPress: (route: string) => void }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.quickActionItem}
            onPress={() => onActionPress(action.route)}
          >
            <View style={styles.quickActionIconBox}>
              <Ionicons name={action.icon} size={24} color="#1A6FD4" />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function CourseCard({ course, onPress }: { course: Course; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress}>
      <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.courseInstructor}>Instructor: {course.instructor.name}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercent}>{course.progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ContinueLearningSection({ 
  courses, 
  onCoursePress, 
  onViewAll 
}: { 
  courses: Course[]; 
  onCoursePress: (courseId: string) => void;
  onViewAll: () => void;
}) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      {courses.map((course) => (
        <CourseCard 
          key={course._id} 
          course={course} 
          onPress={() => onCoursePress(course._id)}
        />
      ))}
    </View>
  );
}

function RecommendedCard({ course, onPress }: { course: RecommendedCourse; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.recommendedCard} onPress={onPress}>
      <View style={styles.recommendedImageWrapper}>
        <Image source={{ uri: course.thumbnail }} style={styles.recommendedImage} />
      </View>
      <View style={styles.recommendedContent}>
        <Text style={styles.recommendedTitle} numberOfLines={2}>{course.title}</Text>
        {course.rating && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{course.rating}</Text>
            {course.studentCount && (
              <Text style={styles.studentsText}>({course.studentCount.toLocaleString()} students)</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function RecommendedSection({ 
  courses, 
  onCoursePress 
}: { 
  courses: RecommendedCourse[]; 
  onCoursePress: (courseId: string) => void;
}) {
  return (
    <View style={[styles.sectionContainer, styles.lastSection]}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendedScroll}
      >
        {courses.map((course) => (
          <RecommendedCard 
            key={course._id} 
            course={course} 
            onPress={() => onCoursePress(course._id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
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
      const [coursesRes, statsRes, walletRes, recommendedRes] = await Promise.all([
        api.get('/students/enrolled-courses?limit=5'),
        api.get('/students/dashboard-stats'),
        api.get('/wallet/balance'),
        api.get('/courses/recommended?limit=10'),
      ]);

      setRecentCourses(coursesRes.data.courses);
      setRecommendedCourses(recommendedRes.data.courses || []);
      setStats({
        ...statsRes.data,
        walletBalance: walletRes.data.balance,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  const handleCoursePress = (courseId: string) => {
    router.push(`/(student)/course-player/${courseId}`);
    // console.log('Navigate to course:', courseId);
  };

  const handleViewAllCourses = () => {
    router.push('/(student)/my-courses');
    // console.log('Navigate to my courses');
  };

  const handleQuickAction = (route: string) => {
    router.push(route as any);
    console.log('Navigate to:', route);
  };

  const handleTopUp = () => {
    router.push('/(student)/wallet');
    // console.log('Navigate to wallet');
  };

  const renderSection = ({ item }: { item: DashboardSection }) => {
    switch (item.type) {
      // case 'wallet':
      //   return <WalletSection balance={stats.walletBalance} onTopUp={handleTopUp} />;
      case 'stats':
        return <StatsSection stats={stats} />;
      case 'quick-actions':
        return <QuickActionsSection onActionPress={handleQuickAction} />;
      case 'continue-learning':
        return (
          <ContinueLearningSection
            courses={recentCourses}
            onCoursePress={handleCoursePress}
            onViewAll={handleViewAllCourses}
          />
        );
      case 'recommended':
        return (
          <RecommendedSection
            courses={recommendedCourses}
            onCoursePress={handleCoursePress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        ListHeaderComponent={
          <DashboardHeader 
            userName={user?.name || 'Student'} 
            profilePicture={user?.profilePicture}
          
          />
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1A6FD4"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1E3D',
  },
  list: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  listContent: {
    paddingBottom: 24,
  },

  // Header
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
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Wallet
  walletCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B1E3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTextGroup: {
    gap: 2,
  },
  walletLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  topUpButton: {
    backgroundColor: '#1A6FD4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '400',
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

  // Section containers
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  lastSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  viewAllText: {
    fontSize: 14,
    color: '#1A6FD4',
    fontWeight: '500',
  },

  // Quick Actions
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

  // Course Cards (Continue Learning)
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  courseThumbnail: {
    width: 100,
    height: 100,
  },
  courseContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A6FD4',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },

  // Recommended
  recommendedScroll: {
    paddingRight: 8,
    gap: 12,
  },
  recommendedCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  recommendedImageWrapper: {
    position: 'relative',
  },
  recommendedImage: {
    width: '100%',
    height: 110,
  },
  recommendedContent: {
    padding: 10,
    gap: 6,
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  studentsText: {
    fontSize: 11,
    color: '#6B7280',
  },
});