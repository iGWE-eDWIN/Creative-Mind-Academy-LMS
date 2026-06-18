import { adminService } from '@/services/admin';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
}

interface Enrollment {
  _id: string;
  userId: User | null;
  courseId: Course | null;
  status: 'active' | 'completed';
  createdAt: string;
  certificateGenerated?: boolean;
}

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await adminService.getEnrollments();
      const list = response.data || response;
      setEnrollments(list);
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEnrollments();
  };

  const handleMarkComplete = async (enrollmentId: string) => {
    Alert.alert(
      'Complete Enrollment',
      'Are you sure you want to mark this enrollment as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await adminService.markEnrollmentComplete(enrollmentId);
              Alert.alert('Success', 'Enrollment marked as completed');
              fetchEnrollments();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to update enrollment');
            }
          },
        },
      ]
    );
  };

  const handleGenerateCertificate = async (enrollmentId: string) => {
    try {
      await adminService.generateCertificate(enrollmentId);
      Alert.alert('Success', 'Certificate generated successfully');
      fetchEnrollments();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate certificate');
    }
  };

  const filteredEnrollments = enrollments.filter((item) => {
    const studentName = item.userId?.name || item.userId?.fullName || '';
    const courseTitle = item.courseId?.title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    return status === 'completed' ? '#22C55E' : '#1A6FD4';
  };

  const renderEnrollmentItem = ({ item }: { item: Enrollment }) => {
    const nameStr = item.userId?.name || item.userId?.fullName || 'Unknown Student';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.infoCol}>
            <Text style={styles.studentName}>{nameStr}</Text>
            <Text style={styles.studentEmail}>{item.userId?.email || 'No Email'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.courseSection}>
          <Ionicons name="book-outline" size={16} color="#6B7280" />
          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.courseId?.title || 'Unknown Course'}
          </Text>
        </View>

        <Text style={styles.dateText}>
          Enrolled: {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.cardDivider} />

        <View style={styles.actionRow}>
          {item.status === 'active' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.completeBtn]}
              onPress={() => handleMarkComplete(item._id)}
            >
              <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
              <Text style={styles.completeBtnText}>Mark Complete</Text>
            </TouchableOpacity>
          )}

          {item.status === 'completed' && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.certBtn,
                item.certificateGenerated && styles.certBtnDisabled,
              ]}
              disabled={item.certificateGenerated}
              onPress={() => handleGenerateCertificate(item._id)}
            >
              <Ionicons name="ribbon-outline" size={16} color="#FFFFFF" />
              <Text style={styles.certBtnText}>
                {item.certificateGenerated ? 'Certificate Sent' : 'Send Certificate'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student or course..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setSelectedFilter(opt)}
            style={[styles.filterPill, selectedFilter === opt && styles.filterPillActive]}
          >
            <Text style={[styles.filterPillText, selectedFilter === opt && styles.filterPillTextActive]}>
              {opt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A6FD4" />
        </View>
      ) : (
        <FlatList
          data={filteredEnrollments}
          keyExtractor={(item) => item._id}
          renderItem={renderEnrollmentItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No enrollments found</Text>
            </View>
          }
        />
      )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1A6FD4',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
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
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
  courseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
  },
  courseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeBtn: {
    backgroundColor: '#1A6FD4',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  certBtn: {
    backgroundColor: '#F59E0B',
  },
  certBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  certBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
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
});
