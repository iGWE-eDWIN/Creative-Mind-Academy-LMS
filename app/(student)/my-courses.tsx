import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY_DARK = '#0B2045';
const PROGRESS_BLUE = '#2563EB';
const PROGRESS_GREEN = '#22C55E';
const BG = '#F5F6FA';
const GRAY_TEXT = '#6B7280';
const CERTIFICATE_YELLOW = '#F59E0B';

type FilterType = 'all' | 'in-progress' | 'completed';

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessed: string;
  category: string;
  hasCertificate?: boolean;
}

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: '1',
    title: 'Advanced React Architectures',
    instructor: 'Sarah Chen',
    thumbnail:
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    progress: 75,
    lessonsCompleted: 45,
    totalLessons: 60,
    lastAccessed: 'Oct 24',
    category: 'Tech',
    hasCertificate: false,
  },
  {
    id: '2',
    title: 'Principles of Visual Identity',
    instructor: 'Marc Andreessen',
    thumbnail:
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
    progress: 100,
    lessonsCompleted: 48,
    totalLessons: 48,
    lastAccessed: 'Sep 12',
    category: 'Design',
    hasCertificate: true,
  },
  {
    id: '3',
    title: 'Algorithmic Trading 101',
    instructor: 'David Miller',
    thumbnail:
      'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800',
    progress: 12,
    lessonsCompleted: 3,
    totalLessons: 25,
    lastAccessed: 'Today',
    category: 'Finance',
    hasCertificate: false,
  },
];

