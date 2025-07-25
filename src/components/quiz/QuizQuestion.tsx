import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from './QuizApp';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  showResult: boolean;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
}

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  showResult,
  onAnswer,
  onNext
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const handleAnswerClick = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (showResult) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    onNext();
  };

  const getAnswerStyle = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!showResult) {
      return selectedAnswer === option 
        ? 'bg-quiz-selected border-primary' 
        : 'bg-card hover:bg-secondary/50 border-border';
    }

    if (option === question.correcta) {
      return 'bg-success text-success-foreground border-success';
    }

    if (selectedAnswer === option && option !== question.correcta) {
      return 'bg-destructive text-destructive-foreground border-destructive';
    }

    return 'bg-muted border-border opacity-60';
  };

  const getAnswerIcon = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!showResult) return null;

    if (option === question.correcta) {
      return <CheckCircle className="w-5 h-5" />;
    }

    if (selectedAnswer === option && option !== question.correcta) {
      return <XCircle className="w-5 h-5" />;
    }

    return null;
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-8 shadow-[var(--shadow-quiz)] mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-8 leading-relaxed">
          {question.pregunta}
        </h2>

        <div className="space-y-4">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={showResult}
              className={cn(
                "w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group",
                "hover:scale-[1.02] active:scale-[0.98]",
                getAnswerStyle(option)
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-semibold text-sm">
                    {option}
                  </span>
                  <span className="text-lg">{question[option]}</span>
                </div>
                {getAnswerIcon(option)}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleNext}
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
            >
              {questionNumber === totalQuestions ? 'Veure Resultats' : 'Següent Pregunta'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};