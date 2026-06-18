// import api from './api';

// export const adminService = {
//   // ============ DASHBOARD ============
//   getDashboardMetrics: async () => {
//     const response = await api.get('/admin-dashboard');
//     return response.data;
//   },
//   getRevenueAnalytics: async () => {
//     const response = await api.get('/admin-dashboard/revenue');
//     return response.data;
//   },
//   getLiveClassesAnalytics: async () => {
//     const response = await api.get('/admin-dashboard/live-classes');
//     return response.data;
//   },
//   getUserStats: async () => {
//     const response = await api.get('/admin-dashboard/users');
//     return response.data;
//   },

//   // ============ USER MANAGEMENT ============
//   getUsers: async (role?: string, status?: string) => {
//     const params: any = {};
//     if (role && role !== 'all') params.role = role;
//     if (status && status !== 'all') {
//       if (status === 'active') params.accountStatus = 'active';
//       else if (status === 'blocked') params.isSuspended = true;
//     }
//     const response = await api.get('/admin/users', { params });
//     return response.data;
//   },
  
//   getUserDetails: async (userId: string) => {
//     const response = await api.get(`/admin/users/${userId}`);
//     return response.data;
//   },
  
//   blockUser: async (userId: string) => {
//     const response = await api.patch(`/admin/users/${userId}/suspend`);
//     return response.data;
//   },
  
//   unblockUser: async (userId: string) => {
//     const response = await api.patch(`/admin/users/${userId}/unsuspend`);
//     return response.data;
//   },
  
//   deactivateUser: async (userId: string, reason?: string) => {
//     const response = await api.patch(`/admin/users/${userId}/deactivate`, { reason });
//     return response.data;
//   },
  
//   reactivateUser: async (userId: string) => {
//     const response = await api.patch(`/admin/users/${userId}/reactivate`);
//     return response.data;
//   },
  
//   deleteUser: async (userId: string) => {
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response.data;
//   },
  
//   getSuspendedUsers: async () => {
//     const response = await api.get('/admin/users/suspended');
//     return response.data;
//   },
  
//   getDeactivatedUsers: async () => {
//     const response = await api.get('/admin/users/deactivated');
//     return response.data;
//   },

//   // ============ COURSE MANAGEMENT ============
//   // getCourses: async () => {
//   //   const response = await api.get('/course');
//   //   return response.data;
//   // },
//   // createCourse: async (courseData: {
//   //   title: string;
//   //   description: string;
//   //   price: number;
//   //   category: string;
//   //   thumbnail?: string;
//   //   duration?: string;
//   //   level?: string;
//   // }) => {
//   //   const response = await api.post('/course', courseData);
//   //   return response.data;
//   // },
//   // updateCourse: async (courseId: string, courseData: any) => {
//   //   const response = await api.put(`/course/${courseId}`, courseData);
//   //   return response.data;
//   // },
//   // publishCourse: async (courseId: string) => {
//   //   const response = await api.patch(`/course/${courseId}/publish`);
//   //   return response.data;
//   // },
//   // archiveCourse: async (courseId: string) => {
//   //   const response = await api.patch(`/course/${courseId}/archive`);
//   //   return response.data;
//   // },
//   // assignInstructor: async (courseId: string, instructorId: string) => {
//   //   const response = await api.patch(`/course/${courseId}/assign-instructor`, { instructorId });
//   //   return response.data;
//   // },
//   // deleteCourse: async (courseId: string) => {
//   //   const response = await api.delete(`/course/${courseId}`);
//   //   return response.data;
//   // },
// // ============ COURSE MANAGEMENT ============
// getCourses: async () => {
//   const response = await api.get('/course');
//   return response.data;
// },

// getCourse: async (courseId: string) => {
//   const response = await api.get(`/course/${courseId}`);
//   return response.data;
// },

// createCourse: async (courseData: any) => {
//   const response = await api.post('/course', courseData);
//   return response.data;
// },

// updateCourse: async (courseId: string, courseData: any) => {
//   const response = await api.put(`/course/${courseId}`, courseData);
//   return response.data;
// },

