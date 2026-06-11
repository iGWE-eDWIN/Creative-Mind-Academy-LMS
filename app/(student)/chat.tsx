
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import {
//     ActivityIndicator,
//     FlatList,
//     KeyboardAvoidingView,
//     Platform,
//     RefreshControl,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from 'react-native';

// interface Message {
//   _id: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   createdAt: string;
//   status: 'sent' | 'delivered' | 'read';
// }

// interface Conversation {
//   _id: string;
//   participant: {
//     id: string;
//     name: string;
//     avatar?: string;
//     role: string;
//   };
//   lastMessage: string;
//   lastMessageTime: string;
//   unreadCount: number;
// }

// // Mock Data
// const MOCK_CONVERSATIONS: Conversation[] = [
//   {
//     _id: '1',
//     participant: {
//       id: '101',
//       name: 'Sarah Chen',
//       role: 'instructor',
//     },
//     lastMessage: 'Great progress on the React project! Keep it up! 🚀',
//     lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
//     unreadCount: 2,
//   },
//   {
//     _id: '2',
//     participant: {
//       id: '102',
//       name: 'David Miller',
//       role: 'instructor',
//     },
//     lastMessage: 'The next live class starts in 30 minutes. Don\'t be late!',
//     lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
//     unreadCount: 0,
//   },
//   {
//     _id: '3',
//     participant: {
//       id: '103',
//       name: 'Alex Rivera',
//       role: 'student',
//     },
//     lastMessage: 'Did you finish the assignment? I\'m struggling with the last part',
//     lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Monday
//     unreadCount: 0,
//   },
//   {
//     _id: '4',
//     participant: {
//       id: '104',
//       name: 'Creative Minds Support',
//       role: 'support',
//     },
//     lastMessage: 'Your wallet has been credited with ₦10,000 for course completion.',
//     lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Oct 20
//     unreadCount: 0,
//   },
// ];

// const MOCK_MESSAGES: Record<string, Message[]> = {
//   '1': [
//     {
//       _id: 'm1',
//       senderId: '101',
//       receiverId: 'current_user',
//       content: 'Hi there! I saw you completed the React module. Great job!',
//       createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm2',
//       senderId: 'current_user',
//       receiverId: '101',
//       content: 'Thank you! I really enjoyed learning React.',
//       createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm3',
//       senderId: '101',
//       receiverId: 'current_user',
//       content: 'Have you started working on the final project?',
//       createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm4',
//       senderId: 'current_user',
//       receiverId: '101',
//       content: 'Yes, I\'m working on an e-commerce app!',
//       createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm5',
//       senderId: '101',
//       receiverId: 'current_user',
//       content: 'Great progress on the React project! Keep it up! 🚀',
//       createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//   ],
//   '2': [
//     {
//       _id: 'm6',
//       senderId: '102',
//       receiverId: 'current_user',
//       content: 'Welcome to the Algorithmic Trading course!',
//       createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm7',
//       senderId: 'current_user',
//       receiverId: '102',
//       content: 'Thanks! Looking forward to learning.',
//       createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm8',
//       senderId: '102',
//       receiverId: 'current_user',
//       content: 'The next live class starts in 30 minutes. Don\'t be late!',
//       createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//   ],
//   '3': [
//     {
//       _id: 'm9',
//       senderId: '103',
//       receiverId: 'current_user',
//       content: 'Hey! How\'s the course going?',
//       createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm10',
//       senderId: 'current_user',
//       receiverId: '103',
//       content: 'Going great! Almost finished with the third module.',
//       createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm11',
//       senderId: '103',
//       receiverId: 'current_user',
//       content: 'Did you finish the assignment? I\'m struggling with the last part',
//       createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//   ],
//   '4': [
//     {
//       _id: 'm12',
//       senderId: '104',
//       receiverId: 'current_user',
//       content: 'Welcome to Creative Minds Learning Platform!',
//       createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//     {
//       _id: 'm13',
//       senderId: '104',
//       receiverId: 'current_user',
//       content: 'Your wallet has been credited with ₦10,000 for course completion.',
//       createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'read',
//     },
//   ],
// };

// export default function ChatScreen() {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [sending, setSending] = useState(false);
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     // Load mock data
//     setTimeout(() => {
//       setConversations(MOCK_CONVERSATIONS);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const fetchConversations = async () => {
//     // Mock fetch conversations
//     setTimeout(() => {
//       setConversations(MOCK_CONVERSATIONS);
//       setRefreshing(false);
//     }, 1000);
//   };

//   const fetchMessages = async (conversationId: string) => {
//     // Mock fetch messages
//     setTimeout(() => {
//       const mockMessages = MOCK_MESSAGES[conversationId] || [];
//       setMessages(mockMessages);
//       setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
//     }, 500);
//   };

//   const sendMessage = async () => {
//     if (!inputText.trim() || !selectedConversation || sending) return;

//     setSending(true);
//     const tempId = Date.now().toString();
//     const tempMessage: Message = {
//       _id: tempId,
//       senderId: 'current_user',
//       receiverId: selectedConversation.participant.id,
//       content: inputText.trim(),
//       createdAt: new Date().toISOString(),
//       status: 'sent',
//     };

//     setMessages(prev => [...prev, tempMessage]);
//     setInputText('');
//     setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

//     // Simulate API response
//     setTimeout(() => {
//       const sentMessage: Message = {
//         ...tempMessage,
//         _id: Date.now().toString(),
//         status: 'delivered',
//       };
//       setMessages(prev => prev.map(msg => 
//         msg._id === tempId ? sentMessage : msg
//       ));
//       setSending(false);
//     }, 1000);
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchConversations();
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
//     if (days === 0) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (days === 1) {
//       return 'Yesterday';
//     } else if (days < 7) {
//       return date.toLocaleDateString([], { weekday: 'short' });
//     } else {
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   const getInitials = (name: string) => {
//     return name.charAt(0).toUpperCase();
//   };

//   const filteredConversations = conversations.filter(conv =>
//     conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
//     <TouchableOpacity
//       onPress={() => {
//         setSelectedConversation(conversation);
//         fetchMessages(conversation._id);
//       }}
//       style={styles.conversationItem}
//     >
//       <View style={styles.avatarContainer}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>
//             {getInitials(conversation.participant.name)}
//           </Text>
//         </View>
//       </View>
      
//       <View style={styles.conversationInfo}>
//         <View style={styles.conversationHeader}>
//           <View style={styles.nameContainer}>
//             <Text style={styles.conversationName}>{conversation.participant.name}</Text>
//             {conversation.participant.role === 'instructor' && (
//               <View style={styles.teacherBadge}>
//                 <Text style={styles.teacherBadgeText}>TEACHER</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.conversationTime}>
//             {formatTime(conversation.lastMessageTime)}
//           </Text>
//         </View>
//         <View style={styles.conversationFooter}>
//           <Text style={styles.lastMessage} numberOfLines={1}>
//             {conversation.lastMessage}
//           </Text>
//           {conversation.unreadCount > 0 && (
//             <View style={styles.unreadBadge}>
//               <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const MessageBubble = ({ message, isMyMessage }: { message: Message; isMyMessage: boolean }) => (
//     <View style={[styles.messageRow, isMyMessage && styles.messageRowRight]}>
//       <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
//         <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
//           {message.content}
//         </Text>
//         <View style={styles.messageFooter}>
//           <Text style={styles.messageTime}>
//             {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//           {isMyMessage && (
//             <Ionicons
//               name={message.status === 'read' ? 'checkmark-done' : 'checkmark'}
//               size={12}
//               color={message.status === 'read' ? '#10B981' : '#9CA3AF'}
//             />
//           )}
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//         <Text style={styles.loadingText}>Loading messages...</Text>
//       </View>
//     );
//   }

//   // Conversation View (when a chat is selected)
//   if (selectedConversation) {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.chatContainer}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         {/* Chat Header */}
//         <View style={styles.chatHeader}>
//           <TouchableOpacity onPress={() => setSelectedConversation(null)} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#1F2937" />
//           </TouchableOpacity>
//           <View style={styles.chatHeaderInfo}>
//             <View style={styles.chatAvatar}>
//               <Text style={styles.chatAvatarText}>
//                 {getInitials(selectedConversation.participant.name)}
//               </Text>
//             </View>
//             <View>
//               <Text style={styles.chatHeaderName}>{selectedConversation.participant.name}</Text>
//               <Text style={styles.chatHeaderRole}>
//                 {selectedConversation.participant.role === 'instructor' ? 'Instructor' : 'Student'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Messages List */}
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={({ item }) => (
//             <MessageBubble
//               message={item}
//               isMyMessage={item.senderId === 'current_user'}
//             />
//           )}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.messagesList}
//           onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//           showsVerticalScrollIndicator={false}
//         />

//         {/* Input Bar */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             placeholderTextColor="#9CA3AF"
//             value={inputText}
//             onChangeText={setInputText}
//             multiline
//             maxLength={500}
//           />
//           <TouchableOpacity
//             onPress={sendMessage}
//             disabled={!inputText.trim() || sending}
//             style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
//           >
//             {sending ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Ionicons name="send" size={20} color="white" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     );
//   }

//   // Conversations List View - Redesigned to match the image
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Messages</Text>
//         <Text style={styles.headerSubtitle}>Chat with your instructors and classmates</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations..."
//             placeholderTextColor="#9CA3AF"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       </View>

//       {/* Conversations List */}
//       <FlatList
//         data={filteredConversations}
//         renderItem={({ item }) => <ConversationItem conversation={item} />}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.conversationsList}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
//             <Text style={styles.emptyTitle}>No messages yet</Text>
//             <Text style={styles.emptyText}>
//               Start a conversation with an instructor or fellow student
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push('/(student)/courses')}
//               style={styles.browseButton}
//             >
//               <Text style={styles.browseButtonText}>Browse Courses</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6B7280',
//   },
  
//   // Header
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 8,
//     backgroundColor: '#FFFFFF',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//   },

//   // Search
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     gap: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#1F2937',
//   },

//   conversationsList: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
  
//   conversationItem: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   avatarContainer: {
//     marginRight: 12,
//   },
//   avatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   conversationInfo: {
//     flex: 1,
//   },
//   conversationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flex: 1,
//   },
//   conversationName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   teacherBadge: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   teacherBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   conversationTime: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   conversationFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   lastMessage: {
//     flex: 1,
//     fontSize: 13,
//     color: '#9CA3AF',
//     marginRight: 8,
//   },
//   unreadBadge: {
//     backgroundColor: '#EF4444',
//     minWidth: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//   },
//   unreadText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
  
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 80,
//   },
//   emptyTitle: {
//     marginTop: 16,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   emptyText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
//   browseButton: {
//     marginTop: 24,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     backgroundColor: '#0B2045',
//   },
//   browseButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
  
//   // Chat View Styles
//   chatContainer: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   chatHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingTop: Platform.OS === 'ios' ? 48 : 16,
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   chatHeaderInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   chatAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#EEF2FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   chatAvatarText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#0B2045',
//   },
//   chatHeaderName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   chatHeaderRole: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   messagesList: {
//     padding: 16,
//     paddingBottom: 20,
//   },
//   messageRow: {
//     marginBottom: 12,
//     alignItems: 'flex-start',
//   },
//   messageRowRight: {
//     alignItems: 'flex-end',
//   },
//   messageBubble: {
//     maxWidth: '80%',
//     padding: 12,
//     borderRadius: 20,
//   },
//   myMessage: {
//     backgroundColor: '#0B2045',
//     borderBottomRightRadius: 4,
//   },
//   otherMessage: {
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   messageText: {
//     fontSize: 15,
//     lineHeight: 20,
//   },
//   myMessageText: {
//     color: 'white',
//   },
//   otherMessageText: {
//     color: '#1F2937',
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginTop: 4,
//     gap: 4,
//   },
//   messageTime: {
//     fontSize: 10,
//     color: 'rgba(255,255,255,0.7)',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     gap: 12,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     fontSize: 15,
//     maxHeight: 100,
//   },
//   sendButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#0B2045',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#D1D5DB',
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../../services/api';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  _id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      setMessages(response.data.messages);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedConversation || sending) return;

    setSending(true);
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      senderId: 'current_user_id',
      receiverId: selectedConversation.participant.id,
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await api.post('/messages/send', {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.participant.id,
        content: inputText.trim(),
      });
      
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? response.data.message : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
      }}
      style={styles.conversationItem}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(conversation.participant.name)}
          </Text>
        </View>
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.conversationName}>{conversation.participant.name}</Text>
            {conversation.participant.role === 'instructor' && (
              <View style={styles.teacherBadge}>
                <Text style={styles.teacherBadgeText}>TEACHER</Text>
              </View>
            )}
          </View>
          <Text style={styles.conversationTime}>
            {formatTime(conversation.lastMessageTime)}
          </Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const MessageBubble = ({ message, isMyMessage }: { message: Message; isMyMessage: boolean }) => (
    <View style={[styles.messageRow, isMyMessage && styles.messageRowRight]}>
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
          {message.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isMyMessage && (
            <Ionicons
              name={message.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={12}
              color={message.status === 'read' ? '#10B981' : '#9CA3AF'}
            />
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  // Conversation View (when a chat is selected)
  if (selectedConversation) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>
                {getInitials(selectedConversation.participant.name)}
              </Text>
            </View>
            <View>
              <Text style={styles.chatHeaderName}>{selectedConversation.participant.name}</Text>
              <Text style={styles.chatHeaderRole}>
                {selectedConversation.participant.role === 'instructor' ? 'Instructor' : 'Student'}
              </Text>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMyMessage={item.senderId === 'current_user_id'}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Conversations List View - Redesigned to match the image
  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Chat with your instructors and classmates</Text>
      </View> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={({ item }) => <ConversationItem conversation={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation with an instructor or fellow student
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(student)/courses')}
              style={styles.browseButton}
            >
              <Text style={styles.browseButtonText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },

  conversationsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  teacherBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  teacherBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  browseButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B2045',
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Chat View Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B2045',
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatHeaderRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  messageRowRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: '#0B2045',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B2045',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});