// import { adminService } from '@/services/admin';
// import { Ionicons } from '@expo/vector-icons';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'student' | 'instructor' | 'admin';
//   accountStatus: 'active' | 'suspended' | 'deactivated' | 'pending_verification';
//   isSuspended: boolean;
//   suspensionReason?: string;
//   suspensionDate?: string;
//   createdAt: string;
//   phone?: string;
// }

// export default function UserManagement() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'instructor'>('all');
//   const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'blocked'>('all');

//   const fetchUsers = useCallback(async () => {
//     try {
//       const data = await adminService.getUsers(
//         selectedRole === 'all' ? undefined : selectedRole,
//         selectedStatus
//       );
//       // Handle both response formats
//       setUsers(data.data || data.users || data || []);
//     } catch (error: any) {
//       console.error('Error fetching users:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [selectedRole, selectedStatus]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUsers();
//   };

//   // Check if user is blocked/suspended
//   const isUserBlocked = (user: User) => {
//     return user.isSuspended === true || user.accountStatus === 'suspended';
//   };

//   const handleBlockUser = async (userId: string, name: string) => {
//     Alert.alert(
//       'Block User',
//       `Are you sure you want to block ${name}? They will not be able to log in.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Block',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await adminService.blockUser(userId);
//               Alert.alert('Success', 'User blocked successfully');
//               fetchUsers();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to block user');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleUnblockUser = async (userId: string, name: string) => {
//     Alert.alert(
//       'Unblock User',
//       `Are you sure you want to unblock ${name}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Unblock',
//           onPress: async () => {
//             try {
//               await adminService.unblockUser(userId);
//               Alert.alert('Success', 'User unblocked successfully');
//               fetchUsers();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to unblock user');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleDeleteUser = async (userId: string, name: string) => {
//     Alert.alert(
//       'Delete User',
//       `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await adminService.deleteUser(userId);
//               Alert.alert('Success', 'User deleted successfully');
//               fetchUsers();
//             } catch (error: any) {
//               Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const filteredUsers = users.filter((u) => {
//     const matchesSearch =
//       u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesSearch;
//   });

//   const renderUserItem = ({ item }: { item: User }) => {
//     const blocked = isUserBlocked(item);
//     const isAdmin = item.role === 'admin';

//     return (
//       <View style={[styles.userCard, blocked && styles.userCardBlocked]}>
//         <View style={styles.userHeader}>
//           <View style={styles.userInfo}>
//             <Text style={styles.userName}>{item.name}</Text>
//             <Text style={styles.userEmail}>{item.email}</Text>
//             {item.phone && (
//               <Text style={styles.userPhone}>{item.phone}</Text>
//             )}
//           </View>
//           <View style={[
//             styles.roleBadge,
//             item.role === 'instructor' ? styles.roleInstructor : 
//             item.role === 'admin' ? styles.roleAdmin : styles.roleStudent
//           ]}>
//             <Text style={styles.roleText}>{item.role?.toUpperCase() || 'USER'}</Text>
//           </View>
//         </View>

//         <View style={styles.cardDivider} />

//         <View style={styles.userFooter}>
//           <View style={styles.statusRow}>
//             <View
//               style={[
//                 styles.statusDot,
//                 { backgroundColor: blocked ? '#EF4444' : '#22C55E' },
//               ]}
//             />
//             <Text style={[
//               styles.statusText,
//               { color: blocked ? '#EF4444' : '#22C55E' }
//             ]}>
//               {blocked ? 'BLOCKED' : (item.accountStatus?.toUpperCase() || 'ACTIVE')}
//             </Text>
//             {blocked && item.suspensionReason && (
//               <Text style={styles.suspensionReason}>
//                 ({item.suspensionReason})
//               </Text>
//             )}
//           </View>

