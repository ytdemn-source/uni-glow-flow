
## Notes & Help Library

A read-only resource library where students can browse, search, and download study notes / help text uploaded by admin, with category tags and a comments section under each note.

### User flows

**Students (no login):**
- See a promo card "Notes & Help" on the homepage → click → /notes
- Browse all notes, filter by subject/semester tag, search by title
- Open a note → read text content, download attached PDF/image, post a comment with their name

**Admin (uses existing `jakir03` code):**
- On /notes, an "Admin" button opens an upload dialog (gated by the admin code)
- Upload: title, body text (markdown), tags (multi-select), optional file (PDF/image, ≤10 MB)
- Delete own notes / moderate comments

### Pages & components

```text
src/pages/Notes.tsx              list + search + tag filter + admin button
src/pages/NoteDetail.tsx         /notes/:id — content, download, comments
src/components/NotesPromoCard.tsx   homepage card linking to /notes
src/components/NoteListItem.tsx
src/components/NoteUploadDialog.tsx (admin-gated)
src/components/NoteComments.tsx
```

Routes added in `src/App.tsx`: `/notes` and `/notes/:id`. Promo card placed on `Index.tsx` between Quick Links and Services.

### Backend (Lovable Cloud)

Tables (all in `public`, with GRANTs + RLS):

- `notes` — id, title, body (markdown), tags text[], file_url, file_name, file_type, created_at
  - SELECT: public (anon + authenticated)
  - INSERT/UPDATE/DELETE: service_role only (admin actions go through edge function)
- `note_comments` — id, note_id, author_name, body, created_at
  - SELECT: public
  - INSERT: public (rate-limited by edge function later if needed)
  - DELETE: service_role only

Storage bucket `note-files` (public read) for attachments.

Edge function `admin-notes` (verify_jwt=false) — accepts `{ adminCode, action, payload }`, checks `adminCode === 'jakir03'`, then performs insert/delete on notes using service role. Keeps the admin code server-side and avoids exposing the service role to the client.

### Tag system

Free-form tag list defined in code (`src/lib/noteTags.ts`): e.g. Semester 1–6, Bengali, English, Education, Geography, Sanskrit, Vocational, General. Stored as `text[]` on each note; filter UI uses chips.

### Design

- Match existing glass-card aesthetic from `QuickLinksSection`
- Promo card uses the same highlighted style as the Student Login card (gradient border, "New" badge)
- Comments: minimal — name input + textarea + list of timestamped comments
- Mobile: single column list, sticky tag filter

### Out of scope (can add later)

- Student accounts / login
- Comment editing or threading
- Upvotes / view counts
- Email notifications on new notes
