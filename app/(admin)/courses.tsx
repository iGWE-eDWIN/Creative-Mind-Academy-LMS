// import { adminService } from '@/services/admin';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const PRIMARY_DARK = '#0B2045';
// const ACCENT_BLUE = '#4361EE';
// const BADGE_RED = '#E53E3E';
// const BADGE_TAN = '#D97706';
// const BG = '#F5F6FA';
// const GRAY_TEXT = '#6B7280';
// const STAR_COLOR = '#F59E0B';

// interface Instructor {
//   _id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
//   avatarUrl?: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   detailedDescription?: string;
//   price: number;
//   isFree: boolean;
//   category: string;
//   subcategory?: string;
//   thumbnail?: string;
//   coverImage?: string;
//   status: 'draft' | 'published' | 'archived';
//   level?: string;
//   duration?: number;
//   language?: string;
//   assignedInstructor?: Instructor;
//   instructor?: Instructor;
//   createdBy?: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
//   publishedAt?: string;
//   isDeleted?: boolean;
//   enrolledCount?: number;
//   rating?: {
//     average: number;
//     count: number;
//   };
// }

// type FilterStatus = 'all' | 'draft' | 'published' | 'archived';

// const STATUS_COLORS = {
//   draft: '#6B7280',
//   published: '#22C55E',
//   archived: '#F59E0B',
// };

// const STATUS_LABELS = {
//   draft: 'Draft',
//   published: 'Published',
//   archived: 'Archived',
// };

// const CATEGORIES = ['All', 'Technology', 'Business', 'Design', 'Entrepreneurship', 'Soft Skills'];

// export default function CourseManagement() {
//   const router = useRouter();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [instructors, setInstructors] = useState<Instructor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Assign Instructor Modal State
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

//   // Course Detail Modal
//   const [showCourseDetail, setShowCourseDetail] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//   const fetchData = useCallback(async () => {
//     try {
//       const [courseData, instructorData] = await Promise.all([
//         adminService.getCourses(),
//         adminService.getInstructors(),
//       ]);
      
//       const coursesList = courseData.data || courseData.courses || [];
//       const instructorsList = instructorData.data || instructorData.instructors || [];
      
//       setCourses(coursesList);
//       setInstructors(instructorsList);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to load data');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   const handlePublishCourse = async (courseId: string) => {
//     Alert.alert(
//       'Publish Course',
//       'Are you sure you want to publish this course? It will be visible to students.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Publish',
//           onPress: async () => {
//             try {
//               await adminService.publishCourse(courseId);
//               Alert.alert('Success', 'Course published successfully');
//               fetchData();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to publish course');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleUnpublishCourse = async (courseId: string) => {
//     Alert.alert(
//       'Unpublish Course',
//       'This will remove the course from public view. Are you sure?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Unpublish',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await adminService.unpublishCourse(courseId);
//               Alert.alert('Success', 'Course unpublished successfully');
//               fetchData();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to unpublish course');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleArchiveCourse = async (courseId: string) => {
//     Alert.alert(
//       'Archive Course',
//       'Archived courses are hidden from students but can be restored later.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Archive',
//           onPress: async () => {
//             try {
//               await adminService.archiveCourse(courseId);
//               Alert.alert('Success', 'Course archived successfully');
//               fetchData();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to archive course');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleDeleteCourse = async (courseId: string, title: string) => {
//     Alert.alert(
//       'Delete Course',
//       `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await adminService.deleteCourse(courseId);
//               Alert.alert('Success', 'Course deleted successfully');
//               fetchData();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to delete course');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleAssignInstructor = async () => {
//     if (!selectedCourseId || !selectedInstructor) {
//       Alert.alert('Error', 'Please select an instructor');
//       return;
//     }

//     try {
//       await adminService.assignInstructor(selectedCourseId, selectedInstructor);
//       Alert.alert('Success', 'Instructor assigned successfully');
//       setShowAssignModal(false);
//       setSelectedCourseId(null);
//       setSelectedInstructor(null);
//       fetchData();
//     } catch (error: any) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to assign instructor');
//     }
//   };

//   const openAssignModal = (courseId: string) => {
//     setSelectedCourseId(courseId);
//     setSelectedInstructor(null);
//     setShowAssignModal(true);
//   };

//   const openCourseDetail = (course: Course) => {
//     setSelectedCourse(course);
//     setShowCourseDetail(true);
//   };

//   const handleEditCourse = (courseId: string) => {
//     router.push(`/(admin)/edit-course/${courseId}` as any);
//   };

//   const getStatusColor = (status: string) => {
//     return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280';
//   };

//   const getStatusLabel = (status: string) => {
//     return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
//   };

//   const formatPrice = (price: number, isFree: boolean) => {
//     if (isFree || price === 0) return 'Free';
//     return `₦${price.toLocaleString()}`;
//   };

//   const getInitials = (name: string) => {
//     if (!name) return '?';
//     return name.charAt(0).toUpperCase();
//   };

//   const getCategoryValue = (label: string) => {
//     const map: Record<string, string> = {
//       'All': 'all',
//       'Technology': 'technology',
//       'Business': 'business',
//       'Design': 'design',
//       'Entrepreneurship': 'entrepreneurship',
//       'Soft Skills': 'soft-skills',
//     };
//     return map[label] || label.toLowerCase();
//   };

