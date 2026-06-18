import api from './api';

// ==================== COURSES ====================

export const getCourses = async () => {
  const response = await api.get('/course');
  return response.data;
};

export const getCourse = async (courseId: string) => {
  const response = await api.get(`/course/${courseId}`);
  return response.data;
};

// ==================== ENROLLMENTS ====================

export const getMyEnrollments = async () => {
  const response = await api.get('/enrollments/my-courses');
  return response.data;
};

export const getEnrollment = async (enrollmentId: string) => {
  const response = await api.get(`/enrollments/${enrollmentId}`);
  return response.data;
};

// ==================== WALLET ====================

export const getWallet = async () => {
  const response = await api.get('/wallet');
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data;
};

export const fundWallet = async (amount: number, redirectUrl: string) => {
  const response = await api.post('/wallet/fund', { amount, redirectUrl });
  return response.data;
};

// ==================== PAYMENTS ====================

export const purchaseCourse = async (courseId: string, paymentMethod: 'wallet' | 'paystack', redirectUrl: string) => {
  const response = await api.post('/payment/initialize', { courseId, paymentMethod, redirectUrl });
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get('/payment/history');
  return response.data;
};

// ==================== CERTIFICATES ====================

export const getMyCertificates = async () => {
  const response = await api.get('/certificate/my-certificates');
  return response.data;
};

export const getCertificate = async (certificateId: string) => {
  const response = await api.get(`/certificate/${certificateId}`);
  return response.data;
};

export const verifyCertificate = async (verificationCode: string) => {
  const response = await api.get(`/certificate/verify/${verificationCode}`);
  return response.data;
};

// ==================== NOTIFICATIONS ====================

export const getNotifications = async () => {
  const response = await api.get('/notification');
  return response.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const response = await api.patch(`/notification/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/notification/read-all');
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await api.delete(`/notification/${notificationId}`);
  return response.data;
};

// ==================== CONVERSATIONS ====================

export const getConversations = async () => {
  const response = await api.get('/conversation');
  return response.data;
};

export const getConversation = async (conversationId: string) => {
  const response = await api.get(`/conversation/${conversationId}`);
  return response.data;
};

export const createConversation = async (participantId: string) => {
  const response = await api.post('/conversation/', { participantId });
  return response.data;
};

export const archiveConversation = async (conversationId: string) => {
  const response = await api.patch(`/conversation/${conversationId}/archive`);
  return response.data;
};

// ==================== MESSAGES ====================

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/message/conversation/${conversationId}`);
  return response.data;
};

export const sendMessage = async (conversationId: string, messageText: string, messageType?: string, replyTo?: string) => {
  const response = await api.post('/message/', { conversationId, messageText, messageType, replyTo });
  return response.data;
};

export const markMessageRead = async (messageId: string) => {
  const response = await api.patch(`/message/${messageId}/read`);
  return response.data;
};

export const reactToMessage = async (messageId: string, emoji: string) => {
  const response = await api.patch(`/message/${messageId}/react`, { emoji });
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/message/${messageId}`);
  return response.data;
};

// ==================== LIVE CLASSES ====================

export const getCourseLiveClasses = async (courseId: string) => {
  const response = await api.get(`/liveClass/course/${courseId}`);
  return response.data;
};

export const getLiveClass = async (liveClassId: string) => {
  const response = await api.get(`/liveClass/${liveClassId}`);
  return response.data;
};

// ==================== QUIZZES ====================

export const getCourseQuizzes = async (courseId: string) => {
  const response = await api.get(`/quiz/course/${courseId}`);
  return response.data;
};

export const getQuiz = async (quizId: string) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: any[]) => {
  const response = await api.post(`/quiz/${quizId}/submit`, { answers });
  return response.data;
};

export const getQuizResult = async (attemptId: string) => {
  const response = await api.get(`/quiz/attempt/${attemptId}/result`);
  return response.data;
};

// ==================== ASSIGNMENTS ====================

export const getLiveClassAssignments = async (liveClassId: string) => {
  const response = await api.get(`/assignment/live-class/${liveClassId}`);
  return response.data;
};

export const getAssignment = async (assignmentId: string) => {
  const response = await api.get(`/assignment/${assignmentId}`);
  return response.data;
};

// ==================== SUBMISSIONS ====================

export const submitAssignment = async (assignmentId: string, content: string) => {
  const response = await api.post(`/submission/${assignmentId}`, { content });
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get('/submission/my-submissions');
  return response.data;
};

export const getSubmission = async (submissionId: string) => {
  const response = await api.get(`/submission/${submissionId}`);
  return response.data;
};

// ==================== PROFILE ====================

export const getProfile = async () => {
  const response = await api.get('/me');
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post('/reset-password', { token, newPassword });
  return response.data;
};
