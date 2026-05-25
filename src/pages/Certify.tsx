// ============================================================
// PAGE: CERTIFICATION QUIZ
// Timed 45-minute quiz with pass/fail results
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useRoadmap } from '../hooks/useRoadmap';
import { useToast } from '../components/ui/Toast';
import { QuizQuestion } from '../types';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Progress from '../components/ui/Progress';
import { generateCertificatePDF } from '../utils/pdfGenerator';
import { supabase } from '../lib/supabase';

const QUIZ_DURATION_MINUTES = 45;
const PASSING_SCORE = 70;

// Sample quiz questions (in production, these would come from the database)
const generateQuizQuestions = (topic: string): QuizQuestion[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Sample question ${i + 1} about ${topic}?`,
    options: [
      'Option A - Correct answer with detailed explanation',
      'Option B - Plausible but incorrect',
      'Option C - Common misconception',
      'Option D - Obviously wrong',
    ],
    correctAnswer: 0,
    explanation: `This is the correct answer because it demonstrates proper understanding of ${topic} concepts.`,
  }));
};

const Certify: React.FC = () => {
  const { user, profile } = useAuth();
  const { activeRoadmap } = useRoadmap();
  const { addToast } = useToast();

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION_MINUTES * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    const topic = activeRoadmap?.targetRole || profile?.targetRole || 'Software Development';
    const quizQuestions = generateQuizQuestions(topic);
    setQuestions(quizQuestions);
    setQuizStarted(true);
    setTimeRemaining(QUIZ_DURATION_MINUTES * 60);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);

    // Save to database
    try {
      await supabase.from('quiz_attempts').insert({
        user_id: user?.id,
        roadmap_id: activeRoadmap?.id,
        quiz_topic: activeRoadmap?.targetRole || 'General',
        score: finalScore,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        time_taken_seconds: (QUIZ_DURATION_MINUTES * 60) - timeRemaining,
        answers_data: answers,
        passed: finalScore >= PASSING_SCORE,
      });

      // Generate certificate if passed
      if (finalScore >= PASSING_SCORE) {
        const hash = await generateCertificatePDF({
          userName: profile?.fullName || 'User',
          topic: activeRoadmap?.targetRole || 'Software Development',
          score: finalScore,
          userId: user?.id || '',
          roadmapTitle: activeRoadmap?.title,
        });

        addToast({
          type: 'success',
          title: 'Congratulations!',
          message: 'Your certificate has been generated and saved.',
        });
      }
    } catch (error) {
      console.error('Failed to save quiz results:', error);
    }
  }, [questions, answers, timeRemaining, user, profile, activeRoadmap]);

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card variant="bordered" className="text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 neon-border animate-glow-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gradient mb-4">
              Certification Assessment
            </h1>
            <p className="text-gray-400 mb-8">
              Test your knowledge and earn a verifiable certificate
            </p>

            <div className="glass-card p-6 mb-8 text-left">
              <h3 className="font-semibold text-purple-400 mb-4">Quiz Details:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>20 multiple-choice questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>45 minutes time limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Passing score: {PASSING_SCORE}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Certificate with QR verification code</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleStartQuiz} variant="primary" size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const passed = score >= PASSING_SCORE;

    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="bordered" className="text-center">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  passed ? 'gradient-primary neon-border' : 'bg-red-900/20 border-2 border-red-500'
                }`}
              >
                {passed ? (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.div>

              <h1 className={`text-4xl font-bold mb-2 ${passed ? 'text-gradient' : 'text-red-400'}`}>
                {passed ? 'Congratulations!' : 'Not Quite There'}
              </h1>
              <p className="text-gray-400 mb-8">
                {passed
                  ? 'You passed the certification assessment!'
                  : 'Keep learning and try again soon'}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="glass-card p-6">
                  <p className="text-sm text-gray-400 mb-2">Your Score</p>
                  <p className="text-4xl font-bold text-gradient">{score}%</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-sm text-gray-400 mb-2">Correct Answers</p>
                  <p className="text-4xl font-bold text-white">
                    {Object.keys(answers).filter(k => answers[k] === questions.find(q => q.id === k)?.correctAnswer).length}/{questions.length}
                  </p>
                </div>
              </div>

              {passed && (
                <div className="glass-card p-6 mb-8 border border-green-500/30 bg-green-900/10">
                  <p className="text-green-400 font-semibold mb-2">
                    🎉 Certificate Generated!
                  </p>
                  <p className="text-sm text-gray-300">
                    Your verifiable certificate has been created and saved to your account.
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()} variant="ghost">
                  Retake Quiz
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} variant="primary">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer and Progress */}
      <div className="mb-6 flex items-center justify-between">
        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-lg font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <Progress value={progress} className="w-32" size="sm" />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                {question.question}
              </p>

              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(question.id, idx)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      answers[question.id] === idx
                        ? 'neon-border bg-purple-600/20 text-white'
                        : 'glass-hover text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[question.id] === idx
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-600'
                        }`}
                      >
                        {answers[question.id] === idx && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="ghost"
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentQuestion === questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz} variant="success">
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} variant="primary">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certify;
