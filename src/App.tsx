import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay, type ComplianceResult, type ComplianceRule } from './components/ResultsDisplay';
import { ReportGenerator } from './components/ReportGenerator';
import { FeedbackMessage } from './components/FeedbackMessage';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/InteractiveBackground';

// Mock compliance rules for demonstration
const mockComplianceRules: ComplianceRule[] = [
  {
    id: '1',
    category: 'Class A',
    rule: 'Extension Depth',
    status: 'passed',
    message: 'Extension depth complies with regulations (2.8m ≤ 6.0m limit)',
    details: 'Measured extension depth: 2.8m, Maximum allowed: 6.0m'
  },
  {
    id: '2',
    category: 'Class E',
    rule: 'Outbuilding Height',
    status: 'failed',
    message: 'Outbuilding exceeds maximum height limit (3.2m > 2.5m limit)',
    details: 'Current height: 3.2m, Maximum allowed: 2.5m'
  },
  {
    id: '3',
    category: 'Class D',
    rule: 'Boundary Distance',
    status: 'warning',
    message: 'Structure is close to minimum boundary distance (1.2m from 1.0m minimum)',
    details: 'Distance to boundary: 1.2m, Minimum required: 1.0m'
  },
  {
    id: '4',
    category: 'Class A',
    rule: 'Roof Pitch',
    status: 'passed',
    message: 'Roof pitch matches existing structure (35° slope)',
    details: 'Existing structure: 35°, New extension: 35°'
  },
  {
    id: '5',
    category: 'Class B',
    rule: 'Glazed Area Ratio',
    status: 'passed',
    message: 'Window area complies with thermal regulations (18% < 25% limit)',
    details: 'Glazed area: 18% of total wall area, Maximum allowed: 25%'
  }
];

export default function App() {
  const [files, setFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ComplianceResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    visible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    visible: false
  });

  const handleFilesChange = (newFiles: any[]) => {
    setFiles(newFiles);
    setShowResults(false);
    setResults([]);
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setShowResults(false);
    
    // Show processing feedback
    setFeedback({
      type: 'info',
      title: 'Processing Files',
      message: 'Analyzing architectural plans for compliance...',
      visible: true
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock results
    const mockResults: ComplianceResult[] = files.map((file, index) => {
      const numRules = Math.floor(Math.random() * 3) + 3; // 3-5 rules per file
      const selectedRules = mockComplianceRules
        .sort(() => 0.5 - Math.random())
        .slice(0, numRules)
        .map((rule, ruleIndex) => ({
          ...rule,
          id: `${index}-${ruleIndex}`,
          // Randomize some statuses for variety
          status: ruleIndex === 0 ? rule.status : 
                  Math.random() > 0.7 ? 'failed' :
                  Math.random() > 0.8 ? 'warning' : 'passed'
        })) as ComplianceRule[];

      const hasFailures = selectedRules.some(r => r.status === 'failed');
      const hasWarnings = selectedRules.some(r => r.status === 'warning');
      
      let overallStatus: 'compliant' | 'non-compliant' | 'warning';
      if (hasFailures) {
        overallStatus = 'non-compliant';
      } else if (hasWarnings) {
        overallStatus = 'warning';
      } else {
        overallStatus = 'compliant';
      }

      return {
        fileName: file.name,
        overallStatus,
        rules: selectedRules,
        processingTime: Math.floor(Math.random() * 2000) + 500
      };
    });

    setResults(mockResults);
    setIsProcessing(false);
    setShowResults(true);

    // Show success feedback
    const compliantFiles = mockResults.filter(r => r.overallStatus === 'compliant').length;
    const totalFiles = mockResults.length;
    
    setFeedback({
      type: compliantFiles === totalFiles ? 'success' : 'warning',
      title: 'Analysis Complete',
      message: `${compliantFiles} of ${totalFiles} files are fully compliant. ${
        totalFiles - compliantFiles > 0 ? 'Please review non-compliant items below.' : ''
      }`,
      visible: true
    });

    // Auto-hide feedback after 5 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Interactive Background */}
      <InteractiveBackground />
      
      <div className="relative">
        <Header />
        
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="space-y-12">
            {/* Feedback Messages */}
            <FeedbackMessage
              type={feedback.type}
              title={feedback.title}
              message={feedback.message}
              isVisible={feedback.visible}
              onClose={() => setFeedback(prev => ({ ...prev, visible: false }))}
            />

            {/* File Upload Section */}
            <section>
              <FileUploader
                onFilesChange={handleFilesChange}
                onUpload={handleUpload}
                isProcessing={isProcessing}
              />
            </section>

            {/* Results Section */}
            <section>
              <ResultsDisplay
                results={results}
                isVisible={showResults}
              />
            </section>

            {/* Report Generation */}
            <section>
              <ReportGenerator
                results={results}
                isVisible={showResults}
              />
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}