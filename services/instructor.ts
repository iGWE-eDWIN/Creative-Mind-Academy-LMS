import api from './api';

export const instructorService = {
  // Live Classes
  scheduleLiveClass: async (classData: {
    title: string;
    description?: string;
    courseId: string;
    scheduledAt: string;
    duration?: number; // in minutes
    meetingLink?: string;
  }) => {
    const response = await api.post('/liveClass', classData);
    return response.data;
  },
  updateLiveClass: async (liveClassId: string, classData: any) => {
    const response = await api.put(`/liveClass/${liveClassId}`, classData);
    return response.data;
  },
  startLiveClass: async (liveClassId: string) => {
    const response = await api.patch(`/liveClass/${liveClassId}/start`);
    return response.data;
  },
  endLiveClass: async (liveClassId: string) => {
    const response = await api.patch(`/liveClass/${liveClassId}/end`);
    return response.data;
  },
  deleteLiveClass: async (liveClassId: string) => {
    const response = await api.delete(`/liveClass/${liveClassId}`);
    return response.data;
  },
  getInstructorClasses: async () => {
    const response = await api.get('/liveClass/instructor');
    return response.data;
  },

  // Assignments
  createAssignment: async (assignmentData: {
    title: string;
    description: string;
    courseId: string;
    dueDate: string;
    points?: number;
    liveClassId?: string;
    instructions?: string;
    totalMarks?: number;
    passMark?: number;
  }) => {
    const response = await api.post('/assignment', assignmentData);
    return response.data;
  },
  updateAssignment: async (assignmentId: string, assignmentData: any) => {
    const response = await api.put(`/assignment/${assignmentId}`, assignmentData);
    return response.data;
  },
  publishAssignment: async (assignmentId: string) => {
    const response = await api.patch(`/assignment/${assignmentId}/publish`);
    return response.data;
  },
  closeAssignment: async (assignmentId: string) => {
    const response = await api.patch(`/assignment/${assignmentId}/close`);
    return response.data;
  },
  deleteAssignment: async (assignmentId: string) => {
    const response = await api.delete(`/assignment/${assignmentId}`);
    return response.data;
  },
  getAssignmentsByLiveClass: async (liveClassId: string) => {
    const response = await api.get(`/assignment/live-class/${liveClassId}`);
    return response.data;
  },

  // Assignment Submissions
  getSubmissionsForAssignment: async (assignmentId: string) => {
    const response = await api.get(`/submission/assignment/${assignmentId}`);
    return response.data;
  },
  gradeSubmission: async (submissionId: string, gradeData: {
    grade: string | number;
    feedback?: string;
  }) => {
    const response = await api.patch(`/submission/${submissionId}/grade`, gradeData);
    return response.data;
  },

  // Quizzes
  createQuiz: async (quizData: {
    title: string;
    description?: string;
    courseId: string;
    duration?: number; // in minutes
  }) => {
    const response = await api.post('/quiz', quizData);
    return response.data;
  },
  updateQuiz: async (quizId: string, quizData: any) => {
    const response = await api.put(`/quiz/${quizId}`, quizData);
    return response.data;
  },
  publishQuiz: async (quizId: string) => {
    const response = await api.patch(`/quiz/${quizId}/publish`);
    return response.data;
  },
  deleteQuiz: async (quizId: string) => {
    const response = await api.delete(`/quiz/${quizId}`);
    return response.data;
  },
  getQuizzesByCourse: async (courseId: string) => {
    const response = await api.get(`/quiz/course/${courseId}`);
    return response.data;
  },

  // Questions
  getQuestionsByQuiz: async (quizId: string) => {
    const response = await api.get(`/question/quiz/${quizId}`);
    return response.data;
  },
  createQuestion: async (questionData: {
    quizId: string;
    text: string;
    options: string[];
    correctAnswer: number; // index of correct option
    points?: number;
  }) => {
    const response = await api.post('/question', questionData);
    return response.data;
  },
  updateQuestion: async (questionId: string, questionData: any) => {
    const response = await api.put(`/question/${questionId}`, questionData);
    return response.data;
  },
  deleteQuestion: async (questionId: string) => {
    const response = await api.delete(`/question/${questionId}`);
    return response.data;
  },
};
export default instructorService;