//   const getCategoryLabel = (value: string) => {
//     const map: Record<string, string> = {
//       'technology': 'Technology',
//       'business': 'Business',
//       'design': 'Design',
//       'entrepreneurship': 'Entrepreneurship',
//       'soft-skills': 'Soft Skills',
//       'other': 'Other',
//     };
//     return map[value] || value;
//   };

//   const filteredCourses = courses.filter((c) => {
//     const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.description?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
//     const matchesCategory = selectedCategory === 'All' || 
//       getCategoryLabel(c.category) === selectedCategory;
//     return matchesSearch && matchesStatus && matchesCategory;
//   });

//   // Render Header
//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       {/* Search Row */}
//       <View style={styles.searchRow}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search courses..."
//             placeholderTextColor="#9CA3AF"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//         <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
//           <Ionicons name="options-outline" size={18} color="#FFFFFF" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.createButton}
//           onPress={() => router.push('/(admin)/create-course')}
//         >
//           <Ionicons name="add-outline" size={20} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Status Filters */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.categoryScroll}
//         contentContainerStyle={styles.categoryScrollContent}
//       >
//         {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
//           <TouchableOpacity
//             key={status}
//             onPress={() => setSelectedStatus(status)}
//             style={[
//               styles.categoryChip,
//               selectedStatus === status && styles.categoryChipActive,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.categoryChipText,
//                 selectedStatus === status && styles.categoryChipTextActive,
//               ]}
//             >
//               {status === 'all' ? 'All' : getStatusLabel(status)}
//             </Text>
//             {selectedStatus === status && (
//               <Ionicons name="checkmark" size={14} color="#FFFFFF" style={styles.chipCheck} />
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Stats Row */}
//       <View style={styles.statsRow}>
//         <Text style={styles.statsText}>
//           {filteredCourses.length} of {courses.length} courses
//         </Text>
//         <View style={styles.statsBadges}>
//           <View style={[styles.statsBadge, { backgroundColor: '#22C55E15' }]}>
//             <Text style={[styles.statsBadgeText, { color: '#22C55E' }]}>
//               Published: {courses.filter(c => c.status === 'published').length}
//             </Text>
//           </View>
//           <View style={[styles.statsBadge, { backgroundColor: '#6B728015' }]}>
//             <Text style={[styles.statsBadgeText, { color: '#6B7280' }]}>
//               Draft: {courses.filter(c => c.status === 'draft').length}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   // Render Footer
//   const renderFooter = () => (
//     <View style={styles.footerContainer}>
//       <View style={styles.ctaBanner}>
//         <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.4)" style={styles.ctaIcon} />
//         <Text style={styles.ctaHeading}>Manage your courses.</Text>
//         <Text style={styles.ctaBody}>
//           Create, publish, and manage all your courses from one place. Track enrollment and performance.
//         </Text>
//         <TouchableOpacity
//           style={styles.ctaButton}
//           onPress={() => router.push('/(admin)/create-course')}
//         >
//           <Text style={styles.ctaButtonText}>Create New Course</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Render Course Card
//   const renderCourseItem = ({ item }: { item: Course }) => {
//     const instructor = item.assignedInstructor || item.instructor;
//     const isPublished = item.status === 'published';
//     const isDraft = item.status === 'draft';
//     const isArchived = item.status === 'archived';

//     return (
//       <TouchableOpacity
//         style={[styles.card, isArchived && styles.cardArchived]}
//         onPress={() => openCourseDetail(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={{
//               uri: item.thumbnail ||
//                 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
//             }}
//             style={styles.cardImage}
//           />
//           <View style={styles.badgeRow}>
//             <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
//               <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
//             </View>
//             {item.category && (
//               <View style={[styles.badge, { backgroundColor: BADGE_TAN }]}>
//                 <Text style={styles.badgeText}>{getCategoryLabel(item.category)}</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={styles.cardBody}>
//           <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          
//           <View style={styles.instructorRow}>
//             {instructor ? (
//               <>
//                 <View style={styles.instructorAvatar}>
//                   <Text style={styles.instructorAvatarText}>
//                     {getInitials(instructor.name)}
//                   </Text>
//                 </View>
//                 <Text style={styles.instructorText}>{instructor.name}</Text>
//               </>
//             ) : (
//               <Text style={styles.noInstructorText}>No instructor assigned</Text>
//             )}
//           </View>

