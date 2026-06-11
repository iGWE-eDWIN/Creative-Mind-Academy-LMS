import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    courseUpdates: boolean;
    assignmentReminders: boolean;
    promotionEmails: boolean;
  };
  privacy: {
    showProfile: boolean;
    showProgress: boolean;
    allowMessages: boolean;
  };
  appearance: {
    darkMode: boolean;
    reduceAnimations: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  security: {
    biometricLogin: boolean;
    twoFactorAuth: boolean;
  };
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: true,
      courseUpdates: true,
      assignmentReminders: true,
      promotionEmails: false,
    },
    privacy: {
      showProfile: true,
      showProgress: true,
      allowMessages: true,
    },
    appearance: {
      darkMode: false,
      reduceAnimations: false,
      fontSize: 'medium',
    },
    security: {
      biometricLogin: false,
      twoFactorAuth: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    loadSettings();
    checkBiometricSupport();
    calculateCacheSize();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: SettingsData) => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SettingsData>(
    category: K,
    key: keyof SettingsData[K],
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const calculateCacheSize = async () => {
    // Simulate cache size calculation
    setCacheSize(24.5); // MB
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all temporary data including downloaded course materials. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage except user data
              const keys = await AsyncStorage.getAllKeys();
              const excludeKeys = ['userData', 'accessToken', 'refreshToken', 'userSettings'];
              const keysToRemove = keys.filter(key => !excludeKeys.includes(key));
              await AsyncStorage.multiRemove(keysToRemove);
              setCacheSize(0);
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    }
  };

  const enableBiometric = async () => {
    if (!biometricAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to enable biometric login',
    });

    if (result.success) {
      updateSetting('security', 'biometricLogin', true);
    } else {
      Alert.alert('Authentication Failed', 'Please try again');
    }
  };

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 16,
      }}
    >
      <Ionicons name={icon as any} size={20} color="#4F46E5" />
      <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 8, color: '#1F2937' }}>
        {title}
      </Text>
    </View>
  );

  const SettingRow = ({
    label,
    description,
    type = 'toggle',
    value,
    onValueChange,
    actionLabel,
    onAction,
  }: {
    label: string;
    description?: string;
    type?: 'toggle' | 'select' | 'action';
    value?: any;
    onValueChange?: (value: any) => void;
    actionLabel?: string;
    onAction?: () => void;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>{label}</Text>
        {description && (
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{description}</Text>
        )}
      </View>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
          thumbColor="white"
        />
      )}
      {type === 'action' && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: '#4F46E5', fontSize: 14, fontWeight: '500' }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
      {type === 'select' && (
        <TouchableOpacity
          onPress={onAction}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: '#1F2937', fontSize: 14, marginRight: 8 }}>
            {value === 'small' ? 'Small' : value === 'large' ? 'Large' : 'Medium'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Account Information */}
      <View style={{ backgroundColor: 'white', marginTop: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#EEF2FF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="person" size={24} color="#4F46E5" />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
              {user?.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPasswordModal(true)}>
            <Text style={{ color: '#4F46E5', fontSize: 14 }}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appearance Section */}
      <SectionHeader title="Appearance" icon="color-palette-outline" />
      <View style={{ backgroundColor: 'white' }}>
        <SettingRow
          label="Dark Mode"
          description="Switch to dark theme"
          type="toggle"
          value={settings.appearance.darkMode}
          onValueChange={(value) => updateSetting('appearance', 'darkMode', value)}
        />
        <SettingRow
          label="Reduce Animations"
          description="Minimize motion effects"
          type="toggle"
          value={settings.appearance.reduceAnimations}
          onValueChange={(value) => updateSetting('appearance', 'reduceAnimations', value)}
        />
        <SettingRow
          label="Font Size"
          description="Adjust text size"
          type="select"
          value={settings.appearance.fontSize}
          onAction={() => {
            const options = ['small', 'medium', 'large'];
            Alert.alert(
              'Font Size',
              'Select your preferred font size',
              options.map(option => ({
                text: option.charAt(0).toUpperCase() + option.slice(1),
                onPress: () => updateSetting('appearance', 'fontSize', option),
              }))
            );
          }}
        />
      </View>

      {/* Notifications Section */}
      <SectionHeader title="Notifications" icon="notifications-outline" />
      <View style={{ backgroundColor: 'white' }}>
        <SettingRow
          label="Push Notifications"
          description="Receive push notifications on your device"
          type="toggle"
          value={settings.notifications.push}
          onValueChange={(value) => updateSetting('notifications', 'push', value)}
        />
        <SettingRow
          label="Email Notifications"
          description="Receive email updates"
          type="toggle"
          value={settings.notifications.email}
          onValueChange={(value) => updateSetting('notifications', 'email', value)}
        />
        <SettingRow
          label="Course Updates"
          description="New content and announcements"
          type="toggle"
          value={settings.notifications.courseUpdates}
          onValueChange={(value) => updateSetting('notifications', 'courseUpdates', value)}
        />
        <SettingRow
          label="Assignment Reminders"
          description="Due date reminders"
          type="toggle"
          value={settings.notifications.assignmentReminders}
          onValueChange={(value) => updateSetting('notifications', 'assignmentReminders', value)}
        />
        <SettingRow
          label="Promotion Emails"
          description="Special offers and updates"
          type="toggle"
          value={settings.notifications.promotionEmails}
          onValueChange={(value) => updateSetting('notifications', 'promotionEmails', value)}
        />
      </View>

      {/* Privacy Section */}
      <SectionHeader title="Privacy" icon="lock-closed-outline" />
      <View style={{ backgroundColor: 'white' }}>
        <SettingRow
          label="Show Profile"
          description="Allow other students to see your profile"
          type="toggle"
          value={settings.privacy.showProfile}
          onValueChange={(value) => updateSetting('privacy', 'showProfile', value)}
        />
        <SettingRow
          label="Show Progress"
          description="Share your course progress with instructors"
          type="toggle"
          value={settings.privacy.showProgress}
          onValueChange={(value) => updateSetting('privacy', 'showProgress', value)}
        />
        <SettingRow
          label="Allow Messages"
          description="Receive messages from instructors"
          type="toggle"
          value={settings.privacy.allowMessages}
          onValueChange={(value) => updateSetting('privacy', 'allowMessages', value)}
        />
      </View>

      {/* Security Section */}
      <SectionHeader title="Security" icon="shield-checkmark-outline" />
      <View style={{ backgroundColor: 'white' }}>
        {biometricAvailable && (
          <SettingRow
            label="Biometric Login"
            description="Use fingerprint or face recognition"
            type="toggle"
            value={settings.security.biometricLogin}
            onValueChange={enableBiometric}
          />
        )}
        <SettingRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security"
          type="toggle"
          value={settings.security.twoFactorAuth}
          onValueChange={(value) => {
            if (value) {
              Alert.alert(
                'Coming Soon',
                'Two-factor authentication will be available in a future update'
              );
            }
          }}
        />
      </View>

      {/* Data & Storage */}
      <SectionHeader title="Data & Storage" icon="cloud-outline" />
      <View style={{ backgroundColor: 'white' }}>
        <SettingRow
          label="Cache Size"
          description={`${cacheSize.toFixed(1)} MB stored`}
          type="action"
          actionLabel="Clear"
          onAction={clearCache}
        />
        <SettingRow
          label="Download Quality"
          description="Video quality for offline viewing"
          type="action"
          actionLabel="Auto"
          onAction={() => {
            Alert.alert(
              'Download Quality',
              'Select video quality for downloads',
              [
                { text: 'Auto', onPress: () => {} },
                { text: 'High (1080p)', onPress: () => {} },
                { text: 'Medium (720p)', onPress: () => {} },
                { text: 'Low (480p)', onPress: () => {} },
              ]
            );
          }}
        />
      </View>

      {/* About Section */}
      <SectionHeader title="About" icon="information-circle-outline" />
      <View style={{ backgroundColor: 'white', marginBottom: 32 }}>
        <SettingRow
          label="Version"
          description="App version 1.0.0"
          type="action"
          actionLabel=""
          onAction={() => {}}
        />
        <SettingRow
          label="Terms of Service"
          type="action"
          actionLabel="View"
          onAction={() => {
            Alert.alert('Terms of Service', 'View terms and conditions');
          }}
        />
        <SettingRow
          label="Privacy Policy"
          type="action"
          actionLabel="View"
          onAction={() => {
            Alert.alert('Privacy Policy', 'View privacy policy');
          }}
        />
        <SettingRow
          label="Rate Us"
          type="action"
          actionLabel="Rate"
          onAction={() => {
            Alert.alert('Rate Us', 'Thank you for your support!');
          }}
        />
        <SettingRow
          label="Contact Support"
          type="action"
          actionLabel="Contact"
          onAction={() => {
            Alert.alert('Contact Support', 'support@creativemindacademy.com');
          }}
        />
      </View>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 400,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                Current Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                New Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                Confirm New Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              onPress={changePassword}
              style={{
                backgroundColor: '#4F46E5',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {saving && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}
    </ScrollView>
  );
}