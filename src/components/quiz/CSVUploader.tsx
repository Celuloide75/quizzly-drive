import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { Question } from './QuizApp';

interface CSVUploaderProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export const CSVUploader = ({ onQuestionsLoaded }: CSVUploaderProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csvText: string): Question[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const questions: Question[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length >= 6) {
        const question: Question = {
          pregunta: values[headers.indexOf('pregunta')] || '',
          A: values[headers.indexOf('A')] || '',
          B: values[headers.indexOf('B')] || '',
          C: values[headers.indexOf('C')] || '',
          D: values[headers.indexOf('D')] || '',
          correcta: (values[headers.indexOf('correcta')] || 'A') as 'A' | 'B' | 'C' | 'D'
        };
        
        if (question.pregunta && question.A && question.B && question.C && question.D) {
          questions.push(question);
        }
      }
    }
    
    return questions;
  };

  const convertGoogleDriveUrl = (url: string): string => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const downloadUrl = convertGoogleDriveUrl(url.trim());
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error('No s\'ha pogut carregar el fitxer. Assegura\'t que l\'enllaç és públic.');
      }

      const csvText = await response.text();
      const questions = parseCSV(csvText);

      if (questions.length === 0) {
        throw new Error('No s\'han trobat preguntes vàlides al fitxer CSV.');
      }

      onQuestionsLoaded(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="csv-url" className="text-sm font-medium">
            Enllaç del fitxer CSV de Google Drive
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="csv-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!url.trim() || isLoading}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-muted-foreground space-y-2">
        <p><strong>Format del CSV:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Columnes: pregunta, A, B, C, D, correcta</li>
          <li>La columna "correcta" ha de contenir A, B, C o D</li>
          <li>El fitxer ha de ser públic (qualsevol persona amb l'enllaç pot veure)</li>
        </ul>
      </div>
    </div>
  );
};