import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const n = Number(value);
    if (!Number.isInteger(n)) {
      setError('Please enter an integer.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/roman?number=${n}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setResult(`${data.input} --> ${data.roman}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, Arial'
    }}>
      <h1>Roman Numerals</h1>
      <p>Convert an integer between 0 and 100.</p>

      <form onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <label htmlFor="n">Number</label>
        <input
          id="n"
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="numeric"
          style={{ display: 'block', padding: '8px', margin: '8px 0', width: 200 }}
          placeholder="e.g. 9"
        />
        <button disabled={loading}>
          {loading ? 'Converting…' : 'Convert'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>
      )}
      {result && (
        <p style={{ marginTop: 16 }}>
          <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}