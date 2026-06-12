// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useAuth } from '../../hooks/useAuth';
// import api from '../../services/api';

// export default function ProfileScreen() {
//   const { user, updateProfile, signOut } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(user?.name || '');
//   const [bio, setBio] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const requestMediaLibraryPermission = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'Please grant access to your photos to upload a profile picture.');
//       return false;
//     }
//     return true;
//   };

//   const pickImage = async () => {
//     const hasPermission = await requestMediaLibraryPermission();
//     if (!hasPermission) return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       uploadProfilePicture(result.assets[0].uri);
//     }
//   };

//   const uploadProfilePicture = async (uri: string) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append('profilePicture', {
//       uri,
//       type: 'image/jpeg',
//       name: 'profile.jpg',
//     } as any);

//     try {
//       const response = await api.put('/users/profile-picture', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       await updateProfile({ profilePicture: response.data.profilePicture });
//       Alert.alert('Success', 'Profile picture updated!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update profile picture');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await updateProfile({ name });
//       setIsEditing(false);
//       Alert.alert('Success', 'Profile updated successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await signOut();
//             router.replace('/(auth)/login');
//           },
//         },
//       ]
//     );
//   };

//   const StatItem = ({ label, value }: { label: string; value: string | number }) => (
//     <View style={styles.statItem}>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={pickImage} disabled={uploading}>
//           <View style={styles.profileImageContainer}>
//             <Image
//               source={{ uri: user?.profilePicture || 'https://via.placeholder.com/100' }}
//               style={styles.profileImage}
//             />
//             {uploading && (
//               <View style={styles.uploadOverlay}>
//                 <ActivityIndicator color="white" />
//               </View>
//             )}
//             <View style={styles.cameraIcon}>
//               <Ionicons name="camera" size={16} color="#4F46E5" />
//             </View>
//           </View>
//         </TouchableOpacity>
        
//         {isEditing ? (
//           <TextInput
//             style={styles.editNameInput}
//             value={name}
//             onChangeText={setName}
//             placeholderTextColor="rgba(255,255,255,0.7)"
//           />
//         ) : (
//           <Text style={styles.userName}>{user?.name}</Text>
//         )}
        
//         <Text style={styles.userEmail}>{user?.email}</Text>
        
//         <View style={styles.roleBadge}>
//           <Text style={styles.roleText}>{user?.role} Account</Text>
//         </View>
//       </View>

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <StatItem label="Courses Enrolled" value="5" />
//         <StatItem label="Certificates" value="3" />
//         <StatItem label="Hours Watched" value="24" />
//       </View>

//       {/* Profile Info */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Profile Information</Text>
//           {!isEditing ? (
//             <TouchableOpacity onPress={() => setIsEditing(true)}>
//               <Ionicons name="create-outline" size={20} color="#4F46E5" />
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.editActions}>
//               <TouchableOpacity onPress={() => setIsEditing(false)}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleSave} disabled={saving}>
//                 <Text style={styles.saveText}>
//                   {saving ? 'Saving...' : 'Save'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Full Name</Text>
//           {isEditing ? (
//             <TextInput
//               style={styles.infoInput}
//               value={name}
//               onChangeText={setName}
//             />
//           ) : (
//             <Text style={styles.infoValue}>{user?.name}</Text>
//           )}
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Email Address</Text>
//           <Text style={styles.infoValue}>{user?.email}</Text>
//         </View>

//         {isEditing && (
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Bio</Text>
//             <TextInput
//               style={styles.bioInput}
//               placeholder="Tell us about yourself..."
//               multiline
//               value={bio}
//               onChangeText={setBio}
//             />
//           </View>
//         )}
//       </View>

//       {/* Settings Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Settings</Text>
        
//         <TouchableOpacity
//           onPress={() => router.push('/(student)/notifications' as any)}
//           style={styles.settingItem}
//         >
//           <View style={styles.settingLeft}>
//             <Ionicons name="notifications-outline" size={20} color="#6B7280" />
//             <Text style={styles.settingText}>Notifications</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => router.push('/(student)/settings' as any)}
//           style={styles.settingItem}
//         >
//           <View style={styles.settingLeft}>
//             <Ionicons name="settings-outline" size={20} color="#6B7280" />
//             <Text style={styles.settingText}>App Settings</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => router.push('/(student)/live-classes' as any)}
//           style={[styles.settingItem, styles.lastSettingItem]}
//         >
//           <View style={styles.settingLeft}>
//             <Ionicons name="videocam-outline" size={20} color="#6B7280" />
//             <Text style={styles.settingText}>Live Classes</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
//         </TouchableOpacity>
//       </View>

