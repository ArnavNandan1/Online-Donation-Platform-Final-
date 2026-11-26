import { useState, useReducer, useEffect, useRef } from "react";
import "./App.css";

function donationReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.donation, ...state];
    case "DELETE":
      return state.filter(d => d.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Education");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [goal, setGoal] = useState(10000);

  const [donations, dispatch] = useReducer(
    donationReducer,
    [],
    () => JSON.parse(localStorage.getItem("donations") || "[]")
  );

  const nameRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function addDonation(e) {
    e.preventDefault();

    if (!name || !amount || Number(amount) <= 0) {
      alert("Please enter valid details");
      return;
    }

    dispatch({
      type: "ADD",
      donation: {
        id: Date.now(),
        name,
        amount: Number(amount),
        category,
        date: new Date().toLocaleDateString()
      }
    });

    setName("");
    setAmount("");
    nameRef.current.focus();
  }

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || d.category === filter;
    return matchesSearch && matchesFilter;
  });

  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  const donorCount = donations.length;
  const average = donorCount ? Math.round(total / donorCount) : 0;
  const progress = Math.min((total / goal) * 100, 100);

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>WILL·INGNESS</h1>
          <p>Donation Management Dashboard</p>
        </div>
        <div className="clock">{time.toLocaleTimeString()}</div>
      </header>

      <div className="stats">
        <div className="stat">
          <h3>Total Donations</h3>
          <h2>₹{total}</h2>
        </div>

        <div className="stat">
          <h3>Total Donors</h3>
          <h2>{donorCount}</h2>
        </div>

        <div className="stat">
          <h3>Average Donation</h3>
          <h2>₹{average}</h2>
        </div>

        <div className="stat">
          <h3>Remaining Goal</h3>
          <h2>₹{Math.max(goal - total, 0)}</h2>
        </div>
      </div>

      <section className="card">
        <h2>🎯 Donation Goal</h2>

        <label>Set Goal: ₹</label>
        <input
          type="number"
          value={goal}
          onChange={e => setGoal(Number(e.target.value))}
        />

        <div className="progress">
          <div style={{ width: `${progress}%` }}></div>
        </div>

        <p>{Math.round(progress)}% completed</p>
      </section>

      <section className="card">
        <h2>➕ Add Donation</h2>

        <form onSubmit={addDonation}>
          <input
            ref={nameRef}
            placeholder="Donor Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount ₹"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option>Education</option>
            <option>Food</option>
            <option>Healthcare</option>
            <option>Environment</option>
          </select>

          <button type="submit">Add Donation</button>
        </form>
      </section>

      <section className="card">
        <h2>🔍 Donation Records</h2>

        <input
          ref={searchRef}
          placeholder="Search donor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button onClick={() => searchRef.current.focus()}>
          Focus Search
        </button>

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Education</option>
          <option>Food</option>
          <option>Healthcare</option>
          <option>Environment</option>
        </select>

        <div className="records">
          {filteredDonations.map(d => (
            <div className="record" key={d.id}>
              <div>
                <strong>{d.name}</strong>
                <p>{d.category} • {d.date}</p>
              </div>

              <strong>₹{d.amount}</strong>

              <button
                className="delete"
                onClick={() => dispatch({ type: "DELETE", id: d.id })}
              >
                Delete
              </button>
            </div>
          ))}

          {filteredDonations.length === 0 && (
            <p>No donation records found.</p>
          )}
        </div>

        <button
          className="clear"
          onClick={() => {
            if (confirm("Delete all donation records?")) {
              dispatch({ type: "CLEAR" });
            }
          }}
        >
          Clear All
        </button>
      </section>

      <section className="card">
        <h2>💚 Social Impact</h2>
        <p>Your donations can help provide:</p>
        <h3>{Math.floor(total / 250)} Education Kits</h3>
        <p>Estimated ₹250 per kit</p>
      </section>

      <footer>
        React • useState • useReducer • useEffect • useRef • ReactDOM
      </footer>
    </div>
  );
}

export default App;