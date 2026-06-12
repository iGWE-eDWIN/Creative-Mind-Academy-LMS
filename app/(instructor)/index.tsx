import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function InstructorDashboard() {
  const { user } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructor Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      <Text style={styles.subtitle}>Manage your courses and students</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2045',
    marginBottom: 16,
  },
  welcome: {
    fontSize: 18,
    color: '#4361EE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});