
import { useState } from 'react';
import {
  Lightbulb,
  LockKeyhole,
  Mail,
  UserRound
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    onLogin({
      name: mode === 'signup'
        ? name.trim()
        : (email.split('@')[0] || 'User'),
      email: email.trim()
    });
  };

  return (
    <main className="login-screen">
      <section className="login-card">

        <div className="login-brand">
          <span className="brand-mark">
            <Lightbulb />
          </span>
          <span>KeepNotes</span>
        </div>

        <h1>
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h1>

        <p className="login-subtitle">
          {mode === 'login'
            ? 'Sign in to continue to your notes.'
            : 'Set up your KeepNotes profile.'}
        </p>

        <form onSubmit={submit} className="login-form">

          {mode === 'signup' && (
            <label>
              <span>Your name</span>
              <div className="login-input">
                <UserRound size={18} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </label>
          )}

          <label>
            <span>Email address</span>
            <div className="login-input">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="login-input">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </label>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button className="login-submit" type="submit">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

        </form>

        <p className="login-switch">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}

          {' '}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </section>
    </main>
  );
}
