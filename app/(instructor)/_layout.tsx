import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function InstructorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="students" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  // Add your styles here if needed
});