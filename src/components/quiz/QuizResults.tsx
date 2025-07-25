import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Upload, Trophy, Target } from 'lucide-react';
import { Answer, Question } from './QuizApp';

interface QuizResultsProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
  onBackToUpload: () => void;
}

export const QuizResults = ({ answers, questions, onRestart, onBackToUpload }: QuizResultsProps) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = answers.filter(answer => !answer.isCorrect);

  const getPerformanceColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excel·lent! 🎉';
    if (percentage >= 80) return 'Molt bé! 👍';
    if (percentage >= 60) return 'Bé, però pots millorar 💪';
    return 'Necessites més pràctica 📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Results Summary */}
        <Card className="p-8 text-center shadow-[var(--shadow-quiz)]">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Quiz Completat!</h1>
          
          <div className="text-6xl font-bold mb-4">
            <span className={getPerformanceColor()}>
              {correctAnswers}
            </span>
            <span className="text-muted-foreground text-4xl"> / {totalQuestions}</span>
          </div>
          
          <div className="text-2xl font-semibold mb-2">
            <span className={getPerformanceColor()}>{percentage}%</span>
          </div>
          
          <p className="text-lg text-muted-foreground mb-6">
            {getPerformanceMessage()}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="text-success border-success/50 bg-success/10 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {correctAnswers} Correctes
            </Badge>
            {incorrectAnswers.length > 0 && (
              <Badge variant="outline" className="text-destructive border-destructive/50 bg-destructive/10 px-4 py-2">
                <XCircle className="w-4 h-4 mr-2" />
                {incorrectAnswers.length} Incorrectes
              </Badge>
            )}
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              {totalQuestions} Total
            </Badge>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={onRestart} className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <RefreshCw className="w-4 h-4 mr-2" />
              Repetir Quiz
            </Button>
            <Button onClick={onBackToUpload} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar Preguntes
            </Button>
          </div>
        </Card>

        {/* Incorrect Answers Review */}
        {incorrectAnswers.length > 0 && (
          <Card className="p-8 shadow-[var(--shadow-quiz)]">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <XCircle className="w-6 h-6 mr-3 text-destructive" />
              Preguntes Incorrectes ({incorrectAnswers.length})
            </h2>
            
            <div className="space-y-6">
              {incorrectAnswers.map((answer, index) => {
                const question = questions[answer.questionIndex];
                return (
                  <div key={index} className="border border-border rounded-lg p-6 bg-card/50">
                    <h3 className="font-semibold text-lg mb-4">
                      Pregunta {answer.questionIndex + 1}: {answer.question}
                    </h3>
                    
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                          La teva resposta:
                        </span>
                        <Badge variant="outline" className="text-destructive border-destructive/50 bg-destructive/10">
                          <XCircle className="w-3 h-3 mr-1" />
                          {answer.selectedAnswer}: {question[answer.selectedAnswer]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                          Resposta correcta:
                        </span>
                        <Badge variant="outline" className="text-success border-success/50 bg-success/10">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {answer.correctAnswer}: {question[answer.correctAnswer]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};