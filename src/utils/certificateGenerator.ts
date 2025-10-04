import jsPDF from 'jspdf';

interface CertificateData {
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  eventId: string;
  eventTitle: string;
  organizationName: string;
  points: number;
  tasksCount: number;
  issuedAt: string;
  startDate?: string;
  endDate?: string;
}

export const generateCertificate = async (data: CertificateData) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Background color
  pdf.setFillColor(254, 243, 229); // bg-orange-50 equivalent
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  pdf.setDrawColor(251, 146, 60); // orange-400
  pdf.setLineWidth(2);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  pdf.setDrawColor(253, 186, 116); // orange-300
  pdf.setLineWidth(0.5);
  pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Title
  pdf.setFont('times', 'bold');
  pdf.setFontSize(32);
  pdf.setTextColor(234, 88, 12); // orange-600
  pdf.text('CERTYFIKAT WOLONTARIUSZA', pageWidth / 2, 40, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(251, 146, 60);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth / 2 - 60, 45, pageWidth / 2 + 60, 45);

  // Body text
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(68, 68, 68);
  
  let yPosition = 65;
  
  pdf.text('Niniejszym poświadczamy, że', pageWidth / 2, yPosition, { align: 'center' });
  
  // Volunteer name
  yPosition += 15;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(234, 88, 12);
  pdf.text(data.volunteerName, pageWidth / 2, yPosition, { align: 'center' });
  
  // Event participation
  yPosition += 15;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(68, 68, 68);
  pdf.text('brał/a udział w akcji wolontariackiej', pageWidth / 2, yPosition, { align: 'center' });
  
  // Event title
  yPosition += 15;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(234, 88, 12);
  const eventTitle = pdf.splitTextToSize(data.eventTitle, pageWidth - 80);
  pdf.text(eventTitle, pageWidth / 2, yPosition, { align: 'center' });
  
  // Organization
  yPosition += (eventTitle.length * 8) + 10;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(68, 68, 68);
  pdf.text(`zorganizowanej przez ${data.organizationName}`, pageWidth / 2, yPosition, { align: 'center' });
  
  // Details section
  yPosition += 20;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(12);
  
  pdf.text('Szczegóły uczestnictwa:', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFont('times', 'normal');
  
  // Center-aligned details
  const estimatedHours = data.tasksCount * 2;
  
  pdf.text(`Liczba wykonanych zadań: ${data.tasksCount}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  pdf.text(`Zdobyte punkty: ${data.points}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  const issueDate = new Date(data.issuedAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  pdf.text(`Data wystawienia: ${issueDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  pdf.text(`Szacowany czas zaangażowania: ${estimatedHours} godzin`, pageWidth / 2, yPosition, { align: 'center' });

  // Save PDF
  const fileName = `Certyfikat_${data.volunteerName.replace(/\s+/g, '_')}_${data.eventTitle.substring(0, 10).replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
};