//       {/* Logout Button */}
//       <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     backgroundColor: '#4F46E5',
//     paddingVertical: 40,
//     alignItems: 'center',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   profileImageContainer: {
//     position: 'relative',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: 'white',
//   },
//   uploadOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 4,
//   },
//   editNameInput: {
//     marginTop: 16,
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.5)',
//     paddingVertical: 4,
//     minWidth: 150,
//   },
//   userName: {
//     marginTop: 16,
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   userEmail: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   roleBadge: {
//     marginTop: 16,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   roleText: {
//     color: 'white',
//     fontSize: 12,
//     textTransform: 'capitalize',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     marginTop: -20,
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   section: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 16,
//     marginTop: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   editActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   cancelText: {
//     color: '#6B7280',
//   },
//   saveText: {
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   infoRow: {
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#1F2937',
//   },
//   infoInput: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 14,
//   },
//   bioInput: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 14,
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   lastSettingItem: {
//     borderBottomWidth: 0,
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   settingText: {
//     fontSize: 14,
//     color: '#1F2937',
//   },
//   logoutButton: {
//     backgroundColor: '#FEE2E2',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginHorizontal: 16,
//     marginTop: 16,
//     marginBottom: 32,
//   },
//   logoutText: {
//     color: '#DC2626',
//     fontWeight: '600',
//   },
// });




import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const HEADER_BG = '#0B1D3A';
const BLUE = '#3B6EF9';
const GRAY = '#6B7280';
const PRIMARY_DARK = '#0B1D3A';

export default function ProfileScreen() {
  const { user, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant access to your photos to upload a profile picture.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', {
      uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    try {
      const response = await api.put('/users/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await updateProfile({ profilePicture: response.data.profilePicture });
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: editName });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const SETTINGS_ITEMS = [
    { icon: "notifications-outline", label: 'Notifications', route: '/(student)/notifications' },
    { icon: "settings-outline", label: 'App Settings', route: '/(student)/settings' },
    { icon: "videocam-outline", label: 'Live Classes', route: '/(student)/live-classes' },
  ];

  return (
    <View style={styles.root}>
      {/* Fixed Header - Does not scroll */}
      <View style={styles.fixedHeader}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              <Image
                source={{ uri: user?.profilePicture || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
              {uploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator color="white" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Name - always shows user data, not edit state */}
          <Text style={styles.nameText}>{user?.name}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()} ACCOUNT</Text>
          </View>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <StatItem label="Courses Enrolled" value="5" />
          <View style={styles.statDivider} />
          <StatItem label="Certificates" value="3" />
          <View style={styles.statDivider} />
          <StatItem label="Hours Watched" value="24" />
        </View>

        {/* Profile Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => {
              setEditName(user?.name || '');
              setIsEditing(!isEditing);
            }}>
              <Ionicons name="create-outline" size={18} color={BLUE} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={editName}
                onChangeText={setEditName}
              />
            ) : (
              <Text style={styles.infoValue}>{user?.name}</Text>
            )}
          </View>

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          {isEditing && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Tell us about yourself..."
                  multiline
                  value={bio}
                  onChangeText={setBio}
                />
              </View>
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    setEditName(user?.name || '');
                  }}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving}
                  style={styles.saveBtn}
                >
                  <Text style={styles.saveBtnText}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Settings</Text>
          {SETTINGS_ITEMS.map((item, i) => {
            const isLast = i === SETTINGS_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={[styles.settingRow, !isLast && styles.settingRowBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name={item.icon as any} size={20} color={PRIMARY_DARK} />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutCard} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  // Fixed Header - does not scroll
  fixedHeader: {
    backgroundColor: HEADER_BG,
    paddingBottom: 16,
    borderBottomWidth: 0,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  // Scrollable Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Profile Header Section (scrolls)
  profileHeader: {
    backgroundColor: HEADER_BG,
    paddingBottom: 32,
    paddingHorizontal: 20,
    marginTop: 0,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: HEADER_BG,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: 14,
  },
  roleBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -28,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY_DARK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: GRAY,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },

  // Profile info rows
  infoRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastInfoRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  infoInput: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_DARK,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Settings rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: PRIMARY_DARK,
  },

  // Logout
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
});