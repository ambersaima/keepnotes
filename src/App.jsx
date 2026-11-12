
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Archive,
  Check,
  Lightbulb,
  Pin,
  Search,
  Trash2,
  Grid2X2,
  List,
  ArrowUpDown,
  Undo2,
  Image,
  Palette,
  ListChecks,
  X
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import LabelModal from './components/LabelModal';
import LoginPage from './pages/LoginPage';

import {
  loadData,
  DATA_KEY,
  SESSION_KEY
} from './utils/storage';

const VIEW_KEY = 'keepnotes-view';
const SORT_KEY = 'keepnotes-sort';

const noteColors = [
  '#ffffff',
  '#fce1e5',
  '#ffedda',
  '#fff3b8',
  '#d9f5e6',
  '#eee2ff',
  '#dceeff',
  '#e9edf2'
];

export default function App() {
  const [data, setData] = useState(loadData);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  const [section, setSection] = useState('Notes');
  const [activeLabel, setActiveLabel] = useState('');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [label, setLabel] = useState('');
  const [editor, setEditor] = useState(null);
  const [labelModal, setLabelModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');

  // Composer image and color
  const [composerImage, setComposerImage] = useState('');
  const [composerColor, setComposerColor] = useState('#ffffff');
  const [showComposerColors, setShowComposerColors] = useState(false);

  const imageInputRef = useRef(null);
  const toastTimer = useRef(null);

  // Grid / List and sorting preferences
  const [view, setView] = useState(() => {
    return localStorage.getItem(VIEW_KEY) || 'grid';
  });

  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem(SORT_KEY) || 'latest';
  });

  // Undo delete
  const [undoNote, setUndoNote] = useState(null);

  // Notification permission
  const [notificationPermission, setNotificationPermission] =
    useState(() =>
      typeof Notification !== 'undefined'
        ? Notification.permission
        : 'unsupported'
    );

  const { notes, labels, dark } = data;

  // Toast message
  const notify = (message) => {
    setToast(message);

    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }

    toastTimer.current = window.setTimeout(() => {
      setToast('');
    }, 2500);
  };

  // Save notes and settings in Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Unable to save notes:', error);
      notify('Storage is full. Try a smaller image.');
    }
  }, [data]);

  // Save Grid / List preference
  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  // Save sorting preference
  useEffect(() => {
    localStorage.setItem(SORT_KEY, sortBy);
  }, [sortBy]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Clear toast timer
  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  // Automatically hide Undo button after 5 seconds
  useEffect(() => {
    if (!undoNote) return;

    const timer = window.setTimeout(() => {
      setUndoNote(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [undoNote]);

  // Update notes
  const updateNotes = (newNotes) => {
    setData((previous) => ({
      ...previous,
      notes: newNotes
    }));
  };

  // Update individual note
  const patch = (id, changes) => {
    updateNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...changes,
              updated: Date.now()
            }
          : note
      )
    );
  };

  // Filter notes
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notes.filter((note) => {
      if (section === 'Trash') {
        if (!note.trashed) return false;
      } else {
        if (note.trashed) return false;

        if (section === 'Archive' && !note.archived) {
          return false;
        }

        if (
          section === 'Pinned' &&
          (!note.pinned || note.archived)
        ) {
          return false;
        }

        if (section === 'Notes' && note.archived) {
          return false;
        }

        if (activeLabel && note.label !== activeLabel) {
          return false;
        }
      }

      return (
        !q ||
        `${note.title} ${note.content || ''} ${(note.checklist || [])
          .map((item) => item.text)
          .join(' ')}`
          .toLowerCase()
          .includes(q)
      );
    });
  }, [notes, section, activeLabel, query]);

  // Sort notes
  const sortedNotes = useMemo(() => {
    const result = [...visible];

    if (sortBy === 'latest') {
      result.sort((a, b) => b.updated - a.updated);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.updated - b.updated);
    } else if (sortBy === 'az') {
      result.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );
    }

    return result;
  }, [visible, sortBy]);

  // Login
  const login = (profile) => {
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // Handle composer image upload
  const handleComposerImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select a valid image');
      e.target.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      notify('Please select an image smaller than 3 MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setComposerImage(reader.result);
    };

    reader.onerror = () => {
      notify('Unable to read image');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Reset composer
  const resetComposer = () => {
    setTitle('');
    setContent('');
    setLabel('');
    setComposerImage('');
    setComposerColor('#ffffff');
    setShowComposerColors(false);
  };

  // Create note and open editor
  const create = () => {
    if (!title.trim() && !content.trim() && !composerImage) return;

    setEditor({
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      checklist: null,
      image: composerImage,
      color: composerColor,
      label,
      reminder: '',
      reminderNotified: false,
      pinned: false,
      archived: false,
      trashed: false,
      updated: Date.now()
    });

    resetComposer();
  };

  // Create checklist
  const checklist = () => {
    setEditor({
      id: Date.now(),
      title: title.trim(),
      content: '',
      checklist: [{ text: '', done: false }],
      image: composerImage,
      color: composerColor,
      label,
      reminder: '',
      reminderNotified: false,
      pinned: false,
      archived: false,
      trashed: false,
      updated: Date.now()
    });

    resetComposer();
  };

  // Edit note
  const edit = (note) => {
    setEditor({
      ...note,
      image: note.image || '',
      checklist:
        note.checklist?.map((item) => ({ ...item })) || null
    });
  };

  // Request browser notification permission
  const requestReminderPermission = async () => {
    if (!('Notification' in window)) {
      notify('Browser notifications are not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      setNotificationPermission('denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();

      setNotificationPermission(permission);

      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  };

  // Save note
  const saveEditor = async () => {
    if (!editor) return;

    const reminder = editor.reminder || '';

    if (
      reminder &&
      (
        Number.isNaN(new Date(reminder).getTime()) ||
        new Date(reminder).getTime() <= Date.now()
      )
    ) {
      notify('Please select a future reminder time');
      return;
    }

    let permissionGranted = true;

    if (reminder) {
      permissionGranted = await requestReminderPermission();
    }

    const previousNote = notes.find(
      (item) => item.id === editor.id
    );

    const updatedNote = {
      ...editor,
      title: editor.title.trim(),
      content: editor.content?.trim() || '',
      checklist:
        editor.checklist?.filter((item) => item.text.trim()) || null,
      image: editor.image || '',
      reminder,
      reminderNotified: reminder
        ? previousNote?.reminder === reminder
          ? previousNote.reminderNotified || false
          : false
        : false,
      updated: Date.now()
    };

    if (notes.some((item) => item.id === updatedNote.id)) {
      updateNotes(
        notes.map((item) =>
          item.id === updatedNote.id ? updatedNote : item
        )
      );
    } else {
      updateNotes([updatedNote, ...notes]);
    }

    setEditor(null);

    if (reminder && !permissionGranted) {
      notify('Reminder saved. Enable browser notifications to receive alerts.');
    } else {
      notify('Note saved');
    }
  };

  // Reminder notification checker
  useEffect(() => {
    if (!('Notification' in window)) return;
    if (notificationPermission !== 'granted') return;

    const checkReminders = () => {
      const now = Date.now();

      const dueNotes = notes.filter(
        (note) =>
          note.reminder &&
          !note.trashed &&
          !note.archived &&
          !note.reminderNotified &&
          new Date(note.reminder).getTime() <= now
      );

      if (!dueNotes.length) return;

      dueNotes.forEach((note) => {
        new Notification(note.title || 'KeepNotes Reminder', {
          body: note.content || 'You have a reminder!',
          tag: `keepnotes-${note.id}`
        });
      });

      const dueIds = new Set(
        dueNotes.map((note) => note.id)
      );

      setData((previous) => ({
        ...previous,
        notes: previous.notes.map((note) =>
          dueIds.has(note.id)
            ? { ...note, reminderNotified: true }
            : note
        )
      }));
    };

    checkReminders();

    const interval = window.setInterval(
      checkReminders,
      10000
    );

    return () => window.clearInterval(interval);
  }, [notes, notificationPermission]);

  // Delete note with Undo
  const deleteWithUndo = (id) => {
    const deletedNote = notes.find(
      (note) => note.id === id
    );

    if (!deletedNote) return;

    setUndoNote(deletedNote);

    updateNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              trashed: true,
              pinned: false,
              updated: Date.now()
            }
          : note
      )
    );

    notify('Note moved to Trash');
  };

  // Undo delete
  const undoDelete = () => {
    if (!undoNote) return;

    updateNotes(
      notes.map((note) =>
        note.id === undoNote.id
          ? { ...undoNote }
          : note
      )
    );

    setUndoNote(null);
    notify('Note restored');
  };

  // Create label
  const addLabel = (name) => {
    const value = name.trim();

    if (
      value &&
      !labels.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      setData((previous) => ({
        ...previous,
        labels: [...previous.labels, value]
      }));
    }

    setLabelModal(false);
  };

  // Delete multiple selected labels without deleting their notes
  const deleteLabels = (names) => {
    if (!Array.isArray(names) || names.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${names.length} selected label(s)? Notes will not be deleted.`
    );

    if (!confirmed) return;

    setData((previous) => ({
      ...previous,
      labels: previous.labels.filter(
        (item) => !names.includes(item)
      ),
      notes: previous.notes.map((note) =>
        names.includes(note.label)
          ? { ...note, label: '', updated: Date.now() }
          : note
      )
    }));

    if (names.includes(activeLabel)) {
      setActiveLabel('');
      setSection('Notes');
    }

    if (names.includes(label)) {
      setLabel('');
    }

    if (editor && names.includes(editor.label)) {
      setEditor((previous) => ({
        ...previous,
        label: ''
      }));
    }

    notify('Selected labels deleted');
  };

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  // Render note card
  const render = (note) => (
    <NoteCard
      key={note.id}
      note={note}
      labels={labels}
      isTrash={section === 'Trash'}
      onEdit={edit}
      onPin={(item) => {
        patch(item.id, {
          pinned: !item.pinned,
          archived: false
        });

        notify(item.pinned ? 'Unpinned' : 'Pinned');
      }}
      onArchive={(item) => {
        patch(item.id, {
          archived: !item.archived,
          pinned: false
        });

        notify(
          item.archived ? 'Moved to Notes' : 'Archived'
        );
      }}
      onTrash={deleteWithUndo}
      onCheck={(item, index) =>
        patch(item.id, {
          checklist: item.checklist.map((value, i) =>
            i === index
              ? { ...value, done: !value.done }
              : value
          )
        })
      }
      onRestore={(id) => {
        patch(id, { trashed: false });
        notify('Restored');
      }}
      onDelete={(id) => {
        updateNotes(
          notes.filter((item) => item.id !== id)
        );
        notify('Permanently deleted');
      }}
      onColor={(color) =>
        patch(note.id, { color })
      }
      onLabel={(value) =>
        patch(note.id, { label: value })
      }
    />
  );

  // Pinned notes grouping
  const showPinnedGroups =
    section === 'Notes' &&
    !activeLabel &&
    !query &&
    sortedNotes.some((note) => note.pinned);

  const pinnedNotes = sortedNotes.filter(
    (note) => note.pinned
  );

  const otherNotes = sortedNotes.filter(
    (note) => !note.pinned
  );

  const gridClass = `notes-grid ${
    view === 'list' ? 'list-view' : ''
  }`;

  return (
    <div className="app-shell min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-[#17181c] dark:text-slate-100">

      <Header
        query={query}
        setQuery={setQuery}
        dark={dark}
        setDark={(value) =>
          setData((previous) => ({
            ...previous,
            dark: value
          }))
        }
        user={user}
        onLogout={logout}
        onMenu={() => setMobileMenu(!mobileMenu)}
      />

      <div className="layout">

        <Sidebar
          section={section}
          setSection={setSection}
          labels={labels}
          activeLabel={activeLabel}
          setActiveLabel={setActiveLabel}
          onAddLabel={() => setLabelModal(true)}
          onDeleteLabels={deleteLabels}
          mobileOpen={mobileMenu}
          setMobileOpen={setMobileMenu}
        />

        <main className="main-content">

          {/* Mobile Search */}
          <div className="mobile-search search-wrap">
            <Search size={20} />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes..."
            />
          </div>

          {/* Note Composer */}
          {!['Trash', 'Archive'].includes(section) && (
            <div
              className="composer"
              style={{ backgroundColor: composerColor }}
            >

              <input
                className="composer-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
              />

              <textarea
                rows="1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Take a note..."
              />

              {/* Selected image preview */}
              {composerImage && (
                <div className="composer-image-preview">
                  <img
                    src={composerImage}
                    alt="Selected note"
                  />

                  <button
                    type="button"
                    onClick={() => setComposerImage('')}
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Hidden image input */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleComposerImage}
              />

              <div className="composer-tools">

                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                >
                  <option value="">No label</option>

                  {labels.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                {/* Checklist */}
                <button
                  className="tool-button"
                  onClick={checklist}
                  title="Create checklist"
                  type="button"
                >
                  <ListChecks size={19} />
                </button>

                {/* Add Image */}
                <button
                  className="tool-button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Add image"
                  type="button"
                >
                  <Image size={19} />
                </button>

                {/* Change Color */}
                <div className="composer-color-wrapper">

                  <button
                    className="tool-button"
                    onClick={() =>
                      setShowComposerColors(!showComposerColors)
                    }
                    title="Change color"
                    type="button"
                  >
                    <Palette size={19} />
                  </button>

                  {showComposerColors && (
                    <div className="composer-color-palette">
                      {noteColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          style={{ backgroundColor: color }}
                          className={
                            composerColor === color
                              ? 'selected-composer-color'
                              : ''
                          }
                          onClick={() => {
                            setComposerColor(color);
                            setShowComposerColors(false);
                          }}
                          title="Select color"
                        />
                      ))}
                    </div>
                  )}

                </div>

                <button
                  className="add-note"
                  onClick={create}
                  type="button"
                >
                  ＋ Add note
                </button>

              </div>
            </div>
          )}

          {/* Section Heading */}
          <div className="section-heading">

            <div className="heading-label">

              {section === 'Pinned' ? (
                <Pin size={19} />
              ) : section === 'Archive' ? (
                <Archive size={19} />
              ) : section === 'Trash' ? (
                <Trash2 size={19} />
              ) : (
                <span className="heading-dot" />
              )}

              <h1>{activeLabel || section}</h1>

            </div>

            <span className="note-count">
              {visible.length} notes
            </span>

          </div>

          {/* Sorting and View Controls */}
          <div className="notes-toolbar">

            <div className="sort-control">
              <ArrowUpDown size={17} />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort notes"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A – Z</option>
              </select>
            </div>

            <div className="view-control">

              <button
                className={view === 'grid' ? 'active-view' : ''}
                onClick={() => setView('grid')}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid2X2 size={19} />
              </button>

              <button
                className={view === 'list' ? 'active-view' : ''}
                onClick={() => setView('list')}
                title="List view"
                aria-label="List view"
              >
                <List size={19} />
              </button>

            </div>

          </div>

          {/* Notes Display */}
          {!sortedNotes.length ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Lightbulb size={34} />
              </div>

              <h2>
                {query
                  ? 'No matching notes'
                  : section === 'Trash'
                    ? 'Trash is empty'
                    : 'Notes you add appear here'}
              </h2>

              <p>
                Capture your thoughts, tasks and ideas in one place.
              </p>

            </div>

          ) : showPinnedGroups ? (

            <>
              <div className="subheading">
                <Pin size={16} /> Pinned
              </div>

              <div className={`${gridClass} pinned-grid`}>
                {pinnedNotes.map(render)}
              </div>

              {otherNotes.length > 0 && (
                <>
                  <div className="subheading">Others</div>

                  <div className={gridClass}>
                    {otherNotes.map(render)}
                  </div>
                </>
              )}

            </>

          ) : (

            <div className={gridClass}>
              {sortedNotes.map(render)}
            </div>

          )}

          <footer className="page-footer">
            Your notes, your space · Keep it simple.
          </footer>

        </main>
      </div>

      {/* Note Editor */}
      {editor && (
        <NoteEditor
          note={editor}
          setNote={setEditor}
          labels={labels}
          onSave={saveEditor}
          onClose={() => setEditor(null)}
        />
      )}

      {/* Label Modal */}
      {labelModal && (
        <LabelModal
          onClose={() => setLabelModal(false)}
          onCreate={addLabel}
        />
      )}

      {/* Normal Toast */}
      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}

      {/* Undo Delete Toast */}
      {undoNote && (
        <div className="undo-toast">
          <span>Note moved to Trash</span>

          <button onClick={undoDelete}>
            <Undo2 size={16} />
            Undo
          </button>
        </div>
      )}

    </div>
  );
}
