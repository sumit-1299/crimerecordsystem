import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function PoliceDashboard() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [firList, setFirList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [location, setLocation] = useState("");

  const [selectedFIR, setSelectedFIR] = useState(null);

  // 🔐 Protect route
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/");
  }, [navigate]);

  // 📥 Fetch FIR
  const fetchFIR = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      setLoading(true);
      const res = await API.get(`/fir/officer/${user.id}`);
      setFirList(res.data);
    } catch {
      toast.error("Failed to load FIR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIR();
  }, []);

  // ➕ Add FIR
  const addFIR = async () => {
    if (!title || !description) {
      toast.error("Fill all fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await API.post("/fir/add", {
        title,
        description,
        status: "PENDING",
        officerId: user.id,
        priority,
        location
      });

      toast.success("FIR Added");
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setLocation("");
      fetchFIR();

    } catch {
      toast.error("Error adding FIR");
    }
  };

  // ❌ Delete (with confirm)
  const deleteFIR = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FIR?")) return;

    try {
      await API.delete(`/fir/${id}`);
      toast.success("FIR Deleted");
      fetchFIR();
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/fir/status/${id}?status=${status}`);
      toast.success(`Updated to ${status}`);
      fetchFIR();
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    }
  };

  // 📂 Upload Evidence
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post(`/fir/upload/${selectedFIR.id}`, formData);
    toast.success("Evidence uploaded");
    fetchFIR();
  };

  // 🧠 Format date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const filteredFIR = firList
    .filter(f => f.title.toLowerCase().includes(search.toLowerCase()))
    .filter(f => statusFilter ? f.status === statusFilter : true)
    .filter(f => priorityFilter ? f.priority === priorityFilter : true);

  return (
    <div className="dashboard-container">

      {/* ADD FIR */}
      <div className="card">
        <h3>Add FIR</h3>

        <div className="fir-form">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button className="btn-primary" onClick={addFIR}>
            Add FIR
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="card">
        <h3>Search & Filter</h3>

        <div className="filter-bar">
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>FIR Records</h3>

        {loading ? (
          <p>Loading...</p>
        ) : filteredFIR.length === 0 ? (
          <p>No matching FIR found</p>
        ) : (
          <table className="fir-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFIR.map(fir => (
                <tr key={fir.id} onClick={() => setSelectedFIR(fir)} style={{ cursor: "pointer" }}>

                  <td>{fir.id}</td>
                  <td>{fir.title}</td>

                  <td>
                    <span className={`priority ${fir.priority?.toLowerCase()}`}>
                      {fir.priority}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${fir.status.toLowerCase()}`}>
                      {fir.status}
                    </span>
                  </td>

                  <td style={{ fontSize: "12px" }}>
                    <div>📌 {formatDate(fir.createdAt)}</div>
                    {fir.startedAt && <div>🚀 {formatDate(fir.startedAt)}</div>}
                    {fir.closedAt && <div>✅ {formatDate(fir.closedAt)}</div>}
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn-blue"
                      onClick={() => updateStatus(fir.id, "IN_PROGRESS")}
                      disabled={fir.status !== "PENDING"}>
                      Start
                    </button>

                    <button className="btn-green"
                      onClick={() => updateStatus(fir.id, "CLOSED")}
                      disabled={fir.status !== "IN_PROGRESS"}>
                      Close
                    </button>

                    <button className="btn-red"
                      onClick={() => deleteFIR(fir.id)}>
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 MODAL */}
      {selectedFIR && (
        <div className="modal-overlay" onClick={() => setSelectedFIR(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h3>{selectedFIR.title}</h3>
            <p>{selectedFIR.description}</p>

            <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />

            {selectedFIR.filePath && (
              <a href={`http://localhost:8080/${selectedFIR.filePath}`} target="_blank">
                View Evidence
              </a>
            )}

            <button onClick={() => setSelectedFIR(null)}>Close</button>

          </div>
        </div>
      )}

    </div>
  );
}

export default PoliceDashboard;