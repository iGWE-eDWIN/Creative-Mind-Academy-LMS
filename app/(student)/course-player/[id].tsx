import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../../services/api';

interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz';
  contentUrl: string;
  duration: number;
  description?: string;
  isCompleted?: boolean;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  modules: Module[];
  progress: number;
}

export default function CoursePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  useEffect(() => {
    fetchCourseContent();
  }, [id]);

  const fetchCourseContent = async () => {
    try {
      const response = await api.get(`/courses/${id}/content`);
      setCourse(response.data.course);
      // Find first incomplete lesson
      let firstIncompleteLesson: { moduleIndex: number; lessonIndex: number } | null = null;
      response.data.course.modules.forEach((module: Module, mIdx: number) => {
        module.lessons.forEach((lesson: Lesson, lIdx: number) => {
          if (!lesson.isCompleted && !firstIncompleteLesson) {
            firstIncompleteLesson = { moduleIndex: mIdx, lessonIndex: lIdx };
          }
        });
      });
      if (firstIncompleteLesson) {
        // setCurrentModuleIndex(firstIncompleteLesson.moduleIndex);
        // setCurrentLessonIndex(firstIncompleteLesson.lessonIndex);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      Alert.alert('Error', 'Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = course?.modules[currentModuleIndex]?.lessons[currentLessonIndex];
  const currentModule = course?.modules[currentModuleIndex];

  const markLessonComplete = async () => {
    if (!currentLesson || currentLesson.isCompleted || isAutoAdvancing) return;

    setIsAutoAdvancing(true);
    try {
      await api.post(`/courses/${id}/lessons/${currentLesson._id}/complete`);
      setCourse(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.modules[currentModuleIndex].lessons[currentLessonIndex].isCompleted = true;
        
        const totalLessons = updated.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const completedLessons = updated.modules.reduce(
          (acc, m) => acc + m.lessons.filter(l => l.isCompleted).length,
          0
        );
        updated.progress = (completedLessons / totalLessons) * 100;
        return updated;
      });
      
      setTimeout(() => {
        navigateNext();
        setIsAutoAdvancing(false);
      }, 500);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      setIsAutoAdvancing(false);
    }
  };

  const navigateNext = () => {
    if (currentLessonIndex + 1 < currentModule!.lessons.length) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex + 1 < course!.modules.length) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    } else {
      Alert.alert(
        'Congratulations! 🎉',
        'You have completed all lessons in this course!',
        [
          { 
            text: 'View Certificate', 
            onPress: () => router.push('/(student)/certificates') 
          },
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }
  };

  const navigatePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModuleLessons = course!.modules[currentModuleIndex - 1].lessons;
      setCurrentLessonIndex(prevModuleLessons.length - 1);
    }
  };

  const openExternalContent = async (url: string, type: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `Cannot open ${type}. Please check your internet connection.`);
    }
  };

  const renderContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <Ionicons name="play-circle-outline" size={80} color="#4F46E5" />
              <Text style={styles.placeholderTitle}>Video Lesson</Text>
              <Text style={styles.placeholderText}>{currentLesson.title}</Text>
              <TouchableOpacity
                onPress={() => openExternalContent(currentLesson.contentUrl, 'video')}
                style={styles.openButton}
              >
                <Ionicons name="open-outline" size={20} color="white" />
                <Text style={styles.openButtonText}>Watch Video</Text>
              </TouchableOpacity>
              <Text style={styles.noteText}>
                This video will open in your default player
              </Text>
            </View>
          </View>
        );

      case 'pdf':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <Ionicons name="document-text-outline" size={80} color="#4F46E5" />
              <Text style={styles.placeholderTitle}>PDF Document</Text>
              <Text style={styles.placeholderText}>{currentLesson.title}</Text>
              <TouchableOpacity
                onPress={() => openExternalContent(currentLesson.contentUrl, 'PDF')}
                style={styles.openButton}
              >
                <Ionicons name="open-outline" size={20} color="white" />
                <Text style={styles.openButtonText}>Open PDF</Text>
              </TouchableOpacity>
              <Text style={styles.noteText}>
                The PDF will open in your default browser
              </Text>
            </View>
          </View>
        );

      case 'quiz':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.quizCard}>
              <View style={styles.quizIconContainer}>
                <Ionicons name="help-circle" size={60} color="#4F46E5" />
              </View>
              <Text style={styles.quizTitle}>Ready to Test Your Knowledge?</Text>
              <Text style={styles.quizDescription}>
                This quiz will test your understanding of the material covered in this module.
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/(student)/quizzes/${currentLesson._id}`)}
                style={styles.quizButton}
              >
                <Ionicons name="play-circle" size={20} color="white" />
                <Text style={styles.quizButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <Ionicons name="document-text-outline" size={80} color="#4F46E5" />
              <Text style={styles.placeholderTitle}>Course Material</Text>
              <TouchableOpacity
                onPress={() => openExternalContent(currentLesson.contentUrl, 'content')}
                style={styles.openButton}
              >
                <Ionicons name="open-outline" size={20} color="white" />
                <Text style={styles.openButtonText}>Open Material</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!course || !currentLesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#D1D5DB" />
        <Text style={styles.errorText}>Course content not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentLesson?.title}
        </Text>
        
        <TouchableOpacity onPress={() => setShowSidebar(true)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${course?.progress || 0}%` }]} />
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={navigatePrevious}
          style={styles.navButtonPrev}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {currentLesson?.type === 'quiz' ? (
          <TouchableOpacity
            onPress={() => router.push(`/(student)/quizzes/${currentLesson._id}`)}
            style={styles.navButtonQuiz}
          >
            <Text style={styles.navButtonText}>Take Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={markLessonComplete}
            disabled={currentLesson?.isCompleted || isAutoAdvancing}
            style={[
              styles.navButtonNext,
              currentLesson?.isCompleted && styles.navButtonCompleted
            ]}
          >
            <Text style={styles.navButtonText}>
              {currentLesson?.isCompleted 
                ? '✓ Completed' 
                : isAutoAdvancing 
                ? 'Completing...' 
                : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sidebar Modal */}
      <Modal visible={showSidebar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarHeaderRow}>
                <Text style={styles.sidebarTitle} numberOfLines={1}>
                  {course?.title}
                </Text>
                <TouchableOpacity onPress={() => setShowSidebar(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.sidebarProgressContainer}>
                <View style={styles.sidebarProgressBar}>
                  <View style={[styles.sidebarProgressFill, { width: `${course?.progress || 0}%` }]} />
                </View>
                <Text style={styles.sidebarProgressText}>
                  {course?.progress.toFixed(0)}%
                </Text>
              </View>
            </View>

            <ScrollView style={styles.sidebarContent}>
              {course?.modules.map((module, mIdx) => {
                const moduleCompleted = module.lessons.every(l => l.isCompleted);
                const moduleProgress = (module.lessons.filter(l => l.isCompleted).length / module.lessons.length) * 100;
                
                return (
                  <View key={module._id} style={styles.moduleContainer}>
                    <View style={[styles.moduleHeader, moduleCompleted && styles.moduleHeaderCompleted]}>
                      <View style={styles.moduleHeaderTextContainer}>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text style={styles.moduleStats}>
                          {module.lessons.length} lessons • {moduleProgress.toFixed(0)}% complete
                        </Text>
                      </View>
                      {moduleCompleted && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                    </View>
                    
                    {module.lessons.map((lesson, lIdx) => (
                      <TouchableOpacity
                        key={lesson._id}
                        onPress={() => {
                          setCurrentModuleIndex(mIdx);
                          setCurrentLessonIndex(lIdx);
                          setShowSidebar(false);
                        }}
                        style={[
                          styles.lessonItem,
                          mIdx === currentModuleIndex && lIdx === currentLessonIndex && styles.lessonItemActive,
                          lesson.isCompleted && styles.lessonItemCompleted
                        ]}
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
                        <Text style={[styles.lessonTitle, lesson.isCompleted && styles.lessonTitleCompleted]}>
                          {lesson.title}
                        </Text>
                        {lesson.isCompleted && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
                        {!lesson.isCompleted && mIdx === currentModuleIndex && lIdx === currentLessonIndex && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Current</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity onPress={() => setShowSidebar(false)} style={styles.sidebarClose}>
              <Text style={styles.sidebarCloseText}>Close Menu</Text>
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1F2937',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 12,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: '#374151',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  openButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  openButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  quizIconContainer: {
    backgroundColor: '#EEF2FF',
    padding: 20,
    borderRadius: 60,
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1F2937',
  },
  quizDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  quizButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1F2937',
    gap: 12,
  },
  navButtonPrev: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  navButtonNext: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonCompleted: {
    backgroundColor: '#10B981',
  },
  navButtonQuiz: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: 'white',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidebarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  sidebarProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  sidebarProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sidebarProgressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  sidebarProgressText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  sidebarContent: {
    flex: 1,
  },
  moduleContainer: {
    marginBottom: 8,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  moduleHeaderCompleted: {
    backgroundColor: '#F0FDF4',
  },
  moduleHeaderTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1F2937',
  },
  moduleStats: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 24,
    backgroundColor: 'white',
    gap: 12,
  },
  lessonItemActive: {
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  lessonItemCompleted: {
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  lessonTitleCompleted: {
    color: '#10B981',
  },
  currentBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  sidebarClose: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  sidebarCloseText: {
    textAlign: 'center',
    color: '#4F46E5',
    fontWeight: '600',
  },
});