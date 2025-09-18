import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Person } from './types/faker';
import { fetchPeople } from './api/fakerApi';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(8);

  const mountedRef = useRef(false);

  // reusable load function — calling this will fetch with the given quantity
  // track latest controller to cancel previous requests
  const latestController = useRef<AbortController | null>(null);

  async function load(q: number) {
    // cancel any previous in-flight request
    if (latestController.current) {
      latestController.current.abort();
    }
    const controller = new AbortController();
    latestController.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetchPeople(q, controller.signal);
      if (!mountedRef.current) return;
      setPeople(res.data || []);
    } catch (err: any) {
      // don't treat AbortError as an actual error to show
      if (err.name === 'AbortError') return;
      console.error(err);
      if (!mountedRef.current) return;
      setError(err.message || 'Unknown error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  // initial load on mount only
  useEffect(() => {
    // mark mounted on each mount (handles React StrictMode double mount in dev)
    mountedRef.current = true;
    load(quantity);
    return () => {
      mountedRef.current = false;
    };
    // intentionally run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>FakerAPI demo</h1>
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>
            Quantity:
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value || 0))}
              style={{ marginLeft: 8, width: 80 }}
            />
          </label>
          <button
            onClick={() => {
              const q = Math.max(1, Math.min(100, quantity || 1));
              load(q);
            }}
            disabled={loading}
          >
            Fetch
          </button>
        </div>

        {loading && <p>Loading people…</p>}
        {error && <p style={{ color: 'salmon' }}>Error: {error}</p>}

        {!loading && !error && (
          <ul style={{ textAlign: 'left', maxWidth: 700 }}>
            {people.map((p, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>
                  {p.firstname} {p.lastname}
                </strong>
                {p.email && (
                  <div>
                    <a href={`mailto:${p.email}`}>{p.email}</a>
                  </div>
                )}
                {p.phone && <div>{p.phone}</div>}
                {p.website && (
                  <div>
                    <a href={p.website} target="_blank" rel="noreferrer">
                      {p.website}
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
