// EditCourse.tsx - With Fixed Keyboard Handling for Modal

import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const PRIMARY_DARK = '#0B2045';
const ACCENT_BLUE = '#0B2045';
const BG = '#F5F6FA';
const GRAY_TEXT = '#6B7280';

// Match backend enum values
const CATEGORIES = [
  { label: 'Technology', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Design', value: 'design' },
  { label: 'Entrepreneurship', value: 'entrepreneurship' },
  { label: 'Soft Skills', value: 'soft-skills' },
  { label: 'Other', value: 'other' },
];

const LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  avatarUrl?: string;
}

interface CourseData {
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
  level: string;
  language: string;
  duration: number;
  tags: string[];
  prerequisites?: string;
  learningOutcomes?: string[];
  targetAudience?: string;
  status: 'draft' | 'published' | 'archived';
  assignedInstructor?: Instructor;
}

export default function EditCourse() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  
  // Instructor Selection Modal
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
  const [searchInstructor, setSearchInstructor] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    price: '',
    category: 'technology',
    thumbnail: '',
    coverImage: '',
    duration: '',
    level: 'beginner',
    language: 'en',
    tags: '',
    prerequisites: '',
    assignedInstructor: '',
    isFree: false,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchCourseData = useCallback(async () => {
    try {
      const [courseData, instructorsData] = await Promise.all([
        adminService.getCourse(id),
        adminService.getInstructors(),
      ]);

      const course = courseData.data || courseData;
      const instructorsList = instructorsData.data || instructorsData.instructors || [];

      setInstructors(instructorsList);
      
      setForm({
        title: course.title || '',
        description: course.description || '',
        detailedDescription: course.detailedDescription || '',
        price: course.price?.toString() || '',
        category: course.category || 'technology',
        thumbnail: course.thumbnail || '',
        coverImage: course.coverImage || '',
        duration: course.duration?.toString() || '',
        level: course.level || 'beginner',
        language: course.language || 'en',
        tags: course.tags?.join(', ') || '',
        prerequisites: course.prerequisites || '',
        assignedInstructor: course.assignedInstructor?._id || '',
        isFree: course.isFree || course.price === 0,
      });

      setSelectedInstructorId(course.assignedInstructor?._id || '');

      if (course.thumbnail) {
        setSelectedImage(course.thumbnail);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching course:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load course data');
      router.back();
    }
  }, [id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const base64Image = `data:image/jpeg;base64,${asset.base64}`;
        setSelectedImage(asset.uri);
        setForm({ ...form, thumbnail: base64Image });
      } else {
        setSelectedImage(asset.uri);
        setForm({ ...form, thumbnail: asset.uri });
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.price || !form.duration) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid positive number for price.');
      return;
    }

    const durationNum = parseFloat(form.duration);
    if (isNaN(durationNum) || durationNum < 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid positive number for duration.');
      return;
    }

    setSaving(true);
    try {
      const courseData = {
        title: form.title.trim(),
        description: form.description.trim(),
        detailedDescription: form.detailedDescription?.trim() || undefined,
        price: priceNum,
        category: form.category,
        thumbnail: form.thumbnail || undefined,
        coverImage: form.coverImage || undefined,
        duration: durationNum,
        level: form.level,
        language: form.language || 'en',
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        prerequisites: form.prerequisites?.trim() || undefined,
        assignedInstructor: form.assignedInstructor || undefined,
        isFree: priceNum === 0,
      };

      await adminService.updateCourse(id, courseData);

      Alert.alert('Success', 'Course updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error updating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.entries(errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join('\n');
        Alert.alert('Validation Error', errorList);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getSelectedInstructorName = () => {
    if (!form.assignedInstructor) return 'None';
    const instructor = instructors.find(i => i._id === form.assignedInstructor);
    return instructor?.name || 'None';
  };

  const filteredInstructors = instructors.filter(inst => 
    inst.name.toLowerCase().includes(searchInstructor.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchInstructor.toLowerCase())
  );

  // Render Instructor Selection Modal with proper keyboard handling
  const renderInstructorModal = () => (
    <Modal
      visible={showInstructorModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowInstructorModal(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Instructor</Text>
                <TouchableOpacity onPress={() => {
                  setShowInstructorModal(false);
                  Keyboard.dismiss();
                }}>
                  <Ionicons name="close" size={24} color={PRIMARY_DARK} />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.modalSearchBar}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search instructors..."
                  placeholderTextColor="#9CA3AF"
                  value={searchInstructor}
                  onChangeText={setSearchInstructor}
                  autoFocus={false}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <FlatList
                data={filteredInstructors}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalInstructorItem,
                      form.assignedInstructor === item._id && styles.modalInstructorItemSelected,
                    ]}
                    onPress={() => {
                      setForm({ ...form, assignedInstructor: item._id });
                      setSelectedInstructorId(item._id);
                      setShowInstructorModal(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <View style={styles.modalInstructorAvatar}>
                      <Text style={styles.modalInstructorAvatarText}>
                        {getInitials(item.name)}
                      </Text>
                    </View>
                    <View style={styles.modalInstructorInfo}>
                      <Text style={styles.modalInstructorName}>{item.name}</Text>
                      <Text style={styles.modalInstructorEmail}>{item.email}</Text>
                    </View>
                    {form.assignedInstructor === item._id && (
                      <Ionicons name="checkmark-circle" size={24} color={ACCENT_BLUE} />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.modalEmptyContainer}>
                    <Ionicons name="people-outline" size={40} color="#9CA3AF" />
                    <Text style={styles.modalEmptyText}>No instructors found</Text>
                  </View>
                }
                contentContainerStyle={styles.modalListContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              />
            </View>
          </KeyboardAvoidingView>
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(admin)/courses')}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Course</Text>
          
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.screenTitle}>Course Information</Text>
            <Text style={styles.screenSubtitle}>Update your course details</Text>

            {/* Thumbnail Image Upload */}
            <Text style={styles.label}>Course Thumbnail</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.thumbnailPreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.imagePlaceholderText}>Tap to upload image</Text>
                  <Text style={styles.imagePlaceholderSubtext}>Recommended: 16:9 ratio</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Course Title */}
            <Text style={styles.label}>Course Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mastering React Native"
              placeholderTextColor="#9CA3AF"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />

            {/* Course Description */}
            <Text style={styles.label}>Short Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description of the course (max 500 chars)..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={500}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />

            {/* Detailed Description */}
            <Text style={styles.label}>Detailed Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full detailed description of the course..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={form.detailedDescription}
              onChangeText={(text) => setForm({ ...form, detailedDescription: text })}
            />

            <View style={styles.row}>
              {/* Price */}
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Price (₦) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 25000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                />
              </View>

              {/* Duration */}
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Duration (hours) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 32"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={form.duration}
                  onChangeText={(text) => setForm({ ...form, duration: text })}
                />
              </View>
            </View>

            {/* Category Selection */}
            <Text style={styles.label}>Category *</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setForm({ ...form, category: cat.value })}
                  style={[styles.chip, form.category === cat.value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, form.category === cat.value && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Level Selection */}
            <Text style={styles.label}>Level *</Text>
            <View style={styles.chipRow}>
              {LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl.value}
                  onPress={() => setForm({ ...form, level: lvl.value })}
                  style={[styles.chip, form.level === lvl.value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, form.level === lvl.value && styles.chipTextActive]}>
                    {lvl.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Instructor Assignment - Updated with Modal */}
            <Text style={styles.label}>Assign Instructor</Text>
            <TouchableOpacity
              style={styles.instructorSelector}
              onPress={() => setShowInstructorModal(true)}
            >
              <View style={styles.instructorSelectorLeft}>
                {form.assignedInstructor ? (
                  <>
                    <View style={styles.instructorSelectorAvatar}>
                      <Text style={styles.instructorSelectorAvatarText}>
                        {getInitials(getSelectedInstructorName())}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.instructorSelectorName}>
                        {getSelectedInstructorName()}
                      </Text>
                      <Text style={styles.instructorSelectorSubtext}>
                        Instructor
                      </Text>
                    </View>
                  </>
                ) : (
                  <View>
                    <Text style={styles.instructorSelectorPlaceholder}>
                      Tap to select an instructor
                    </Text>
                    <Text style={styles.instructorSelectorSubtext}>
                      No instructor assigned
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={GRAY_TEXT} />
            </TouchableOpacity>

            {/* Language */}
            <Text style={styles.label}>Language</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. English"
              placeholderTextColor="#9CA3AF"
              value={form.language}
              onChangeText={(text) => setForm({ ...form, language: text })}
            />

            {/* Tags */}
            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. React, Mobile, JavaScript"
              placeholderTextColor="#9CA3AF"
              value={form.tags}
              onChangeText={(text) => setForm({ ...form, tags: text })}
            />

            {/* Prerequisites */}
            <Text style={styles.label}>Prerequisites</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List any prerequisites for this course..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={form.prerequisites}
              onChangeText={(text) => setForm({ ...form, prerequisites: text })}
            />

            {/* Cover Image URL (optional) */}
            <Text style={styles.label}>Cover Image URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/cover.jpg"
              placeholderTextColor="#9CA3AF"
              value={form.coverImage}
              onChangeText={(text) => setForm({ ...form, coverImage: text })}
            />

            {/* Save Button at Bottom */}
            <TouchableOpacity
              style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Update Course</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Instructor Selection Modal */}
      {renderInstructorModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_DARK,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
  },

  // Fixed Header
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: ACCENT_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Scrollable Content
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },
  screenSubtitle: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginTop: 4,
    marginBottom: 24,
  },

  // Form Elements
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: PRIMARY_DARK,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Image Upload
  imageUpload: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  imagePlaceholderSubtext: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 4,
  },
  thumbnailPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Instructor Selector (Updated)
  instructorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  instructorSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructorSelectorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorSelectorAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  instructorSelectorName: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  instructorSelectorPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  instructorSelectorSubtext: {
    fontSize: 11,
    color: GRAY_TEXT,
    marginTop: 1,
  },

  // Submit Button
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 32,
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal Styles - Fixed
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: PRIMARY_DARK,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  modalListContent: {
    paddingBottom: 20,
  },
  modalInstructorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 8,
  },
  modalInstructorItemSelected: {
    borderColor: ACCENT_BLUE,
    backgroundColor: '#EBF4FF',
  },
  modalInstructorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalInstructorAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalInstructorInfo: {
    flex: 1,
  },
  modalInstructorName: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  modalInstructorEmail: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginTop: 2,
  },
  modalEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  modalEmptyText: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginTop: 8,
  },
});