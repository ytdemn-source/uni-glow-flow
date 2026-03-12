

## Add Vocational Education & Training (Retail and Sales) Section

### What I Found
Burdwan University's NEP 2020 curriculum includes **VOC Minor** and **VOC Exit Point** syllabi that apply across all departments. These contain the "Retail and Sales" vocational subject. The official PDF links are available from the university website.

### Plan

**File: `src/lib/departmentsData.ts`**

Add a new department entry for "Vocational Education & Training" with:
- Name: "Vocational Education & Training"
- Link to Galsi Mahavidyalaya (or BU page since the college page doesn't exist)
- Color: a distinct gradient (e.g., `from-rose-500/20 to-pink-500/20`)
- About text describing the VOC courses under NEP 2020
- Syllabus items:
  - VOC Minor Syllabus (Sem-III, V & VI) — from BU
  - VOC Exit Point Syllabus (Sem-II, Sem-IV) — from BU
- Teachers, routine, results, notices: empty arrays (placeholder)

This adds the new department card to the existing grid with downloadable syllabus PDFs. No other files need changes — `DepartmentsSection.tsx` already maps over `departmentsData`.

