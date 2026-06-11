import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../../services/api';

interface Question {
  _id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit?: number;
  questions: Question[];
  passingScore: number;
  attemptsAllowed: number;
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // if (quizStarted && timeRemaining !== null && timeRemaining > 0) {
    //   timer = setInterval(() => {
    //     setTimeRemaining(prev => {
    //       if (prev && prev <= 1) {
    //         clearInterval(timer);
    //         handleSubmit();
    //         return 0;
    //       }
    //       return prev ? prev - 1 : null;
    //     });
    //   }, 1000);
    // }
    // return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      Alert.alert('Error', 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = quiz?.questions.filter(q => !answers[q._id]);
    if (unanswered && unanswered.length > 0) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${unanswered.length} unanswered question(s). Do you still want to submit?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: submitQuiz },
        ]
      );
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const response = await api.post(`/quizzes/${id}/submit`, { answers });
    //   router.push(`/(student)/quizzes/result/${id}?score=${response.data.score}&total=${response.data.total}&passed=${response.data.passed}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <View style={{ gap: 12 }}>
            {currentQuestion.options?.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleAnswer(currentQuestion._id, option)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: answers[currentQuestion._id] === option ? '#EEF2FF' : 'white',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: answers[currentQuestion._id] === option ? '#4F46E5' : '#E5E7EB',
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: answers[currentQuestion._id] === option ? '#4F46E5' : '#D1D5DB',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {answers[currentQuestion._id] === option && (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4F46E5' }} />
                  )}
                </View>
                <Text style={{ flex: 1, fontSize: 16 }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'true-false':
        return (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['True', 'False'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => handleAnswer(currentQuestion._id, option)}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: answers[currentQuestion._id] === option ? '#EEF2FF' : 'white',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: answers[currentQuestion._id] === option ? '#4F46E5' : '#E5E7EB',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: answers[currentQuestion._id] === option ? '#4F46E5' : '#374151',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'essay':
        return (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 12,
              fontSize: 16,
              minHeight: 150,
              textAlignVertical: 'top',
            }}
            placeholder="Type your answer here..."
            multiline
            value={answers[currentQuestion._id] || ''}
            onChangeText={text => handleAnswer(currentQuestion._id, text)}
          />
        );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  if (!quizStarted) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>{quiz.title}</Text>
          <Text style={{ fontSize: 16, color: '#4B5563', marginBottom: 24 }}>{quiz.description}</Text>

          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Quiz Information</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: '#6B7280' }}>Questions:</Text>
              <Text style={{ fontWeight: '600' }}>{quiz.questions.length}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: '#6B7280' }}>Total Points:</Text>
              <Text style={{ fontWeight: '600' }}>
                {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: '#6B7280' }}>Passing Score:</Text>
              <Text style={{ fontWeight: '600' }}>{quiz.passingScore}%</Text>
            </View>
            {quiz.timeLimit && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280' }}>Time Limit:</Text>
                <Text style={{ fontWeight: '600' }}>{quiz.timeLimit} minutes</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={startQuiz}
            style={{
              backgroundColor: '#4F46E5',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#4F46E5',
          padding: 16,
          paddingTop: 48,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
          {timeRemaining !== null && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={20} color="white" />
              <Text style={{ color: 'white', marginLeft: 4 }}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
            marginTop: 16,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              height: '100%',
              backgroundColor: 'white',
            }}
          />
        </View>
      </View>

      {/* Question */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }}>
            {currentQuestion?.text}
          </Text>
          {renderQuestion()}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          gap: 12,
        }}
      >
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#4F46E5',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#4F46E5', fontWeight: '600' }}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            style={{
              flex: 1,
              backgroundColor: '#4F46E5',
              padding: 14,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              backgroundColor: '#10B981',
              padding: 14,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}