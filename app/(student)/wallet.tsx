// import api from '@/services/api';
// import { Ionicons } from '@expo/vector-icons';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface Transaction {
//   _id: string;
//   amount: number;
//   type: 'credit' | 'debit';
//   description: string;
//   createdAt: string;
//   status: 'pending' | 'completed' | 'failed';
//   reference?: string;
// }

// export default function WalletScreen() {
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [showFundingModal, setShowFundingModal] = useState(false);
//   const [fundAmount, setFundAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [bankDetails, setBankDetails] = useState({
//     bankName: '',
//     accountNumber: '',
//     accountName: '',
//   });
//   const [withdrawing, setWithdrawing] = useState(false);

//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       const balanceRes = await api.get('/wallet/balance');
//       setBalance(balanceRes.data.balance);

//       const transactionsRes = await api.get('/wallet/transactions?limit=50');
//       setTransactions(transactionsRes.data.transactions);
//     } catch (error: any) {
//       console.error('Error fetching wallet data:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to load wallet data');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchWalletData();
//   };

//   const initializePayment = async () => {
//     const amount = parseFloat(fundAmount);
//     if (isNaN(amount) || amount < 100) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount (minimum ₦100)');
//       return;
//     }

//     if (amount > 1000000) {
//       Alert.alert('Amount Too High', 'Maximum funding amount is ₦1,000,000 per transaction');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.post('/payments/initialize', {
//         amount: amount,
//         currency: 'NGN',
//         paymentMethod: 'paystack',
//         callbackUrl: 'creativemind://payment-callback',
//       });
      
//       Alert.alert(
//         'Payment Initiated',
//         `You are about to fund your wallet with ₦${amount.toLocaleString()}. Please check your email for payment instructions.`,
//         [{ text: 'OK', onPress: () => {
//           setShowFundingModal(false);
//           setFundAmount('');
//         }}]
//       );
//     } catch (error: any) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to initialize payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     const amount = parseFloat(withdrawAmount);
//     if (isNaN(amount) || amount < 1000) {
//       Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₦1,000');
//       return;
//     }

//     if (amount > balance) {
//       Alert.alert('Insufficient Balance', `Your available balance is ₦${balance.toLocaleString()}`);
//       return;
//     }

//     if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
//       Alert.alert('Incomplete Details', 'Please fill in all bank details');
//       return;
//     }

//     setWithdrawing(true);
//     try {
//       await api.post('/wallet/withdraw', {
//         amount: amount,
//         bankName: bankDetails.bankName,
//         accountNumber: bankDetails.accountNumber,
//         accountName: bankDetails.accountName,
//       });
      
//       Alert.alert(
//         'Withdrawal Request Submitted',
//         `Your request to withdraw ₦${amount.toLocaleString()} has been submitted. It will be processed within 1-3 business days.`,
//         [{ text: 'OK', onPress: () => {
//           setShowWithdrawModal(false);
//           setWithdrawAmount('');
//           setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
//           fetchWalletData();
//         }}]
//       );
//     } catch (error: any) {
//       Alert.alert('Error', error.response?.data?.message || 'Withdrawal failed');
//     } finally {
//       setWithdrawing(false);
//     }
//   };

//   const filteredTransactions = transactions.filter(transaction => {
//     if (selectedFilter === 'all') return true;
//     return transaction.type === selectedFilter;
//   });

//   const getTotalCredits = () => {
//     return transactions
//       .filter(t => t.type === 'credit' && t.status === 'completed')
//       .reduce((sum, t) => sum + t.amount, 0);
//   };

//   const getTotalDebits = () => {
//     return transactions
//       .filter(t => t.type === 'debit' && t.status === 'completed')
//       .reduce((sum, t) => sum + t.amount, 0);
//   };

