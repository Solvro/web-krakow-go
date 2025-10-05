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
  // Helper function to remove Polish diacritics
  const removeDiacritics = (text: string): string => {
    return text
      .replace(/ą/g, 'a').replace(/Ą/g, 'A')
      .replace(/ć/g, 'c').replace(/Ć/g, 'C')
      .replace(/ę/g, 'e').replace(/Ę/g, 'E')
      .replace(/ł/g, 'l').replace(/Ł/g, 'L')
      .replace(/ń/g, 'n').replace(/Ń/g, 'N')
      .replace(/ó/g, 'o').replace(/Ó/g, 'O')
      .replace(/ś/g, 's').replace(/Ś/g, 'S')
      .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
      .replace(/ż/g, 'z').replace(/Ż/g, 'Z');
  };

  const COLORS = {
    background: [246, 246, 246] as const, // bg-orange-50
    borderOuter: [251, 146, 60] as const, // orange-400
    borderInner: [253, 186, 116] as const, // orange-300
    accent: [49, 122, 181] as const, // orange-600
    text: [68, 68, 68] as const, // neutral text
  };

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(...COLORS.background);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border
  pdf.setDrawColor(...COLORS.borderOuter);
  pdf.setLineWidth(2);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  pdf.setDrawColor(...COLORS.borderInner);
  pdf.setLineWidth(0.5);
  pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(32);
  pdf.setTextColor(...COLORS.accent);
  pdf.text('CERTYFIKAT WOLONTARIUSZA', pageWidth / 2, 40, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(...COLORS.borderOuter);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth / 2 - 60, 45, pageWidth / 2 + 60, 45);

  // Body text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.text);

  let yPosition = 65;

  pdf.text('Niniejszym poswiadczamy, ze', pageWidth / 2, yPosition, { align: 'center' });

  // Volunteer name
  yPosition += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(...COLORS.accent);
  pdf.text(removeDiacritics(data.volunteerName), pageWidth / 2, yPosition, { align: 'center' });

  // Event participation
  yPosition += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.text);
  pdf.text('bral/a udzial w akcji wolontariackiej', pageWidth / 2, yPosition, { align: 'center' });

  // Event title
  yPosition += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(...COLORS.accent);
  const eventTitle = pdf.splitTextToSize(removeDiacritics(data.eventTitle), pageWidth - 80);
  pdf.text(eventTitle, pageWidth / 2, yPosition, { align: 'center' });

  // Organization
  yPosition += (eventTitle.length * 8) + 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.text);
  pdf.text(`zorganizowanej przez: ${removeDiacritics(data.organizationName)}`, pageWidth / 2, yPosition, { align: 'center' });

  // Details
  yPosition += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Szczegoly uczestnictwa:', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFont('helvetica', 'normal');

  const estimatedHours = data.tasksCount * 2;

  pdf.text(`Liczba wykonanych zadan: ${data.tasksCount}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  pdf.text(`Zdobyte punkty: ${data.points}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  const issueDate = new Date(data.issuedAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  pdf.text(`Data wystawienia: ${removeDiacritics(issueDate)}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  pdf.text(`Szacowany czas zaangazowania: ${estimatedHours} godzin`, pageWidth / 2, yPosition, { align: 'center' });

  // Save PDF
  const fileName = `Certyfikat_${removeDiacritics(data.volunteerName).replace(/\s+/g, '_')}_${removeDiacritics(data.eventTitle).substring(0, 10).replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
};