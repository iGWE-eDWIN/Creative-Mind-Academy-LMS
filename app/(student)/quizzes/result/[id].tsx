import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function QuizResultScreen() {
  const { id, score, total, passed } = useLocalSearchParams();
  const scoreNum = parseInt(score as string);
  const totalNum = parseInt(total as string);
  const percentage = (scoreNum / totalNum) * 100;
  const passedQuiz = passed === 'true';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <LinearGradient
        colors={passedQuiz ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
        style={{ padding: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons
            name={passedQuiz ? 'checkmark' : 'close'}
            size={60}
            color="white"
          />
        </View>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>
          {passedQuiz ? 'Congratulations!' : 'Better Luck Next Time!'}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' }}>
          {passedQuiz
            ? 'You have passed the quiz!'
            : 'Keep learning and try again'}
        </Text>
      </LinearGradient>

      <View style={{ padding: 24 }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Your Score</Text>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: passedQuiz ? '#10B981' : '#EF4444' }}>
            {scoreNum}/{totalNum}
          </Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginTop: 8 }}>
            {percentage.toFixed(1)}%
          </Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Performance Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#6B7280' }}>Correct Answers</Text>
            <Text style={{ fontWeight: '600' }}>{scoreNum}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#6B7280' }}>Incorrect Answers</Text>
            <Text style={{ fontWeight: '600' }}>{totalNum - scoreNum}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#6B7280' }}>Passing Score Required</Text>
            <Text style={{ fontWeight: '600' }}>{passed === 'true' ? 'Met' : 'Not Met'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: '#4F46E5',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center', 
            marginBottom: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Back to Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
        //   onPress={() => router.push(`/(student)/quizzes/[id]`)}
        onPress={() =>
  router.push({
    pathname: '/(student)/quizzes/[id]',
    params: { id: id },
  })
}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#4F46E5',
          }}
        >
          <Text style={{ color: '#4F46E5', fontWeight: '600' }}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}