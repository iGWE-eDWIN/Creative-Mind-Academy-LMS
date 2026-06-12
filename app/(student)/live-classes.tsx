// import api from '@/services/api';
// import { Ionicons } from '@expo/vector-icons';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Linking,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface LiveClass {
//   _id: string;
//   title: string;
//   description: string;
//   courseId: string;
//   courseTitle: string;
//   instructor: { name: string };
//   meetLink: string;
//   scheduledAt: string;
//   duration: number;
//   status: 'upcoming' | 'ongoing' | 'ended';
// }

// export default function LiveClassesScreen() {
//   const [classes, setClasses] = useState<LiveClass[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchLiveClasses();
//     const interval = setInterval(fetchLiveClasses, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchLiveClasses = async () => {
//     try {
//       const response = await api.get('/students/live-classes');
//       setClasses(response.data.classes);
//     } catch (error) {
//       console.error('Error fetching live classes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const joinClass = async (meetLink: string) => {
//     try {
//       const supported = await Linking.canOpenURL(meetLink);
//       if (supported) {
//         await Linking.openURL(meetLink);
//       } else {
//         Alert.alert('Error', 'Cannot open meeting link');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Unable to open the meeting link');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'upcoming':
//         return '#F59E0B';
//       case 'ongoing':
//         return '#10B981';
//       case 'ended':
//         return '#6B7280';
//       default:
//         return '#6B7280';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'upcoming':
//         return 'Upcoming';
//       case 'ongoing':
//         return 'Live Now';
//       case 'ended':
//         return 'Ended';
//       default:
//         return status;
//     }
//   };

//   const LiveClassCard = ({ item }: { item: LiveClass }) => {
//     const isUpcoming = new Date(item.scheduledAt) > new Date();
//     const isOngoing = item.status === 'ongoing';
//     const canJoin = isOngoing || (isUpcoming && new Date(item.scheduledAt) <= new Date(Date.now() + 15 * 60000));

//     return (
//       <View style={styles.classCard}>
//         <View style={styles.classHeader}>
//           <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}10` }]}>
//             <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//               {getStatusText(item.status)}
//             </Text>
//           </View>
//           <Text style={styles.classTime}>
//             {new Date(item.scheduledAt).toLocaleTimeString()}
//           </Text>
//         </View>

//         <Text style={styles.classTitle}>{item.title}</Text>
//         <Text style={styles.courseTitle}>{item.courseTitle}</Text>
//         <Text style={styles.classDescription} numberOfLines={2}>
//           {item.description}
//         </Text>

//         <View style={styles.classMeta}>
//           <View style={styles.metaItem}>
//             <Ionicons name="person-outline" size={14} color="#6B7280" />
//             <Text style={styles.metaText}>{item.instructor.name}</Text>
//           </View>
//           <View style={styles.metaItem}>
//             <Ionicons name="time-outline" size={14} color="#6B7280" />
//             <Text style={styles.metaText}>{item.duration} min</Text>
//           </View>
//         </View>

//         {canJoin && item.status !== 'ended' && (
//           <TouchableOpacity
//             onPress={() => joinClass(item.meetLink)}
//             style={[styles.joinButton, isOngoing ? styles.joinButtonLive : styles.joinButtonUpcoming]}
//           >
//             <Ionicons name="videocam" size={20} color="white" />
//             <Text style={styles.joinButtonText}>
//               {isOngoing ? 'Join Live Class' : 'Join Early'}
//             </Text>
//           </TouchableOpacity>
//         )}

//         {!canJoin && item.status === 'upcoming' && (
//           <View style={styles.waitingContainer}>
//             <Text style={styles.waitingText}>
//               Class starts at {new Date(item.scheduledAt).toLocaleString()}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={classes}
//       renderItem={({ item }) => <LiveClassCard item={item} />}
//       keyExtractor={(item) => item._id}
//       contentContainerStyle={styles.listContainer}
//       ListEmptyComponent={() => (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="videocam-off-outline" size={60} color="#D1D5DB" />
//           <Text style={styles.emptyTitle}>No live classes scheduled</Text>
//           <Text style={styles.emptyText}>Check back later for upcoming live sessions</Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   classCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   classHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   classTime: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   classTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#1F2937',
//   },
//   courseTitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   classDescription: {
//     fontSize: 14,
//     color: '#4B5563',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   classMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 16,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   joinButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   joinButtonLive: {
//     backgroundColor: '#10B981',
//   },
//   joinButtonUpcoming: {
//     backgroundColor: '#4F46E5',
//   },
//   joinButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   waitingContainer: {
//     backgroundColor: '#F3F4F6',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   waitingText: {
//     color: '#6B7280',
//     fontSize: 12,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyTitle: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   emptyText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
// });