// publishCourse: async (courseId: string) => {
//   const response = await api.patch(`/course/${courseId}/publish`);
//   return response.data;
// },

// unpublishCourse: async (courseId: string) => {
//   const response = await api.patch(`/course/${courseId}/unpublish`);
//   return response.data;
// },

// archiveCourse: async (courseId: string) => {
//   const response = await api.patch(`/course/${courseId}/archive`);
//   return response.data;
// },

// assignInstructor: async (courseId: string, instructorId: string) => {
//   const response = await api.patch(`/course/${courseId}/assign-instructor`, { instructorId });
//   return response.data;
// },

// deleteCourse: async (courseId: string) => {
//   const response = await api.delete(`/course/${courseId}`);
//   return response.data;
// },

// getInstructors: async () => {
//   const response = await api.get('/course/instructors');
//   return response.data;
// },
//   // ============ ENROLLMENTS ============
//   getEnrollments: async () => {
//     const response = await api.get('/enrollments');
//     return response.data;
//   },
//   getEnrollmentsByCourse: async (courseId: string) => {
//     const response = await api.get(`/enrollments/course/${courseId}`);
//     return response.data;
//   },
//   markEnrollmentComplete: async (enrollmentId: string) => {
//     const response = await api.patch(`/enrollments/${enrollmentId}/complete`);
//     return response.data;
//   },

//   // ============ CERTIFICATES ============
//   generateCertificate: async (enrollmentId: string) => {
//     const response = await api.post(`/certificate/generate/${enrollmentId}`);
//     return response.data;
//   },
//   revokeCertificate: async (certificateId: string) => {
//     const response = await api.patch(`/certificate/revoke/${certificateId}`);
//     return response.data;
//   },


  
// };

// adminService.js

import api from './api';

