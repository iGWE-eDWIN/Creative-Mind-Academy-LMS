import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyle,
        headerTintColor: '#FFFFFF',
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          headerTitle: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
          headerTitle: 'Browse Courses',
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: 'My Learning',
          tabBarIcon: ({ color, size }) => <Ionicons name="play-circle-outline" size={size} color={color} />,
          headerTitle: 'My Courses',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
          headerTitle: 'Messages',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
          headerTitle: 'My Wallet',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
      <Tabs.Screen
        name="course-player/[id]"
        options={{
          href: null,
          headerTitle: 'Course Player',
        }}
      />
      <Tabs.Screen
        name="assignments/[id]"
        options={{
          href: null,
          headerTitle: 'Assignment',
        }}
      />
      <Tabs.Screen
        name="quizzes/[id]"
        options={{
          href: null,
          headerTitle: 'Quiz',
        }}
      />
      <Tabs.Screen
        name="certificates"
        options={{
          href: null,
          headerTitle: 'My Certificates',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#4F46E5',
  },
  tabBarStyle: {
    backgroundColor: 'white',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
});