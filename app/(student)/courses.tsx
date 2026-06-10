import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructor: { name: string };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [searchQuery, selectedCategory]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses', {
        params: {
          search: searchQuery,
          category: selectedCategory,
        },
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/courses/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEnroll = async (courseId: string, price: number) => {
    if (price > 0) {
      // router.push(`/(student)/checkout/${courseId}`);
    } else {
      try {
        await api.post(`/courses/${courseId}/enroll`);
        router.push('/(student)/my-courses');
      } catch (error) {
        console.error('Enrollment error:', error);
      }
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <TouchableOpacity
      // onPress={() => router.push(`/(student)/course-details/${course._id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
      }}
    >
      <Image source={{ uri: course.thumbnail }} style={{ height: 180, width: '100%' }} />
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: '#EEF2FF',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, color: '#4F46E5' }}>{course.category}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, color: '#6B7280' }}>{course.level}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{course.title}</Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
          {course.instructor.name}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>{course.duration}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4F46E5' }}>
            ₦{course.price.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleEnroll(course._id, course.price)}
          style={{
            backgroundColor: '#4F46E5',
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {course.price > 0 ? 'Enroll Now' : 'Start Free'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Search Bar */}
      <View
        style={{
          padding: 16,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={{ flex: 1, paddingVertical: 12, marginLeft: 8, fontSize: 16 }}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <Ionicons name="options-outline" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Filter Courses</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Category</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(item === selectedCategory ? '' : item);
                    setShowFilters(false);
                  }}
                  style={{
                    backgroundColor: selectedCategory === item ? '#4F46E5' : '#F3F4F6',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: selectedCategory === item ? 'white' : '#374151',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={{
                backgroundColor: '#4F46E5',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Course List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCard course={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}