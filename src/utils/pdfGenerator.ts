// ============================================================
// UTILITY: PDF CERTIFICATE GENERATOR
// jsPDF engine with QR code verification
// ============================================================

import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';

interface CertificateData {
  userName: string;
  topic: string;
  score: number;
  userId: string;
  roadmapTitle?: string;
  totalHours?: number;
}

/**
 * Generate SHA-256 hash for certificate verification
 */
async function generateVerificationHash(data: CertificateData): Promise<string> {
  const timestamp = Date.now();
  const secretSalt = import.meta.env.VITE_CERTIFICATE_SALT || 'hireready-2.0-salt';
  
  const hashInput = `${data.userId}-${data.topic}-${data.score}-${timestamp}-${secretSalt}`;
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(hashInput);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Generate certificate PDF with QR code
 */
export async function generateCertificatePDF(data: CertificateData): Promise<string> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Generate verification hash
  const verificationHash = await generateVerificationHash(data);
  const verifyUrl = `${window.location.origin}/verify?hash=${verificationHash}`;

  // Save to database
  await supabase.from('certificates').insert({
    user_id: data.userId,
    user_name: data.userName,
    topic: data.topic,
    score: data.score,
    roadmap_title: data.roadmapTitle,
    total_hours_invested: data.totalHours,
    verification_hash: verificationHash,
  });

  // Background gradient (simulated with rectangles)
  doc.setFillColor(17, 24, 39); // gray-950
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border (purple glow effect - simulated with multiple rectangles)
  for (let i = 0; i < 3; i++) {
    const opacity = 0.3 - (i * 0.1);
    doc.setDrawColor(147, 51, 234, opacity * 255);
    doc.setLineWidth(2 - i * 0.5);
    doc.rect(10 - i, 10 - i, pageWidth - 20 + (i * 2), pageHeight - 20 + (i * 2), 'S');
  }

  // Inner border
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

  // Header - "CERTIFICATE OF ACHIEVEMENT"
  doc.setFontSize(32);
  doc.setTextColor(147, 51, 234); // purple-600
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 40, { align: 'center' });

  // Decorative line
  doc.setDrawColor(168, 85, 247); // purple-500
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 60, 45, pageWidth / 2 + 60, 45);

  // "This is to certify that"
  doc.setFontSize(12);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', pageWidth / 2, 60, { align: 'center' });

  // Recipient Name
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName, pageWidth / 2, 75, { align: 'center' });

  // Name underline
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.5);
  const nameWidth = doc.getTextWidth(data.userName);
  doc.line(pageWidth / 2 - nameWidth / 2, 78, pageWidth / 2 + nameWidth / 2, 78);

  // "has successfully completed"
  doc.setFontSize(12);
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed the', pageWidth / 2, 90, { align: 'center' });

  // Topic/Course
  doc.setFontSize(18);
  doc.setTextColor(236, 72, 153); // pink-500
  doc.setFont('helvetica', 'bold');
  doc.text(data.topic, pageWidth / 2, 102, { align: 'center' });

  // Roadmap title (if provided)
  if (data.roadmapTitle) {
    doc.setFontSize(11);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'italic');
    doc.text(`Career Roadmap: ${data.roadmapTitle}`, pageWidth / 2, 110, { align: 'center' });
  }

  // Score badge (centered)
  const badgeX = pageWidth / 2 - 20;
  const badgeY = 120;

  // Badge background (purple gradient simulation)
  doc.setFillColor(126, 34, 206, 0.2); // purple-700
  doc.circle(pageWidth / 2, badgeY + 10, 15, 'F');
  
  doc.setDrawColor(147, 51, 234);
  doc.setLineWidth(2);
  doc.circle(pageWidth / 2, badgeY + 10, 15, 'S');

  // Score text
  doc.setFontSize(24);
  doc.setTextColor(147, 51, 234);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.score}%`, pageWidth / 2, badgeY + 15, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Issued on ${issueDate}`, pageWidth / 2, 155, { align: 'center' });

  // QR Code (bottom right)
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#8b5cf6', // purple-500
        light: '#00000000', // transparent
      },
    });

    doc.addImage(qrDataUrl, 'PNG', pageWidth - 45, pageHeight - 45, 30, 30);

    // QR label
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Scan to verify', pageWidth - 30, pageHeight - 12, { align: 'center' });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }

  // Verification hash (bottom left)
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.setFont('courier', 'normal');
  doc.text(`Verification: ${verificationHash.substring(0, 32)}...`, 20, pageHeight - 12);

  // Footer - HireReady branding
  doc.setFontSize(10);
  doc.setTextColor(147, 51, 234);
  doc.setFont('helvetica', 'bold');
  doc.text('HireReady 2.0', 20, pageHeight - 20);
  
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('The Ultimate AI-Powered Career OS', 20, pageHeight - 16);

  // Signature line (right side)
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 80, pageHeight - 25, pageWidth - 20, pageHeight - 25);
  
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Authorized Signature', pageWidth - 50, pageHeight - 20, { align: 'center' });

  // Save the PDF
  const filename = `HireReady_Certificate_${data.userName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);

  return verificationHash;
}
