import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY_DARK = '#0B2045';
const ACCENT_BLUE = '#4361EE';
const BADGE_RED = '#E53E3E';
const BADGE_TAN = '#D97706';
const BG = '#F5F6FA';
const GRAY_TEXT = '#6B7280';
const STAR_COLOR = '#F59E0B';

interface Badge {
  label: string;
  color: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviews: string;
  hours: string;
  level: string;
  price: string;
  badges: Badge[];
  category: string;
  isFree?: boolean;
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Full-Stack Web Development',
    instructor: 'Sarah Johnson',
    thumbnail:
      'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviews: '1.2k',
    hours: '48 Hours',
    level: 'Beginner',
    price: '45,000',
    badges: [
      { label: 'New', color: BADGE_RED },
      { label: 'Development', color: BADGE_TAN },
    ],
    category: 'Tech',
  },
  {
    id: '2',
    title: 'UI/UX Design Masterclass',
    instructor: 'David Chen',
    thumbnail:
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviews: '950',
    hours: '32 Hours',
    level: 'Intermediate',
    price: '35,000',
    badges: [
      { label: 'Bestseller', color: BADGE_RED },
      { label: 'Design', color: BADGE_TAN },
    ],
    category: 'Tech',
  },
  {
    id: '3',
    title: 'Digital Marketing Strategy',
    instructor: 'Amara Okafor',
    thumbnail:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviews: '600',
    hours: '24 Hours',
    level: 'All Levels',
    price: '25,000',
    badges: [{ label: 'Business', color: BADGE_TAN }],
    category: 'Business',
  },
  {
    id: '4',
    title: 'Financial Analytics Pro',
    instructor: 'Michael Oyelade',
    thumbnail:
      'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviews: '450',
    hours: '40 Hours',
    level: 'Advanced',
    price: '55,000',
    badges: [
      { label: 'Hot', color: BADGE_RED },
      { label: 'Finance', color: BADGE_TAN },
    ],
    category: 'Finance',
  },
];

const CATEGORIES = ['All Courses', 'Tech', 'Business', 'Finance', 'Design'];