//   const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
//     <TouchableOpacity
//       onPress={() => {
//         Alert.alert(
//           'Transaction Details',
//           `Amount: ₦${transaction.amount.toLocaleString()}\nType: ${transaction.type.toUpperCase()}\nStatus: ${transaction.status}\nDate: ${new Date(transaction.createdAt).toLocaleString()}\nReference: ${transaction.reference || 'N/A'}`
//         );
//       }}
//       style={styles.transactionItem}
//     >
//       <View style={styles.transactionLeft}>
//         <View style={[styles.transactionIcon, transaction.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
//           <Ionicons
//             name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
//             size={20}
//             color={transaction.type === 'credit' ? '#059669' : '#DC2626'}
//           />
//         </View>
//         <View style={styles.transactionInfo}>
//           <Text style={styles.transactionDescription}>{transaction.description}</Text>
//           <Text style={styles.transactionDate}>
//             {new Date(transaction.createdAt).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.transactionRight}>
//         <Text style={[styles.transactionAmount, transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
//           {transaction.type === 'credit' ? '+' : '-'} ₦{transaction.amount.toLocaleString()}
//         </Text>
//         <View style={styles.transactionStatus}>
//           <View style={[styles.statusDot, {
//             backgroundColor: 
//               transaction.status === 'completed' ? '#10B981' :
//               transaction.status === 'pending' ? '#F59E0B' : '#EF4444',
//           }]} />
//           <Text style={styles.statusText}>{transaction.status}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView 
//         style={styles.scrollView}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Balance Card */}
//         <View style={styles.balanceCard}>
//           <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
//           <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          
//           <View style={styles.balanceActions}>
//             <TouchableOpacity
//               onPress={() => setShowFundingModal(true)}
//               style={styles.fundButton}
//             >
//               <Ionicons name="add-circle-outline" size={18} color="#4F46E5" />
//               <Text style={styles.fundButtonText}>Fund</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               onPress={() => setShowWithdrawModal(true)}
//               style={styles.withdrawButton}
//             >
//               <Ionicons name="arrow-up-circle-outline" size={18} color="white" />
//               <Text style={styles.withdrawButtonText}>Withdraw</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Text style={styles.statAmount}>₦{getTotalCredits().toLocaleString()}</Text>
//             <Text style={styles.statLabel}>Total Deposits</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={[styles.statAmount, styles.debitStatAmount]}>₦{getTotalDebits().toLocaleString()}</Text>
//             <Text style={styles.statLabel}>Total Withdrawals</Text>
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           <View style={styles.actionButtonsRow}>
//             <TouchableOpacity onPress={() => setShowFundingModal(true)} style={styles.actionButton}>
//               <View style={styles.actionIconContainer}>
//                 <Ionicons name="card-outline" size={24} color="#4F46E5" />
//               </View>
//               <Text style={styles.actionLabel}>Fund Wallet</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <View style={[styles.actionIconContainer, styles.disabledAction]}>
//                 <Ionicons name="swap-horizontal-outline" size={24} color="#6B7280" />
//               </View>
//               <Text style={styles.actionLabel}>Transfer</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <View style={[styles.actionIconContainer, styles.disabledAction]}>
//                 <Ionicons name="qr-code-outline" size={24} color="#6B7280" />
//               </View>
//               <Text style={styles.actionLabel}>QR Code</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <View style={[styles.actionIconContainer, styles.disabledAction]}>
//                 <Ionicons name="document-text-outline" size={24} color="#6B7280" />
//               </View>
//               <Text style={styles.actionLabel}>Statement</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Transactions Section */}
//         <View style={styles.transactionsSection}>
//           <View style={styles.transactionsHeader}>
//             <Text style={styles.sectionTitle}>Transaction History</Text>
//             <View style={styles.filterTabs}>
//               {(['all', 'credit', 'debit'] as const).map((filter) => (
//                 <TouchableOpacity
//                   key={filter}
//                   onPress={() => setSelectedFilter(filter)}
//                   style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
//                 >
//                   <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
//                     {filter === 'all' ? 'All' : filter === 'credit' ? 'Credits' : 'Debits'}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {filteredTransactions.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Ionicons name="receipt-outline" size={60} color="#D1D5DB" />
//               <Text style={styles.emptyStateText}>No transactions found</Text>
//               <TouchableOpacity onPress={() => setShowFundingModal(true)}>
//                 <Text style={styles.emptyStateLink}>Make your first deposit</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             filteredTransactions.map((transaction) => (
//               <TransactionItem key={transaction._id} transaction={transaction} />
//             ))
//           )}
//         </View>
//       </ScrollView>

//       {/* Funding Modal */}
//       <Modal visible={showFundingModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Fund Wallet</Text>
//               <TouchableOpacity onPress={() => setShowFundingModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalBody}>
//               <Text style={styles.inputLabel}>Enter Amount (₦)</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 placeholder="0.00"
//                 keyboardType="numeric"
//                 value={fundAmount}
//                 onChangeText={setFundAmount}
//                 autoFocus
//               />
//               <Text style={styles.inputHint}>Minimum: ₦100 | Maximum: ₦1,000,000</Text>