//           {!isAdmin && (
//             <View style={styles.actionButtons}>
//               {blocked ? (
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.unblockBtn]}
//                   onPress={() => handleUnblockUser(item._id, item.name)}
//                 >
//                   <Ionicons name="checkmark-circle-outline" size={18} color="#22C55E" />
//                   <Text style={[styles.actionBtnText, { color: '#22C55E' }]}>Unblock</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.blockBtn]}
//                   onPress={() => handleBlockUser(item._id, item.name)}
//                 >
//                   <Ionicons name="ban-outline" size={18} color="#F59E0B" />
//                   <Text style={[styles.actionBtnText, { color: '#F59E0B' }]}>Block</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 style={[styles.actionBtn, styles.deleteBtn]}
//                 onPress={() => handleDeleteUser(item._id, item.name)}
//               >
//                 <Ionicons name="trash-outline" size={18} color="#EF4444" />
//                 <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchBar}>
//         <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name or email..."
//           placeholderTextColor="#9CA3AF"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Role Filters */}
//       <View style={styles.filterContainer}>
//         <Text style={styles.filterLabel}>Role:</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
//           {(['all', 'student', 'instructor'] as const).map((r) => (
//             <TouchableOpacity
//               key={r}
//               onPress={() => setSelectedRole(r)}
//               style={[styles.filterChip, selectedRole === r && styles.filterChipActive]}
//             >
//               <Text style={[styles.filterChipText, selectedRole === r && styles.filterChipTextActive]}>
//                 {r.toUpperCase()}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Status Filters */}
//       <View style={[styles.filterContainer, { marginTop: 4, marginBottom: 12 }]}>
//         <Text style={styles.filterLabel}>Status:</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
//           {(['all', 'active', 'blocked'] as const).map((s) => (
//             <TouchableOpacity
//               key={s}
//               onPress={() => setSelectedStatus(s)}
//               style={[styles.filterChip, selectedStatus === s && styles.filterChipActive]}
//             >
//               <Text style={[styles.filterChipText, selectedStatus === s && styles.filterChipTextActive]}>
//                 {s.toUpperCase()}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1A6FD4" />
//         </View>
//       ) : (
//         <FlatList
//           data={filteredUsers}
//           keyExtractor={(item) => item._id}
//           renderItem={renderUserItem}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons name="people-outline" size={48} color="#9CA3AF" />
//               <Text style={styles.emptyText}>No users found</Text>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F6FA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 24,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#0F172A',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   filterLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//     width: 50,
//   },
//   filterScroll: {
//     flexDirection: 'row',
//   },
//   filterChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   filterChipActive: {
//     backgroundColor: '#1A6FD4',
//   },
//   filterChipText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#374151',
//   },
//   filterChipTextActive: {
//     color: '#FFFFFF',
//   },
//   userCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   userCardBlocked: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FCA5A5',
//   },
//   userHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#0F172A',
//   },
//   userEmail: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   userPhone: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 1,
//   },
//   roleBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   roleInstructor: {
//     backgroundColor: '#E8F5E9',
//   },
//   roleStudent: {
//     backgroundColor: '#E3F2FD',
//   },
//   roleAdmin: {
//     backgroundColor: '#FEF3C7',
//   },
//   roleText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#1A6FD4',
//   },
//   cardDivider: {
//     height: 1,
//     backgroundColor: '#F3F4F6',
//     marginVertical: 12,
//   },
//   userFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   suspensionReason: {
//     fontSize: 10,
//     color: '#6B7280',
//     fontStyle: 'italic',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   actionBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   blockBtn: {
//     borderColor: '#F59E0B',
//   },
//   unblockBtn: {
//     borderColor: '#22C55E',
//   },
//   deleteBtn: {
//     borderColor: '#EF4444',
//   },
//   actionBtnText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 48,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 8,
//   },
// });


// UserManagement.tsx - Updated with click outside to close filter modal

import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const PRIMARY_DARK = '#0B2045';
const ACCENT_BLUE = '#4361EE';
const BG = '#F5F6FA';
const GRAY_TEXT = '#6B7280';
const BADGE_RED = '#E53E3E';
const BADGE_TAN = '#D97706';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  accountStatus: 'active' | 'suspended' | 'deactivated' | 'pending_verification';
  isSuspended: boolean;
  suspensionReason?: string;
  suspensionDate?: string;
  createdAt: string;
  phone?: string;
  profileImage?: string;
  avatarUrl?: string;
}

