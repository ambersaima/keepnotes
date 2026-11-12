export const DATA_KEY = 'keepnotes-v2';
export const SESSION_KEY = 'keepnotes-session';

export const starterNotes = [
  {
    id: 1,
    title: 'Project Plan',
    content: '',
    checklist: [
      { text: 'Setup repository', done: true },
      { text: 'Design UI', done: false },
      { text: 'Integrate API', done: false },
      { text: 'Testing', done: false }
    ],
    color: '#fff3b8',
    label: 'Work',
    pinned: true,
    archived: false,
    trashed: false,
    updated: Date.now()
  },
  {
    id: 2,
    title: 'Meeting Notes',
    content: `• Discuss project timeline
• Finalize requirements
• Assign tasks
• Next review on Friday`,
    checklist: null,
    color: '#eee2ff',
    label: 'Work',
    pinned: true,
    archived: false,
    trashed: false,
    updated: Date.now() - 1
  },
  {
    id: 3,
    title: 'Learning Goals',
    content: '',
    checklist: [
      { text: 'Complete React course', done: false },
      { text: 'Build 2 mini-projects', done: true },
      { text: 'Revise JavaScript', done: false },
      { text: 'Practice DSA', done: false }
    ],
    color: '#dceeff',
    label: 'Study',
    pinned: true,
    archived: false,
    trashed: false,
    updated: Date.now() - 2
  },
  {
    id: 4,
    title: 'Grocery List',
    content: '',
    checklist: [
      { text: 'Milk', done: false },
      { text: 'Bread', done: false },
      { text: 'Fruits', done: false },
      { text: 'Eggs', done: false },
      { text: 'Vegetables', done: false }
    ],
    color: '#fce1e5',
    label: 'Personal',
    pinned: false,
    archived: false,
    trashed: false,
    updated: Date.now() - 3
  },
  {
    id: 5,
    title: 'Ideas 💡',
    content: `• AI automation for HR
• Resume generator
• Mock test platform
• LinkedIn content ideas`,
    checklist: null,
    color: '#d9f5e6',
    label: 'Work',
    pinned: false,
    archived: false,
    trashed: false,
    updated: Date.now() - 4
  },
  {
    id: 6,
    title: 'Reading List 📚',
    content: '',
    checklist: [
      { text: 'Atomic Habits', done: false },
      { text: 'Deep Work', done: false },
      { text: 'The Lean Startup', done: true },
      { text: 'Building a Second Brain', done: false }
    ],
    color: '#ffedda',
    label: 'Personal',
    pinned: false,
    archived: false,
    trashed: false,
    updated: Date.now() - 5
  },
  {
    id: 7,
    title: 'Travel Plan ✈️',
    content: `• Manali – Dec
• Book hotel
• Check weather
• Make itinerary`,
    checklist: null,
    color: '#dceeff',
    label: 'Personal',
    pinned: false,
    archived: false,
    trashed: false,
    updated: Date.now() - 6
  }
];

export function loadData() {
  try {
    const x = JSON.parse(localStorage.getItem(DATA_KEY));

    if (x?.notes) {
      return x;
    }
  } catch {}

  return {
    notes: starterNotes,
    labels: ['Work', 'Personal', 'Study'],
    dark: false
  };
}
