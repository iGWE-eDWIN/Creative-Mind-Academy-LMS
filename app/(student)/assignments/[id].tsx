import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../../services/api';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  instructions: string;
  attachments?: string[];
  submission?: {
    submittedAt: string;
    files: string[];
    score?: number;
    feedback?: string;
    status: 'submitted' | 'graded' | 'late';
  };
}

export default function AssignmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/assignments/${id}`);
      setAssignment(response.data.assignment);
      if (response.data.assignment.submission?.comments) {
        setComments(response.data.assignment.submission.comments);
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      Alert.alert('Error', 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/zip'],
        copyToCacheDirectory: true,
      });
      
      if (result.assets && result.assets.length > 0) {
        setSelectedFiles([...selectedFiles, result.assets[0]]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Error', 'Please select at least one file to submit');
      return false;
    }

    const formData = new FormData();
    for (const file of selectedFiles) {
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      if (fileInfo.exists) {
        formData.append('files', {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name,
        } as any);
      }
    }
    formData.append('comments', comments);

    try {
      const response = await api.post(`/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.success;
    } catch (error) {
      console.error('Error uploading files:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    Alert.alert(
      'Submit Assignment',
      'Are you sure you want to submit this assignment? You cannot edit it after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSubmitting(true);
            const success = await uploadFiles();
            if (success) {
              Alert.alert('Success', 'Assignment submitted successfully!');
              fetchAssignment(); // Refresh to show submission
              setSelectedFiles([]);
              setComments('');
            } else {
              Alert.alert('Error', 'Failed to submit assignment');
            }
            setSubmitting(false);
          },
        },
      ]
    );
  };

  const isOverdue = assignment && new Date(assignment.dueDate) < new Date();
  const hasSubmitted = assignment?.submission?.status === 'submitted' || assignment?.submission?.status === 'graded';
  const isGraded = assignment?.submission?.status === 'graded';

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Assignment not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#4F46E5', padding: 24 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          {assignment.title}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Due Date</Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
              {new Date(assignment.dueDate).toLocaleTimeString()}
            </Text>
          </View>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Total Points</Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              {assignment.totalPoints}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Status Banner */}
        {hasSubmitted && (
          <View
            style={{
              backgroundColor: isGraded ? '#D1FAE5' : '#FEF3C7',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={isGraded ? 'checkmark-circle' : 'time-outline'}
                size={24}
                color={isGraded ? '#059669' : '#D97706'}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontWeight: '600', color: isGraded ? '#059669' : '#D97706' }}>
                  {isGraded ? 'Graded' : 'Submitted'}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  Submitted on {new Date(assignment.submission!.submittedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            {isGraded && (
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
                <Text style={{ fontWeight: '600' }}>Score: {assignment.submission!.score}/{assignment.totalPoints}</Text>
                {assignment.submission!.feedback && (
                  <Text style={{ marginTop: 8, color: '#4B5563' }}>{assignment.submission!.feedback}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {isOverdue && !hasSubmitted && (
          <View
            style={{
              backgroundColor: '#FEE2E2',
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={{ marginLeft: 8, color: '#DC2626' }}>This assignment is overdue</Text>
          </View>
        )}

        {/* Description */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Description</Text>
          <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{assignment.description}</Text>
        </View>

        {/* Instructions */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Instructions</Text>
          <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{assignment.instructions}</Text>
        </View>

        {/* Attachments */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Resources</Text>
            {assignment.attachments.map((url, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {/* Open file */}}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Ionicons name="attach" size={20} color="#4F46E5" />
                <Text style={{ marginLeft: 8, color: '#4F46E5' }}>Resource {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Submission Section */}
        {!hasSubmitted && !isOverdue && (
          <>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Your Submission</Text>
              
              {/* File Upload */}
              <TouchableOpacity
                onPress={pickFile}
                style={{
                  borderWidth: 2,
                  borderColor: '#E5E7EB',
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  padding: 20,
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                <Text style={{ marginTop: 8, color: '#6B7280' }}>Upload Files</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>PDF, DOC, ZIP (Max 50MB)</Text>
              </TouchableOpacity>

              {/* Selected Files */}
              {selectedFiles.map((file, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F3F4F6',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons name="document-text" size={20} color="#4F46E5" />
                    <Text style={{ marginLeft: 8, flex: 1 }} numberOfLines={1}>
                      {file.name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFile(index)}>
                    <Ionicons name="close-circle" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Comments */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Comments (Optional)</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
                placeholder="Add any comments for your instructor..."
                multiline
                value={comments}
                onChangeText={setComments}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || selectedFiles.length === 0}
              style={{
                backgroundColor: selectedFiles.length === 0 ? '#D1D5DB' : '#4F46E5',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 32,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}