export const adminService = {
  // ============ DASHBOARD ============
  getDashboardMetrics: async () => {
    const response = await api.get('/admin-dashboard');
    return response.data;
  },
  getRevenueAnalytics: async () => {
    const response = await api.get('/admin-dashboard/revenue');
    return response.data;
  },
  getLiveClassesAnalytics: async () => {
    const response = await api.get('/admin-dashboard/live-classes');
    return response.data;
  },
  getUserStats: async () => {
    const response = await api.get('/admin-dashboard/users');
    return response.data;
  },
  getCourseStats: async () => {
    const response = await api.get('/admin-dashboard/courses');
    return response.data;
  },

  // ============ USER MANAGEMENT ============
  getUsers: async (role?: string, status?: string) => {
    const params: any = {};
    if (role && role !== 'all') params.role = role;
    if (status && status !== 'all') {
      if (status === 'active') params.accountStatus = 'active';
      else if (status === 'blocked') params.isSuspended = true;
    }
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  
  getUserDetails: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  
  blockUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/suspend`);
    return response.data;
  },
  
  unblockUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/unsuspend`);
    return response.data;
  },
  
  deactivateUser: async (userId: string, reason?: string) => {
    const response = await api.patch(`/admin/users/${userId}/deactivate`, { reason });
    return response.data;
  },
  
  reactivateUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/reactivate`);
    return response.data;
  },
  
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  
  getSuspendedUsers: async () => {
    const response = await api.get('/admin/users/suspended');
    return response.data;
  },
  
  getDeactivatedUsers: async () => {
    const response = await api.get('/admin/users/deactivated');
    return response.data;
  },

  // ============ COURSE MANAGEMENT ============
  getCourses: async () => {
    const response = await api.get('/course');
    return response.data;
  },

  getCourse: async (courseId: string) => {
    const response = await api.get(`/course/${courseId}`);
    return response.data;
  },



createCourse: async (courseData: {
  title: string;
  description: string;
  detailedDescription?: string;
  price: number;
  category: string;
  thumbnail?: string;
  coverImage?: string;
  duration?: number;
  level?: string;
  language?: string;
  tags?: string[];
  prerequisites?: string;
  assignedInstructor?: string;
  isFree?: boolean;
}) => {
  const response = await api.post('/course', courseData);
  return response.data;
},


  updateCourse: async (courseId: string, courseData: any) => {
    const response = await api.put(`/course/${courseId}`, courseData);
    return response.data;
  },

  publishCourse: async (courseId: string) => {
    const response = await api.patch(`/course/${courseId}/publish`);
    return response.data;
  },

  unpublishCourse: async (courseId: string) => {
    const response = await api.patch(`/course/${courseId}/unpublish`);
    return response.data;
  },

  archiveCourse: async (courseId: string) => {
    const response = await api.patch(`/course/${courseId}/archive`);
    return response.data;
  },

  assignInstructor: async (courseId: string, instructorId: string) => {
    const response = await api.patch(`/course/${courseId}/assign-instructor`, { instructorId });
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await api.delete(`/course/${courseId}`);
    return response.data;
  },

  // ✅ ADD THIS - Get instructors for assignment dropdown
  getInstructors: async () => {
    const response = await api.get('/course/instructors');
    return response.data;
  },

  // ============ ENROLLMENTS ============
  getEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  getEnrollment: async (enrollmentId: string) => {
    const response = await api.get(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  getEnrollmentsByCourse: async (courseId: string) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },

  markEnrollmentComplete: async (enrollmentId: string) => {
    const response = await api.patch(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  },

  purchaseWithWallet: async (courseId: string) => {
    const response = await api.post(`/enrollments/purchase/wallet/${courseId}`);
    return response.data;
  },

  initializePaystackPayment: async (courseId: string) => {
    const response = await api.post(`/enrollments/purchase/paystack/${courseId}`);
    return response.data;
  },

  // ============ PAYMENTS ============
  getPaymentHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },

  initializePayment: async (data: { amount: number; redirectUrl?: string }) => {
    const response = await api.post('/payment/initialize', data);
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const response = await api.get(`/payment/verify/${reference}`);
    return response.data;
  },

  // ============ WALLET ============
  getWalletBalance: async () => {
    const response = await api.get('/wallet');
    return response.data;
  },

  getWalletTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },

  fundWallet: async (amount: number) => {
    const response = await api.post('/wallet/fund', { amount });
    return response.data;
  },

  verifyWalletFunding: async (reference: string) => {
    const response = await api.get(`/wallet/verify/${reference}`);
    return response.data;
  },

  // ============ CERTIFICATES ============
  getMyCertificates: async () => {
    const response = await api.get('/certificate/my-certificates');
    return response.data;
  },

  getCertificate: async (certificateId: string) => {
    const response = await api.get(`/certificate/${certificateId}`);
    return response.data;
  },

  verifyCertificate: async (verificationCode: string) => {
    const response = await api.get(`/certificate/verify/${verificationCode}`);
    return response.data;
  },

  generateCertificate: async (enrollmentId: string) => {
    const response = await api.post(`/certificate/generate/${enrollmentId}`);
    return response.data;
  },

  revokeCertificate: async (certificateId: string) => {
    const response = await api.patch(`/certificate/revoke/${certificateId}`);
    return response.data;
  },

  // ============ LIVE CLASSES ============
  getLiveClasses: async (courseId?: string) => {
    const url = courseId ? `/liveClass/course/${courseId}` : '/liveClass';
    const response = await api.get(url);
    return response.data;
  },

  getLiveClass: async (liveClassId: string) => {
    const response = await api.get(`/liveClass/${liveClassId}`);
    return response.data;
  },

  scheduleLiveClass: async (data: any) => {
    const response = await api.post('/liveClass', data);
    return response.data;
  },

  updateLiveClass: async (liveClassId: string, data: any) => {
    const response = await api.put(`/liveClass/${liveClassId}`, data);
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

  cancelLiveClass: async (liveClassId: string, reason?: string) => {
    const response = await api.patch(`/liveClass/${liveClassId}/cancel`, { reason });
    return response.data;
  },

  deleteLiveClass: async (liveClassId: string) => {
    const response = await api.delete(`/liveClass/${liveClassId}`);
    return response.data;
  },

  getInstructorLiveClasses: async () => {
    const response = await api.get('/liveClass/instructor');
    return response.data;
  },

  // ============ ASSIGNMENTS ============
  getAssignments: async (liveClassId?: string) => {
    const url = liveClassId ? `/assignment/live-class/${liveClassId}` : '/assignment';
    const response = await api.get(url);
    return response.data;
  },

  getAssignment: async (assignmentId: string) => {
    const response = await api.get(`/assignment/${assignmentId}`);
    return response.data;
  },

  createAssignment: async (data: any) => {
    const response = await api.post('/assignment', data);
    return response.data;
  },

  updateAssignment: async (assignmentId: string, data: any) => {
    const response = await api.put(`/assignment/${assignmentId}`, data);
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

  // ============ SUBMISSIONS ============
  submitAssignment: async (assignmentId: string, data: any) => {
    const response = await api.post(`/submission/${assignmentId}`, data);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submission/my-submissions');
    return response.data;
  },

  getAssignmentSubmissions: async (assignmentId: string) => {
    const response = await api.get(`/submission/assignment/${assignmentId}`);
    return response.data;
  },

  gradeSubmission: async (submissionId: string, data: { grade: number; feedback?: string }) => {
    const response = await api.patch(`/submission/${submissionId}/grade`, data);
    return response.data;
  },

  getSubmission: async (submissionId: string) => {
    const response = await api.get(`/submission/${submissionId}`);
    return response.data;
  },

  // ============ QUIZZES ============
  getQuizzes: async (courseId?: string) => {
    const url = courseId ? `/quiz/course/${courseId}` : '/quiz';
    const response = await api.get(url);
    return response.data;
  },

  getQuiz: async (quizId: string) => {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  },

  createQuiz: async (data: any) => {
    const response = await api.post('/quiz', data);
    return response.data;
  },

  updateQuiz: async (quizId: string, data: any) => {
    const response = await api.put(`/quiz/${quizId}`, data);
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

  submitQuiz: async (quizId: string, answers: any[]) => {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  },

  getQuizResult: async (attemptId: string) => {
    const response = await api.get(`/quiz/attempt/${attemptId}/result`);
    return response.data;
  },

  // ============ QUESTIONS ============
  getQuestions: async (quizId: string) => {
    const response = await api.get(`/question/quiz/${quizId}`);
    return response.data;
  },

  getQuestion: async (questionId: string) => {
    const response = await api.get(`/question/${questionId}`);
    return response.data;
  },

  createQuestion: async (data: any) => {
    const response = await api.post('/question', data);
    return response.data;
  },

  updateQuestion: async (questionId: string, data: any) => {
    const response = await api.put(`/question/${questionId}`, data);
    return response.data;
  },

  deleteQuestion: async (questionId: string) => {
    const response = await api.delete(`/question/${questionId}`);
    return response.data;
  },

  // ============ NOTIFICATIONS ============
  getNotifications: async () => {
    const response = await api.get('/notification');
    return response.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const response = await api.patch(`/notification/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await api.patch('/notification/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notification/${notificationId}`);
    return response.data;
  },

  // ============ CONVERSATIONS & MESSAGES ============
  getConversations: async () => {
    const response = await api.get('/conversation');
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await api.get(`/conversation/${conversationId}`);
    return response.data;
  },

  createConversation: async (data: { participantIds: string[]; title?: string }) => {
    const response = await api.post('/conversation', data);
    return response.data;
  },

  archiveConversation: async (conversationId: string) => {
    const response = await api.patch(`/conversation/${conversationId}/archive`);
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(`/message/conversation/${conversationId}`);
    return response.data;
  },

  sendMessage: async (data: { conversationId: string; content: string; type?: string }) => {
    const response = await api.post('/message', data);
    return response.data;
  },

  markMessageRead: async (messageId: string) => {
    const response = await api.patch(`/message/${messageId}/read`);
    return response.data;
  },

  reactToMessage: async (messageId: string, reaction: string) => {
    const response = await api.patch(`/message/${messageId}/react`, { reaction });
    return response.data;
  },

  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/message/${messageId}`);
    return response.data;
  },
};

export default adminService;

