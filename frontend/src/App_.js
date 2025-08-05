import { useEffect, useState } from 'react';
import axios from 'axios';

const API = "http://localhost:8000/items/";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null); // ID đang sửa

  const fetchItems = async () => {
    const res = await axios.get(API);
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      await axios.put(`${API}${editingId}`, form);
      setEditingId(null);
    } else {
      // Create
      await axios.post(API, form);
    }
    setForm({ name: "", description: "" });
    fetchItems();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}${id}`);
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Item CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          required
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button onClick={() => {
            setForm({ name: "", description: "" });
            setEditingId(null);
          }}>Cancel</button>
        )}
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            {" "}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