type FilterRole = 'all' | 'student' | 'instructor';
type FilterStatus = 'all' | 'active' | 'blocked';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<FilterRole>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminService.getUsers(
        selectedRole === 'all' ? undefined : selectedRole,
        selectedStatus
      );
      setUsers(data.data || data.users || data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedRole, selectedStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const isUserBlocked = (user: User) => {
    return user.isSuspended === true || user.accountStatus === 'suspended';
  };

  const handleBlockUser = async (userId: string, name: string) => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${name}? They will not be able to log in.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.blockUser(userId);
              Alert.alert('Success', 'User blocked successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  const handleUnblockUser = async (userId: string, name: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              await adminService.unblockUser(userId);
              Alert.alert('Success', 'User unblocked successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to unblock user');
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteUser(userId);
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#F59E0B';
      case 'instructor':
        return '#22C55E';
      case 'student':
        return '#4361EE';
      default:
        return '#6B7280';
    }
  };

  const getRoleLabel = (role: string) => {
    return role.toUpperCase();
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.accountStatus === 'active' && !u.isSuspended).length;
  const blockedUsers = users.filter(u => u.isSuspended).length;

  // Render Header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Role Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {(['all', 'student', 'instructor'] as const).map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => setSelectedRole(role)}
            style={[
              styles.categoryChip,
              selectedRole === role && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedRole === role && styles.categoryChipTextActive,
              ]}
            >
              {role === 'all' ? 'All' : role.toUpperCase()}
            </Text>
            {selectedRole === role && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" style={styles.chipCheck} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {filteredUsers.length} of {users.length} users
        </Text>
        <View style={styles.statsBadges}>
          <View style={[styles.statsBadge, { backgroundColor: '#22C55E15' }]}>
            <Text style={[styles.statsBadgeText, { color: '#22C55E' }]}>
              Active: {activeUsers}
            </Text>
          </View>
          <View style={[styles.statsBadge, { backgroundColor: '#EF444415' }]}>
            <Text style={[styles.statsBadgeText, { color: '#EF4444' }]}>
              Blocked: {blockedUsers}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render User Card
  const renderUserItem = ({ item }: { item: User }) => {
    const blocked = isUserBlocked(item);
    const isAdmin = item.role === 'admin';

    return (
      <View style={[styles.card, blocked && styles.cardBlocked]}>
        <View style={styles.cardHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            {item.phone && (
              <Text style={styles.userPhone}>{item.phone}</Text>
            )}
          </View>
          <View style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.role) + '15' }
          ]}>
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
              {getRoleLabel(item.role)}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: blocked ? '#EF4444' : '#22C55E' },
              ]}
            />
            <Text style={[
              styles.statusText,
              { color: blocked ? '#EF4444' : '#22C55E' }
            ]}>
              {blocked ? 'BLOCKED' : (item.accountStatus?.toUpperCase() || 'ACTIVE')}
            </Text>
            {blocked && item.suspensionReason && (
              <Text style={styles.suspensionReason}>
                ({item.suspensionReason})
              </Text>
            )}
          </View>

          {!isAdmin && (
            <View style={styles.actionButtons}>
              {blocked ? (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.unblockBtn]}
                  onPress={() => handleUnblockUser(item._id, item.name)}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color="#22C55E" />
                  <Text style={[styles.actionBtnText, { color: '#22C55E' }]}>Unblock</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.blockBtn]}
                  onPress={() => handleBlockUser(item._id, item.name)}
                >
                  <Ionicons name="ban-outline" size={16} color="#F59E0B" />
                  <Text style={[styles.actionBtnText, { color: '#F59E0B' }]}>Block</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDeleteUser(item._id, item.name)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Filter Modal - Updated with TouchableWithoutFeedback
  const renderFilterModal = () => (
    <Modal visible={showFilters} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Filter Users</Text>
              
              <Text style={styles.modalLabel}>Role</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoryScroll}>
                {(['all', 'student', 'instructor'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => {
                      setSelectedRole(role);
                    }}
                    style={[
                      styles.modalChip,
                      selectedRole === role && styles.modalChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedRole === role && styles.modalChipTextActive,
                      ]}
                    >
                      {role === 'all' ? 'All' : role.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.modalLabel, { marginTop: 16 }]}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoryScroll}>
                {(['all', 'active', 'blocked'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => {
                      setSelectedStatus(status);
                    }}
                    style={[
                      styles.modalChip,
                      selectedStatus === status && styles.modalChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedStatus === status && styles.modalChipTextActive,
                      ]}
                    >
                      {status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.modalApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_DARK} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_DARK} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users match your search' : 'No users found'}
            </Text>
          </View>
        }
      />

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  flatListContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
  },

  // Header
  headerContainer: {
    backgroundColor: BG,
    paddingTop: 8,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: PRIMARY_DARK,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories/Status Filters
  categoryScroll: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    gap: 8,
    paddingRight: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  chipCheck: {
    marginLeft: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statsText: {
    fontSize: 12,
    color: GRAY_TEXT,
  },
  statsBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statsBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // User Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBlocked: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  userEmail: {
    fontSize: 13,
    color: GRAY_TEXT,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  suspensionReason: {
    fontSize: 10,
    color: GRAY_TEXT,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
  },
  blockBtn: {
    borderColor: '#F59E0B',
  },
  unblockBtn: {
    borderColor: '#22C55E',
  },
  deleteBtn: {
    borderColor: '#EF4444',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginTop: 8,
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
    marginBottom: 10,
  },
  modalCategoryScroll: {
    marginBottom: 4,
  },
  modalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  modalChipActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  modalChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  modalChipTextActive: {
    color: '#FFFFFF',
  },
  modalApplyButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  modalApplyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});