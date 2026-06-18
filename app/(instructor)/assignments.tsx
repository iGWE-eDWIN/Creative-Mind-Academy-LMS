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

interface LiveClass {
  _id: string;
  title: string;
  courseId: {
    _id: string;
    title: string;
  } | null;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  totalMarks: number;
  passMark: number;
  dueDate: string;
  liveClassId: string;
  visibleToStudents: boolean;
}

interface Submission {
  _id: string;
  userId: {
    _id: string;
    name?: string;
    fullName?: string;
    email: string;
  } | null;
  answers: string;
  grade?: number | string;
  feedback?: string;
  status: 'submitted' | 'graded';
  createdAt: string;
}

export default function InstructorAssignments() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Assignment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructions: '',
    totalMarks: '100',
    passMark: '50',
    dueDate: '',
    liveClassId: '',
  });

  // Submissions Modal
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Grading Form State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const classesData = await instructorService.getInstructorClasses();
      const list: LiveClass[] = classesData.data || classesData;
      setLiveClasses(list);

      if (list.length > 0) {
        setForm((prev) => ({ ...prev, liveClassId: list[0]._id }));
      }

      // Fetch assignments for all classes
      const allAssignments: Assignment[] = [];
      for (const liveClass of list) {
        try {
          const res = await instructorService.getAssignmentsByLiveClass(liveClass._id);
          const classAssignments: Assignment[] = res.data || res;
          allAssignments.push(...classAssignments);
        } catch (err) {
          console.error(`Error loading assignments for class ${liveClass._id}:`, err);
        }
      }
      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error fetching assignments data:', error);
      Alert.alert('Error', 'Failed to load assignments data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCreateAssignment = async () => {
    if (!form.title || !form.description || !form.liveClassId || !form.dueDate) {
      Alert.alert('Incomplete Form', 'Please fill in Title, Description, Live Class, and Due Date.');
      return;
    }

    const parsedDate = new Date(form.dueDate);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid Date', 'Please write Due Date in ISO format (YYYY-MM-DD HH:MM).');
      return;
    }

    // Find courseId associated with liveClass
    const selectedClass = liveClasses.find((c) => c._id === form.liveClassId);
    const courseId = selectedClass?.courseId?._id || '';

    try {
      await instructorService.createAssignment({
        title: form.title,
        description: form.description,
        instructions: form.instructions || undefined,
        courseId,
        liveClassId: form.liveClassId,
        totalMarks: parseInt(form.totalMarks) || 100,
        passMark: parseInt(form.passMark) || 50,
        dueDate: parsedDate.toISOString(),
      });

      Alert.alert('Success', 'Assignment created successfully!');
      setShowCreateModal(false);
      setForm({
        title: '',
        description: '',
        instructions: '',
        totalMarks: '100',
        passMark: '50',
        dueDate: '',
        liveClassId: liveClasses[0]?._id || '',
      });
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handlePublishAssignment = async (assignmentId: string) => {
    try {
      await instructorService.publishAssignment(assignmentId);
      Alert.alert('Success', 'Assignment published successfully!');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to publish assignment');
    }
  };

  const handleCloseAssignment = async (assignmentId: string) => {
    try {
      await instructorService.closeAssignment(assignmentId);
      Alert.alert('Success', 'Submissions closed for this assignment.');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to close assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string, title: string) => {
    Alert.alert(
      'Delete Assignment',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await instructorService.deleteAssignment(assignmentId);
              Alert.alert('Success', 'Assignment deleted successfully');
              fetchData();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete assignment');
            }
          },
        },
      ]
    );
  };

  const openSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
    setLoadingSubmissions(true);
    try {
      const res = await instructorService.getSubmissionsForAssignment(assignment._id);
      setSubmissions(res.data || res);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const submitGrade = async () => {
    if (!gradingSubmissionId) return;
    if (!gradeInput) {
      Alert.alert('Required', 'Please enter a grade.');
      return;
    }

    setSubmittingGrade(true);
    try {
      await instructorService.gradeSubmission(gradingSubmissionId, {
        grade: gradeInput,
        feedback: feedbackInput || undefined,
      });

      Alert.alert('Success', 'Submission graded successfully!');
      setGradingSubmissionId(null);
      setGradeInput('');
      setFeedbackInput('');
      if (selectedAssignment) {
        openSubmissions(selectedAssignment);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const renderAssignmentItem = ({ item }: { item: Assignment }) => {
    const parentClass = liveClasses.find((c) => c._id === item.liveClassId);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.infoCol}>
            <Text style={styles.classTitle}>{item.title}</Text>
            <Text style={styles.courseTitle}>Live Class: {parentClass?.title || 'No Class'}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.visibleToStudents ? '#22C55E15' : '#6B728015' },
            ]}
          />
        </View>

        <Text style={styles.descText} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.dueDateText}>
          Due: {new Date(item.dueDate).toLocaleString()} · Marks: {item.totalMarks}
        </Text>

        <View style={styles.cardDivider} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openSubmissions(item)}>
            <Ionicons name="people-outline" size={16} color="#1A6FD4" />
            <Text style={[styles.btnText, { color: '#1A6FD4' }]}>Submissions</Text>
          </TouchableOpacity>

          {!item.visibleToStudents && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handlePublishAssignment(item._id)}
            >
              <Ionicons name="cloud-upload-outline" size={16} color="#22C55E" />
              <Text style={[styles.btnText, { color: '#22C55E' }]}>Publish</Text>
            </TouchableOpacity>
          )}

          {item.visibleToStudents && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleCloseAssignment(item._id)}
            >
              <Ionicons name="close-circle-outline" size={16} color="#F59E0B" />
              <Text style={[styles.btnText, { color: '#F59E0B' }]}>Close</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDeleteAssignment(item._id, item.title)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={[styles.btnText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <Text style={styles.listHeading}>Your Assignments</Text>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => setShowCreateModal(true)}
          disabled={liveClasses.length === 0}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A6FD4" />
        </View>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item._id}
          renderItem={renderAssignmentItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A6FD4" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No assignments found</Text>
            </View>
          }
        />
      )}

      {/* Create Assignment Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Assignment</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Assignment Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Final Design Presentation"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
              />

              <Text style={styles.label}>Live Class *</Text>
              <View style={styles.pickerContainer}>
                {liveClasses.map((c) => (
                  <TouchableOpacity
                    key={c._id}
                    style={[styles.pickerItem, form.liveClassId === c._id && styles.pickerItemActive]}
                    onPress={() => setForm({ ...form, liveClassId: c._id })}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        form.liveClassId === c._id && styles.pickerItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Due Date * (YYYY-MM-DD HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026-06-25 23:59"
                value={form.dueDate}
                onChangeText={(text) => setForm({ ...form, dueDate: text })}
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Total Marks</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.totalMarks}
                    onChangeText={(text) => setForm({ ...form, totalMarks: text })}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Pass Mark</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.passMark}
                    onChangeText={(text) => setForm({ ...form, passMark: text })}
                  />
                </View>
              </View>

              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Overview of what students should do"
                multiline
                numberOfLines={3}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />

              <Text style={styles.label}>Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Submission instructions e.g. upload link"
                multiline
                numberOfLines={3}
                value={form.instructions}
                onChangeText={(text) => setForm({ ...form, instructions: text })}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateAssignment}>
                <Text style={styles.submitBtnText}>Create Assignment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Submissions Modal */}
      <Modal visible={showSubmissionsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                Submissions: {selectedAssignment?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowSubmissionsModal(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {loadingSubmissions ? (
              <ActivityIndicator size="large" color="#1A6FD4" style={{ marginVertical: 32 }} />
            ) : (
              <FlatList
                data={submissions}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                renderItem={({ item }) => {
                  const studentName = item.userId?.name || item.userId?.fullName || 'Student';
                  const isGraded = item.status === 'graded';
                  return (
                    <View style={styles.subCard}>
                      <View style={styles.subHeader}>
                        <View>
                          <Text style={styles.subStudent}>{studentName}</Text>
                          <Text style={styles.subDate}>
                            Submitted: {new Date(item.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={[styles.subStatus, { backgroundColor: isGraded ? '#22C55E15' : '#1A6FD415' }]}>
                          <Text style={{ color: isGraded ? '#22C55E' : '#1A6FD4', fontSize: 10, fontWeight: '700' }}>
                            {isGraded ? `GRADED (${item.grade})` : 'SUBMITTED'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.subAnswer}>Answers/Link: {item.answers}</Text>
                      {item.feedback && <Text style={styles.subFeedback}>Feedback: {item.feedback}</Text>}

                      {gradingSubmissionId === item._id ? (
                        <View style={styles.gradeForm}>
                          <Text style={styles.label}>Grade (out of {selectedAssignment?.totalMarks})</Text>
                          <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g. 85"
                            value={gradeInput}
                            onChangeText={setGradeInput}
                          />

                          <Text style={styles.label}>Feedback</Text>
                          <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Provide feedback..."
                            multiline
                            numberOfLines={2}
                            value={feedbackInput}
                            onChangeText={setFeedbackInput}
                          />

                          <View style={styles.gradeFormButtons}>
                            <TouchableOpacity
                              style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                              onPress={() => setGradingSubmissionId(null)}
                            >
                              <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionBtn, { backgroundColor: '#22C55E' }]}
                              onPress={submitGrade}
                              disabled={submittingGrade}
                            >
                              {submittingGrade ? (
                                <ActivityIndicator color="#FFFFFF" />
                              ) : (
                                <Text style={styles.btnText}>Submit Grade</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        !isGraded && (
                          <TouchableOpacity
                            style={[styles.actionBtn, styles.gradeBtn]}
                            onPress={() => {
                              setGradingSubmissionId(item._id);
                              setGradeInput('');
                              setFeedbackInput('');
                            }}
                          >
                            <Ionicons name="create-outline" size={14} color="#FFFFFF" />
                            <Text style={styles.btnText}>Grade</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <Text style={styles.emptySubText}>No submissions received yet</Text>
                }
              />
            )}
          </View>
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
  descText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 10,
    lineHeight: 18,
  },
  dueDateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '600',
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
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  gradeBtn: {
    backgroundColor: '#1A6FD4',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 11,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
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
  subCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subStudent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  subDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  subStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subAnswer: {
    fontSize: 13,
    color: '#374151',
    marginTop: 8,
  },
  subFeedback: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptySubText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 32,
  },
  gradeForm: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  gradeFormButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
});
