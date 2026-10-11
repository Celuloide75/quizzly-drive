import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { useQuizLogic } from './useQuizLogic';

type Option = 'A' | 'B' | 'C' | 'D';
export interface Question {
  id: string;
  pregunta: string;
  A: string; B: string; C: string; D: string;
  correcta: Option;
  duplicat_id: string;
  origen: { document: string; numero_original: number; reserva: boolean };
}
export interface Answer {
  questionIndex: number;
  question: string;
  selectedAnswer: Option;
  correctAnswer: Option;
  isCorrect: boolean;
}
function selectTen(items: Question[]): Question[] {
  const unique = [...new Map(items.map(q => [q.duplicat_id, q])).values()];
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, 10);
}
export const QuizApp = () => {
  const [bank, setBank] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentQuestionIndex, answers, showResult, isQuizCompleted, handleAnswer, nextQuestion, resetQuiz } = useQuizLogic(questions);
  useEffect(() => {
    let active = true;
    fetch(import.meta.env.BASE_URL + 'preguntes.json', { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('El banc oficial encara no està disponible.'); return r.json(); })
      .then(data => {
        if (data.estat !== 'VALIDAT') throw new Error('El banc oficial està pendent de validació.');
        if (!Array.isArray(data.preguntes)) throw new Error('Format de dades incorrecte.');
        const valid = data.preguntes.filter((q: Question) =>
          q && q.id && q.duplicat_id && q.pregunta && q.A && q.B && q.C && q.D &&
          ['A', 'B', 'C', 'D'].includes(q.correcta) && q.origen?.document);
        if (new Set(valid.map((q: Question) => q.duplicat_id)).size < 10)
          throw new Error('No hi ha prou preguntes oficials validades.');
        if (active) { setBank(valid); setQuestions(selectTen(valid)); }
      })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Error carregant les preguntes.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const restart = () => { resetQuiz(); setQuestions(selectTen(bank)); };
  if (loading) return <div className="min-h-screen grid place-items-center">Carregant preguntes oficials...</div>;
  if (error) return <div className="min-h-screen grid place-items-center p-4"><Card className="max-w-lg p-8 space-y-4"><h1 className="text-xl font-bold">Quizzly · OPOS</h1><p>{error}</p><Button onClick={() => window.location.reload()}>Reintentar</Button></Card></div>;
  if (isQuizCompleted) return <QuizResults answers={answers} questions={questions} onRestart={restart} onBackToUpload={restart} />;
  const current = questions[currentQuestionIndex];
  if (!current) return <div className="p-8">No hi ha preguntes disponibles.</div>;
  return <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4"><QuizQuestion key={current.id} question={current} questionNumber={currentQuestionIndex + 1} totalQuestions={questions.length} showResult={showResult} onAnswer={handleAnswer} onNext={nextQuestion} /></div>;
};
