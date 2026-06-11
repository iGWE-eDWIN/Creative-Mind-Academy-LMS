import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';

const { width } = Dimensions.get('window');

interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  duration: number;
  type: 'video' | 'pdf' | 'quiz';
  isCompleted?: boolean;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  studentsEnrolled: number;
  rating: number;
  totalRatings: number;
  instructor: Instructor;
  modules: Module[];
  whatYouWillLearn: string[];
  requirements: string[];
  isEnrolled?: boolean;
  progress?: number;
}

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to enroll in this course', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }

    setEnrolling(true);
    try {
      if (course!.price > 0) {
        // Navigate to payment
        // router.push(`/(student)/checkout/${course!._id}`);
      } else {
        // Free enrollment
        await api.post(`/courses/${course!._id}/enroll`);
        Alert.alert('Success', 'You have successfully enrolled in this course!');
        fetchCourseDetails(); // Refresh to show enrolled status
      }
    } catch (error: any) {
      Alert.alert('Enrollment Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinueLearning = () => {
    // router.push(`/(student)/course-player/${course!._id}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this course: ${course?.title} on Creative Mind Academy`,
        url: `https://creativemindacademy.com/course/${course?._id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View>
        <Image source={{ uri: course.thumbnail }} style={{ width: width, height: 220 }} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{course.title}</Text>
        </LinearGradient>
        <TouchableOpacity
          onPress={handleShare}
          style={{
            position: 'absolute',
            top: 50,
            right: 16,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 8,
          }}
        >
          <Ionicons name="share-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Course Info */}
      <View style={{ padding: 16 }}>
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text style={{ marginLeft: 4, fontSize: 14, color: '#6B7280' }}>
              {course.studentsEnrolled} students
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={{ marginLeft: 4, fontSize: 14, color: '#6B7280' }}>
              {course.rating} ({course.totalRatings} ratings)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={{ marginLeft: 4, fontSize: 14, color: '#6B7280' }}>{course.duration}</Text>
          </View>
        </View>

        {/* Price and Enrollment Button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#4F46E5' }}>
            ₦{course.price.toLocaleString()}
          </Text>
          {course.isEnrolled ? (
            <TouchableOpacity
              onPress={handleContinueLearning}
              style={{
                backgroundColor: '#10B981',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Continue Learning</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleEnroll}
              disabled={enrolling}
              style={{
                backgroundColor: '#4F46E5',
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {enrolling ? 'Processing...' : course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 16 }}>
          {(['overview', 'curriculum', 'reviews'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: activeTab === tab ? 2 : 0,
                borderBottomColor: '#4F46E5',
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? '#4F46E5' : '#6B7280',
                  fontWeight: activeTab === tab ? '600' : '400',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View>
            {/* Description */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Course Description</Text>
              <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{course.description}</Text>
            </View>

            {/* What You'll Learn */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>What You'll Learn</Text>
              {course.whatYouWillLearn.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={{ marginLeft: 8, fontSize: 14, color: '#4B5563', flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Requirements */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Requirements</Text>
              {course.requirements.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
                  <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                  <Text style={{ marginLeft: 8, fontSize: 14, color: '#4B5563', flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Instructor */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Instructor</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: course.instructor.profilePicture || 'https://via.placeholder.com/60' }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{course.instructor.name}</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>{course.instructor.bio}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'curriculum' && (
          <View>
            {course.modules.map((module, index) => (
              <View key={module._id} style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>
                    Module {index + 1}: {module.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>{module.lessons.length} lessons</Text>
                </View>
                {module.lessons.map((lesson, lessonIndex) => (
                  <View
                    key={lesson._id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingLeft: 16,
                      borderLeftWidth: 2,
                      borderLeftColor: lesson.isCompleted ? '#10B981' : '#E5E7EB',
                    }}
                  >
                    <Ionicons
                      name={
                        lesson.type === 'video'
                          ? 'play-circle'
                          : lesson.type === 'pdf'
                          ? 'document-text'
                          : 'help-circle'
                      }
                      size={20}
                      color={lesson.isCompleted ? '#10B981' : '#6B7280'}
                    />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 8,
                        fontSize: 14,
                        color: lesson.isCompleted ? '#10B981' : '#374151',
                      }}
                    >
                      {lesson.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>{lesson.duration} min</Text>
                    {lesson.isCompleted && (
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginLeft: 8 }} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View>
            <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 40 }}>
              Reviews feature coming soon
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}