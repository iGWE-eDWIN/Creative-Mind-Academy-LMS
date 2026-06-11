// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Linking,
//   Share,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import api from '../../services/api';

// interface Certificate {
//   _id: string;
//   courseId: string;
//   courseTitle: string;
//   issueDate: string;
//   certificateId: string;
//   downloadUrl: string;
// }

// export default function CertificatesScreen() {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const fetchCertificates = async () => {
//     try {
//       const response = await api.get('/students/certificates');
//       setCertificates(response.data.certificates);
//     } catch (error) {
//       console.error('Error fetching certificates:', error);
//       Alert.alert('Error', 'Failed to load certificates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openCertificate = async (certificate: Certificate) => {
//     try {
//       const supported = await Linking.canOpenURL(certificate.downloadUrl);
//       if (supported) {
//         await Linking.openURL(certificate.downloadUrl);
//       } else {
//         Alert.alert('Error', 'Cannot open certificate');
//       }
//     } catch (error) {
//       console.error('Error opening certificate:', error);
//       Alert.alert('Error', 'Failed to open certificate');
//     }
//   };

//   const shareCertificate = async (certificate: Certificate) => {
//     try {
//       await Share.share({
//         message: `I earned a certificate in ${certificate.courseTitle} from Creative Mind Academy! Certificate ID: ${certificate.certificateId}`,
//       });
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   const verifyCertificate = (certificateId: string) => {
//     router.push(`/(student)/certificate-view/${certificateId}`);
//   };

//   const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
//     <TouchableOpacity
//       onPress={() => verifyCertificate(certificate.certificateId)}
//       style={styles.certificateCard}
//     >
//       <View style={styles.certificateCardHeader}>
//         <View style={styles.certificateIcon}>
//           <Ionicons name="medal" size={24} color="#4F46E5" />
//         </View>
//         <View style={styles.certificateInfo}>
//           <Text style={styles.certificateTitle}>{certificate.courseTitle}</Text>
//           <Text style={styles.certificateDate}>
//             Issued: {new Date(certificate.issueDate).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.certificateActions}>
//         <TouchableOpacity
//           onPress={() => openCertificate(certificate)}
//           style={styles.actionButton}
//         >
//           <Ionicons name="open-outline" size={20} color="#4F46E5" />
//           <Text style={styles.actionButtonText}>Open</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => shareCertificate(certificate)}
//           style={styles.actionButton}
//         >
//           <Ionicons name="share-outline" size={20} color="#4F46E5" />
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => verifyCertificate(certificate.certificateId)}
//           style={styles.actionButton}
//         >
//           <Ionicons name="eye-outline" size={20} color="#4F46E5" />
//           <Text style={styles.actionButtonText}>View</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {certificates.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="medal-outline" size={80} color="#D1D5DB" />
//           <Text style={styles.emptyTitle}>No certificates yet</Text>
//           <Text style={styles.emptyText}>
//             Complete courses and pass final assessments to earn certificates
//           </Text>
//           <TouchableOpacity
//             onPress={() => router.push('/(student)/my-courses')}
//             style={styles.emptyButton}
//           >
//             <Text style={styles.emptyButtonText}>View My Courses</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={certificates}
//           renderItem={({ item }) => <CertificateCard certificate={item} />}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   certificateCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   certificateCardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   certificateIcon: {
//     backgroundColor: '#EEF2FF',
//     padding: 12,
//     borderRadius: 10,
//     marginRight: 12,
//   },
//   certificateInfo: {
//     flex: 1,
//   },
//   certificateTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#1F2937',
//   },
//   certificateDate: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   certificateActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   actionButtonText: {
//     color: '#4F46E5',
//     fontSize: 14,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   emptyTitle: {
//     marginTop: 16,
//     fontSize: 18,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   emptyText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   emptyButton: {
//     marginTop: 24,
//     backgroundColor: '#4F46E5',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   emptyButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });



import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import api from '../../services/api';

interface Certificate {
  _id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
  downloadUrl: string;
  studentName?: string;
  grade?: string;
}

