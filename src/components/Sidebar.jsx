
import { useState } from 'react';
import {
  Archive,
  FileText,
  Pin,
  Plus,
  Tag,
  Trash2,
  X
} from 'lucide-react';

const items = [
  ['Notes', FileText],
  ['Pinned', Pin],
  ['Archive', Archive],
  ['Trash', Trash2]
];

export default function Sidebar({
  section,
  setSection,
  labels,
  activeLabel,
  setActiveLabel,
  onAddLabel,
  onDeleteLabels,
  mobileOpen,
  setMobileOpen
}) {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const toggleLabel = (name) => {
    setSelectedLabels((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name]
    );
  };

  const handleDelete = () => {
    if (!selectedLabels.length) return;

    if (typeof onDeleteLabels !== 'function') {
      console.error('onDeleteLabels function is missing in App.jsx');
      return;
    }

    // App handles confirmation and deletion.
    // Clear selection only after invoking the callback.
    onDeleteLabels(selectedLabels);

    setSelectedLabels([]);
    setSelectMode(false);
  };

  const cancelSelection = () => {
    setSelectedLabels([]);
    setSelectMode(false);
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>

      <div className="mobile-sidebar-head">
        <b>Menu</b>
        <button
          className="icon-button"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>
      </div>

      <nav className="nav-list">
        {items.map(([name, Icon]) => (
          <button
            key={name}
            className={`nav-item ${
              section === name && !activeLabel ? 'active' : ''
            }`}
            onClick={() => {
              setSection(name);
              setActiveLabel('');
              setMobileOpen(false);
            }}
          >
            <Icon size={22} />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="side-divider" />

      <div className="label-heading">
        <span>Labels</span>

        <div className="label-heading-actions">

          <button
            className="icon-button small"
            onClick={onAddLabel}
            title="Create new label"
            type="button"
          >
            <Plus size={21} />
          </button>

          <button
            className={`icon-button small ${
              selectMode ? 'delete-mode-active' : ''
            }`}
            onClick={() => {
              if (selectMode) {
                cancelSelection();
              } else {
                setSelectMode(true);
              }
            }}
            title={selectMode ? 'Cancel selection' : 'Select labels to delete'}
            type="button"
          >
            {selectMode ? <X size={19} /> : <Trash2 size={19} />}
          </button>

        </div>
      </div>

      <div className="label-list">

        {labels.map((name, index) => (
          <div
            key={name}
            className={`label-row ${
              activeLabel === name ? 'label-active' : ''
            }`}
          >

            {selectMode && (
              <input
                type="checkbox"
                className="label-checkbox"
                checked={selectedLabels.includes(name)}
                onChange={() => toggleLabel(name)}
                aria-label={`Select ${name}`}
              />
            )}

            <button
              type="button"
              className={`label-item ${
                activeLabel === name ? 'label-active' : ''
              }`}
              onClick={() => {
                if (selectMode) {
                  toggleLabel(name);
                } else {
                  setActiveLabel(name);
                  setSection('Notes');
                  setMobileOpen(false);
                }
              }}
            >
              <Tag
                className={`label-icon label-${index % 4}`}
                size={20}
              />

              <span>{name}</span>
            </button>

          </div>
        ))}

      </div>

      {selectMode && (
        <div className="label-selection-actions">

          <span>
            {selectedLabels.length} selected
          </span>

          <button
            type="button"
            className="delete-selected-labels"
            onClick={handleDelete}
            disabled={selectedLabels.length === 0}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>

          <button
            type="button"
            className="cancel-label-selection"
            onClick={cancelSelection}
          >
            Cancel
          </button>

        </div>
      )}

      <button
        className="create-label"
        onClick={onAddLabel}
        type="button"
      >
        <Plus size={20} />
        Create new label
      </button>

      <div className="sidebar-bottom">
        <span>KeepNotes</span>
        <span>Made for your ideas ✨</span>
      </div>

    </aside>
  );
}
