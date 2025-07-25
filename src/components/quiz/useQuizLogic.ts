import { useState, useCallback } from 'react';
import { Question, Answer } from './QuizApp';

export const useQuizLogic = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);

  const isQuizCompleted = currentQuestionIndex >= questions.length && answers.length > 0;

  const handleAnswer = useCallback((selectedAnswer: 'A' | 'B' | 'C' | 'D') => {
    if (showResult || currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correcta;

    const newAnswer: Answer = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.pregunta,
      selectedAnswer,
      correctAnswer: currentQuestion.correcta,
      isCorrect
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);
  }, [currentQuestionIndex, questions, showResult]);

  const nextQuestion = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  }, []);

  // Shuffle questions when quiz starts
  const shuffleQuestions = useCallback((questionsToShuffle: Question[]): Question[] => {
    const shuffled = [...questionsToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  return {
    currentQuestionIndex,
    answers,
    showResult,
    isQuizCompleted,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    shuffleQuestions
  };
};