//               <View style={styles.amountButtons}>
//                 {[5000, 10000, 20000, 50000].map((amount) => (
//                   <TouchableOpacity
//                     key={amount}
//                     onPress={() => setFundAmount(amount.toString())}
//                     style={styles.amountButton}
//                   >
//                     <Text style={styles.amountButtonText}>₦{amount.toLocaleString()}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <TouchableOpacity
//                 onPress={initializePayment}
//                 disabled={loading}
//                 style={styles.continueButton}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text style={styles.continueButtonText}>Continue to Payment</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => setShowFundingModal(false)} style={styles.cancelButton}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Withdrawal Modal */}
//       <Modal visible={showWithdrawModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.withdrawModal]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Withdraw Funds</Text>
//               <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               <View style={styles.balanceDisplay}>
//                 <Text style={styles.balanceDisplayLabel}>Available Balance</Text>
//                 <Text style={styles.balanceDisplayAmount}>₦{balance.toLocaleString()}</Text>
//               </View>

//               <Text style={styles.inputLabel}>Amount to Withdraw (₦)</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 placeholder="Enter amount"
//                 keyboardType="numeric"
//                 value={withdrawAmount}
//                 onChangeText={setWithdrawAmount}
//               />
//               <Text style={styles.inputHint}>Minimum: ₦1,000</Text>

//               <Text style={styles.inputLabel}>Bank Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Select bank"
//                 value={bankDetails.bankName}
//                 onChangeText={(text) => setBankDetails({ ...bankDetails, bankName: text })}
//               />

//               <Text style={styles.inputLabel}>Account Number</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Enter account number"
//                 keyboardType="numeric"
//                 value={bankDetails.accountNumber}
//                 onChangeText={(text) => setBankDetails({ ...bankDetails, accountNumber: text })}
//               />

//               <Text style={styles.inputLabel}>Account Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Account holder name"
//                 value={bankDetails.accountName}
//                 onChangeText={(text) => setBankDetails({ ...bankDetails, accountName: text })}
//               />

