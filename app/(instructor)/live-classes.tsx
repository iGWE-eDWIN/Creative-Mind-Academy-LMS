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
  instructor?: {
    _id: string;
  };
}

interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  courseId: {
    _id: string;
    title: string;
  } | null;
  scheduledAt: string;
  duration?: number;
  status: 'scheduled' | 'live' | 'ended';
  meetingLink?: string;
}

export default function InstructorLiveClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    courseId: '',
    scheduledAt: '',
    duration: '60',
    meetingLink: '',
  });

  const fetchData = useCallback(async () => {
    try {
      // Fetch classes
      const classesData = await instructorService.getInstructorClasses();
      setClasses(classesData.data || classesData);

      // Fetch courses and filter to only my courses
      const allCoursesRes = await adminService.getCourses();
      const allCourses: Course[] = allCoursesRes.courses || allCoursesRes;
      const filtered = allCourses.filter(
        (c) => c.instructor?._id === user?.id || c.instructor === user?.id
      );
      setMyCourses(filtered);
      
      if (filtered.length > 0) {
        setForm((prev) => ({ ...prev, courseId: filtered[0]._id }));
      }
    } catch (error: any) {
      console.error('Error fetching live class data:', error);
      Alert.alert('Error', 'Failed to load live class data');
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

  const handleStartClass = async (classId: string) => {
    try {
      await instructorService.startLiveClass(classId);
      Alert.alert('Success', 'Class started successfully!');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to start class');
    }
  };

  const handleEndClass = async (classId: string) => {
    try {
      await instructorService.endLiveClass(classId);
      Alert.alert('Success', 'Class ended successfully!');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to end class');
    }
  };

  const handleDeleteClass = async (classId: string, title: string) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await instructorService.deleteLiveClass(classId);
              Alert.alert('Success', 'Class deleted successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete class');
            }
          },
        },
      ]
    );
  };

  const handleScheduleSubmit = async () => {
    if (!form.title || !form.courseId || !form.scheduledAt) {
      Alert.alert('Incomplete Form', 'Please fill in Title, Course, and Scheduled Date.');
      return;
    }

    // Basic date parsing validation
    const parsedDate = new Date(form.scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid Date', 'Please write Date in ISO format (YYYY-MM-DD HH:MM).');
      return;
    }

    try {
      await instructorService.scheduleLiveClass({
        title: form.title,
        description: form.description || undefined,
        courseId: form.courseId,
        scheduledAt: parsedDate.toISOString(),
        duration: parseInt(form.duration) || 60,
        meetingLink: form.meetingLink || undefined,
      });

      Alert.alert('Success', 'Live class scheduled successfully!');
      setShowScheduleModal(false);
      setForm({
        title: '',
        description: '',
        courseId: myCourses[0]?._id || '',
        scheduledAt: '',
        duration: '60',
        meetingLink: '',
      });
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to schedule class');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#EF4444';
      case 'ended':
        return '#6B7280';
      default:
        return '#1A6FD4';
    }
  };

  const renderClassItem = ({ item }: { item: LiveClass }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.infoCol}>
          <Text style={styles.classTitle}>{item.title}</Text>
          <Text style={styles.courseTitle}>Course: {item.courseId?.title || 'No Course'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.timeText}>
        Scheduled: {new Date(item.scheduledAt).toLocaleString()} ({item.duration || 60} mins)
      </Text>

      {item.meetingLink && (
        <Text style={styles.linkText} numberOfLines={1}>
          Link: {item.meetingLink}
        </Text>
      )}

      <View style={styles.cardDivider} />

      <View style={styles.actionRow}>
        {item.status === 'scheduled' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.startBtn]}
            onPress={() => handleStartClass(item._id)}
          >
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>Start Class</Text>
          </TouchableOpacity>
        )}

        {item.status === 'live' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.endBtn]}
            onPress={() => handleEndClass(item._id)}
          >
            <Ionicons name="square" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>End Class</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDeleteClass(item._id, item.title)}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={[styles.btnText, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <Text style={styles.listHeading}>Your Classes</Text>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => setShowScheduleModal(true)}
          disabled={myCourses.length === 0}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A6FD4" />
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          renderItem={renderClassItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No classes scheduled yet</Text>
            </View>
          }
        />
      )}

      {/* Schedule Class Modal */}
      <Modal visible={showScheduleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Live Class</Text>
                <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Class Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Introduction to Figma"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
              />

              <Text style={styles.label}>Course *</Text>
              <View style={styles.pickerContainer}>
                {myCourses.map((c) => (
                  <TouchableOpacity
                    key={c._id}
                    style={[styles.pickerItem, form.courseId === c._id && styles.pickerItemActive]}
                    onPress={() => setForm({ ...form, courseId: c._id })}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        form.courseId === c._id && styles.pickerItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Scheduled At * (YYYY-MM-DD HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026-06-20 15:00"
                value={form.scheduledAt}
                onChangeText={(text) => setForm({ ...form, scheduledAt: text })}
              />

              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 60"
                keyboardType="numeric"
                value={form.duration}
                onChangeText={(text) => setForm({ ...form, duration: text })}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Optional class description"
                multiline
                numberOfLines={3}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />

              <Text style={styles.label}>Meeting Link (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Zoom link or internal link"
                value={form.meetingLink}
                onChangeText={(text) => setForm({ ...form, meetingLink: text })}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleScheduleSubmit}>
                <Text style={styles.submitBtnText}>Schedule Class</Text>
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
  timeText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 12,
  },
  linkText: {
    fontSize: 11,
    color: '#1A6FD4',
    marginTop: 4,
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
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  startBtn: {
    backgroundColor: '#22C55E',
  },
  endBtn: {
    backgroundColor: '#EF4444',
  },
  deleteBtn: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  btnText: {
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
  },
  textArea: {
    height: 70,
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
});
