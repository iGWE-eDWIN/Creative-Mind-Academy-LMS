import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const HEADER_BG = '#0B1D3A';
const BLUE = '#0B1D3A';
const GRAY = '#6B7280';
const PRIMARY_DARK = '#0B1D3A';

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
  const router = useRouter()
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
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconBox}>
        <Ionicons name={icon as any} size={18} color={BLUE} />
      </View>
      <Text style={styles.sectionHeaderText}>{title}</Text>
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
    <View style={styles.settingRow}>
      <View style={styles.settingRowContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D5DB', true: BLUE }}
          thumbColor="white"
        />
      )}
      {type === 'action' && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.settingActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
      {type === 'select' && (
        <TouchableOpacity onPress={onAction} style={styles.settingSelectButton}>
          <Text style={styles.settingSelectText}>
            {value === 'small' ? 'Small' : value === 'large' ? 'Large' : 'Medium'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BLUE} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Fixed Header - Does not scroll */}
      <View style={styles.fixedHeader}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>App Settings</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Information */}
        <View style={styles.accountCard}>
          {/* Profile Image and Name on same line */}
          <View style={styles.profileRow}>
            <View style={styles.accountAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.accountName}>{user?.name}</Text>
          </View>
          
          {/* Email directly below name */}
          <Text style={styles.accountEmail}>{user?.email}</Text>
          
          {/* Change Password Button centered below */}
          <TouchableOpacity 
            onPress={() => setShowPasswordModal(true)}
            style={styles.changePasswordButton}
          >
            <Ionicons name="lock-closed-outline" size={16} color="#FFFFFF" />
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" icon="color-palette-outline" />
        <View style={styles.sectionCard}>
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
        <View style={styles.sectionCard}>
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
        <View style={styles.sectionCard}>
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
        <View style={styles.sectionCard}>
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
        <View style={styles.sectionCard}>
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
        <View style={[styles.sectionCard, styles.lastSection]}>
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
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color={GRAY} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Current Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>New Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity onPress={changePassword} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  // Fixed Header
  fixedHeader: {
    backgroundColor: HEADER_BG,
    paddingBottom: 16,
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
  // Scroll Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Account Card - Updated Layout
  accountCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  accountEmail: {
    fontSize: 13,
    color: GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: BLUE,
    width: '100%',
  },
  changePasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginLeft: 10,
  },
  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  lastSection: {
    marginBottom: 20,
  },
  // Setting Row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingRowContent: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_DARK,
  },
  settingDescription: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
  },
  settingActionText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '600',
  },
  settingSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingSelectText: {
    color: PRIMARY_DARK,
    fontSize: 14,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_DARK,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: PRIMARY_DARK,
  },
  modalButton: {
    backgroundColor: BLUE,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Saving Overlay
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});