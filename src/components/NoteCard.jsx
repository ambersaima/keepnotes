
import { useState } from 'react';

import {
  Archive,
  Bell,
  Check,
  MoreVertical,
  Pin,
  RotateCcw,
  Trash2
} from 'lucide-react';

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

export default function NoteCard({
  note,
  labels,
  onEdit,
  onPin,
  onArchive,
  onTrash,
  onCheck,
  onRestore,
  onDelete,
  onColor,
  onLabel,
  isTrash
}) {
  const [more, setMore] = useState(false);
  const [palette, setPalette] = useState(false);

  const formatReminder = (value) => {
    if (!value) return '';

    return new Date(value).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article
      className="note-card"
      style={{ backgroundColor: note.color }}
      onClick={() => !isTrash && onEdit(note)}
    >
      <div className="card-head">
        <h2>{note.title || 'Untitled'}</h2>

        {!isTrash && (
          <button
            className={`pin-button ${note.pinned ? 'is-pinned' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onPin(note);
            }}
          >
            <Pin
              size={21}
              fill={note.pinned ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Uploaded Image */}
      {note.image && (
        <div className="note-image-container">
          <img
            src={note.image}
            alt={note.title || 'Note image'}
            className="note-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {note.checklist ? (
        <ul
          className="check-list"
          onClick={(e) => e.stopPropagation()}
        >
          {note.checklist.map((x, i) => (
            <li key={i}>
              <button
                className={`check-box ${x.done ? 'checked' : ''}`}
                onClick={() => onCheck(note, i)}
              >
                {x.done && <Check size={13} />}
              </button>

              <span className={x.done ? 'completed' : ''}>
                {x.text || 'Empty task'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note-content">{note.content}</p>
      )}

      {/* Reminder Display */}
      {!isTrash && note.reminder && (
        <div className="note-reminder">
          <Bell size={14} />
          <span>{formatReminder(note.reminder)}</span>
        </div>
      )}

      <div className="card-bottom">
        <div className="card-labels">
          {note.label && (
            <span className="label-chip">
              {note.label}
            </span>
          )}
        </div>

        <div
          className="card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          {isTrash ? (
            <>
              <button
                className="card-action"
                onClick={() => onRestore(note.id)}
                title="Restore"
              >
                <RotateCcw size={18} />
              </button>

              <button
                className="card-action"
                onClick={() => onDelete(note.id)}
                title="Delete permanently"
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <>
              <div className="relative-action">
                <button
                  className="card-action"
                  onClick={() => setPalette(!palette)}
                  title="Change color"
                >
                  ◉
                </button>

                {palette && (
                  <div className="color-popover">
                    {colors.map((c) => (
                      <button
                        key={c}
                        style={{ background: c }}
                        onClick={() => {
                          onColor(c);
                          setPalette(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                className="card-action"
                onClick={() => onArchive(note)}
                title="Archive"
              >
                <Archive size={18} />
              </button>

              <button
                className="card-action"
                onClick={() => onTrash(note.id)}
                title="Move to Trash"
              >
                <Trash2 size={18} />
              </button>

              <div className="relative-action">
                <button
                  className="card-action"
                  onClick={() => setMore(!more)}
                  title="More options"
                >
                  <MoreVertical size={18} />
                </button>

                {more && (
                  <div className="more-menu">
                    <button
                      onClick={() => {
                        onEdit(note);
                        setMore(false);
                      }}
                    >
                      Edit note
                    </button>

                    <label>
                      Change label

                      <select
                        value={note.label || ''}
                        onChange={(e) => {
                          onLabel(e.target.value);
                          setMore(false);
                        }}
                      >
                        <option value="">No label</option>

                        {labels.map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
