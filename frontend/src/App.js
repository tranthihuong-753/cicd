import { useEffect, useState } from 'react';
import axios from 'axios';

const API = "http://localhost:8000/items/";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const fetchItems = async () => {
    try {
      setStatus("Loading...");
      const res = await axios.get(API);
      setItems(res.data);
      setStatus("Backend connected successfully.");
      setError("");
    } catch (err) {
      setError("Cannot connect to backend (GET /items/).");
      setStatus("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}${editingId}`, form);
        setStatus("Item updated.");
      } else {
        await axios.post(API, form);
        setStatus("Item created.");
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      setError("Failed to submit data (POST/PUT).");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
    setError("");
    setStatus("Editing item...");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}${id}`);
      fetchItems();
      setStatus("Item deleted.");
    } catch (err) {
      setError("Failed to delete item (DELETE).");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ textAlign: "center" }}>Item CRUD</h1>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {status && <div style={{ color: "green", marginBottom: "10px" }}>{status}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ padding: "10px", flex: 1 }}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: "", description: "" });
                setEditingId(null);
                setStatus("Canceled edit.");
              }}
              style={{ padding: "10px", flex: 1, background: "#ccc" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "10px"
          }}>
            <strong>{item.name}</strong>: {item.description}
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => handleEdit(item)} style={{ marginRight: "10px" }}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: "#f66", color: "white" }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;