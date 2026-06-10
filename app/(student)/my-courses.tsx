import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';

interface EnrolledCourse {
  _id: string;
  title: string;
  thumbnail: string;
  instructor: { name: string };
  progress: number;
  lastAccessedAt: string;
  category: string;
}

export default function MyCoursesScreen() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/students/enrolled-courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEnrolledCourses();
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'in-progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'completed') return course.progress === 100;
    return true;
  });

  const CourseCard = ({ course }: { course: EnrolledCourse }) => (
    <TouchableOpacity
      // onPress={() => router.push(`/(student)/course-player/${course._id}`)}
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
      <Image source={{ uri: course.thumbnail }} style={{ height: 160, width: '100%' }} />
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
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            Last accessed: {new Date(course.lastAccessedAt).toLocaleDateString()}
          </Text>
        </View>
        
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{course.title}</Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{course.instructor.name}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              flex: 1,
              height: 6,
              backgroundColor: '#E5E7EB',
              borderRadius: 3,
              overflow: 'hidden',
              marginRight: 8,
            }}
          >
            <View
              style={{
                width: `${course.progress}%`,
                height: '100%',
                backgroundColor: course.progress === 100 ? '#10B981' : '#4F46E5',
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: course.progress === 100 ? '#10B981' : '#4F46E5',
            }}
          >
            {course.progress}%
          </Text>
        </View>

        {course.progress === 100 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
            }}
          >
            <Ionicons name="medal" size={16} color="#F59E0B" />
            <Text style={{ marginLeft: 6, fontSize: 12, color: '#F59E0B', fontWeight: '600' }}>
              Certificate Available
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Filter Tabs */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        {(['all', 'in-progress', 'completed'] as const).map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            onPress={() => setFilter(filterOption)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: filter === filterOption ? 2 : 0,
              borderBottomColor: '#4F46E5',
            }}
          >
            <Text
              style={{
                color: filter === filterOption ? '#4F46E5' : '#6B7280',
                fontWeight: filter === filterOption ? '600' : '400',
                textTransform: 'capitalize',
              }}
            >
              {filterOption === 'in-progress' ? 'In Progress' : filterOption}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => <CourseCard course={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="book-outline" size={60} color="#D1D5DB" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280' }}>
              {filter === 'all'
                ? "You haven't enrolled in any courses yet"
                : filter === 'in-progress'
                ? 'No courses in progress'
                : 'No completed courses yet'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(student)/courses')}
              style={{
                marginTop: 16,
                backgroundColor: '#4F46E5',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}