//               <TouchableOpacity
//                 onPress={handleWithdraw}
//                 disabled={withdrawing}
//                 style={styles.withdrawSubmitButton}
//               >
//                 {withdrawing ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text style={styles.withdrawSubmitText}>Request Withdrawal</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => setShowWithdrawModal(false)} style={styles.cancelButton}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   balanceCard: {
//     backgroundColor: '#4F46E5',
//     margin: 16,
//     padding: 28,
//     borderRadius: 28,
//     alignItems: 'center',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   balanceLabel: {
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 14,
//     marginBottom: 8,
//     letterSpacing: 1,
//   },
//   balanceAmount: {
//     color: 'white',
//     fontSize: 44,
//     fontWeight: 'bold',
//     marginBottom: 24,
//   },
//   balanceActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   fundButton: {
//     backgroundColor: 'white',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   fundButtonText: {
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   withdrawButton: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   withdrawButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 16,
//     marginBottom: 24,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 14,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   statAmount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#10B981',
//   },
//   debitStatAmount: {
//     color: '#EF4444',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   quickActions: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 12,
//   },
//   actionButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   actionButton: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   actionIconContainer: {
//     backgroundColor: '#EEF2FF',
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 8,
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   disabledAction: {
//     backgroundColor: '#F3F4F6',
//   },
//   actionLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   transactionsSection: {
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginBottom: 32,
//   },
//   transactionsHeader: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filterTabs: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 12,
//   },
//   filterTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//   },
//   filterTabActive: {
//     backgroundColor: '#4F46E5',
//   },
//   filterText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6B7280',
//     textTransform: 'capitalize',
//   },
//   filterTextActive: {
//     color: 'white',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     backgroundColor: 'white',
//   },
//   transactionLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   transactionIcon: {
//     padding: 10,
//     borderRadius: 12,
//     marginRight: 12,
//   },
//   creditIcon: {
//     backgroundColor: '#D1FAE5',
//   },
//   debitIcon: {
//     backgroundColor: '#FEE2E2',
//   },
//   transactionInfo: {
//     flex: 1,
//   },
//   transactionDescription: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#1F2937',
//   },
//   transactionDate: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   transactionRight: {
//     alignItems: 'flex-end',
//   },
//   transactionAmount: {
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   creditAmount: {
//     color: '#059669',
//   },
//   debitAmount: {
//     color: '#DC2626',
//   },
//   transactionStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     gap: 4,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   statusText: {
//     fontSize: 10,
//     color: '#9CA3AF',
//     textTransform: 'capitalize',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyStateText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   emptyStateLink: {
//     marginTop: 16,
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   withdrawModal: {
//     justifyContent: 'center',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   modalBody: {
//     gap: 16,
//   },
//   inputLabel: {
//     marginBottom: 8,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   amountInput: {
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//   },
//   inputHint: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   amountButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 8,
//   },
//   amountButton: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   amountButtonText: {
//     fontWeight: '600',
//     color: '#4F46E5',
//   },
//   continueButton: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   continueButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   cancelButton: {
//     alignItems: 'center',
//     padding: 12,
//   },
//   cancelButtonText: {
//     color: '#6B7280',
//   },
//   balanceDisplay: {
//     backgroundColor: '#F3F4F6',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   balanceDisplayLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   balanceDisplayAmount: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4F46E5',
//     marginTop: 4,
//   },
//   withdrawSubmitButton: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   withdrawSubmitText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });


// import {
//   ArrowDown,
//   ArrowLeftRight,
//   ArrowUp,
//   CreditCard,
//   FileText,
//   Plus,
//   QrCode,
//   X,
// } from 'lucide-react-native';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const CARD_DARK = '#0B1D3A';
// const FUND_BLUE = '#3B6EF9';
// const WITHDRAW_DARK = '#2D3748';
// const GREEN = '#22C55E';
// const RED = '#EF4444';
// const ORANGE = '#F59E0B';
// const ICON_BLUE = '#3B6EF9';
// const ICON_BG = '#EBF3FF';
// const BG = '#F5F6FA';
// const PRIMARY_DARK = '#0B1D3A';
// const GRAY = '#6B7280';

// type FilterType = 'all' | 'credit' | 'debit';

// interface Transaction {
//   id: string;
//   description: string;
//   datetime: string;
//   amount: number;
//   type: 'credit' | 'debit';
//   status: 'success' | 'pending' | 'failed';
// }

// const TRANSACTIONS: Transaction[] = [
//   {
//     id: '1',
//     description: 'Course Cashback',
//     datetime: 'Oct 24, 2023 • 10:45 AM',
//     amount: 1500,
//     type: 'credit',
//     status: 'success',
//   },
//   {
//     id: '2',
//     description: 'Advanced AI Course',
//     datetime: 'Oct 22, 2023 • 02:15 PM',
//     amount: 8900,
//     type: 'debit',
//     status: 'success',
//   },
//   {
//     id: '3',
//     description: 'Withdrawal to Bank',
//     datetime: 'Oct 20, 2023 • 09:30 AM',
//     amount: 2500,
//     type: 'debit',
//     status: 'pending',
//   },
//   {
//     id: '4',
//     description: 'Wallet Topup',
//     datetime: 'Oct 18, 2023 • 05:22 PM',
//     amount: 10000,
//     type: 'credit',
//     status: 'failed',
//   },
// ];

// const BALANCE = 1240500;
// const TOTAL_DEPOSITS = 45000;
// const TOTAL_WITHDRAWALS = 12450;

// function StatusBadge({ status }: { status: Transaction['status'] }) {
//   const colors: Record<Transaction['status'], string> = {
//     success: GREEN,
//     pending: ORANGE,
//     failed: RED,
//   };
//   return (
//     <View style={styles.statusRow}>
//       <View style={[styles.statusDot, { backgroundColor: colors[status] }]} />
//       <Text style={[styles.statusText, { color: colors[status] }]}>
//         {status.toUpperCase()}
//       </Text>
//     </View>
//   );
// }

// function TransactionItem({ item }: { item: Transaction }) {
//   const isCredit = item.type === 'credit';
//   return (
//     <View style={styles.txItem}>
//       <View style={[styles.txIconBox, isCredit ? styles.txIconCredit : styles.txIconDebit]}>
//         {isCredit ? (
//           <ArrowDown size={20} color={GREEN} strokeWidth={2.5} />
//         ) : (
//           <ArrowUp size={20} color={RED} strokeWidth={2.5} />
//         )}
//       </View>
//       <View style={styles.txInfo}>
//         <Text style={styles.txDescription}>{item.description}</Text>
//         <Text style={styles.txDatetime}>{item.datetime}</Text>
//       </View>
//       <View style={styles.txRight}>
//         <Text style={[styles.txAmount, { color: isCredit ? GREEN : RED }]}>
//           {isCredit ? '+' : '-'}₦{item.amount.toLocaleString()}
//         </Text>
//         <StatusBadge status={item.status} />
//       </View>
//     </View>
//   );
// }

// export default function WalletScreen() {
//   const [filter, setFilter] = useState<FilterType>('all');
//   const [showFundModal, setShowFundModal] = useState(false);
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [fundAmount, setFundAmount] = useState('');
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [accountName, setAccountName] = useState('');
//   const [loading, setLoading] = useState(false);

//   const filtered = TRANSACTIONS.filter((t) => {
//     if (filter === 'all') return true;
//     return t.type === filter;
//   });

//   const filterOptions: { key: FilterType; label: string }[] = [
//     { key: 'all', label: 'All' },
//     { key: 'credit', label: 'Credits' },
//     { key: 'debit', label: 'Debits' },
//   ];

//   const quickAmounts = [5000, 10000, 20000, 50000];

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Wallet</Text>
//           <Text style={styles.headerSub}>Manage your funds and subscriptions</Text>
//         </View>

//         {/* Balance Card */}
//         <View style={styles.balanceCard}>
//           <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
//           <Text style={styles.balanceAmount}>₦{BALANCE.toLocaleString()}</Text>
//           <View style={styles.balanceButtons}>
//             <TouchableOpacity style={styles.fundBtn} onPress={() => setShowFundModal(true)}>
//               <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
//               <Text style={styles.fundBtnText}>Fund</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.withdrawBtn} onPress={() => setShowWithdrawModal(true)}>
//               <ArrowUp size={18} color="#FFFFFF" strokeWidth={2.5} />
//               <Text style={styles.withdrawBtnText}>Withdraw</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Stats */}
//         <View style={styles.statsRow}>
//           <View style={styles.statCard}>
//             <Text style={styles.statLabel}>Total Deposits</Text>
//             <Text style={[styles.statAmount, { color: GREEN }]}>
//               ₦{TOTAL_DEPOSITS.toLocaleString()}
//             </Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statLabel}>Total Withdrawals</Text>
//             <Text style={[styles.statAmount, { color: RED }]}>
//               ₦{TOTAL_WITHDRAWALS.toLocaleString()}
//             </Text>
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.actionsCard}>
//           {[
//             { icon: <CreditCard size={22} color={ICON_BLUE} />, label: 'Fund', onPress: () => setShowFundModal(true) },
//             { icon: <ArrowLeftRight size={22} color={ICON_BLUE} />, label: 'Transfer', onPress: () => {} },
//             { icon: <QrCode size={22} color={ICON_BLUE} />, label: 'QR Pay', onPress: () => {} },
//             { icon: <FileText size={22} color={ICON_BLUE} />, label: 'Report', onPress: () => {} },
//           ].map((action) => (
//             <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={action.onPress}>
//               <View style={styles.actionIconBox}>{action.icon}</View>
//               <Text style={styles.actionLabel}>{action.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Transactions */}
//         <View style={styles.txSection}>
//           <View style={styles.txHeader}>
//             <Text style={styles.txHeading}>Transactions</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Filter pills */}
//           <View style={styles.filterRow}>
//             {filterOptions.map((opt) => (
//               <TouchableOpacity
//                 key={opt.key}
//                 onPress={() => setFilter(opt.key)}
//                 style={[styles.filterPill, filter === opt.key && styles.filterPillActive]}
//               >
//                 <Text
//                   style={[
//                     styles.filterPillText,
//                     filter === opt.key && styles.filterPillTextActive,
//                   ]}
//                 >
//                   {opt.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Transaction list */}
//           <View style={styles.txList}>
//             {filtered.map((item) => (
//               <TransactionItem key={item.id} item={item} />
//             ))}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Fund Modal */}
//       <Modal visible={showFundModal} animationType="slide" transparent>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalSheet}>
//             <View style={styles.modalHandle} />
//             <View style={styles.modalTitleRow}>
//               <Text style={styles.modalTitle}>Fund Wallet</Text>
//               <TouchableOpacity onPress={() => setShowFundModal(false)} style={styles.closeBtn}>
//                 <X size={20} color={GRAY} />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.inputLabel}>Enter Amount (₦)</Text>
//             <TextInput
//               style={styles.amountInput}
//               placeholder="0.00"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="numeric"
//               value={fundAmount}
//               onChangeText={setFundAmount}
//               autoFocus
//             />
//             <Text style={styles.inputHint}>Minimum: ₦100 · Maximum: ₦1,000,000</Text>

//             <View style={styles.quickAmountsRow}>
//               {quickAmounts.map((a) => (
//                 <TouchableOpacity
//                   key={a}
//                   onPress={() => setFundAmount(a.toString())}
//                   style={styles.quickAmountBtn}
//                 >
//                   <Text style={styles.quickAmountText}>₦{a.toLocaleString()}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={() => {
//                 setLoading(true);
//                 setTimeout(() => {
//                   setLoading(false);
//                   setShowFundModal(false);
//                   setFundAmount('');
//                 }, 1200);
//               }}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.primaryBtnText}>Continue to Payment</Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setShowFundModal(false)}
//               style={styles.ghostBtn}
//             >
//               <Text style={styles.ghostBtnText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* Withdraw Modal */}
//       <Modal visible={showWithdrawModal} animationType="slide" transparent>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalOverlay}
//         >
//           <View style={[styles.modalSheet, styles.tallSheet]}>
//             <View style={styles.modalHandle} />
//             <View style={styles.modalTitleRow}>
//               <Text style={styles.modalTitle}>Withdraw Funds</Text>
//               <TouchableOpacity onPress={() => setShowWithdrawModal(false)} style={styles.closeBtn}>
//                 <X size={20} color={GRAY} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.availableBalanceBox}>
//                 <Text style={styles.availableLabel}>Available Balance</Text>
//                 <Text style={styles.availableAmount}>₦{BALANCE.toLocaleString()}</Text>
//               </View>

//               <Text style={styles.inputLabel}>Amount to Withdraw (₦)</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 placeholder="Enter amount"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="numeric"
//                 value={withdrawAmount}
//                 onChangeText={setWithdrawAmount}
//               />
//               <Text style={styles.inputHint}>Minimum: ₦1,000</Text>

//               <Text style={[styles.inputLabel, { marginTop: 16 }]}>Bank Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Select bank"
//                 placeholderTextColor="#9CA3AF"
//                 value={bankName}
//                 onChangeText={setBankName}
//               />

//               <Text style={[styles.inputLabel, { marginTop: 14 }]}>Account Number</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Enter account number"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="numeric"
//                 value={accountNumber}
//                 onChangeText={setAccountNumber}
//               />

//               <Text style={[styles.inputLabel, { marginTop: 14 }]}>Account Name</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Account holder name"
//                 placeholderTextColor="#9CA3AF"
//                 value={accountName}
//                 onChangeText={setAccountName}
//               />

//               <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]}>
//                 <Text style={styles.primaryBtnText}>Request Withdrawal</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setShowWithdrawModal(false)}
//                 style={styles.ghostBtn}
//               >
//                 <Text style={styles.ghostBtnText}>Cancel</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 32,
//   },

//   // Header
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 8,
//     paddingBottom: 16,
//     backgroundColor: BG,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//     lineHeight: 32,
//   },
//   headerSub: {
//     fontSize: 13,
//     color: GRAY,
//     marginTop: 2,
//   },

//   // Balance card
//   balanceCard: {
//     backgroundColor: CARD_DARK,
//     marginHorizontal: 16,
//     borderRadius: 20,
//     padding: 24,
//     marginBottom: 16,
//     shadowColor: CARD_DARK,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   balanceLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.6)',
//     letterSpacing: 1.5,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   balanceAmount: {
//     fontSize: 42,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     marginBottom: 24,
//     letterSpacing: -1,
//   },
//   balanceButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   fundBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: FUND_BLUE,
//     borderRadius: 12,
//     paddingVertical: 13,
//     gap: 8,
//   },
//   fundBtnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   withdrawBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: WITHDRAW_DARK,
//     borderRadius: 12,
//     paddingVertical: 13,
//     gap: 8,
//   },
//   withdrawBtnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },

//   // Stats
//   statsRow: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     gap: 12,
//     marginBottom: 16,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: GRAY,
//     marginBottom: 6,
//   },
//   statAmount: {
//     fontSize: 20,
//     fontWeight: '800',
//   },

//   // Quick actions
//   actionsCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   actionBtn: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 8,
//   },
//   actionIconBox: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: ICON_BG,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   actionLabel: {
//     fontSize: 12,
//     color: '#374151',
//     fontWeight: '500',
//   },

//   // Transactions
//   txSection: {
//     paddingHorizontal: 16,
//   },
//   txHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   txHeading: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//   },
//   seeAll: {
//     fontSize: 14,
//     color: FUND_BLUE,
//     fontWeight: '600',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   filterPill: {
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     borderRadius: 24,
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     backgroundColor: '#FFFFFF',
//   },
//   filterPillActive: {
//     backgroundColor: '#111827',
//     borderColor: '#111827',
//   },
//   filterPillText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: GRAY,
//   },
//   filterPillTextActive: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   txList: {
//     gap: 4,
//   },
//   txItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   txIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   txIconCredit: {
//     backgroundColor: '#DCFCE7',
//   },
//   txIconDebit: {
//     backgroundColor: '#FEE2E2',
//   },
//   txInfo: {
//     flex: 1,
//   },
//   txDescription: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//     marginBottom: 3,
//   },
//   txDatetime: {
//     fontSize: 12,
//     color: GRAY,
//   },
//   txRight: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   txAmount: {
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },

//   // Modals
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalSheet: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     paddingBottom: 40,
//   },
//   tallSheet: {
//     maxHeight: '90%',
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modalTitleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: PRIMARY_DARK,
//   },
//   closeBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   amountInput: {
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 20,
//     fontWeight: '700',
//     color: PRIMARY_DARK,
//   },
//   textInput: {
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 13,
//     fontSize: 15,
//     color: PRIMARY_DARK,
//   },
//   inputHint: {
//     fontSize: 12,
//     color: GRAY,
//     marginTop: 6,
//     marginBottom: 16,
//   },
//   quickAmountsRow: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 20,
//   },
//   quickAmountBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   quickAmountText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: FUND_BLUE,
//   },
//   primaryBtn: {
//     backgroundColor: FUND_BLUE,
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   primaryBtnText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   ghostBtn: {
//     alignItems: 'center',
//     paddingVertical: 14,
//   },
//   ghostBtnText: {
//     color: GRAY,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   availableBalanceBox: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   availableLabel: {
//     fontSize: 12,
//     color: GRAY,
//     marginBottom: 4,
//   },
//   availableAmount: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: FUND_BLUE,
//   },
// });


import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CARD_DARK = '#0B1D3A';
const FUND_BLUE = '#3B6EF9';
const WITHDRAW_DARK = '#2D3748';
const GREEN = '#22C55E';
const RED = '#EF4444';
const ORANGE = '#F59E0B';
const BG = '#F5F6FA';
const PRIMARY_DARK = '#0B1D3A';
const GRAY = '#6B7280';

interface Transaction {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const balanceRes = await api.get('/wallet/balance');
      setBalance(balanceRes.data.balance);

      const transactionsRes = await api.get('/wallet/transactions?limit=50');
      setTransactions(transactionsRes.data.transactions);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load wallet data');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const initializePayment = async () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount < 100) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount (minimum ₦100)');
      return;
    }

    if (amount > 1000000) {
      Alert.alert('Amount Too High', 'Maximum funding amount is ₦1,000,000 per transaction');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/payments/initialize', {
        amount: amount,
        currency: 'NGN',
        paymentMethod: 'paystack',
        callbackUrl: 'creativemind://payment-callback',
      });
      
      Alert.alert(
        'Payment Initiated',
        `You are about to fund your wallet with ₦${amount.toLocaleString()}. Please check your email for payment instructions.`,
        [{ text: 'OK', onPress: () => {
          setShowFundingModal(false);
          setFundAmount('');
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1000) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₦1,000');
      return;
    }

    if (amount > balance) {
      Alert.alert('Insufficient Balance', `Your available balance is ₦${balance.toLocaleString()}`);
      return;
    }

    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
      Alert.alert('Incomplete Details', 'Please fill in all bank details');
      return;
    }

    setWithdrawing(true);
    try {
      await api.post('/wallet/withdraw', {
        amount: amount,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName,
      });
      
      Alert.alert(
        'Withdrawal Request Submitted',
        `Your request to withdraw ₦${amount.toLocaleString()} has been submitted. It will be processed within 1-3 business days.`,
        [{ text: 'OK', onPress: () => {
          setShowWithdrawModal(false);
          setWithdrawAmount('');
          setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
          fetchWalletData();
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const getTotalCredits = () => {
    return transactions
      .filter(t => t.type === 'credit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalDebits = () => {
    return transactions
      .filter(t => t.type === 'debit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return GREEN;
      case 'pending': return ORANGE;
      case 'failed': return RED;
      default: return GRAY;
    }
  };

  const getStatusText = (status: string) => {
    return status.toUpperCase();
  };

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Transaction Details',
          `Amount: ₦${transaction.amount.toLocaleString()}\nType: ${transaction.type.toUpperCase()}\nStatus: ${transaction.status}\nDate: ${new Date(transaction.createdAt).toLocaleString()}\nReference: ${transaction.reference || 'N/A'}`
        );
      }}
      style={styles.txItem}
    >
      <View style={[styles.txIconBox, transaction.type === 'credit' ? styles.txIconCredit : styles.txIconDebit]}>
        <Ionicons
          name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
          size={20}
          color={transaction.type === 'credit' ? GREEN : RED}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDescription}>{transaction.description}</Text>
        <Text style={styles.txDatetime}>
          {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: transaction.type === 'credit' ? GREEN : RED }]}>
          {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(transaction.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
            {getStatusText(transaction.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterOptions: { key: 'all' | 'credit' | 'debit'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'credit', label: 'Credits' },
    { key: 'debit', label: 'Debits' },
  ];

  const quickAmounts = [5000, 10000, 20000, 50000];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSub}>Manage your funds and subscriptions</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          
          <View style={styles.balanceButtons}>
            <TouchableOpacity
              onPress={() => setShowFundingModal(true)}
              style={styles.fundBtn}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.fundBtnText}>Fund</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setShowWithdrawModal(true)}
              style={styles.withdrawBtn}
            >
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              <Text style={styles.withdrawBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Deposits</Text>
            <Text style={[styles.statAmount, { color: GREEN }]}>
              ₦{getTotalCredits().toLocaleString()}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Withdrawals</Text>
            <Text style={[styles.statAmount, { color: RED }]}>
              ₦{getTotalDebits().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          {[
            { icon: "card-outline", label: 'Fund', onPress: () => setShowFundingModal(true) },
            { icon: "swap-horizontal-outline", label: 'Transfer', onPress: () => {} },
            { icon: "qr-code-outline", label: 'QR Pay', onPress: () => {} },
            { icon: "document-text-outline", label: 'Report', onPress: () => {} },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={action.onPress}>
              <View style={styles.actionIconBox}>
                <Ionicons name={action.icon as any} size={22} color={FUND_BLUE} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions Section */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txHeading}>Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Filter pills */}
          <View style={styles.filterRow}>
            {filterOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setSelectedFilter(opt.key)}
                style={[styles.filterPill, selectedFilter === opt.key && styles.filterPillActive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedFilter === opt.key && styles.filterPillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <TouchableOpacity onPress={() => setShowFundingModal(true)}>
                <Text style={styles.emptyStateLink}>Make your first deposit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.txList}>
              {filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Funding Modal */}
      <Modal visible={showFundingModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle}>Fund Wallet</Text>
              <TouchableOpacity onPress={() => setShowFundingModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={GRAY} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Enter Amount (₦)</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={fundAmount}
              onChangeText={setFundAmount}
              autoFocus
            />
            <Text style={styles.inputHint}>Minimum: ₦100 · Maximum: ₦1,000,000</Text>

            <View style={styles.quickAmountsRow}>
              {quickAmounts.map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => setFundAmount(a.toString())}
                  style={styles.quickAmountBtn}
                >
                  <Text style={styles.quickAmountText}>₦{a.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={initializePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Continue to Payment</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFundingModal(false)}
              style={styles.ghostBtn}
            >
              <Text style={styles.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Withdrawal Modal */}
      <Modal visible={showWithdrawModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalSheet, styles.tallSheet]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={GRAY} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.availableBalanceBox}>
                <Text style={styles.availableLabel}>Available Balance</Text>
                <Text style={styles.availableAmount}>₦{balance.toLocaleString()}</Text>
              </View>

              <Text style={styles.inputLabel}>Amount to Withdraw (₦)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
              />
              <Text style={styles.inputHint}>Minimum: ₦1,000</Text>

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Bank Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Select bank"
                placeholderTextColor="#9CA3AF"
                value={bankDetails.bankName}
                onChangeText={(text) => setBankDetails({ ...bankDetails, bankName: text })}
              />

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Account Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter account number"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={bankDetails.accountNumber}
                onChangeText={(text) => setBankDetails({ ...bankDetails, accountNumber: text })}
              />

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Account Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Account holder name"
                placeholderTextColor="#9CA3AF"
                value={bankDetails.accountName}
                onChangeText={(text) => setBankDetails({ ...bankDetails, accountName: text })}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 20 }]}
                onPress={handleWithdraw}
                disabled={withdrawing}
              >
                {withdrawing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryBtnText}>Request Withdrawal</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowWithdrawModal(false)}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: PRIMARY_DARK,
    lineHeight: 32,
  },
  headerSub: {
    fontSize: 13,
    color: GRAY,
    marginTop: 2,
  },

  // Balance card
  balanceCard: {
    backgroundColor: CARD_DARK,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: CARD_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -1,
  },
  balanceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  fundBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FUND_BLUE,
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  fundBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  withdrawBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WITHDRAW_DARK,
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 6,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '800',
  },

  // Quick actions
  actionsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },

  // Transactions
  txSection: {
    paddingHorizontal: 16,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  txHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },
  seeAll: {
    fontSize: 14,
    color: FUND_BLUE,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filterPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: GRAY,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  txList: {
    gap: 4,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txIconCredit: {
    backgroundColor: '#DCFCE7',
  },
  txIconDebit: {
    backgroundColor: '#FEE2E2',
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_DARK,
    marginBottom: 3,
  },
  txDatetime: {
    fontSize: 12,
    color: GRAY,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyStateLink: {
    marginTop: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  tallSheet: {
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_DARK,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_DARK,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    color: PRIMARY_DARK,
  },
  inputHint: {
    fontSize: 12,
    color: GRAY,
    marginTop: 6,
    marginBottom: 16,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: '700',
    color: FUND_BLUE,
  },
  primaryBtn: {
    backgroundColor: FUND_BLUE,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  ghostBtnText: {
    color: GRAY,
    fontSize: 14,
    fontWeight: '500',
  },
  availableBalanceBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  availableLabel: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 4,
  },
  availableAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: FUND_BLUE,
  },
});