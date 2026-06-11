// import { Ionicons } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ScrollView,
//   Share,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import api from '../../../services/api';

// interface CertificateData {
//   _id: string;
//   certificateId: string;
//   studentName: string;
//   courseTitle: string;
//   courseDescription: string;
//   issueDate: string;
//   expiryDate?: string;
//   grade?: string;
//   score?: number;
//   totalPoints?: number;
//   downloadUrl: string;
//   instructorName: string;
//   duration: string;
//   skills: string[];
// }

// export default function CertificateViewScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [certificate, setCertificate] = useState<CertificateData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);

//   useEffect(() => {
//     fetchCertificate();
//   }, [id]);

//   const fetchCertificate = async () => {
//     try {
//       const response = await api.get(`/certificates/${id}`);
//       setCertificate(response.data.certificate);
//     } catch (error) {
//       console.error('Error fetching certificate:', error);
//       Alert.alert('Error', 'Failed to load certificate', [
//         { text: 'OK', onPress: () => router.back() },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadCertificate = async () => {
//     if (!certificate) return;

//     setDownloading(true);
//     try {
//       const supported = await Linking.canOpenURL(certificate.downloadUrl);
//       if (supported) {
//         await Linking.openURL(certificate.downloadUrl);
//       } else {
//         Alert.alert('Error', 'Cannot open certificate file');
//       }
//     } catch (error) {
//       console.error('Error downloading certificate:', error);
//       Alert.alert('Error', 'Failed to open certificate');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const shareCertificate = async () => {
//     if (!certificate) return;

