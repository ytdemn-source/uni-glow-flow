export const NOTE_TAGS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Bengali",
  "English",
  "Education",
  "Geography",
  "Sanskrit",
  "Political Science",
  "History",
  "Philosophy",
  "Vocational",
  "General",
  "Help",
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];