//           <View style={styles.statsRow}>
//             <Ionicons name="time-outline" size={13} color={GRAY_TEXT} />
//             <Text style={styles.statText}>{item.duration || 0}h</Text>
//             <Ionicons name="bar-chart-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
//             <Text style={styles.statText}>{item.level || 'Beginner'}</Text>
//             <Ionicons name="people-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
//             <Text style={styles.statText}>{item.enrolledCount || 0}</Text>
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.priceText}>{formatPrice(item.price, item.isFree)}</Text>
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={[styles.actionBtn, styles.editBtn]}
//                 onPress={() => handleEditCourse(item._id)}
//               >
//                 <Ionicons name="create-outline" size={14} color="#FFFFFF" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.actionBtn, styles.assignBtn]}
//                 onPress={() => openAssignModal(item._id)}
//               >
//                 <Ionicons name="person-add-outline" size={14} color="#FFFFFF" />
//               </TouchableOpacity>
//               {isDraft && (
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.publishBtn]}
//                   onPress={() => handlePublishCourse(item._id)}
//                 >
//                   <Ionicons name="cloud-upload-outline" size={14} color="#FFFFFF" />
//                 </TouchableOpacity>
//               )}
//               {isPublished && (
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.archiveActionBtn]}
//                   onPress={() => handleArchiveCourse(item._id)}
//                 >
//                   <Ionicons name="archive-outline" size={14} color="#FFFFFF" />
//                 </TouchableOpacity>
//               )}
//               {isArchived && (
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.restoreBtn]}
//                   onPress={() => handlePublishCourse(item._id)}
//                 >
//                   <Ionicons name="refresh-outline" size={14} color="#FFFFFF" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Course Detail Modal
//   const renderCourseDetailModal = () => {
//     if (!selectedCourse) return null;
//     const instructor = selectedCourse.assignedInstructor || selectedCourse.instructor;

//     return (
//       <Modal visible={showCourseDetail} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalSheet}>
//             <View style={styles.modalHandle} />
            
//             <ScrollView contentContainerStyle={styles.modalContent}>
//               <Image
//                 source={{
//                   uri: selectedCourse.thumbnail ||
//                     'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
//                 }}
//                 style={styles.modalImage}
//               />

//               <View style={styles.modalBody}>
//                 <View style={styles.modalTitleRow}>
//                   <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
//                   <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedCourse.status) + '15' }]}>
//                     <Text style={[styles.modalStatusText, { color: getStatusColor(selectedCourse.status) }]}>
//                       {getStatusLabel(selectedCourse.status)}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text style={styles.modalPrice}>{formatPrice(selectedCourse.price, selectedCourse.isFree)}</Text>

//                 <Text style={styles.modalSectionLabel}>Description</Text>
//                 <Text style={styles.modalText}>{selectedCourse.description || 'No description'}</Text>

//                 {selectedCourse.detailedDescription && (
//                   <>
//                     <Text style={styles.modalSectionLabel}>Detailed Description</Text>
//                     <Text style={styles.modalText}>{selectedCourse.detailedDescription}</Text>
//                   </>
//                 )}

//                 <View style={styles.modalGrid}>
//                   <View style={styles.modalGridItem}>
//                     <Text style={styles.modalGridLabel}>Category</Text>
//                     <Text style={styles.modalGridValue}>{getCategoryLabel(selectedCourse.category) || 'N/A'}</Text>
//                   </View>
//                   <View style={styles.modalGridItem}>
//                     <Text style={styles.modalGridLabel}>Level</Text>
//                     <Text style={styles.modalGridValue}>{selectedCourse.level || 'N/A'}</Text>
//                   </View>
//                   <View style={styles.modalGridItem}>
//                     <Text style={styles.modalGridLabel}>Duration</Text>
//                     <Text style={styles.modalGridValue}>{selectedCourse.duration ? `${selectedCourse.duration}h` : 'N/A'}</Text>
//                   </View>
//                   <View style={styles.modalGridItem}>
//                     <Text style={styles.modalGridLabel}>Language</Text>
//                     <Text style={styles.modalGridValue}>{selectedCourse.language || 'N/A'}</Text>
//                   </View>
//                 </View>

//                 <Text style={styles.modalSectionLabel}>Instructor</Text>
//                 {instructor ? (
//                   <View style={styles.modalInstructor}>
//                     <View style={styles.modalInstructorAvatar}>
//                       <Text style={styles.modalInstructorAvatarText}>
//                         {getInitials(instructor.name)}
//                       </Text>
//                     </View>
//                     <View>
//                       <Text style={styles.modalInstructorName}>{instructor.name}</Text>
//                       <Text style={styles.modalInstructorEmail}>{instructor.email}</Text>
//                     </View>
//                   </View>
//                 ) : (
//                   <Text style={styles.noInstructorText}>No instructor assigned</Text>
//                 )}

//                 <Text style={styles.modalSectionLabel}>Created</Text>
//                 <Text style={styles.modalText}>
//                   {new Date(selectedCourse.createdAt).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                   })}
//                 </Text>

//                 {selectedCourse.publishedAt && (
//                   <>
//                     <Text style={styles.modalSectionLabel}>Published</Text>
//                     <Text style={styles.modalText}>
//                       {new Date(selectedCourse.publishedAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                       })}
//                     </Text>
//                   </>
//                 )}

//                 <View style={styles.modalActionRow}>
//                   <TouchableOpacity
//                     style={[styles.modalActionBtn, styles.modalEditBtn]}
//                     onPress={() => {
//                       setShowCourseDetail(false);
//                       handleEditCourse(selectedCourse._id);
//                     }}
//                   >
//                     <Ionicons name="create-outline" size={18} color="#FFFFFF" />
//                     <Text style={styles.modalActionBtnText}>Edit</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalActionBtn, styles.modalCloseBtn]}
//                     onPress={() => setShowCourseDetail(false)}
//                   >
//                     <Ionicons name="close" size={18} color="#FFFFFF" />
//                     <Text style={styles.modalActionBtnText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // Assign Instructor Modal
//   const renderAssignModal = () => (
//     <Modal visible={showAssignModal} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalSheet}>
//           <View style={styles.modalHandle} />
//           <Text style={styles.modalTitle}>Assign Instructor</Text>
          
