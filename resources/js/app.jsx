import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "../css/app.css";

function StudentApp() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get("/students-list").then(res => setStudents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/students/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("/students", form);
    }
    const res = await axios.get("/students-list");
    setStudents(res.data);
    setForm({ name: "", email: "", course: "" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/students/${id}`);
    setStudents(students.filter(s => s.id !== id));
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditId(student.id);
  };

  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => (filter ? s.course === filter : true));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Student Management System</h1>

        <div className="flex gap-6 mb-6">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            Total Students: {students.length}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input className="border rounded px-3 py-2" value={form.name} placeholder="Name"
            onChange={e => setForm({...form, name: e.target.value})}/>
          <input className="border rounded px-3 py-2" value={form.email} placeholder="Email"
            onChange={e => setForm({...form, email: e.target.value})}/>
          <select
            className="border rounded px-3 py-2"
            value={form.course}
            onChange={e => setForm({ ...form, course: e.target.value })}
          >
            <option value="">Select Course</option>
            <option value="BSIT">BSIT</option>
            <option value="BSCRIM">BSCRIM</option>
            <option value="BSHM">BSHM</option>
            <option value="BSAB">BSAB</option>
            <option value="BEED">BEED</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editId ? "Update" : "Add"} Student
          </button>
        </form>

        <div className="flex gap-4 mb-6">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)}/>
          <select
            className="border rounded px-3 py-2"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            <option value="BSIT">BSIT</option>
            <option value="BSCRIM">BSCRIM</option>
            <option value="BSHM">BSHM</option>
            <option value="BSAB">BSAB</option>
            <option value="BEED">BEED</option>
          </select>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.course}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<StudentApp />);
