// CreateCourse.tsx - Matches Edit Course UI

import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

export default function CreateCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    setLoading(true);
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
        isFree: priceNum === 0,
      };

      await adminService.createCourse(courseData);

      Alert.alert('Success', 'Course created successfully as draft', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      
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
      setLoading(false);
    }
  };

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
          <Text style={styles.headerTitle}>Create Course</Text>
        
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.screenTitle}>Course Information</Text>
            <Text style={styles.screenSubtitle}>Enter the course details to add it to the catalog</Text>

            {/* Thumbnail Image Upload */}
            <Text style={styles.label}>Course Thumbnail</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage} disabled={uploadingImage}>
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

            {/* Create Button at Bottom */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Create Course</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  createBtn: {
    backgroundColor: ACCENT_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnDisabled: {
    opacity: 0.5,
  },
  createBtnText: {
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
});