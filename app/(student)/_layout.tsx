
import { Ionicons } from '@expo/vector-icons';
import { Tabs, } from 'expo-router';
import { StyleSheet, View } from 'react-native';


function TabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconWrapper}>
      <Ionicons name={name} size={size} color={color} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyle,
        headerTintColor: '#FFFFFF',
        tabBarActiveTintColor: '#1A6FD4',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarShowLabel: true,
      }}
    >
      {/* Visible Tab Screens */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home-outline" color={color} size={size} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="school-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'Browse Courses',
          // headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: 'My Learning',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="book-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'My Courses',
          
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="chatbubble-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'Messages',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="wallet-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'My Wallet',
        }}
      />
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'My Profile',
        }}
      /> */}

      {/* Hidden Screens - Not shown in tab bar */}
      <Tabs.Screen
        name="profile"
        options={{ href: null, headerTitle: 'Profile',  headerShown: false, }}
      />
      <Tabs.Screen
        name="course-details/[id]"
        options={{ href: null, headerTitle: 'Course Details',headerShown: false, }}
      />
      <Tabs.Screen
        name="course-player/[id]"
        options={{ href: null, headerTitle: 'Course Player', headerShown: false, }}
      />
      <Tabs.Screen
        name="assignments/[id]"
        options={{ href: null, headerTitle: 'Assignment', headerShown: false, }}
      />
      <Tabs.Screen
        name="quizzes/[id]"
        options={{ href: null, headerTitle: 'Quiz', headerShown: false, }}
      />
      <Tabs.Screen
        name="quizzes/result/[id]"
        options={{ href: null, headerTitle: 'Quiz Result', headerShown: false, }}
      />
      <Tabs.Screen
        name="certificates"
        options={{ href: null, headerTitle: 'My Certificates', headerShown: false, }}
      />
      <Tabs.Screen
        name="certificate-view/[id]"
        options={{ href: null, headerTitle: 'Certificate', headerShown: false, }}
      />
      <Tabs.Screen
        name="live-classes"
        options={{ href: null, headerTitle: 'Live Classes', headerShown: false, }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null, headerTitle: 'Notifications', headerShown: false, }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null, headerTitle: 'Settings', headerShown: false, }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#0B1E3D',
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 6,
    height: 64,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 28,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1A6FD4',
    position: 'absolute',
    bottom: -4,
  },
});