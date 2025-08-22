import React, { useState } from 'react';
import { FileDown, Stamp, CheckCircle, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'motion/react';
import type { ComplianceResult } from './ResultsDisplay';

interface ReportGeneratorProps {
  results: ComplianceResult[];
  isVisible: boolean;
}

export function ReportGenerator({ results, isVisible }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  if (!isVisible || results.length === 0) return null;

  // Calculate statistics for both UI and PDF
  const totalFiles = results.length;
  const compliantFiles = results.filter(r => r.overallStatus === 'compliant').length;
  const nonCompliantFiles = results.filter(r => r.overallStatus === 'non-compliant').length;
  const warningFiles = results.filter(r => r.overallStatus === 'warning').length;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await generatePDFReport();
      setIsGenerated(true);
      setTimeout(() => setIsGenerated(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsGenerating(false);
  };

  const generatePDFReport = async () => {
    // Dynamic import to avoid server-side rendering issues
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Colors matching our theme
    const colors = {
      primary: [10, 61, 98] as [number, number, number],
      secondary: [76, 175, 80] as [number, number, number],
      accent: [184, 115, 51] as [number, number, number],
      destructive: [212, 24, 61] as [number, number, number],
      warning: [255, 152, 0] as [number, number, number],
      muted: [113, 113, 130] as [number, number, number],
      background: [245, 245, 245] as [number, number, number]
    };

    // Helper function to add colored rectangle
    const addColoredRect = (x: number, y: number, width: number, height: number, color: [number, number, number]) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, width, height, 'F');
    };

    // Header with background
    addColoredRect(0, 0, pageWidth, 40, colors.primary);
    
    // Logo/Icon area
    addColoredRect(15, 10, 8, 8, colors.accent);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text('AP', 17, 15);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('ARCHITECTURAL PLANS', 30, 20);
    doc.setFontSize(20);
    doc.text('COMPLIANCE REPORT', 30, 28);

    // Subtitle
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 30, 35);

    yPosition = 50;

    // Summary Statistics Card
    addColoredRect(15, yPosition, pageWidth - 30, 25, colors.background);
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(0.5);
    doc.rect(15, yPosition, pageWidth - 30, 25);

    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(14);
    doc.text('EXECUTIVE SUMMARY', 20, yPosition + 8);

    const complianceRate = Math.round((compliantFiles / totalFiles) * 100);

    // Statistics boxes
    const statBoxWidth = 35;
    const statBoxHeight = 12;
    const startX = 20;
    const statY = yPosition + 12;

    // Total Files
    addColoredRect(startX, statY, statBoxWidth, statBoxHeight, colors.primary);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(totalFiles.toString(), startX + 5, statY + 8);
    doc.setFontSize(8);
    doc.text('TOTAL FILES', startX + 15, statY + 8);

    // Compliant Files
    if (compliantFiles > 0) {
      addColoredRect(startX + 40, statY, statBoxWidth, statBoxHeight, colors.secondary);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(compliantFiles.toString(), startX + 45, statY + 8);
      doc.setFontSize(8);
      doc.text('COMPLIANT', startX + 55, statY + 8);
    }

    // Warning Files
    if (warningFiles > 0) {
      addColoredRect(startX + 80, statY, statBoxWidth, statBoxHeight, colors.warning);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(warningFiles.toString(), startX + 85, statY + 8);
      doc.setFontSize(8);
      doc.text('WARNINGS', startX + 95, statY + 8);
    }

    // Non-compliant Files
    if (nonCompliantFiles > 0) {
      addColoredRect(startX + 120, statY, statBoxWidth, statBoxHeight, colors.destructive);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(nonCompliantFiles.toString(), startX + 125, statY + 8);
      doc.setFontSize(8);
      doc.text('NON-COMPLIANT', startX + 135, statY + 8);
    }

    yPosition += 35;

    // Compliance Rate Visualization
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(12);
    doc.text('OVERALL COMPLIANCE RATE', 20, yPosition);
    
    // Progress bar
    const barWidth = 150;
    const barHeight = 8;
    const barX = 20;
    const barY = yPosition + 5;
    
    // Background bar
    addColoredRect(barX, barY, barWidth, barHeight, [220, 220, 220]);
    
    // Progress bar
    const progressWidth = (barWidth * complianceRate) / 100;
    const progressColor = complianceRate >= 80 ? colors.secondary : 
                         complianceRate >= 60 ? colors.warning : colors.destructive;
    addColoredRect(barX, barY, progressWidth, barHeight, progressColor);
    
    // Percentage text
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(14);
    doc.text(`${complianceRate}%`, barX + barWidth + 10, barY + 6);

    yPosition += 25;

    // Detailed Results Section
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(14);
    doc.text('DETAILED COMPLIANCE ANALYSIS', 20, yPosition);
    yPosition += 10;

    // Process each file result
    results.forEach((result, index) => {
      // Add new page if needed
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // File header
      const headerColor = result.overallStatus === 'compliant' ? colors.secondary :
                         result.overallStatus === 'warning' ? colors.warning : colors.destructive;
      
      addColoredRect(15, yPosition, pageWidth - 30, 15, headerColor);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(`FILE ${index + 1}: ${result.fileName}`, 20, yPosition + 6);
      doc.text(`STATUS: ${result.overallStatus.toUpperCase()}`, 20, yPosition + 11);

      yPosition += 20;

      // Rules table
      const tableData = result.rules.map(rule => [
        rule.category,
        rule.rule,
        rule.status === 'passed' ? '✓ PASSED' : 
        rule.status === 'warning' ? '⚠ WARNING' : '✗ FAILED',
        rule.message
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Category', 'Rule', 'Status', 'Message']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: 255,
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 105 }
        },
        didParseCell: function(data: any) {
          if (data.section === 'body' && data.column.index === 2) {
            if (data.cell.text[0].includes('PASSED')) {
              data.cell.styles.textColor = colors.secondary;
            } else if (data.cell.text[0].includes('WARNING')) {
              data.cell.styles.textColor = colors.warning;
            } else if (data.cell.text[0].includes('FAILED')) {
              data.cell.styles.textColor = colors.destructive;
            }
          }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });

    // Add new page for recommendations
    doc.addPage();
    yPosition = 20;

    // Recommendations section
    addColoredRect(0, 0, pageWidth, 25, colors.primary);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('RECOMMENDATIONS & NEXT STEPS', 20, 15);

    yPosition = 35;

    const recommendations = [
      'Review and address all non-compliant items before proceeding with construction',
      'Consult with a structural engineer for any load-bearing modifications',
      'Obtain necessary permits from local planning authority',
      'Schedule follow-up compliance check after revisions',
      'Keep all documentation for future reference and inspections'
    ];

    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(12);
    doc.text('ACTION ITEMS:', 20, yPosition);
    yPosition += 10;

    recommendations.forEach((rec, index) => {
      doc.setFontSize(10);
      doc.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
      doc.text(`${index + 1}.`, 25, yPosition);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      
      // Split long text
      const splitText = doc.splitTextToSize(rec, pageWidth - 50);
      doc.text(splitText, 35, yPosition);
      yPosition += splitText.length * 5 + 3;
    });

    // Footer
    yPosition = pageHeight - 30;
    addColoredRect(0, yPosition, pageWidth, 30, colors.primary);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Architectural Plans Compliance Checker', 20, yPosition + 10);
    doc.text('Professional Building Compliance Analysis', 20, yPosition + 17);
    doc.text('Contact: info@compliancechecker.com | www.compliancechecker.com', 20, yPosition + 24);

    // Page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    }

    // Save the PDF
    const fileName = `Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card via-card to-accent/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <CardContent className="relative p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center relative shadow-lg">
              <FileDown className="w-8 h-8 text-white" />
              <div className="absolute inset-0 border-2 border-accent/30 rounded-full border-dashed animate-pulse"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <PieChart className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Interactive PDF Report</h3>
              <p className="text-muted-foreground">
                Generate professional compliance documentation with charts and visual analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-bl-full"></div>
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalFiles}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-secondary/10 rounded-bl-full"></div>
              <CheckCircle className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">{compliantFiles}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            
            {warningFiles > 0 && (
              <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg border border-orange-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-orange-100 rounded-bl-full"></div>
                <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{warningFiles}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            )}
            
            {nonCompliantFiles > 0 && (
              <div className="text-center p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border border-destructive/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-destructive/10 rounded-bl-full"></div>
                <div className="text-2xl font-bold text-destructive">{nonCompliantFiles}</div>
                <div className="text-sm text-muted-foreground">Non-Compliant</div>
              </div>
            )}
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white relative overflow-hidden shadow-lg"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Generating Interactive PDF...
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                />
              </>
            ) : isGenerated ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                PDF Report Generated!
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 mr-2" />
                Generate Interactive PDF Report
              </>
            )}
            
            {isGenerated && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-secondary/20 pointer-events-none rounded-md"
              />
            )}
          </Button>

          <div className="mt-6 p-4 bg-gradient-to-r from-muted/20 to-accent/10 rounded-lg border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Stamp className="w-5 h-5 text-accent" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-primary mb-2">Professional PDF Report Features</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Executive summary with visual compliance statistics</li>
                  <li>• Detailed analysis tables with color-coded status indicators</li>
                  <li>• Professional charts and progress visualizations</li>
                  <li>• Architectural theme styling and branding</li>
                  <li>• Actionable recommendations and next steps</li>
                  <li>• Multi-page format with proper headers and footers</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}