function CourseCard({ course }: { course: Course }) {
  const handleEnroll = (courseId: string, price: string) => {
    const priceNum = parseInt(price.replace(/,/g, ''));
    if (priceNum > 0) {
      // router.push(`/(student)/checkout/${courseId}`);
      console.log('Navigate to checkout for course:', courseId);
    } else {
      // router.push('/(student)/my-courses');
      console.log('Enroll in free course:', courseId);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.cardImage} />
        <View style={styles.badgeRow}>
          {course.badges.map((b, i) => (
            <View key={i} style={[styles.badge, { backgroundColor: b.color }]}>
              <Text style={styles.badgeText}>{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={STAR_COLOR} />
          <Text style={styles.ratingText}>
            {course.rating} ({course.reviews} reviews)
          </Text>
        </View>

        <Text style={styles.cardTitle}>{course.title}</Text>
        <Text style={styles.instructorText}>Instructor: {course.instructor}</Text>

        <View style={styles.statsRow}>
          <Ionicons name="time-outline" size={13} color={GRAY_TEXT} />
          <Text style={styles.statText}>{course.hours}</Text>
          <Ionicons name="bar-chart-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
          <Text style={styles.statText}>{course.level}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₦{course.price}</Text>
          <TouchableOpacity
            onPress={() => handleEnroll(course.id, course.price)}
            style={styles.enrollButton}
          >
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CoursesScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = COURSES.filter((c) => {
    const matchesSearch =
      search.trim() === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Courses' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for courses..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionLabel}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.categoryChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Course Section Header */}
      <View style={styles.courseSectionHeader}>
        <Text style={styles.popularHeading}>Popular Courses</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* CTA Banner */}
      <View style={styles.ctaBanner}>
        <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.4)" style={styles.ctaIcon} />
        <Text style={styles.ctaHeading}>Build your career with us.</Text>
        <Text style={styles.ctaBody}>
          Get personalized course recommendations and career guidance from industry experts.
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => <CourseCard course={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filter Courses</Text>
            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalCategoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                  style={[
                    styles.modalChip,
                    selectedCategory === cat && styles.modalChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      selectedCategory === cat && styles.modalChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={styles.modalApplyButton}
            >
              <Text style={styles.modalApplyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 24,
  },

  headerContainer: {
    backgroundColor: BG,
    paddingTop: 8,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: PRIMARY_DARK,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  seeAll: {
    fontSize: 13,
    color: ACCENT_BLUE,
    fontWeight: '500',
  },
  categoryScroll: {
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    gap: 8,
    paddingRight: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  // Course section
  courseSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  popularHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },

  // Course card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
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
    height: 190,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: GRAY_TEXT,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginBottom: 4,
    lineHeight: 22,
  },
  instructorText: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  statIcon: {
    marginLeft: 8,
  },
  statText: {
    fontSize: 12,
    color: GRAY_TEXT,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },
  enrollButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  enrollButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },

  // CTA Banner
  ctaBanner: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 20,
    padding: 24,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  ctaIcon: {
    marginBottom: 12,
  },
  ctaHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 30,
  },
  ctaBody: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: BADGE_RED,
    paddingHorizontal: 40,
    paddingVertical: 13,
    borderRadius: 10,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Filter modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
    marginBottom: 10,
  },
  modalCategoryScroll: {
    marginBottom: 4,
  },
  modalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  modalChipActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  modalChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  modalChipTextActive: {
    color: '#FFFFFF',
  },
  modalApplyButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  modalApplyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});



// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import api from '../../services/api';

// const PRIMARY_DARK = '#0B2045';
// const ACCENT_BLUE = '#4361EE';
// const BADGE_RED = '#E53E3E';
// const BADGE_TAN = '#D97706';
// const BG = '#F5F6FA';
// const GRAY_TEXT = '#6B7280';
// const STAR_COLOR = '#F59E0B';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   price: number;
//   instructor: { name: string };
//   category: string;
//   level: 'beginner' | 'intermediate' | 'advanced';
//   duration: string;
// }

// export default function CoursesScreen() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [categories, setCategories] = useState<string[]>([]);
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     fetchCourses();
//     fetchCategories();
//   }, [searchQuery, selectedCategory]);

//   const fetchCourses = async () => {
//     try {
//       const response = await api.get('/courses', {
//         params: {
//           search: searchQuery,
//           category: selectedCategory,
//         },
//       });
//       setCourses(response.data.courses);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get('/courses/categories');
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleEnroll = async (courseId: string, price: number) => {
//     if (price > 0) {
//       // router.push(`/(student)/checkout/${courseId}`);
//     } else {
//       try {
//         await api.post(`/courses/${courseId}/enroll`);
//         router.push('/(student)/my-courses');
//       } catch (error) {
//         console.error('Enrollment error:', error);
//       }
//     }
//   };

//   const CourseCard = ({ course }: { course: Course }) => (
//     <TouchableOpacity
//       // onPress={() => router.push(`/(student)/course-details/${course._id}`)}
//       style={styles.card}
//     >
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: course.thumbnail }} style={styles.cardImage} />
//         <View style={styles.badgeRow}>
//           <View style={[styles.badge, { backgroundColor: BADGE_RED }]}>
//             <Text style={styles.badgeText}>{course.level}</Text>
//           </View>
//           <View style={[styles.badge, { backgroundColor: BADGE_TAN }]}>
//             <Text style={styles.badgeText}>{course.category}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.cardBody}>
//         <View style={styles.ratingRow}>
//           <Ionicons name="star" size={13} color={STAR_COLOR} />
//           <Text style={styles.ratingText}>4.5 (1.2k reviews)</Text>
//         </View>

//         <Text style={styles.cardTitle}>{course.title}</Text>
//         <Text style={styles.instructorText}>Instructor: {course.instructor.name}</Text>

//         <View style={styles.statsRow}>
//           <Ionicons name="time-outline" size={13} color={GRAY_TEXT} />
//           <Text style={styles.statText}>{course.duration}</Text>
//           <Ionicons name="bar-chart-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
//           <Text style={styles.statText}>{course.level}</Text>
//         </View>

//         <View style={styles.priceRow}>
//           <Text style={styles.priceText}>₦{course.price.toLocaleString()}</Text>
//           <TouchableOpacity
//             onPress={() => handleEnroll(course._id, course.price)}
//             style={styles.enrollButton}
//           >
//             <Text style={styles.enrollButtonText}>
//               {course.price > 0 ? 'Enroll Now' : 'Start Free'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderHeader = () => (
//     <>
//       {/* Search and Filter */}
//       <View style={styles.searchSection}>
//         <View style={styles.searchRow}>
//           <View style={styles.searchBar}>
//             <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search for courses..."
//               placeholderTextColor="#9CA3AF"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//           <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
//             <Ionicons name="options-outline" size={18} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>

//         {/* Categories */}
//         <View style={styles.categoriesHeader}>
//           <Text style={styles.sectionLabel}>Categories</Text>
//           <TouchableOpacity>
//             <Text style={styles.seeAll}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.categoryScroll}
//           contentContainerStyle={styles.categoryScrollContent}
//           data={categories}
//           keyExtractor={(item) => item}
//           renderItem={({ item: cat }) => (
//             <TouchableOpacity
//               onPress={() => setSelectedCategory(cat)}
//               style={[
//                 styles.categoryChip,
//                 selectedCategory === cat && styles.categoryChipActive,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryChipText,
//                   selectedCategory === cat && styles.categoryChipTextActive,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           )}
//           ListHeaderComponent={() => (
//             <TouchableOpacity
//               onPress={() => setSelectedCategory('')}
//               style={[
//                 styles.categoryChip,
//                 selectedCategory === '' && styles.categoryChipActive,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.categoryChipText,
//                   selectedCategory === '' && styles.categoryChipTextActive,
//                 ]}
//               >
//                 All Courses
//               </Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* Course Section Header */}
//       <View style={styles.courseSectionHeader}>
//         <Text style={styles.popularHeading}>Popular Courses</Text>
//       </View>
//     </>
//   );

//   const renderFooter = () => (
//     <View style={styles.ctaContainer}>
//       {/* CTA Banner */}
//       <View style={styles.ctaBanner}>
//         <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.4)" style={styles.ctaIcon} />
//         <Text style={styles.ctaHeading}>Build your career with us.</Text>
//         <Text style={styles.ctaBody}>
//           Get personalized course recommendations and career guidance from industry experts.
//         </Text>
//         <TouchableOpacity style={styles.ctaButton}>
//           <Text style={styles.ctaButtonText}>Enroll Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={courses}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => <CourseCard course={item} />}
//         ListHeaderComponent={renderHeader}
//         ListFooterComponent={renderFooter}
//         ListEmptyComponent={
//           !loading ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No courses found</Text>
//             </View>
//           ) : null
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         onRefresh={fetchCourses}
//         refreshing={loading}
//       />

//       {/* Filter Modal */}
//       <Modal visible={showFilters} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>Filter Courses</Text>
//             <Text style={styles.modalLabel}>Category</Text>
//             <FlatList
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.modalCategoryScroll}
//               data={categories}
//               keyExtractor={(item) => item}
//               renderItem={({ item: cat }) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedCategory(cat);
//                     setShowFilters(false);
//                   }}
//                   style={[
//                     styles.modalChip,
//                     selectedCategory === cat && styles.modalChipActive,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.modalChipText,
//                       selectedCategory === cat && styles.modalChipTextActive,
//                     ]}
//                   >
//                     {cat}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListHeaderComponent={() => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedCategory('');
//                     setShowFilters(false);
//                   }}
//                   style={[
//                     styles.modalChip,
//                     selectedCategory === '' && styles.modalChipActive,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.modalChipText,
//                       selectedCategory === '' && styles.modalChipTextActive,
//                     ]}
//                   >
//                     All Courses
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//             <TouchableOpacity
//               onPress={() => setShowFilters(false)}
//               style={styles.modalApplyButton}
//             >
//               <Text style={styles.modalApplyText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   listContent: {
//     paddingBottom: 24,
//   },

//   // Search Section
//   searchSection: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//   },
//   searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 16,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     gap: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: PRIMARY_DARK,
//   },
//   filterButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: PRIMARY_DARK,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Categories
//   categoriesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   sectionLabel: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//   },
//   seeAll: {
//     fontSize: 13,
//     color: ACCENT_BLUE,
//     fontWeight: '500',
//   },
//   categoryScroll: {
//     marginBottom: 4,
//   },
//   categoryScrollContent: {
//     gap: 8,
//     paddingRight: 4,
//   },
//   categoryChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     backgroundColor: '#FFFFFF',
//   },
//   categoryChipActive: {
//     backgroundColor: PRIMARY_DARK,
//     borderColor: PRIMARY_DARK,
//   },
//   categoryChipText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#374151',
//   },
//   categoryChipTextActive: {
//     color: '#FFFFFF',
//   },

//   // Course Section
//   courseSectionHeader: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     paddingBottom: 8,
//     backgroundColor: BG,
//   },
//   popularHeading: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//   },

//   // Course card
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginBottom: 20,
//     marginHorizontal: 16,
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
//     height: 190,
//   },
//   badgeRow: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     flexDirection: 'row',
//     gap: 6,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   cardBody: {
//     padding: 14,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 6,
//   },
//   ratingText: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//     marginBottom: 4,
//     lineHeight: 22,
//   },
//   instructorText: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//     marginBottom: 8,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 12,
//   },
//   statIcon: {
//     marginLeft: 8,
//   },
//   statText: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     paddingTop: 12,
//   },
//   priceText: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//   },
//   enrollButton: {
//     backgroundColor: PRIMARY_DARK,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   enrollButtonText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },

//   // CTA Banner
//   ctaContainer: {
//     paddingHorizontal: 16,
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   ctaBanner: {
//     backgroundColor: PRIMARY_DARK,
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'flex-start',
//   },
//   ctaIcon: {
//     marginBottom: 12,
//   },
//   ctaHeading: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     marginBottom: 10,
//     lineHeight: 30,
//   },
//   ctaBody: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.75)',
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   ctaButton: {
//     backgroundColor: BADGE_RED,
//     paddingHorizontal: 40,
//     paddingVertical: 13,
//     borderRadius: 10,
//     alignSelf: 'center',
//     width: '100%',
//     alignItems: 'center',
//   },
//   ctaButtonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },

//   // Empty state
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: GRAY_TEXT,
//   },

//   // Filter modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalSheet: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     paddingBottom: 36,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//     marginBottom: 16,
//   },
//   modalLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PRIMARY_DARK,
//     marginBottom: 10,
//   },
//   modalCategoryScroll: {
//     marginBottom: 4,
//   },
//   modalChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     backgroundColor: '#F3F4F6',
//     marginRight: 8,
//   },
//   modalChipActive: {
//     backgroundColor: PRIMARY_DARK,
//     borderColor: PRIMARY_DARK,
//   },
//   modalChipText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#374151',
//   },
//   modalChipTextActive: {
//     color: '#FFFFFF',
//   },
//   modalApplyButton: {
//     backgroundColor: PRIMARY_DARK,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   modalApplyText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
// });