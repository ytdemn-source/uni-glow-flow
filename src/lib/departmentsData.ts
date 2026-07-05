export interface Teacher {
  name: string;
  designation: string;
  qualification?: string;
}

export interface DownloadableItem {
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'link';
}

export interface DepartmentData {
  name: string;
  href: string;
  color: string;
  about: string;
  teachers: Teacher[];
  syllabus: DownloadableItem[];
  routine: DownloadableItem[];
  results: DownloadableItem[];
  notices: DownloadableItem[];
}

// Generic subject directory. No college-specific links, faculty, or PDFs —
// content is uploaded per-subject via the Notes Library.
export const departmentsData: DepartmentData[] = [
  {
    name: 'Bengali',
    href: '#notices',
    color: 'from-orange-500/20 to-amber-500/20',
    about:
      'Study Bengali literature, language and culture. Use the Notes Library to browse and share study material for this subject.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'English',
    href: '#notices',
    color: 'from-blue-500/20 to-cyan-500/20',
    about:
      'English literature, language skills and communication. Share and download subject notes via the Notes Library.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'History',
    href: '#notices',
    color: 'from-purple-500/20 to-pink-500/20',
    about:
      'Ancient, medieval and modern history with a focus on Indian and world events.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'Geography',
    href: '#notices',
    color: 'from-green-500/20 to-emerald-500/20',
    about:
      'Physical and human geography, climate, landforms and geospatial basics.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'Sanskrit',
    href: '#notices',
    color: 'from-yellow-500/20 to-orange-500/20',
    about:
      'Classical Sanskrit texts, grammar and philosophy.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'Philosophy',
    href: '#notices',
    color: 'from-indigo-500/20 to-violet-500/20',
    about:
      'Indian and Western philosophical traditions, logic and ethics.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'Political Science',
    href: '#notices',
    color: 'from-red-500/20 to-rose-500/20',
    about:
      'Political theory, comparative politics, international relations and public administration.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
  {
    name: 'Environmental Studies',
    href: '#notices',
    color: 'from-teal-500/20 to-cyan-500/20',
    about:
      'Ecology, biodiversity, pollution, climate change and sustainability.',
    teachers: [],
    syllabus: [],
    routine: [],
    results: [],
    notices: [],
  },
];
