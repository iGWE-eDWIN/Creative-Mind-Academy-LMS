import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
// import { NotificationProvider } from '../src/context/NotificationContext';

// Create a separate component for the navigation logic
function RootLayoutNav() {
  const { userToken, userRole, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inStudentGroup = segments[0] === '(student)';
    const inInstructorGroup = segments[0] === '(instructor)';
    const inAdminGroup = segments[0] === '(admin)';

    console.log('Navigation check:', { 
      userToken: !!userToken, 
      userRole,
      isLoading, 
      segments, 
      inAuthGroup,
      inStudentGroup,
      inInstructorGroup,
      inAdminGroup
    });

    if (!userToken && !inAuthGroup) {
      // Not signed in, redirect to login
      console.log('Redirecting to login...');
      router.replace('/(auth)/login');
      return;
    }

    if (userToken) {
      // User is signed in
      
      // If user is in auth group, redirect to their appropriate dashboard
      if (inAuthGroup) {
        // Redirect based on user role
        switch (userRole) {
          case 'admin':
            console.log('Redirecting admin to admin dashboard');
            router.replace('/(admin)');
            break;
          case 'instructor':
            console.log('Redirecting instructor to instructor dashboard');
            router.replace('/(instructor)');
            break;
          case 'student':
            console.log('Redirecting student to student dashboard');
            router.replace('/(student)');
            break;
          default:
            console.log('Unknown role, redirecting to login');
            router.replace('/(auth)/login');
        }
        return;
      }

      // Check if user is accessing the wrong section based on their role
      if (userRole === 'student' && !inStudentGroup) {
        console.log('Student trying to access non-student area, redirecting to student dashboard');
        router.replace('/(student)');
        return;
      }

      if (userRole === 'instructor' && !inInstructorGroup) {
        console.log('Instructor trying to access non-instructor area, redirecting to instructor dashboard');
        router.replace('/(instructor)');
        return;
      }

      if (userRole === 'admin' && !inAdminGroup) {
        console.log('Admin trying to access non-admin area, redirecting to admin dashboard');
        router.replace('/(admin)');
        return;
      }
    }
  }, [userToken, userRole, isLoading, segments]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(instructor)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <SocketProvider>
          {/* <NotificationProvider> */}
            <StatusBar style="dark" />
            <RootLayoutNav />
          {/* </NotificationProvider> */}
        </SocketProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});