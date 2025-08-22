import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackMessageProps {
  type: MessageType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function FeedbackMessage({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose 
}: FeedbackMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-secondary/10 border-secondary/20',
          title: 'text-secondary',
          message: 'text-secondary/80'
        };
      case 'error':
        return {
          container: 'bg-destructive/10 border-destructive/20',
          title: 'text-destructive',
          message: 'text-destructive/80'
        };
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-200',
          title: 'text-orange-700',
          message: 'text-orange-600'
        };
      case 'info':
        return {
          container: 'bg-primary/10 border-primary/20',
          title: 'text-primary',
          message: 'text-primary/80'
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`relative p-4 rounded-lg border ${styles.container}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${styles.title}`}>
                {title}
              </h4>
              <p className={`text-sm mt-1 ${styles.message}`}>
                {message}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors ${styles.title}`}
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}