function CourseCard({ course }: { course: EnrolledCourse }) {
  const isCompleted = course.progress === 100;
  const progressColor = isCompleted ? PROGRESS_GREEN : PROGRESS_BLUE;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.92}>
      {/* Image with overlays */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.cardImage} />

        {/* Top badge row */}
        <View style={styles.imageBadgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{course.category}</Text>
          </View>
          {course.hasCertificate && (
            <View style={styles.certificateBadge}>
              <Ionicons name="medal" size={13} color="#78350F" />
              <Text style={styles.certificateBadgeText}>Certificate Available</Text>
            </View>
          )}
        </View>

        {/* Last accessed — bottom right */}
        <View style={styles.lastAccessedBadge}>
          <Text style={styles.lastAccessedText}>Last accessed: {course.lastAccessed}</Text>
        </View>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{course.title}</Text>
        <Text style={styles.instructorText}>Instructor: {course.instructor}</Text>

        {/* Progress stats row */}
        <View style={styles.progressStatsRow}>
          <Text style={[styles.progressLabel, { color: progressColor }]}>
            {course.progress}% Complete
          </Text>
          {isCompleted ? (
            <Ionicons name="checkmark-circle" size={22} color={PROGRESS_GREEN} />
          ) : (
            <Text style={styles.lessonsText}>
              {course.lessonsCompleted}/{course.totalLessons} Lessons
            </Text>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${course.progress}%` as any, backgroundColor: progressColor },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyCoursesScreen() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = ENROLLED_COURSES.filter((c) => {
    if (filter === 'in-progress') return c.progress > 0 && c.progress < 100;
    if (filter === 'completed') return c.progress === 100;
    return true;
  });

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <View style={styles.container}>
      {/* Filter pills - Centered */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setFilter(opt.key)}
              style={[styles.filterPill, filter === opt.key && styles.filterPillActive]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === opt.key && styles.filterPillTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Course list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {filter === 'all'
                ? "You haven't enrolled in any courses yet"
                : filter === 'in-progress'
                ? 'No courses in progress'
                : 'No completed courses yet'}
            </Text>
          </View>
        ) : (
          filtered.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Filter wrapper for centering
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },

  // Image overlays
  imageBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  certificateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CERTIFICATE_YELLOW,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  certificateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  lastAccessedBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  lastAccessedText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },

  // Card body
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY_DARK,
    marginBottom: 4,
    lineHeight: 24,
  },
  instructorText: {
    fontSize: 13,
    color: GRAY_TEXT,
    marginBottom: 14,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  lessonsText: {
    fontSize: 13,
    color: GRAY_TEXT,
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 15,
    color: GRAY_TEXT,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});


// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import api from '../../services/api';

// const PRIMARY_DARK = '#0B2045';
// const PROGRESS_BLUE = '#2563EB';
// const PROGRESS_GREEN = '#22C55E';
// const BG = '#F5F6FA';
// const GRAY_TEXT = '#6B7280';
// const CERTIFICATE_YELLOW = '#F59E0B';

// interface EnrolledCourse {
//   _id: string;
//   title: string;
//   thumbnail: string;
//   instructor: { name: string };
//   progress: number;
//   lastAccessedAt: string;
//   category: string;
// }

// export default function MyCoursesScreen() {
//   const [courses, setCourses] = useState<EnrolledCourse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

//   useEffect(() => {
//     fetchEnrolledCourses();
//   }, []);

//   const fetchEnrolledCourses = async () => {
//     try {
//       const response = await api.get('/students/enrolled-courses');
//       setCourses(response.data.courses);
//     } catch (error) {
//       console.error('Error fetching enrolled courses:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchEnrolledCourses();
//   };

//   const filteredCourses = courses.filter(course => {
//     if (filter === 'in-progress') return course.progress > 0 && course.progress < 100;
//     if (filter === 'completed') return course.progress === 100;
//     return true;
//   });

//   const CourseCard = ({ course }: { course: EnrolledCourse }) => {
//     const isCompleted = course.progress === 100;
//     const progressColor = isCompleted ? PROGRESS_GREEN : PROGRESS_BLUE;
    
//     // Format last accessed date
//     const formatLastAccessed = (dateString: string) => {
//       const date = new Date(dateString);
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);
      
//       if (date >= today) return 'Today';
//       if (date >= yesterday) return 'Yesterday';
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     };

//     return (
//       <TouchableOpacity
//         onPress={() => router.push(`/(student)/course-player/${course._id}`)}
//         style={styles.card}
//         activeOpacity={0.92}
//       >
//         {/* Image with overlays */}
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: course.thumbnail }} style={styles.cardImage} />

//           {/* Top badge row */}
//           <View style={styles.imageBadgeRow}>
//             <View style={styles.categoryBadge}>
//               <Text style={styles.categoryBadgeText}>{course.category}</Text>
//             </View>
//             {isCompleted && (
//               <View style={styles.certificateBadge}>
//                 <Ionicons name="medal" size={13} color="#78350F" />
//                 <Text style={styles.certificateBadgeText}>Certificate Available</Text>
//               </View>
//             )}
//           </View>

//           {/* Last accessed — bottom right */}
//           <View style={styles.lastAccessedBadge}>
//             <Text style={styles.lastAccessedText}>
//               Last accessed: {formatLastAccessed(course.lastAccessedAt)}
//             </Text>
//           </View>
//         </View>

//         {/* Card body */}
//         <View style={styles.cardBody}>
//           <Text style={styles.cardTitle}>{course.title}</Text>
//           <Text style={styles.instructorText}>Instructor: {course.instructor.name}</Text>

//           {/* Progress stats row */}
//           <View style={styles.progressStatsRow}>
//             <Text style={[styles.progressLabel, { color: progressColor }]}>
//               {course.progress}% Complete
//             </Text>
//             {isCompleted ? (
//               <Ionicons name="checkmark-circle" size={22} color={PROGRESS_GREEN} />
//             ) : (
//               <Text style={styles.lessonsText}>
//                 {Math.round((course.progress / 100) * 20)}/{20} Lessons
//               </Text>
//             )}
//           </View>

//           {/* Progress bar */}
//           <View style={styles.progressTrack}>
//             <View
//               style={[
//                 styles.progressFill,
//                 { width: `${course.progress}%`, backgroundColor: progressColor },
//               ]}
//             />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const filterOptions: { key: 'all' | 'in-progress' | 'completed'; label: string }[] = [
//     { key: 'all', label: 'All' },
//     { key: 'in-progress', label: 'In Progress' },
//     { key: 'completed', label: 'Completed' },
//   ];

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={PROGRESS_BLUE} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Filter pills - Centered */}
//       <View style={styles.filterWrapper}>
//         <View style={styles.filterRow}>
//           {filterOptions.map((opt) => (
//             <TouchableOpacity
//               key={opt.key}
//               onPress={() => setFilter(opt.key)}
//               style={[styles.filterPill, filter === opt.key && styles.filterPillActive]}
//             >
//               <Text
//                 style={[
//                   styles.filterPillText,
//                   filter === opt.key && styles.filterPillTextActive,
//                 ]}
//               >
//                 {opt.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Course List */}
//       <FlatList
//         data={filteredCourses}
//         renderItem={({ item }) => <CourseCard course={item} />}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.flatListContent}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={() => (
//           <View style={styles.empty}>
//             <Ionicons name="book-outline" size={56} color="#D1D5DB" />
//             <Text style={styles.emptyTitle}>
//               {filter === 'all'
//                 ? "You haven't enrolled in any courses yet"
//                 : filter === 'in-progress'
//                 ? 'No courses in progress'
//                 : 'No completed courses yet'}
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push('/(student)/courses')}
//               style={styles.browseButton}
//             >
//               <Text style={styles.browseButtonText}>Browse Courses</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Filter wrapper for centering
//   filterWrapper: {
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
  
//   // Filters
//   filterRow: {
//     flexDirection: 'row',
//     gap: 10,
//     justifyContent: 'center',
//   },
//   filterPill: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 24,
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     backgroundColor: '#F3F4F6',
//   },
//   filterPillActive: {
//     backgroundColor: '#111827',
//     borderColor: '#111827',
//   },
//   filterPillText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   filterPillTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },

//   // FlatList content
//   flatListContent: {
//     padding: 16,
//     paddingBottom: 24,
//     backgroundColor: BG,
//   },

//   // Card
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginBottom: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   imageContainer: {
//     position: 'relative',
//   },
//   cardImage: {
//     width: '100%',
//     height: 200,
//   },

//   // Image overlays
//   imageBadgeRow: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'center',
//   },
//   categoryBadge: {
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },
//   categoryBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   certificateBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: CERTIFICATE_YELLOW,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     gap: 5,
//   },
//   certificateBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#78350F',
//   },
//   lastAccessedBadge: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 10,
//   },
//   lastAccessedText: {
//     fontSize: 11,
//     fontWeight: '500',
//     color: '#374151',
//   },

//   // Card body
//   cardBody: {
//     padding: 16,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//     marginBottom: 4,
//     lineHeight: 24,
//   },
//   instructorText: {
//     fontSize: 13,
//     color: GRAY_TEXT,
//     marginBottom: 14,
//   },
//   progressStatsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   progressLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   lessonsText: {
//     fontSize: 13,
//     color: GRAY_TEXT,
//     fontWeight: '500',
//   },
//   progressTrack: {
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 3,
//   },

//   // Empty state
//   empty: {
//     alignItems: 'center',
//     paddingTop: 80,
//     gap: 16,
//   },
//   emptyTitle: {
//     fontSize: 15,
//     color: GRAY_TEXT,
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
//   browseButton: {
//     backgroundColor: PRIMARY_DARK,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   browseButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });