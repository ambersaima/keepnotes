# KeepNotes — Component-wise React + Vite + Tailwind CSS

## Features
- Separate React components: Header, Sidebar, NoteCard, NoteEditor, LabelModal, LoginPage
- Demo login/sign-up and logout
- Create, edit, delete, pin, archive, restore and permanently delete notes
- Pastel colours, labels, search and checklist notes
- Browser LocalStorage persistence for notes, labels, theme and demo session
- Responsive layout and dark/light mode

## Run
Requires Node.js 18+.
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
Push to GitHub, import into Vercel, choose Vite, build command `npm run build`, output folder `dist`.

## Important login note
The login/sign-up screen is a front-end demo only. It accepts any non-empty email and password, stores only the signed-in profile in LocalStorage, and does not store passwords. There is no server-side identity verification or cloud account system. For real authentication, connect a backend or Firebase/Supabase. Notes are saved in the current browser and do not sync across devices.
