import jsPDF from 'jspdf';

interface ParsedProject {
  projectName: string;
  problemItSolves: string;
  whyRecruitersLoveIt: string;
  techStack: string;
  difficulty: string;
  timeToBuild: string;
  steps: Array<{ title: string; description: string }>;
  proTip: string;
}

export function generatePDF(project: ParsedProject) {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237);
  doc.text('HireReady', margin, yPos);
  yPos += 15;

  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(project.projectName, margin, yPos);
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Problem It Solves:', margin, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  const problemLines = doc.splitTextToSize(project.problemItSolves, maxWidth);
  doc.text(problemLines, margin, yPos);
  yPos += problemLines.length * 7 + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Why Recruiters Love It:', margin, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  const recruitersLines = doc.splitTextToSize(project.whyRecruitersLoveIt, maxWidth);
  doc.text(recruitersLines, margin, yPos);
  yPos += recruitersLines.length * 7 + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Tech Stack:', margin, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(project.techStack, margin, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'bold');
  doc.text(`Difficulty: ${project.difficulty}`, margin, yPos);
  yPos += 7;
  doc.text(`Time to Build: ${project.timeToBuild}`, margin, yPos);
  yPos += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Step-by-Step Guide:', margin, yPos);
  yPos += 10;

  doc.setFontSize(12);
  project.steps.forEach((step, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`Step ${index + 1}: ${step.title}`, margin, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    const stepLines = doc.splitTextToSize(step.description, maxWidth);
    doc.text(stepLines, margin, yPos);
    yPos += stepLines.length * 7 + 8;
  });

  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('Pro Tip:', margin, yPos);
  yPos += 7;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const tipLines = doc.splitTextToSize(project.proTip, maxWidth);
  doc.text(tipLines, margin, yPos);

  doc.save('HireReady-Project-Guide.pdf');
}
