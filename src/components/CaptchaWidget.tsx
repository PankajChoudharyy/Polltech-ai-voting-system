import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, Shield } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerified: (verified: boolean) => void;
}

type CaptchaType = 'math' | 'image' | 'text';

interface CaptchaChallenge {
  type: CaptchaType;
  question: string;
  answer: string;
  options?: string[];
}

const generateChallenge = (): CaptchaChallenge => {
  const types: CaptchaType[] = ['math', 'text'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'math') {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    let answer: number;
    if (op === '+') answer = a + b;
    else if (op === '-') answer = Math.abs(a - b);
    else answer = a * b;
    return {
      type: 'math',
      question: `What is ${op === '-' ? Math.max(a, b) : a} ${op} ${op === '-' ? Math.min(a, b) : b}?`,
      answer: answer.toString()
    };
  }

  const words = ['SECURE', 'VOTE', 'POLL', 'ELECT', 'CIVIC', 'TRUST'];
  const word = words[Math.floor(Math.random() * words.length)];
  const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  return {
    type: 'text',
    question: `Unscramble: ${scrambled}`,
    answer: word
  };
};

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerified }) => {
  const [challenge, setChallenge] = useState<CaptchaChallenge>(generateChallenge);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);

  const refresh = useCallback(() => {
    setChallenge(generateChallenge());
    setInput('');
    setStatus('idle');
  }, []);

  const verify = () => {
    const correct = input.trim().toUpperCase() === challenge.answer.toUpperCase();
    if (correct) {
      setStatus('success');
      onVerified(true);
    } else {
      setStatus('error');
      setAttempts(a => a + 1);
      onVerified(false);
      setTimeout(() => {
        refresh();
      }, 1200);
    }
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-secondary/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Security Check</span>
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors duration-200 text-muted-foreground hover:text-foreground"
          aria-label="Refresh CAPTCHA"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 py-3 text-green-600"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Verification successful</span>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white rounded-lg px-4 py-3 border border-border">
            <p className="text-sm font-mono font-semibold text-foreground tracking-wide select-none">
              {challenge.question}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder="Your answer..."
              className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                status === 'error'
                  ? 'border-destructive focus:ring-destructive/30 bg-destructive/5'
                  : 'border-border focus:ring-primary/30 bg-white'
              }`}
              aria-label="CAPTCHA answer"
            />
            <button
              onClick={verify}
              disabled={!input.trim()}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Verify
            </button>
          </div>

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive"
            >
              Incorrect answer. Generating new challenge...
            </motion.p>
          )}

          {attempts > 2 && status !== 'success' && (
            <p className="text-xs text-muted-foreground">
              Having trouble? Try refreshing the challenge.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CaptchaWidget;