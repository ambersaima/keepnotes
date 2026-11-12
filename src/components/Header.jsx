
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';

export default function Header({
  query,
  setQuery,
  dark,
  setDark,
  user,
  onLogout,
  onMenu
}) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu icon-button"
        onClick={onMenu}
      >
        <Menu size={22} />
      </button>

      <div className="brand">
        <span className="brand-mark">✦</span>
        <span>KeepNotes</span>
      </div>

      <div className="search-wrap desktop-search">
        <Search size={21} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
        />
      </div>

      <div className="top-actions">
        <button
          className="theme-switch"
          onClick={() => setDark(false)}
        >
          <Sun size={20} />
        </button>

        <button
          className="theme-switch"
          onClick={() => setDark(true)}
        >
          <Moon size={20} />
        </button>

        <button className="icon-button notification">
          <Bell size={22} />
        </button>

        <button
          className="avatar"
          title={`${user.email} — Log out`}
          onClick={onLogout}
        >
          {user.name.slice(0, 1).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
