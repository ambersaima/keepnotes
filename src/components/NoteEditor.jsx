
import { Plus, X, CalendarClock, ImagePlus } from 'lucide-react';

const colors = [
  '#ffffff',
  '#fce1e5',
  '#ffedda',
  '#fff3b8',
  '#d9f5e6',
  '#eee2ff',
  '#dceeff',
  '#e9edf2'
];

export default function NoteEditor({
  note,
  setNote,
  labels,
  onSave,
  onClose
}) {
  const update = (k, v) => {
    setNote((p) => ({
      ...p,
      [k]: v
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      update('image', reader.result);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div
        className="editor-modal"
        style={{ backgroundColor: note.color }}
      >
        <div className="editor-top">
          <span>
            {note.checklist ? 'Checklist note' : 'Edit note'}
          </span>

          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          className="editor-title"
          value={note.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Title"
        />

        {note.checklist ? (
          <div className="editor-checks">
            {note.checklist.map((x, i) => (
              <div className="editor-check-row" key={i}>
                <input
                  type="checkbox"
                  checked={x.done}
                  onChange={(e) =>
                    update(
                      'checklist',
                      note.checklist.map((v, j) =>
                        j === i
                          ? { ...v, done: e.target.checked }
                          : v
                      )
                    )
                  }
                />

                <input
                  value={x.text}
                  onChange={(e) =>
                    update(
                      'checklist',
                      note.checklist.map((v, j) =>
                        j === i
                          ? { ...v, text: e.target.value }
                          : v
                      )
                    )
                  }
                  placeholder="List item"
                />

                <button
                  className="icon-button"
                  onClick={() =>
                    update(
                      'checklist',
                      note.checklist.filter((_, j) => j !== i)
                    )
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            <button
              className="add-check"
              onClick={() =>
                update('checklist', [
                  ...note.checklist,
                  { text: '', done: false }
                ])
              }
            >
              <Plus size={16} /> Add item
            </button>
          </div>
        ) : (
          <textarea
            className="editor-content"
            value={note.content}
            onChange={(e) => update('content', e.target.value)}
            placeholder="Take a note..."
          />
        )}

        {/* Image Upload Section */}
        <div className="image-upload-section">
          <label className="image-upload-button" htmlFor="note-image">
            <ImagePlus size={18} />
            Add Image
          </label>

          <input
            id="note-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />

          {note.image && (
            <div className="image-preview">
              <img src={note.image} alt="Note attachment" />

              <button
                type="button"
                className="remove-note-image"
                onClick={() => update('image', '')}
                title="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Reminder Section */}
        <div className="reminder-section">
          <label className="reminder-label">
            <CalendarClock size={18} />
            Reminder
          </label>

          <input
            type="datetime-local"
            className="reminder-input"
            value={note.reminder || ''}
            min={new Date(
              Date.now() - new Date().getTimezoneOffset() * 60000
            ).toISOString().slice(0, 16)}
            onChange={(e) => update('reminder', e.target.value)}
          />

          {note.reminder && (
            <button
              className="clear-reminder"
              onClick={() => update('reminder', '')}
            >
              <X size={14} /> Remove reminder
            </button>
          )}
        </div>

        <div className="editor-controls">
          <select
            value={note.label || ''}
            onChange={(e) => update('label', e.target.value)}
          >
            <option value="">No label</option>

            {labels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <div className="editor-colors">
            {colors.map((c) => (
              <button
                key={c}
                style={{ background: c }}
                onClick={() => update('color', c)}
              />
            ))}
          </div>

          <button className="primary-button" onClick={onSave}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
