import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

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

export default function AdminLayout() {
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="stats-chart-outline" color={color} size={size} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="people-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'User Management',
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="school-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'Course Management',
        }}
      />
      <Tabs.Screen
        name="enrollments"
        options={{
          title: 'Enrollments',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="receipt-outline" color={color} size={size} focused={focused} />
          ),
          headerTitle: 'Enrollment Management',
        }}
      />
      
      {/* Hidden Screens */}
      <Tabs.Screen
        name="create-course"
        options={{
          href: null,
          headerTitle: 'Create Course',
          headerShown: false,
        }}
      />
      
<Tabs.Screen
  name="edit-course/[id]"
  options={{
     href: null,
    headerShown: false,
  }}
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 78 : 64,
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