import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_BG = '#0B1D3A';
const BLUE = '#3B6EF9';
const GRAY = '#6B7280';
const PRIMARY_DARK = '#0B1D3A';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  instructor: { name: string };
  meetLink: string;
  scheduledAt: string;
  duration: number;
  status: 'upcoming' | 'ongoing' | 'ended';
}

export default function LiveClassesScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveClasses();
    const interval = setInterval(fetchLiveClasses, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await api.get('/students/live-classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinClass = async (meetLink: string) => {
    try {
      const supported = await Linking.canOpenURL(meetLink);
      if (supported) {
        await Linking.openURL(meetLink);
      } else {
        Alert.alert('Error', 'Cannot open meeting link');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the meeting link');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return ORANGE;
      case 'ongoing':
        return GREEN;
      case 'ended':
        return GRAY;
      default:
        return GRAY;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Live Now';
      case 'ended':
        return 'Ended';
      default:
        return status;
    }
  };

  const LiveClassCard = ({ item }: { item: LiveClass }) => {
    const isUpcoming = new Date(item.scheduledAt) > new Date();
    const isOngoing = item.status === 'ongoing';
    const canJoin = isOngoing || (isUpcoming && new Date(item.scheduledAt) <= new Date(Date.now() + 15 * 60000));

    return (
      <View style={styles.classCard}>
        <View style={styles.classHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color={GRAY} />
            <Text style={styles.classTime}>
              {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <Text style={styles.classTitle}>{item.title}</Text>
        <View style={styles.courseInfo}>
          <Ionicons name="book-outline" size={14} color={BLUE} />
          <Text style={styles.courseTitle}>{item.courseTitle}</Text>
        </View>
        
        <Text style={styles.classDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.classMeta}>
          <View style={styles.metaItem}>
            <View style={styles.metaIconBox}>
              <Ionicons name="person-outline" size={12} color={GRAY} />
            </View>
            <Text style={styles.metaText}>{item.instructor.name}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <View style={styles.metaIconBox}>
              <Ionicons name="hourglass-outline" size={12} color={GRAY} />
            </View>
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
        </View>

        {canJoin && item.status !== 'ended' && (
          <TouchableOpacity
            onPress={() => joinClass(item.meetLink)}
            style={[styles.joinButton, isOngoing ? styles.joinButtonLive : styles.joinButtonUpcoming]}
          >
            <Ionicons name="videocam" size={18} color="#FFFFFF" />
            <Text style={styles.joinButtonText}>
              {isOngoing ? 'Join Live Class' : 'Join Early'}
            </Text>
          </TouchableOpacity>
        )}

        {!canJoin && item.status === 'upcoming' && (
          <View style={styles.waitingContainer}>
            <Ionicons name="alarm-outline" size={16} color={GRAY} />
            <Text style={styles.waitingText}>
              Starts at {new Date(item.scheduledAt).toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

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
            <Text style={styles.headerTitle}>Live Classes</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </View>

      {/* Scrollable Content */}
      <FlatList
        data={classes}
        renderItem={({ item }) => <LiveClassCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="videocam-off-outline" size={48} color={GRAY} />
            </View>
            <Text style={styles.emptyTitle}>No live classes scheduled</Text>
            <Text style={styles.emptyText}>Check back later for upcoming live sessions</Text>
          </View>
        )}
      />
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
  // List Container
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  // Class Card
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  classTime: {
    fontSize: 12,
    color: GRAY,
    fontWeight: '500',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: PRIMARY_DARK,
    lineHeight: 24,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '500',
  },
  classDescription: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 14,
    lineHeight: 20,
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 12,
    color: GRAY,
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonLive: {
    backgroundColor: GREEN,
  },
  joinButtonUpcoming: {
    backgroundColor: BLUE,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  waitingText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_DARK,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
  },
});