//           <ScrollView contentContainerStyle={styles.assignList}>
//             {instructors.map((inst) => (
//               <TouchableOpacity
//                 key={inst._id}
//                 style={[
//                   styles.assignItem,
//                   selectedInstructor === inst._id && styles.assignItemSelected,
//                 ]}
//                 onPress={() => setSelectedInstructor(inst._id)}
//               >
//                 <View style={styles.assignAvatar}>
//                   <Text style={styles.assignAvatarText}>{getInitials(inst.name)}</Text>
//                 </View>
//                 <View style={styles.assignInfo}>
//                   <Text style={styles.assignName}>{inst.name}</Text>
//                   <Text style={styles.assignEmail}>{inst.email}</Text>
//                 </View>
//                 {selectedInstructor === inst._id && (
//                   <Ionicons name="checkmark-circle" size={24} color={ACCENT_BLUE} />
//                 )}
//               </TouchableOpacity>
//             ))}

//             {instructors.length === 0 && (
//               <Text style={styles.emptyInstructors}>No instructors available</Text>
//             )}

//             <TouchableOpacity
//               style={[styles.assignConfirmBtn, !selectedInstructor && styles.assignConfirmBtnDisabled]}
//               disabled={!selectedInstructor}
//               onPress={handleAssignInstructor}
//             >
//               <Text style={styles.assignConfirmText}>Assign Instructor</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.assignCancelBtn}
//               onPress={() => setShowAssignModal(false)}
//             >
//               <Text style={styles.assignCancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Filter Modal
//   const renderFilterModal = () => (
//     <Modal visible={showFilters} animationType="slide" transparent>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalSheet}>
//           <View style={styles.modalHandle} />
//           <Text style={styles.modalTitle}>Filter Courses</Text>
          
//           <Text style={styles.modalLabel}>Category</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoryScroll}>
//             {CATEGORIES.map((cat) => (
//               <TouchableOpacity
//                 key={cat}
//                 onPress={() => setSelectedCategory(cat)}
//                 style={[
//                   styles.modalChip,
//                   selectedCategory === cat && styles.modalChipActive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.modalChipText,
//                     selectedCategory === cat && styles.modalChipTextActive,
//                   ]}
//                 >
//                   {cat}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           <TouchableOpacity
//             style={styles.modalApplyButton}
//             onPress={() => setShowFilters(false)}
//           >
//             <Text style={styles.modalApplyText}>Apply Filters</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={PRIMARY_DARK} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={filteredCourses}
//         renderItem={renderCourseItem}
//         keyExtractor={(item) => item._id}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={renderHeader}
//         ListFooterComponent={renderFooter}
//         contentContainerStyle={styles.flatListContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_DARK} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="book-outline" size={48} color="#9CA3AF" />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No courses match your search' : 'No courses found'}
//             </Text>
//             {!searchQuery && (
//               <TouchableOpacity
//                 style={styles.emptyCreateBtn}
//                 onPress={() => router.push('/(admin)/create-course')}
//               >
//                 <Text style={styles.emptyCreateBtnText}>Create your first course</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {renderAssignModal()}
//       {renderCourseDetailModal()}
//       {renderFilterModal()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   flatListContent: {
//     paddingBottom: 24,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: BG,
//   },

//   // Header
//   headerContainer: {
//     backgroundColor: BG,
//     paddingTop: 8,
//   },

//   // Search
//   searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
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
//   createButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: ACCENT_BLUE,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Categories/Status Filters
//   categoryScroll: {
//     marginBottom: 12,
//     paddingHorizontal: 16,
//   },
//   categoryScrollContent: {
//     gap: 8,
//     paddingRight: 4,
//   },
//   categoryChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
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
//   chipCheck: {
//     marginLeft: 2,
//   },

//   // Stats
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },
//   statsText: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//   },
//   statsBadges: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   statsBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   statsBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },

