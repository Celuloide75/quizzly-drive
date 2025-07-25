import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CSVUploader } from './CSVUploader';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { useQuizLogic } from './useQuizLogic';

export interface Question {
  pregunta: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correcta: 'A' | 'B' | 'C' | 'D';
}

export interface Answer {
  questionIndex: number;
  question: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

export const QuizApp = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  
  const {
    currentQuestionIndex,
    answers,
    showResult,
    isQuizCompleted,
    handleAnswer,
    nextQuestion,
    resetQuiz
  } = useQuizLogic(questions);

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setIsQuizStarted(false);
  };

  const startQuiz = () => {
    resetQuiz();
    setIsQuizStarted(true);
  };

  const backToUpload = () => {
    setQuestions([]);
    setIsQuizStarted(false);
    resetQuiz();
  };

  if (isQuizCompleted) {
    return (
      <QuizResults 
        answers={answers}
        questions={questions}
        onRestart={startQuiz}
        onBackToUpload={backToUpload}
      />
    );
  }

  if (!isQuizStarted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 shadow-[var(--shadow-quiz)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
              Quiz Interactiu
            </h1>
            <p className="text-lg text-muted-foreground">
              Carrega un fitxer CSV amb preguntes des de Google Drive
            </p>
          </div>
          
          <CSVUploader onQuestionsLoaded={handleQuestionsLoaded} />
          
          {questions.length > 0 && !isQuizStarted && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {questions.length} preguntes carregades correctament
              </p>
              <button
                onClick={startQuiz}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Començar Quiz
              </button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        showResult={showResult}
        onAnswer={handleAnswer}
        onNext={nextQuestion}
      />
    </div>
  );
};