export default function CertificatesScreen() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/students/certificates');
      setCertificates(response.data.certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      Alert.alert('Error', 'Failed to load certificates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCertificates();
  };

  const openCertificate = async (certificate: Certificate) => {
    try {
      const supported = await Linking.canOpenURL(certificate.downloadUrl);
      if (supported) {
        await Linking.openURL(certificate.downloadUrl);
      } else {
        Alert.alert('Error', 'Cannot open certificate file');
      }
    } catch (error) {
      console.error('Error opening certificate:', error);
      Alert.alert('Error', 'Failed to open certificate');
    }
  };

  const shareCertificate = async (certificate: Certificate) => {
    try {
      await Share.share({
        message: `I earned a certificate in ${certificate.courseTitle} from Creative Mind Academy! 🎓\n\nCertificate ID: ${certificate.certificateId}\nDate: ${new Date(certificate.issueDate).toLocaleDateString()}\n\nVerify at: https://creativemindacademy.com/verify/${certificate.certificateId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const viewCertificate = (certificateId: string) => {
    router.push(`/(student)/certificate-view/${certificateId}`);
  };

  const getVerificationUrl = (certificateId: string) => {
    return `https://creativemindacademy.com/verify/${certificateId}`;
  };

  const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
    const verificationUrl = getVerificationUrl(certificate.certificateId);
    const issueDate = new Date(certificate.issueDate);
    const isRecent = (Date.now() - issueDate.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => viewCertificate(certificate.certificateId)}
        style={styles.certificateCard}
      >
        {/* Recent Badge */}
        {isRecent && (
          <View style={styles.recentBadge}>
            <Text style={styles.recentBadgeText}>New</Text>
          </View>
        )}

        <View style={styles.certificateCardHeader}>
          <View style={styles.certificateIcon}>
            <Ionicons name="medal" size={28} color="#4F46E5" />
          </View>
          
          <View style={styles.certificateInfo}>
            <Text style={styles.certificateTitle} numberOfLines={2}>
              {certificate.courseTitle}
            </Text>
            <Text style={styles.certificateDate}>
              Issued: {issueDate.toLocaleDateString()}
            </Text>
            <Text style={styles.certificateId} numberOfLines={1}>
              ID: {certificate.certificateId}
            </Text>
          </View>

          {/* QR Code Preview */}
          <View style={styles.qrPreview}>
            <QRCode
              value={verificationUrl}
              size={55}
              backgroundColor="white"
              color="#4F46E5"
            />
          </View>
        </View>

        {/* Grade Badge (if available) */}
        {certificate.grade && (
          <View style={styles.gradeContainer}>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeLabel}>Grade</Text>
              <Text style={styles.gradeValue}>{certificate.grade}</Text>
            </View>
          </View>
        )}

        <View style={styles.certificateActions}>
          <TouchableOpacity
            onPress={() => openCertificate(certificate)}
            style={styles.actionButton}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="open-outline" size={18} color="#4F46E5" />
            </View>
            <Text style={styles.actionButtonText}>Open</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            onPress={() => shareCertificate(certificate)}
            style={styles.actionButton}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="share-outline" size={18} color="#4F46E5" />
            </View>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            onPress={() => viewCertificate(certificate.certificateId)}
            style={styles.actionButton}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="eye-outline" size={18} color="#4F46E5" />
            </View>
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Verification Hint */}
        <View style={styles.verifyHint}>
          <Ionicons name="scan-outline" size={12} color="#9CA3AF" />
          <Text style={styles.verifyHintText}>
            Scan QR code to verify
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your certificates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {certificates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="medal-outline" size={80} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No certificates yet</Text>
          <Text style={styles.emptyText}>
            Complete courses and pass final assessments to earn certificates
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(student)/my-courses')}
            style={styles.emptyButton}
          >
            <Ionicons name="play-circle-outline" size={20} color="white" />
            <Text style={styles.emptyButtonText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={certificates}
          renderItem={({ item }) => <CertificateCard certificate={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  certificateCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  recentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  certificateCardHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  certificateIcon: {
    backgroundColor: '#EEF2FF',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
    marginRight: 8,
  },
  certificateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  certificateDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  certificateId: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qrPreview: {
    width: 55,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gradeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  gradeLabel: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '500',
  },
  gradeValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
  },
  certificateActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '500',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  verifyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  verifyHintText: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});