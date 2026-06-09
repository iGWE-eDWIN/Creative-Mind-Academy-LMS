import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isLoading, userToken, userRole } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!userToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect based on user role
  switch (userRole) {
    case 'student':
      return <Redirect href="/(student)" />;
    case 'instructor':
      return <Redirect href="/(instructor)" />;
    case 'admin':
      return <Redirect href="/(admin)" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}