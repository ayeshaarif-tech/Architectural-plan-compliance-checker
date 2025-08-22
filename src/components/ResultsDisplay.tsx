import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

export interface ComplianceRule {
  id: string;
  category: string;
  rule: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
}

export interface ComplianceResult {
  fileName: string;
  overallStatus: 'compliant' | 'non-compliant' | 'warning';
  rules: ComplianceRule[];
  processingTime: number;
}

interface ResultsDisplayProps {
  results: ComplianceResult[];
  isVisible: boolean;
}

export function ResultsDisplay({ results, isVisible }: ResultsDisplayProps) {
  if (!isVisible || results.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'failed':
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'compliant':
        return 'text-secondary';
      case 'warning':
        return 'text-orange-500';
      case 'failed':
      case 'non-compliant':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
            Compliant ✓
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            Warnings ⚠
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Non-Compliant ✗
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="architectural-line">
        <h2 className="text-2xl font-bold text-primary mb-2">Compliance Results</h2>
        <p className="text-muted-foreground">
          Analysis complete for {results.length} file{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-6">
        {results.map((result, resultIndex) => (
          <motion.div
            key={result.fileName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: resultIndex * 0.2, duration: 0.5 }}
          >
            <Card className="overflow-hidden border-primary/10">
              <CardHeader className="bg-muted/30 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-primary">{result.fileName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Processed in {result.processingTime}ms
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(result.overallStatus)}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {result.rules.map((rule, ruleIndex) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: resultIndex * 0.2 + ruleIndex * 0.1, 
                          duration: 0.3 
                        }}
                        className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary/20 transition-colors"
                      >
                        {getStatusIcon(rule.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-accent">
                              {rule.category}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm font-medium">{rule.rule}</span>
                          </div>
                          <p className={`text-sm ${getStatusColor(rule.status)}`}>
                            {rule.message}
                          </p>
                          {rule.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {rule.details}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Summary:</span>
                      <div className="flex gap-4">
                        <span className="text-secondary">
                          {result.rules.filter(r => r.status === 'passed').length} Passed
                        </span>
                        {result.rules.filter(r => r.status === 'warning').length > 0 && (
                          <span className="text-orange-500">
                            {result.rules.filter(r => r.status === 'warning').length} Warnings
                          </span>
                        )}
                        {result.rules.filter(r => r.status === 'failed').length > 0 && (
                          <span className="text-destructive">
                            {result.rules.filter(r => r.status === 'failed').length} Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}