//   // Course Card
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
//   cardArchived: {
//     opacity: 0.7,
//   },
//   imageContainer: {
//     position: 'relative',
//   },
//   cardImage: {
//     width: '100%',
//     height: 170,
//     backgroundColor: '#E5E7EB',
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
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   cardBody: {
//     padding: 14,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//     marginBottom: 6,
//     lineHeight: 22,
//   },
//   instructorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   instructorAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: ACCENT_BLUE,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   instructorAvatarText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   instructorText: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//   },
//   noInstructorText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     fontStyle: 'italic',
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
//     fontSize: 18,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   actionBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   editBtn: {
//     backgroundColor: ACCENT_BLUE,
//   },
//   assignBtn: {
//     backgroundColor: '#8B5CF6',
//   },
//   publishBtn: {
//     backgroundColor: '#22C55E',
//   },
//   archiveActionBtn: {
//     backgroundColor: '#F59E0B',
//   },
//   restoreBtn: {
//     backgroundColor: '#22C55E',
//   },

//   // Footer
//   footerContainer: {
//     paddingHorizontal: 16,
//     marginTop: 4,
//   },
//   ctaBanner: {
//     backgroundColor: PRIMARY_DARK,
//     borderRadius: 20,
//     padding: 24,
//     marginBottom: 8,
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

//   // Modals
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
//     maxHeight: '90%',
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modalContent: {
//     paddingBottom: 24,
//   },
//   modalImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     backgroundColor: '#E5E7EB',
//     marginBottom: 16,
//   },
//   modalBody: {
//     paddingHorizontal: 4,
//   },
//   modalTitleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//     flex: 1,
//   },
//   modalStatusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   modalStatusText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   modalPrice: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: ACCENT_BLUE,
//     marginBottom: 16,
//   },
//   modalSectionLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   modalText: {
//     fontSize: 14,
//     color: GRAY_TEXT,
//     lineHeight: 22,
//   },
//   modalGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 8,
//   },
//   modalGridItem: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 8,
//   },
//   modalGridLabel: {
//     fontSize: 11,
//     color: GRAY_TEXT,
//     marginBottom: 4,
//   },
//   modalGridValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PRIMARY_DARK,
//   },
//   modalInstructor: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 8,
//   },
//   modalInstructorAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: ACCENT_BLUE,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalInstructorAvatarText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   modalInstructorName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: PRIMARY_DARK,
//   },
//   modalInstructorEmail: {
//     fontSize: 13,
//     color: GRAY_TEXT,
//   },
//   modalActionRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalActionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   modalEditBtn: {
//     backgroundColor: ACCENT_BLUE,
//   },
//   modalCloseBtn: {
//     backgroundColor: '#6B7280',
//   },
//   modalActionBtnText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   // Assign Modal
//   assignList: {
//     gap: 8,
//     paddingBottom: 20,
//   },
//   assignItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//     borderRadius: 10,
//   },
//   assignItemSelected: {
//     borderColor: ACCENT_BLUE,
//     backgroundColor: '#EBF4FF',
//   },
//   assignAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: ACCENT_BLUE,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   assignAvatarText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   assignInfo: {
//     flex: 1,
//   },
//   assignName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PRIMARY_DARK,
//   },
//   assignEmail: {
//     fontSize: 12,
//     color: GRAY_TEXT,
//     marginTop: 2,
//   },
//   assignConfirmBtn: {
//     backgroundColor: ACCENT_BLUE,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   assignConfirmBtnDisabled: {
//     backgroundColor: '#9CA3AF',
//   },
//   assignConfirmText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   assignCancelBtn: {
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   assignCancelText: {
//     color: GRAY_TEXT,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   emptyInstructors: {
//     textAlign: 'center',
//     color: GRAY_TEXT,
//     paddingVertical: 24,
//   },

//   // Filter Modal
//   modalLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PRIMARY_DARK,
//     marginBottom: 10,
//   },
//   modalCategoryScroll: {
//     marginBottom: 20,
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
//     marginTop: 8,
//   },
//   modalApplyText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },

//   // Empty State
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: GRAY_TEXT,
//     marginTop: 8,
//   },
//   emptyCreateBtn: {
//     marginTop: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: ACCENT_BLUE,
//     borderRadius: 8,
//   },
//   emptyCreateBtnText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });



// CourseManagement.tsx - Updated with Delete, Unpublish, and Empty State fixes

// CourseManagement.tsx - With Click Outside to Close

import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const PRIMARY_DARK = '#0B2045';
const ACCENT_BLUE = '#4361EE';
const BADGE_RED = '#E53E3E';
const BADGE_TAN = '#D97706';
const BG = '#F5F6FA';
const GRAY_TEXT = '#6B7280';
const STAR_COLOR = '#F59E0B';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  avatarUrl?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  price: number;
  isFree: boolean;
  category: string;
  subcategory?: string;
  thumbnail?: string;
  coverImage?: string;
  status: 'draft' | 'published' | 'archived';
  level?: string;
  duration?: number;
  language?: string;
  assignedInstructor?: Instructor;
  instructor?: Instructor;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  publishedAt?: string;
  isDeleted?: boolean;
  enrolledCount?: number;
  rating?: {
    average: number;
    count: number;
  };
}

type FilterStatus = 'all' | 'draft' | 'published' | 'archived';

const STATUS_COLORS = {
  draft: '#6B7280',
  published: '#22C55E',
  archived: '#F59E0B',
};

const STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

const CATEGORIES = ['All', 'Technology', 'Business', 'Design', 'Entrepreneurship', 'Soft Skills'];

export default function CourseManagement() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Assign Instructor Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

  // Course Detail Modal
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [courseData, instructorData] = await Promise.all([
        adminService.getCourses(),
        adminService.getInstructors(),
      ]);
      
      const coursesList = courseData.data || courseData.courses || [];
      const instructorsList = instructorData.data || instructorData.instructors || [];
      
      setCourses(coursesList);
      setInstructors(instructorsList);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePublishCourse = async (courseId: string) => {
    Alert.alert(
      'Publish Course',
      'Are you sure you want to publish this course? It will be visible to students.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            try {
              await adminService.publishCourse(courseId);
              Alert.alert('Success', 'Course published successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to publish course');
            }
          },
        },
      ]
    );
  };

  const handleUnpublishCourse = async (courseId: string) => {
    Alert.alert(
      'Unpublish Course',
      'This will remove the course from public view. Students will no longer see it. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpublish',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.unpublishCourse(courseId);
              Alert.alert('Success', 'Course unpublished successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to unpublish course');
            }
          },
        },
      ]
    );
  };

  const handleArchiveCourse = async (courseId: string) => {
    Alert.alert(
      'Archive Course',
      'Archived courses are hidden from students but can be restored later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            try {
              await adminService.archiveCourse(courseId);
              Alert.alert('Success', 'Course archived successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to archive course');
            }
          },
        },
      ]
    );
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to permanently delete "${title}"? This action cannot be undone and will remove all associated data including enrollments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteCourse(courseId);
              Alert.alert('Success', 'Course deleted successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  const handleAssignInstructor = async () => {
    if (!selectedCourseId || !selectedInstructor) {
      Alert.alert('Error', 'Please select an instructor');
      return;
    }

    try {
      await adminService.assignInstructor(selectedCourseId, selectedInstructor);
      Alert.alert('Success', 'Instructor assigned successfully');
      setShowAssignModal(false);
      setSelectedCourseId(null);
      setSelectedInstructor(null);
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to assign instructor');
    }
  };

  const openAssignModal = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedInstructor(null);
    setShowAssignModal(true);
  };

  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/(admin)/edit-course/${courseId}` as any);
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
  };

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree || price === 0) return 'Free';
    return `₦${price.toLocaleString()}`;
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getCategoryValue = (label: string) => {
    const map: Record<string, string> = {
      'All': 'all',
      'Technology': 'technology',
      'Business': 'business',
      'Design': 'design',
      'Entrepreneurship': 'entrepreneurship',
      'Soft Skills': 'soft-skills',
    };
    return map[label] || label.toLowerCase();
  };

  const getCategoryLabel = (value: string) => {
    const map: Record<string, string> = {
      'technology': 'Technology',
      'business': 'Business',
      'design': 'Design',
      'entrepreneurship': 'Entrepreneurship',
      'soft-skills': 'Soft Skills',
      'other': 'Other',
    };
    return map[value] || value;
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || 
      getCategoryLabel(c.category) === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Render Header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/(admin)/create-course')}
        >
          <Ionicons name="add-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={[
              styles.categoryChip,
              selectedStatus === status && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedStatus === status && styles.categoryChipTextActive,
              ]}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </Text>
            {selectedStatus === status && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" style={styles.chipCheck} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {filteredCourses.length} of {courses.length} courses
        </Text>
        <View style={styles.statsBadges}>
          <View style={[styles.statsBadge, { backgroundColor: '#22C55E15' }]}>
            <Text style={[styles.statsBadgeText, { color: '#22C55E' }]}>
              Published: {courses.filter(c => c.status === 'published').length}
            </Text>
          </View>
          <View style={[styles.statsBadge, { backgroundColor: '#6B728015' }]}>
            <Text style={[styles.statsBadgeText, { color: '#6B7280' }]}>
              Draft: {courses.filter(c => c.status === 'draft').length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render Footer
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.ctaBanner}>
        <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.4)" style={styles.ctaIcon} />
        <Text style={styles.ctaHeading}>Manage your courses.</Text>
        <Text style={styles.ctaBody}>
          Create, publish, and manage all your courses from one place. Track enrollment and performance.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(admin)/create-course')}
        >
          <Text style={styles.ctaButtonText}>Create New Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Course Card
  const renderCourseItem = ({ item }: { item: Course }) => {
    const instructor = item.assignedInstructor || item.instructor;
    const isPublished = item.status === 'published';
    const isDraft = item.status === 'draft';
    const isArchived = item.status === 'archived';

    return (
      <TouchableOpacity
        style={[styles.card, isArchived && styles.cardArchived]}
        onPress={() => openCourseDetail(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.thumbnail ||
                'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
            }}
            style={styles.cardImage}
            resizeMode="stretch"
          />
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
            </View>
            {item.category && (
              <View style={[styles.badge, { backgroundColor: BADGE_TAN }]}>
                <Text style={styles.badgeText}>{getCategoryLabel(item.category)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.instructorRow}>
            {instructor ? (
              <>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.instructorAvatarText}>
                    {getInitials(instructor.name)}
                  </Text>
                </View>
                <Text style={styles.instructorText}>{instructor.name}</Text>
              </>
            ) : (
              <Text style={styles.noInstructorText}>No instructor assigned</Text>
            )}
          </View>

          <View style={styles.statsRow}>
            <Ionicons name="time-outline" size={13} color={GRAY_TEXT} />
            <Text style={styles.statText}>{item.duration || 0}h</Text>
            <Ionicons name="bar-chart-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
            <Text style={styles.statText}>{item.level || 'Beginner'}</Text>
            <Ionicons name="people-outline" size={13} color={GRAY_TEXT} style={styles.statIcon} />
            <Text style={styles.statText}>{item.enrolledCount || 0}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatPrice(item.price, item.isFree)}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => handleEditCourse(item._id)}
              >
                <Ionicons name="create-outline" size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.assignBtn]}
                onPress={() => openAssignModal(item._id)}
              >
                <Ionicons name="person-add-outline" size={14} color="#FFFFFF" />
              </TouchableOpacity>
              {isDraft && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.publishBtn]}
                    onPress={() => handlePublishCourse(item._id)}
                  >
                    <Ionicons name="cloud-upload-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDeleteCourse(item._id, item.title)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
              {isPublished && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.unpublishActionBtn]}
                    onPress={() => handleUnpublishCourse(item._id)}
                  >
                    <Ionicons name="eye-off-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.archiveActionBtn]}
                    onPress={() => handleArchiveCourse(item._id)}
                  >
                    <Ionicons name="archive-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDeleteCourse(item._id, item.title)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
              {isArchived && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.restoreBtn]}
                    onPress={() => handlePublishCourse(item._id)}
                  >
                    <Ionicons name="refresh-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDeleteCourse(item._id, item.title)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Course Detail Modal
  const renderCourseDetailModal = () => {
    if (!selectedCourse) return null;
    const instructor = selectedCourse.assignedInstructor || selectedCourse.instructor;

    return (
      <Modal visible={showCourseDetail} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowCourseDetail(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <Image
                    source={{
                      uri: selectedCourse.thumbnail ||
                        'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
                    }}
                    style={styles.modalImage}
                    resizeMode="stretch"
                  />

                  <View style={styles.modalBody}>
                    <View style={styles.modalTitleRow}>
                      <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
                      <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedCourse.status) + '15' }]}>
                        <Text style={[styles.modalStatusText, { color: getStatusColor(selectedCourse.status) }]}>
                          {getStatusLabel(selectedCourse.status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.modalPrice}>{formatPrice(selectedCourse.price, selectedCourse.isFree)}</Text>

                    <Text style={styles.modalSectionLabel}>Description</Text>
                    <Text style={styles.modalText}>{selectedCourse.description || 'No description'}</Text>

                    {selectedCourse.detailedDescription && (
                      <>
                        <Text style={styles.modalSectionLabel}>Detailed Description</Text>
                        <Text style={styles.modalText}>{selectedCourse.detailedDescription}</Text>
                      </>
                    )}

                    <View style={styles.modalGrid}>
                      <View style={styles.modalGridItem}>
                        <Text style={styles.modalGridLabel}>Category</Text>
                        <Text style={styles.modalGridValue}>{getCategoryLabel(selectedCourse.category) || 'N/A'}</Text>
                      </View>
                      <View style={styles.modalGridItem}>
                        <Text style={styles.modalGridLabel}>Level</Text>
                        <Text style={styles.modalGridValue}>{selectedCourse.level || 'N/A'}</Text>
                      </View>
                      <View style={styles.modalGridItem}>
                        <Text style={styles.modalGridLabel}>Duration</Text>
                        <Text style={styles.modalGridValue}>{selectedCourse.duration ? `${selectedCourse.duration}h` : 'N/A'}</Text>
                      </View>
                      <View style={styles.modalGridItem}>
                        <Text style={styles.modalGridLabel}>Language</Text>
                        <Text style={styles.modalGridValue}>{selectedCourse.language || 'N/A'}</Text>
                      </View>
                    </View>

                    <Text style={styles.modalSectionLabel}>Instructor</Text>
                    {instructor ? (
                      <View style={styles.modalInstructor}>
                        <View style={styles.modalInstructorAvatar}>
                          <Text style={styles.modalInstructorAvatarText}>
                            {getInitials(instructor.name)}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.modalInstructorName}>{instructor.name}</Text>
                          <Text style={styles.modalInstructorEmail}>{instructor.email}</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.noInstructorText}>No instructor assigned</Text>
                    )}

                    <Text style={styles.modalSectionLabel}>Created</Text>
                    <Text style={styles.modalText}>
                      {new Date(selectedCourse.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>

                    {selectedCourse.publishedAt && (
                      <>
                        <Text style={styles.modalSectionLabel}>Published</Text>
                        <Text style={styles.modalText}>
                          {new Date(selectedCourse.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </>
                    )}

                    <View style={styles.modalActionRow}>
                      <TouchableOpacity
                        style={[styles.modalActionBtn, styles.modalEditBtn]}
                        onPress={() => {
                          setShowCourseDetail(false);
                          handleEditCourse(selectedCourse._id);
                        }}
                      >
                        <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.modalActionBtnText}>Edit</Text>
                      </TouchableOpacity>
                      {selectedCourse.status !== 'archived' && (
                        <TouchableOpacity
                          style={[styles.modalActionBtn, styles.modalUnpublishBtn]}
                          onPress={() => {
                            setShowCourseDetail(false);
                            handleUnpublishCourse(selectedCourse._id);
                          }}
                        >
                          <Ionicons name="eye-off-outline" size={18} color="#FFFFFF" />
                          <Text style={styles.modalActionBtnText}>Unpublish</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.modalActionBtn, styles.modalDeleteBtn]}
                        onPress={() => {
                          setShowCourseDetail(false);
                          handleDeleteCourse(selectedCourse._id, selectedCourse.title);
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.modalActionBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // Assign Instructor Modal
  const renderAssignModal = () => (
    <Modal visible={showAssignModal} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setShowAssignModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Assign Instructor</Text>
              
              <ScrollView contentContainerStyle={styles.assignList}>
                {instructors.map((inst) => (
                  <TouchableOpacity
                    key={inst._id}
                    style={[
                      styles.assignItem,
                      selectedInstructor === inst._id && styles.assignItemSelected,
                    ]}
                    onPress={() => setSelectedInstructor(inst._id)}
                  >
                    <View style={styles.assignAvatar}>
                      <Text style={styles.assignAvatarText}>{getInitials(inst.name)}</Text>
                    </View>
                    <View style={styles.assignInfo}>
                      <Text style={styles.assignName}>{inst.name}</Text>
                      <Text style={styles.assignEmail}>{inst.email}</Text>
                    </View>
                    {selectedInstructor === inst._id && (
                      <Ionicons name="checkmark-circle" size={24} color={ACCENT_BLUE} />
                    )}
                  </TouchableOpacity>
                ))}

                {instructors.length === 0 && (
                  <Text style={styles.emptyInstructors}>No instructors available</Text>
                )}

                <TouchableOpacity
                  style={[styles.assignConfirmBtn, !selectedInstructor && styles.assignConfirmBtnDisabled]}
                  disabled={!selectedInstructor}
                  onPress={handleAssignInstructor}
                >
                  <Text style={styles.assignConfirmText}>Assign Instructor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.assignCancelBtn}
                  onPress={() => setShowAssignModal(false)}
                >
                  <Text style={styles.assignCancelText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Filter Modal
  const renderFilterModal = () => (
    <Modal visible={showFilters} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Filter Courses</Text>
              
              <Text style={styles.modalLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoryScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
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
                style={styles.modalApplyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.modalApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_DARK} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_DARK} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No courses match your search' : 'No courses found'}
            </Text>
          </View>
        }
      />

      {renderAssignModal()}
      {renderCourseDetailModal()}
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  flatListContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
  },

  // Header
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
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories/Status Filters
  categoryScroll: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    gap: 8,
    paddingRight: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  chipCheck: {
    marginLeft: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statsText: {
    fontSize: 12,
    color: GRAY_TEXT,
  },
  statsBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statsBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Course Card
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
  cardArchived: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#E5E7EB',
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
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginBottom: 6,
    lineHeight: 22,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorAvatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  instructorText: {
    fontSize: 12,
    color: GRAY_TEXT,
  },
  noInstructorText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
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
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: ACCENT_BLUE,
  },
  assignBtn: {
    backgroundColor: '#8B5CF6',
  },
  publishBtn: {
    backgroundColor: '#22C55E',
  },
  unpublishActionBtn: {
    backgroundColor: '#F59E0B',
  },
  archiveActionBtn: {
    backgroundColor: '#8B5CF6',
  },
  restoreBtn: {
    backgroundColor: '#22C55E',
  },
  deleteActionBtn: {
    backgroundColor: '#EF4444',
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
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

  // Modals
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
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalContent: {
    paddingBottom: 24,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  modalBody: {
    paddingHorizontal: 4,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_DARK,
    flex: 1,
  },
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: ACCENT_BLUE,
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: GRAY_TEXT,
    lineHeight: 22,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  modalGridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  modalGridLabel: {
    fontSize: 11,
    color: GRAY_TEXT,
    marginBottom: 4,
  },
  modalGridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  modalInstructor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  modalInstructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInstructorAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalInstructorName: {
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  modalInstructorEmail: {
    fontSize: 13,
    color: GRAY_TEXT,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalEditBtn: {
    backgroundColor: ACCENT_BLUE,
  },
  modalUnpublishBtn: {
    backgroundColor: '#F59E0B',
  },
  modalDeleteBtn: {
    backgroundColor: '#EF4444',
  },
  modalCloseBtn: {
    backgroundColor: '#6B7280',
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Assign Modal
  assignList: {
    gap: 8,
    paddingBottom: 20,
  },
  assignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 10,
  },
  assignItemSelected: {
    borderColor: ACCENT_BLUE,
    backgroundColor: '#EBF4FF',
  },
  assignAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assignAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  assignInfo: {
    flex: 1,
  },
  assignName: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  assignEmail: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginTop: 2,
  },
  assignConfirmBtn: {
    backgroundColor: ACCENT_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  assignConfirmBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  assignConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  assignCancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  assignCancelText: {
    color: GRAY_TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyInstructors: {
    textAlign: 'center',
    color: GRAY_TEXT,
    paddingVertical: 24,
  },

  // Filter Modal
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
    marginBottom: 10,
  },
  modalCategoryScroll: {
    marginBottom: 20,
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
    marginTop: 8,
  },
  modalApplyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Empty State - Updated (removed create button)
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginTop: 8,
  },
});