//     try {
//       await Share.share({
//         message: `I have successfully completed "${certificate.courseTitle}" at Creative Mind Academy! 🎓\n\nCertificate ID: ${certificate.certificateId}\nDate: ${new Date(certificate.issueDate).toLocaleDateString()}\n\nVerify at: https://creativemindacademy.com/verify/${certificate.certificateId}`,
//       });
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   const verifyCertificate = () => {
//     Alert.alert(
//       'Certificate Verification',
//       `Certificate ID: ${certificate?.certificateId}\n\nThis certificate can be verified at:\nhttps://creativemindacademy.com/verify/${certificate?.certificateId}\n\nShare this ID with employers to verify your achievement.`
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   if (!certificate) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="document-text-outline" size={80} color="#D1D5DB" />
//         <Text style={styles.errorText}>Certificate not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       {/* Certificate Card */}
//       <View style={styles.certificateCard}>
//         {/* Header */}
//         <View style={styles.certificateHeader}>
//           <View style={styles.logoContainer}>
//             <Ionicons name="school" size={32} color="#4F46E5" />
//           </View>
//           <Text style={styles.academyName}>Creative Mind Academy</Text>
//           <Text style={styles.certificateType}>Certificate of Completion</Text>
//         </View>

//         {/* Content */}
//         <View style={styles.certificateContent}>
//           <View style={styles.certificateIdContainer}>
//             <Text style={styles.certificateIdLabel}>Certificate ID</Text>
//             <Text style={styles.certificateIdValue}>{certificate.certificateId}</Text>
//           </View>

//           <View style={styles.awardedToContainer}>
//             <Text style={styles.awardedToLabel}>This certificate is awarded to</Text>
//             <Text style={styles.studentName}>{certificate.studentName}</Text>
//           </View>

//           <View style={styles.courseInfoContainer}>
//             <Text style={styles.completionLabel}>for successfully completing</Text>
//             <Text style={styles.courseTitle}>{certificate.courseTitle}</Text>
//             <Text style={styles.courseDescription}>{certificate.courseDescription}</Text>
//           </View>

//           {certificate.skills && certificate.skills.length > 0 && (
//             <View style={styles.skillsContainer}>
//               <Text style={styles.skillsTitle}>Skills Mastered</Text>
//               <View style={styles.skillsList}>
//                 {certificate.skills.map((skill, index) => (
//                   <View key={index} style={styles.skillBadge}>
//                     <Text style={styles.skillText}>{skill}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {certificate.grade && (
//             <View style={styles.gradeContainer}>
//               <View style={styles.gradeItem}>
//                 <Text style={styles.gradeLabel}>Grade</Text>
//                 <Text style={styles.gradeValue}>{certificate.grade}</Text>
//               </View>
//               {certificate.score && certificate.totalPoints && (
//                 <View style={styles.gradeItem}>
//                   <Text style={styles.gradeLabel}>Score</Text>
//                   <Text style={styles.gradeValue}>{certificate.score}/{certificate.totalPoints}</Text>
//                 </View>
//               )}
//               <View style={styles.gradeItem}>
//                 <Text style={styles.gradeLabel}>Duration</Text>
//                 <Text style={styles.gradeValue}>{certificate.duration}</Text>
//               </View>
//             </View>
//           )}

//           <View style={styles.datesContainer}>
//             <View style={styles.dateItem}>
//               <Text style={styles.dateLabel}>Issue Date</Text>
//               <Text style={styles.dateValue}>
//                 {new Date(certificate.issueDate).toLocaleDateString()}
//               </Text>
//             </View>
//             {certificate.expiryDate && (
//               <View style={styles.dateItem}>
//                 <Text style={styles.dateLabel}>Expiry Date</Text>
//                 <Text style={styles.dateValue}>
//                   {new Date(certificate.expiryDate).toLocaleDateString()}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.signatureContainer}>
//             <View style={styles.signatureLine} />
//             <Text style={styles.instructorName}>{certificate.instructorName}</Text>
//             <Text style={styles.instructorTitle}>Lead Instructor</Text>
//           </View>

//           <View style={styles.qrPlaceholder}>
//             <Ionicons name="qr-code-outline" size={80} color="#9CA3AF" />
//             <Text style={styles.qrText}>Certificate ID: {certificate.certificateId}</Text>
//             <Text style={styles.verifyHint}>Use this ID for verification</Text>
//           </View>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity
//           onPress={downloadCertificate}
//           disabled={downloading}
//           style={styles.downloadButton}
//         >
//           <Ionicons name="download-outline" size={20} color="white" />
//           <Text style={styles.buttonText}>
//             {downloading ? 'Opening...' : 'Open Certificate'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={shareCertificate} style={styles.shareButton}>
//           <Ionicons name="share-outline" size={20} color="#4F46E5" />
//           <Text style={styles.shareButtonText}>Share Certificate</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={verifyCertificate} style={styles.verifyButton}>
//           <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
//           <Text style={styles.verifyButtonText}>Verify Certificate</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Verification Info */}
//       <View style={styles.infoBox}>
//         <View style={styles.infoBoxHeader}>
//           <Ionicons name="information-circle" size={20} color="#D97706" />
//           <Text style={styles.infoBoxTitle}>Verification Information</Text>
//         </View>
//         <Text style={styles.infoBoxText}>
//           This certificate can be verified online using the Certificate ID. Employers can verify at: creativemindacademy.com/verify
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   errorText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   certificateCard: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   certificateHeader: {
//     backgroundColor: '#4F46E5',
//     padding: 24,
//     alignItems: 'center',
//   },
//   logoContainer: {
//     backgroundColor: 'white',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   academyName: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   certificateType: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//   },
//   certificateContent: {
//     padding: 24,
//   },
//   certificateIdContainer: {
//     backgroundColor: '#F3F4F6',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   certificateIdLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   certificateIdValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   awardedToContainer: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   awardedToLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   studentName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     textAlign: 'center',
//   },
//   courseInfoContainer: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   completionLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   courseTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#4F46E5',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   courseDescription: {
//     fontSize: 14,
//     color: '#4B5563',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   skillsContainer: {
//     marginBottom: 24,
//   },
//   skillsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   skillsList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   skillBadge: {
//     backgroundColor: '#EEF2FF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//   },
//   skillText: {
//     fontSize: 12,
//     color: '#4F46E5',
//   },
//   gradeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 24,
//     gap: 32,
//   },
//   gradeItem: {
//     alignItems: 'center',
//   },
//   gradeLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   gradeValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4F46E5',
//   },
//   datesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 32,
//     marginBottom: 32,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   dateItem: {
//     alignItems: 'center',
//   },
//   dateLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   dateValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1F2937',
//   },
//   signatureContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   signatureLine: {
//     width: 200,
//     height: 60,
//     borderBottomWidth: 1,
//     borderBottomColor: '#D1D5DB',
//     marginBottom: 8,
//   },
//   instructorName: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   instructorTitle: {
//     fontSize: 10,
//     color: '#9CA3AF',
//   },
//   qrPlaceholder: {
//     alignItems: 'center',
//     marginBottom: 24,
//     padding: 16,
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//   },
//   qrText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   verifyHint: {
//     fontSize: 10,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },
//   actionButtons: {
//     marginTop: 24,
//     gap: 12,
//   },
//   downloadButton: {
//     backgroundColor: '#4F46E5',
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   shareButton: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#4F46E5',
//   },
//   verifyButton: {
//     backgroundColor: '#F3F4F6',
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   shareButtonText: {
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   verifyButtonText: {
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   infoBox: {
//     marginTop: 24,
//     marginBottom: 32,
//     padding: 16,
//     backgroundColor: '#FEF3C7',
//     borderRadius: 12,
//   },
//   infoBoxHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 8,
//   },
//   infoBoxTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#92400E',
//   },
//   infoBoxText: {
//     fontSize: 12,
//     color: '#92400E',
//     lineHeight: 18,
//   },
// });


import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import api from '../../../services/api';

interface CertificateData {
  _id: string;
  certificateId: string;
  studentName: string;
  courseTitle: string;
  courseDescription: string;
  issueDate: string;
  expiryDate?: string;
  grade?: string;
  score?: number;
  totalPoints?: number;
  downloadUrl: string;
  instructorName: string;
  duration: string;
  skills: string[];
}

export default function CertificateViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const response = await api.get(`/certificates/${id}`);
      setCertificate(response.data.certificate);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      Alert.alert('Error', 'Failed to load certificate', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCertificate = async () => {
    if (!certificate) return;

    setDownloading(true);
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
    } finally {
      setDownloading(false);
    }
  };

  const shareCertificate = async () => {
    if (!certificate) return;

    try {
      await Share.share({
        message: `I have successfully completed "${certificate.courseTitle}" at Creative Mind Academy! 🎓\n\nCertificate ID: ${certificate.certificateId}\nDate: ${new Date(certificate.issueDate).toLocaleDateString()}\n\nVerify at: https://creativemindacademy.com/verify/${certificate.certificateId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const verifyCertificate = () => {
    Alert.alert(
      'Certificate Verification',
      `Certificate ID: ${certificate?.certificateId}\n\nThis certificate can be verified at:\nhttps://creativemindacademy.com/verify/${certificate?.certificateId}\n\nShare this ID with employers to verify your achievement.`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!certificate) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={80} color="#D1D5DB" />
        <Text style={styles.errorText}>Certificate not found</Text>
      </View>
    );
  }

  // Create verification URL for QR code
  const verificationUrl = `https://creativemindacademy.com/verify/${certificate.certificateId}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Certificate Card */}
      <View style={styles.certificateCard}>
        {/* Header */}
        <View style={styles.certificateHeader}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={32} color="#4F46E5" />
          </View>
          <Text style={styles.academyName}>Creative Mind Academy</Text>
          <Text style={styles.certificateType}>Certificate of Completion</Text>
        </View>

        {/* Content */}
        <View style={styles.certificateContent}>
          <View style={styles.certificateIdContainer}>
            <Text style={styles.certificateIdLabel}>Certificate ID</Text>
            <Text style={styles.certificateIdValue}>{certificate.certificateId}</Text>
          </View>

          <View style={styles.awardedToContainer}>
            <Text style={styles.awardedToLabel}>This certificate is awarded to</Text>
            <Text style={styles.studentName}>{certificate.studentName}</Text>
          </View>

          <View style={styles.courseInfoContainer}>
            <Text style={styles.completionLabel}>for successfully completing</Text>
            <Text style={styles.courseTitle}>{certificate.courseTitle}</Text>
            <Text style={styles.courseDescription}>{certificate.courseDescription}</Text>
          </View>

          {certificate.skills && certificate.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              <Text style={styles.skillsTitle}>Skills Mastered</Text>
              <View style={styles.skillsList}>
                {certificate.skills.map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {certificate.grade && (
            <View style={styles.gradeContainer}>
              <View style={styles.gradeItem}>
                <Text style={styles.gradeLabel}>Grade</Text>
                <Text style={styles.gradeValue}>{certificate.grade}</Text>
              </View>
              {certificate.score && certificate.totalPoints && (
                <View style={styles.gradeItem}>
                  <Text style={styles.gradeLabel}>Score</Text>
                  <Text style={styles.gradeValue}>{certificate.score}/{certificate.totalPoints}</Text>
                </View>
              )}
              <View style={styles.gradeItem}>
                <Text style={styles.gradeLabel}>Duration</Text>
                <Text style={styles.gradeValue}>{certificate.duration}</Text>
              </View>
            </View>
          )}

          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Issue Date</Text>
              <Text style={styles.dateValue}>
                {new Date(certificate.issueDate).toLocaleDateString()}
              </Text>
            </View>
            {certificate.expiryDate && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Expiry Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(certificate.expiryDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.instructorName}>{certificate.instructorName}</Text>
            <Text style={styles.instructorTitle}>Lead Instructor</Text>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <QRCode
              value={verificationUrl}
              size={140}
              backgroundColor="white"
              color="#1F2937"
            />
            <Text style={styles.qrTitle}>Verify Authenticity</Text>
            <Text style={styles.qrText}>Scan this QR code with your phone camera</Text>
            <Text style={styles.qrSubtext}>or visit: {verificationUrl}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={openCertificate}
          disabled={downloading}
          style={styles.downloadButton}
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.buttonText}>
            {downloading ? 'Opening...' : 'Open Certificate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={shareCertificate} style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color="#4F46E5" />
          <Text style={styles.shareButtonText}>Share Certificate</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={verifyCertificate} style={styles.verifyButton}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
          <Text style={styles.verifyButtonText}>Verify Certificate</Text>
        </TouchableOpacity>
      </View>

      {/* Verification Info */}
      <View style={styles.infoBox}>
        <View style={styles.infoBoxHeader}>
          <Ionicons name="information-circle" size={20} color="#D97706" />
          <Text style={styles.infoBoxTitle}>Verification Information</Text>
        </View>
        <Text style={styles.infoBoxText}>
          This certificate can be verified online by scanning the QR code or using the Certificate ID below.
          Employers can verify at: creativemindacademy.com/verify/{certificate.certificateId}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
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
  certificateCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  certificateHeader: {
    backgroundColor: '#4F46E5',
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  academyName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  certificateType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  certificateContent: {
    padding: 24,
  },
  certificateIdContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  certificateIdLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  certificateIdValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  awardedToContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  awardedToLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  courseInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  skillsContainer: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skillText: {
    fontSize: 12,
    color: '#4F46E5',
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 32,
  },
  gradeItem: {
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  signatureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  signatureLine: {
    width: 200,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 12,
    color: '#6B7280',
  },
  instructorTitle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  qrText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  qrSubtext: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  downloadButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  verifyButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  shareButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  verifyButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  infoBoxText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});