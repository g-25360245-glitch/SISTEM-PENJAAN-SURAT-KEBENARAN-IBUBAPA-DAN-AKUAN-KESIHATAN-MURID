
import { jsPDF } from 'jspdf';
import { Student, ProgramData } from '../types';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '....................';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

const LOGO_URL = 'https://i.postimg.cc/sg7cFNyJ/logo-kpm-3.jpg';

let cachedLogoData: string | null = null;

/**
 * Pre-loads the logo and converts it to base64 for fast PDF generation.
 * This should be called when the app starts.
 */
export const preloadLogo = (): Promise<void> => {
  if (cachedLogoData) return Promise.resolve();
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = LOGO_URL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        cachedLogoData = canvas.toDataURL('image/jpeg', 0.8);
      }
      resolve();
    };
    img.onerror = () => {
      console.error("Failed to preload KPM logo");
      resolve();
    };
  });
};

export const generateBorangPDF = async (student: Student, program: Omit<ProgramData, 'students'>) => {
  // Ensure logo is loaded, but don't block too long if it's already being handled
  if (!cachedLogoData) {
    await preloadLogo();
  }

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 20;
  const lineFull = ".................................................................................................................";
  const lineHalf = ".................................................";

  const dateStartFormatted = formatDate(program.programDateStart);
  const dateEndFormatted = formatDate(program.programDateEnd);
  
  // Logic: If end date is missing, only show start date.
  const dateRangeText = (program.programDateEnd && program.programDateEnd !== '') 
    ? `${dateStartFormatted} sehingga ${dateEndFormatted}`
    : dateStartFormatted;

  // Helper for drawing checkboxes
  const drawCheckbox = (x: number, y: number, label: string) => {
    doc.rect(x, y - 3.5, 3.5, 3.5);
    doc.text(label, x + 5, y - 0.5);
  };

  // Function to add logo to a page
  const addLogoToPage = (pageDoc: jsPDF) => {
    if (cachedLogoData) {
      const imgWidth = 45; 
      const imgHeight = 25;
      pageDoc.addImage(cachedLogoData, 'JPEG', (210 - imgWidth) / 2, 10, imgWidth, imgHeight);
    }
  };

  // --- PAGE 1: SURAT AKUAN KEBENARAN ---
  addLogoToPage(doc);

  // Removed "KEMENTERIAN PENDIDIKAN" as it's in the logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SURAT AKUAN KEBENARAN IBU BAPA/PENJAGA MENYERTAI', 105, 42, { align: 'center' });
  doc.text('AKTIVITI KOKURIKULUM', 105, 47, { align: 'center' });

  let y = 55;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  doc.text('Saya', margin, y);
  doc.text(`: ${lineFull}`, margin + 35, y);
  y += 6;
  doc.text('No. Kad Pengenalan', margin, y);
  doc.text(`: ${lineFull}`, margin + 35, y);
  y += 6;
  doc.text('Beralamat', margin, y);
  doc.text(`: ${lineFull}`, margin + 35, y);
  y += 5;
  doc.text(`${lineFull}`, margin + 37, y);
  y += 8;
  doc.text('No. Telefon', margin, y);
  doc.text(`: ${lineHalf}`, margin + 35, y);
  
  y += 8;
  doc.text('mengaku adalah waris kepada murid bernama di bawah :', margin, y);
  
  y += 7;
  doc.text('Nama Pelajar', margin + 10, y);
  doc.text(`: ${student.studentName.toUpperCase() || '......................................................................................'}`, margin + 50, y);
  y += 5.5;
  doc.text('Tahun', margin + 10, y);
  doc.text(`: ${student.studentClass.toUpperCase() || '......................................................................................'}`, margin + 50, y);
  y += 5.5;
  doc.text('No. KP /Surat Lahir', margin + 10, y);
  doc.text(`: ${student.studentIC || '......................................................................................'}`, margin + 50, y);
  y += 5.5;
  doc.text('Sekolah', margin + 10, y);
  doc.text(`: SEKOLAH KEBANGSAAN SUNGAI ABONG (JBA 5095)`, margin + 50, y);
  
  y += 10;
  doc.text('Saya dengan ini memberi kebenaran bertulis saya kepada anak / jagaan saya untuk menyertai :', margin, y);
  
  y += 10;
  doc.text('Nama Program', margin + 10, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${program.programName.toUpperCase() || '.......................................................................'}`, margin + 45, y, { maxWidth: 125 });
  doc.setFont('helvetica', 'normal');
  
  y += 10;
  doc.text('Tarikh', margin + 10, y);
  doc.text(`: ${dateRangeText}`, margin + 45, y);
  y += 5.5;
  doc.text('Tempat', margin + 10, y);
  doc.text(`: ${program.programPlace.toUpperCase() || '.......................................................................'}`, margin + 45, y);
  
  y += 8;
  doc.text('Anjuran', margin + 10, y);
  doc.text(`: ${program.programOrganizer.toUpperCase() || '.......................................................................'}`, margin + 45, y);
  y += 5.5;
  doc.text('Kelolaan', margin + 10, y);
  doc.text(`: ${program.programManagedBy.toUpperCase() || '.......................................................................'}`, margin + 45, y);

  y += 10;
  doc.setFontSize(9);
  const p2 = `2. Saya difahamkan bahawa soal keselamatan dan disiplin sentiasa diberi perhatian sewajarnya oleh Guru/Pegawai/Urus Setia yang telah diamanahkan. Sekiranya kesihatan anak/jagaan saya terganggu dalam masa latihan/perkhemahan atau perjalanan/semasa program, maka saya dengan sepenuh hati membenarkan Guru/Pegawai/Urus Setia menguruskan bagi pihak saya untuk mendapatkan rawatan perubatan. Saya juga mengaku bahawa anak saya telah mempunyai skim perlindungan insurans bagi dirinya sendiri.`;
  doc.text(p2, margin, y, { maxWidth: 170, align: 'justify' });

  y += 22;
  doc.setFontSize(10);
  doc.text('3. Saya dengan ini mengakui bahawa anak/jagaan saya ADA/TIDAK ADA* mengidap penyakit', margin, y);
  y += 5;
  doc.text('kronik/berjangkit. Nyatakan (Jika ada) :', margin, y);
  y += 6.5;
  doc.text('...........................................................................................................', margin, y);
  y += 3.5;
  doc.setFontSize(8);
  doc.text('(*Potong yang berkenaan)', margin, y);
  
  y += 7.5;
  doc.setFontSize(10);
  doc.text('Tandatangan Ibu bapa/Penjaga', margin, y);
  doc.text(`: .......................................................................`, margin + 55, y);
  y += 5.5;
  doc.text('Nama', margin, y);
  doc.text(`: .......................................................................`, margin + 55, y);
  y += 5.5;
  doc.text('Tarikh', margin, y);
  doc.text(`: .......................................................................`, margin + 55, y);

  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.text('DISAHKAN OLEH GURU BESAR', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  doc.text('Saya dengan ini mengakui bahawa sepanjang pengetahuan saya, segala keterangan di atas adalah benar.', margin, y);
  
  y += 7.5;
  doc.text('Tandatangan', margin, y);
  doc.text(`: .......................................................................`, margin + 35, y);
  y += 5.5;
  doc.text('Nama', margin, y);
  doc.text(`: SITI ZALEHA BINTI RAMLAN`, margin + 35, y);
  y += 5.5;
  doc.text('No. Kad Pengenalan', margin, y);
  doc.text(`: 710810015746`, margin + 35, y);
  y += 5.5;
  doc.text('Tarikh', margin, y);
  doc.text(`: .......................................................................`, margin + 35, y);
  y += 5.5;
  doc.text('Cop Rasmi', margin, y);
  doc.text(`: .......................................................................`, margin + 35, y);

  // --- PAGE 2: BORANG PERAKUAN KESIHATAN ---
  doc.addPage();
  addLogoToPage(doc);
  
  y = 42;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BORANG PERAKUAN KESIHATAN MURID SEBELUM MENYERTAI', 105, 43, { align: 'center' });
  doc.text('AKTIVITI KOKURIKULUM PERINGKAT KEBANGSAAN', 105, 47, { align: 'center' });

  y = 52;
  const col1W = 50;
  const col2W = 120;
  const rowH = 7.5;
  doc.setFontSize(8.5);
  
  const drawTableRow = (label: string, value: string, currentY: number) => {
    doc.rect(margin, currentY, col1W, rowH);
    doc.rect(margin + col1W, currentY, col2W, rowH);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 2, currentY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + col1W + 2, currentY + 5);
    return currentY + rowH;
  };

  y = drawTableRow('NAMA AKTIVITI', program.programName.toUpperCase(), y);
  y = drawTableRow('TEMPAT AKTIVITI', program.programPlace.toUpperCase(), y);
  y = drawTableRow('PERINGKAT AKTIVITI', program.programLevel.toUpperCase(), y);
  
  // Date Row Split
  doc.rect(margin, y, col1W, rowH);
  doc.rect(margin + col1W, y, 40, rowH);
  doc.rect(margin + col1W + 40, y, 40, rowH);
  doc.rect(margin + col1W + 80, y, 40, rowH);
  doc.setFont('helvetica', 'bold');
  doc.text('TARIKH MULA', margin + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStartFormatted, margin + col1W + 2, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('TARIKH AKHIR', margin + col1W + 42, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(dateEndFormatted, margin + col1W + 82, y + 5);
  y += rowH;

  y = drawTableRow('NAMA PENUH MURID', student.studentName.toUpperCase(), y);
  y = drawTableRow('NO. K.P/SIJIL LAHIR', student.studentIC, y);
  
  // Gender/Insurance Row
  doc.rect(margin, y, col1W, rowH * 2);
  doc.rect(margin + col1W, y, 40, rowH * 2);
  doc.rect(margin + col1W + 40, y, 80, rowH * 2);
  doc.setFont('helvetica', 'bold');
  doc.text('JANTINA', margin + 2, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(student.studentGender.toUpperCase() || '....................', margin + col1W + 2, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.text('NO. INSURANS TAKAFUL', margin + col1W + 42, y + 6);
  doc.setFontSize(7);
  doc.text('(Dapatkan dari pihak sekolah)', margin + col1W + 42, y + 10);
  doc.setFontSize(8.5);
  y += rowH * 2;

  // Phone Rows
  doc.rect(margin, y, col1W, rowH * 1.5);
  doc.rect(margin + col1W, y, 40, rowH * 1.5);
  doc.rect(margin + col1W + 40, y, 80, rowH * 1.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NO. TELEFON RUMAH', margin + 2, y + 6);
  doc.text('NO. TELEFON TANGAN', margin + col1W + 42, y + 6);
  doc.text('PENJAGA', margin + col1W + 42, y + 10);
  y += rowH * 1.5;

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('REKOD PERUBATAN:', margin, y);
  y += 4;
  doc.rect(margin, y, 130, 7);
  doc.rect(margin + 130, y, 20, 7);
  doc.rect(margin + 150, y, 20, 7);
  doc.setFont('helvetica', 'normal');
  doc.text('Pernahkah anda menerima imunisasi terhadap Tetanus? (Tandakan)', margin + 2, y + 4.5);
  doc.text('Ya', margin + 132, y + 4.5);
  doc.text('Tidak', margin + 152, y + 4.5);
  y += 7;
  doc.rect(margin, y, 130, 7);
  doc.rect(margin + 130, y, 40, 7);
  doc.text('Jika pernah, sila nyatakan tarikh terakhir anda menerima imunisasi.', margin + 2, y + 4.5);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('SILA TANDAKAN √ JIKA ”YA” DAN X JIKA ”TIDAK” DI PETAK YANG BERKENAAN:', margin, y);
  y += 5;
  
  const checklist = [
    ['Pernah Pening atau sakit kepala yang teruk', 'Pernah dilakukan pembedahan pada tubuh'],
    ['Pernah bermasalah pernafasan atau asma', 'Pernah mempunyai sakit sawan (epilepsy)'],
    ['Alahan pada bisa, ubatan or air laut', 'Pernah alami Diabetes atau tekanan darah tinggi'],
    ['Pernah alami kecederaan pada tulang', 'Pernah mabuk laut atau pergerakan'],
    ['Pernah alami sakit jantung', 'Pernah alami masalah buah pinggang'],
    ['Pernahkah anda dalam tempoh satu bulan yang lalu mengalami sebarang penyakit berjangkit atau cirit-birit?', '']
  ];

  checklist.forEach((row, i) => {
    const isFull = row[1] === '';
    doc.rect(margin, y, isFull ? 160 : 80, 7);
    doc.rect(margin + (isFull ? 160 : 80), y, 10, 7);
    doc.setFontSize(7.5);
    doc.text(row[0], margin + 2, y + 4.5);
    
    if (!isFull) {
      doc.rect(margin + 90, y, 70, 7);
      doc.rect(margin + 160, y, 10, 7);
      doc.text(row[1], margin + 92, y + 4.5);
    }
    y += 7;
  });

  // Blood Group
  doc.rect(margin, y, 110, 8);
  doc.rect(margin + 110, y, 60, 8);
  doc.setFontSize(8.5);
  doc.text('Kumpulan Darah', margin + 2, y + 5);
  drawCheckbox(margin + 30, y + 5, 'A');
  drawCheckbox(margin + 40, y + 5, 'B');
  drawCheckbox(margin + 52, y + 5, 'AB');
  drawCheckbox(margin + 65, y + 5, 'O');
  
  doc.text('Rhesus', margin + 112, y + 5);
  drawCheckbox(margin + 130, y + 5, 'RH+');
  drawCheckbox(margin + 145, y + 5, 'RH-');
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('SILA BERIKAN MAKLUMAT TERPERINCI JIKA MASALAH KESIHATAN DI ATAS BERKAITAN DENGAN ANDA.', margin, y);
  y += 4;
  doc.rect(margin, y, 170, 12);
  y += 18;

  doc.setFontSize(8);
  doc.text('SEKIRANYA PELAJAR MEMPUNYAI SALAH SATU DARIPADA PENYAKIT DI ATAS, PELAJAR ADALAH DILARANG', margin, y);
  y += 4;
  doc.text('MENYERTAI PERTANDINGAN DI ATAS.', margin, y);

  y += 10;
  doc.setFontSize(9);
  doc.text('Tanda Tangan Peserta & Nama:', margin, y);
  doc.text('Disahkan oleh Pengetua :', 80, y);
  doc.text('Tarikh :', 150, y);
  
  y += 10;
  doc.text('.........................................................', margin, y);
  doc.text('............................................................', 80, y);
  doc.text('............................', 150, y);
  y += 5;
  doc.text(`( ${student.studentName.toUpperCase() || '                              '} )`, margin, y);
  doc.text('(                                             )', 80, y);

  const fileName = `${student.studentName.toUpperCase().replace(/\s+/g, '_')}_${program.programName.toUpperCase().replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
