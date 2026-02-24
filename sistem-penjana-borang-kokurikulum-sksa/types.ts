
export interface Student {
  id: string;
  studentName: string;
  studentClass: string;
  studentIC: string;
  studentGender: string;
}

export interface ProgramData {
  // Students Info
  students: Student[];
  
  // Program Info
  programName: string;
  programDateStart: string;
  programDateEnd: string;
  programPlace: string;
  programLevel: string;
  programOrganizer: string;
  programManagedBy: string;
}

export const initialStudent: Student = {
  id: '1',
  studentName: '',
  studentClass: '',
  studentIC: '',
  studentGender: '',
};

export const initialProgramData: ProgramData = {
  students: [initialStudent],
  programName: '',
  programDateStart: '',
  programDateEnd: '',
  programPlace: '',
  programLevel: 'Peringkat Sekolah',
  programOrganizer: '',
  programManagedBy: '',
};
