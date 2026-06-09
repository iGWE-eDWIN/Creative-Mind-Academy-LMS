import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
// import { NotificationProvider } from '../src/context/NotificationContext';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  // const [fontsLoaded] = useFonts({
  //   'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  //   'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  //   'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#4F46E5" />
  //     </View>
  //   );
  // }


   return (
    <PaperProvider>
      <AuthProvider>
        <SocketProvider>
          {/* <NotificationProvider> */}
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(student)" />
              {/* <Stack.Screen name="(instructor)" />
              <Stack.Screen name="(admin)" /> */}
            </Stack>
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
  },
});
