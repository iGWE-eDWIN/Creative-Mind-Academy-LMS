import { adminService } from '@/services/admin';
import { instructorService } from '@/services/instructor';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

interface Course {
  _id: string;
  title: string;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  courseId: {
    _id: string;
    title: string;
  } | null;
  duration?: number;
  status: 'draft' | 'published';
  questionsCount?: number;
}

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export default function InstructorQuizzes() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Create Quiz Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '30',
  });

  // Manage Questions Modal State
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Add Question Form State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '0', // 0: A, 1: B, 2: C, 3: D
    points: '10',
  });

  const fetchData = useCallback(async () => {
    try {
      // Get instructor's assigned courses
      const allCoursesRes = await adminService.getCourses();
      const allCourses: any[] = allCoursesRes.courses || allCoursesRes;
      const assigned = allCourses.filter(
        (c) => c.instructor?._id === user?.id || c.instructor === user?.id
      );
      setCourses(assigned);

      if (assigned.length > 0) {
        setQuizForm((prev) => ({ ...prev, courseId: assigned[0]._id }));
      }

      // Fetch quizzes for assigned courses
      const allQuizzes: Quiz[] = [];
      for (const course of assigned) {
        try {
          const res = await instructorService.getQuizzesByCourse(course._id);
          const courseQuizzes: Quiz[] = res.data || res;
          allQuizzes.push(...courseQuizzes);
        } catch (err) {
          console.error(`Error loading quizzes for course ${course._id}:`, err);
        }
      }
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      Alert.alert('Error', 'Failed to load quiz data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCreateQuiz = async () => {
    if (!quizForm.title || !quizForm.courseId) {
      Alert.alert('Incomplete Form', 'Please enter Title and select a Course.');
      return;
    }

    try {
      await instructorService.createQuiz({
        title: quizForm.title,
        description: quizForm.description || undefined,
        courseId: quizForm.courseId,
        duration: parseInt(quizForm.duration) || 30,
      });

      Alert.alert('Success', 'Quiz created successfully as draft!');
      setShowCreateModal(false);
      setQuizForm({
        title: '',
        description: '',
        courseId: courses[0]?._id || '',
        duration: '30',
      });
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handlePublishQuiz = async (quizId: string) => {
    try {
      await instructorService.publishQuiz(quizId);
      Alert.alert('Success', 'Quiz published successfully!');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to publish quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string, title: string) => {
    Alert.alert(
      'Delete Quiz',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await instructorService.deleteQuiz(quizId);
              Alert.alert('Success', 'Quiz deleted successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete quiz');
            }
          },
        },
      ]
    );
  };

  const openQuestions = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestionsModal(true);
    setLoadingQuestions(true);
    try {
      const res = await instructorService.getQuestionsByQuiz(quiz._id);
      setQuestions(res.data || res);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAddQuestion = async () => {
    const { text, optionA, optionB, optionC, optionD, correctAnswer, points } = questionForm;
    if (!text || !optionA || !optionB || !optionC || !optionD) {
      Alert.alert('Incomplete Form', 'Please enter Question Text and all 4 options.');
      return;
    }

    if (!selectedQuiz) return;

    try {
      await instructorService.createQuestion({
        quizId: selectedQuiz._id,
        text,
        options: [optionA, optionB, optionC, optionD],
        correctAnswer: parseInt(correctAnswer),
        points: parseInt(points) || 10,
      });

      Alert.alert('Success', 'Question added successfully!');
      setShowAddQuestion(false);
      setQuestionForm({
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '0',
        points: '10',
      });
      openQuestions(selectedQuiz);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await instructorService.deleteQuestion(questionId);
              Alert.alert('Success', 'Question deleted successfully');
              if (selectedQuiz) {
                openQuestions(selectedQuiz);
              }
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.infoCol}>
          <Text style={styles.classTitle}>{item.title}</Text>
          <Text style={styles.courseTitle}>Course: {item.courseId?.title || 'Unknown'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'published' ? '#22C55E15' : '#6B728015' }]}>
          <Text style={[styles.statusText, { color: item.status === 'published' ? '#22C55E' : '#6B7280' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.descText}>{item.description || 'No description provided'}</Text>
      <Text style={styles.quizMeta}>Duration: {item.duration || 30} mins</Text>

      <View style={styles.cardDivider} />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openQuestions(item)}>
          <Ionicons name="help-circle-outline" size={16} color="#1A6FD4" />
          <Text style={[styles.btnText, { color: '#1A6FD4' }]}>Questions</Text>
        </TouchableOpacity>

        {item.status !== 'published' && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => handlePublishQuiz(item._id)}>
            <Ionicons name="cloud-upload-outline" size={16} color="#22C55E" />
            <Text style={[styles.btnText, { color: '#22C55E' }]}>Publish</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteQuiz(item._id, item.title)}>
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={[styles.btnText, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <Text style={styles.listHeading}>Your Quizzes</Text>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => setShowCreateModal(true)}
          disabled={courses.length === 0}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A6FD4" />
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id}
          renderItem={renderQuizItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="help-circle-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No quizzes found</Text>
            </View>
          }
        />
      )}

      {/* Create Quiz Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Quiz</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Quiz Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Photoshop Tools Basics"
                value={quizForm.title}
                onChangeText={(text) => setQuizForm({ ...quizForm, title: text })}
              />

              <Text style={styles.label}>Course *</Text>
              <View style={styles.pickerContainer}>
                {courses.map((c) => (
                  <TouchableOpacity
                    key={c._id}
                    style={[styles.pickerItem, quizForm.courseId === c._id && styles.pickerItemActive]}
                    onPress={() => setQuizForm({ ...quizForm, courseId: c._id })}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        quizForm.courseId === c._id && styles.pickerItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 30"
                keyboardType="numeric"
                value={quizForm.duration}
                onChangeText={(text) => setQuizForm({ ...quizForm, duration: text })}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explain what the quiz covers..."
                multiline
                numberOfLines={3}
                value={quizForm.description}
                onChangeText={(text) => setQuizForm({ ...quizForm, description: text })}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateQuiz}>
                <Text style={styles.submitBtnText}>Create Quiz</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Questions List Modal */}
      <Modal visible={showQuestionsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                Questions: {selectedQuiz?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowQuestionsModal(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.scheduleBtn, { marginBottom: 12, alignSelf: 'flex-start' }]}
              onPress={() => setShowAddQuestion(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.scheduleBtnText}>Add Question</Text>
            </TouchableOpacity>

            {loadingQuestions ? (
              <ActivityIndicator size="large" color="#1A6FD4" style={{ marginVertical: 32 }} />
            ) : (
              <FlatList
                data={questions}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                renderItem={({ item, index }) => (
                  <View style={styles.questionCard}>
                    <View style={styles.questionCardHeader}>
                      <Text style={styles.questionIndex}>Q{index + 1}.</Text>
                      <Text style={styles.questionPoints}>{item.points} pts</Text>
                    </View>
                    <Text style={styles.questionText}>{item.text}</Text>

                    <View style={styles.optionsList}>
                      {item.options.map((opt, i) => (
                        <View key={i} style={[styles.optionItem, item.correctAnswer === i && styles.optionItemCorrect]}>
                          <Text style={[styles.optionText, item.correctAnswer === i && styles.optionTextCorrect]}>
                            {String.fromCharCode(65 + i)}. {opt}
                          </Text>
                          {item.correctAnswer === i && (
                            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                          )}
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.deleteQuestionBtn}
                      onPress={() => handleDeleteQuestion(item._id)}
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                      <Text style={styles.deleteQuestionBtnText}>Remove Question</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptySubText}>No questions added to this quiz yet.</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Add Question Modal */}
      <Modal visible={showAddQuestion} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Question</Text>
                <TouchableOpacity onPress={() => setShowAddQuestion(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Question Text *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Type question here..."
                multiline
                numberOfLines={3}
                value={questionForm.text}
                onChangeText={(text) => setQuestionForm({ ...questionForm, text })}
              />

              <Text style={styles.label}>Option A *</Text>
              <TextInput
                style={styles.input}
                placeholder="Option A text"
                value={questionForm.optionA}
                onChangeText={(text) => setQuestionForm({ ...questionForm, optionA: text })}
              />

              <Text style={styles.label}>Option B *</Text>
              <TextInput
                style={styles.input}
                placeholder="Option B text"
                value={questionForm.optionB}
                onChangeText={(text) => setQuestionForm({ ...questionForm, optionB: text })}
              />

              <Text style={styles.label}>Option C *</Text>
              <TextInput
                style={styles.input}
                placeholder="Option C text"
                value={questionForm.optionC}
                onChangeText={(text) => setQuestionForm({ ...questionForm, optionC: text })}
              />

              <Text style={styles.label}>Option D *</Text>
              <TextInput
                style={styles.input}
                placeholder="Option D text"
                value={questionForm.optionD}
                onChangeText={(text) => setQuestionForm({ ...questionForm, optionD: text })}
              />

              <Text style={styles.label}>Correct Option *</Text>
              <View style={styles.pickerContainer}>
                {['A', 'B', 'C', 'D'].map((opt, idx) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.pickerItem,
                      questionForm.correctAnswer === idx.toString() && styles.pickerItemActive,
                    ]}
                    onPress={() =>
                      setQuestionForm({ ...questionForm, correctAnswer: idx.toString() })
                    }
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        questionForm.correctAnswer === idx.toString() && styles.pickerItemTextActive,
                      ]}
                    >
                      Option {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Points</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={questionForm.points}
                onChangeText={(text) => setQuestionForm({ ...questionForm, points: text })}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddQuestion}>
                <Text style={styles.submitBtnText}>Add Question</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  listHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A6FD4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
    marginRight: 8,
  },
  classTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  courseTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  descText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 10,
  },
  quizMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerItemActive: {
    backgroundColor: '#1A6FD4',
    borderColor: '#1A6FD4',
  },
  pickerItemText: {
    fontSize: 12,
    color: '#374151',
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#1A6FD4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 32,
  },
  questionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  questionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionIndex: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A6FD4',
  },
  questionPoints: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionItemCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 13,
    color: '#374151',
  },
  optionTextCorrect: {
    color: '#22C55E',
    fontWeight: '600',
  },
  deleteQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  deleteQuestionBtnText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
});
