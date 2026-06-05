import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";

function AdminDashboard() {

  const navigate = useNavigate();

  const [firList, setFirList] = useState([]);
  const [policeList, setPoliceList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFIR, setSelectedFIR] = useState(null);

  // 🔐 Protect
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  // 📥 Fetch
  const fetchFIR = async () => {
    const res = await API.get("/fir/all");
    setFirList(res.data);
  };

  const fetchPolice = async () => {
    const res = await API.get("/users/police");
    setPoliceList(res.data);
  };

  useEffect(() => {
    fetchFIR();
    fetchPolice();
  }, []);

  // 🔥 Assign
  const assignFIR = async (firId, officerId) => {
    if (!officerId) return;

    await API.put(`/fir/assign/${firId}?officerId=${officerId}`);
    toast.success("Assigned");
    fetchFIR();
  };

  // 📂 Upload
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post(`/fir/upload/${selectedFIR.id}`, formData);
    toast.success("Uploaded");
    fetchFIR();
  };

  // 📊 Stats
  const statusData = [
    { name: "PENDING", value: firList.filter(f => f.status === "PENDING").length },
    { name: "IN_PROGRESS", value: firList.filter(f => f.status === "IN_PROGRESS").length },
    { name: "CLOSED", value: firList.filter(f => f.status === "CLOSED").length }
  ];

  const COLORS = ["#f59e0b", "#6366f1", "#22c55e"];

  return (
    <div className="dashboard-container">

      {/* SEARCH */}
      <div className="card">
        <h3>Search FIR</h3>
        <input
          placeholder="Search FIR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* STATS */}
      <div className="grid-4">
        <div className="card"><h4>Total</h4><h2>{firList.length}</h2></div>
        <div className="card"><h4>Pending</h4><h2>{statusData[0].value}</h2></div>
        <div className="card"><h4>Progress</h4><h2>{statusData[1].value}</h2></div>
        <div className="card"><h4>Closed</h4><h2>{statusData[2].value}</h2></div>
      </div>

      {/* CHARTS */}
      <div className="grid-2">
        <div className="card">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value">
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>Manage FIR</h3>

        <table className="fir-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Assign</th>
            </tr>
          </thead>

          <tbody>
            {firList
              .filter(f => f.title.toLowerCase().includes(search.toLowerCase()))
              .map(fir => {

                const officer = policeList.find(p => p.id === fir.officerId);

                return (
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

                    <td>
                      {officer ? officer.username : "Not Assigned"}
                    </td>

                    <td>
                      <select onClick={(e) => e.stopPropagation()}
                        onChange={(e) => assignFIR(fir.id, e.target.value)}>
                        <option value="">Assign</option>
                        {policeList.map(p => (
                          <option key={p.id} value={p.id}>{p.username}</option>
                        ))}
                      </select>
                    </td>

                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {selectedFIR && (
        <div className="modal-overlay" onClick={() => setSelectedFIR(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h2>FIR Details</h2>

            <p><b>Title:</b> {selectedFIR.title}</p>
            <p><b>Description:</b> {selectedFIR.description}</p>
            <p><b>Status:</b> {selectedFIR.status}</p>
            <p><b>Priority:</b> {selectedFIR.priority}</p>

            <h4>Timeline</h4>
            <div className="timeline">
              <span className={selectedFIR.createdAt ? "created" : ""}>Created</span>
              <span className={selectedFIR.assignedAt ? "assigned" : ""}>Assigned</span>
              <span className={selectedFIR.startedAt ? "progress" : ""}>Progress</span>
              <span className={selectedFIR.closedAt ? "closed" : ""}>Closed</span>
            </div>

            {/* FILE */}
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

export default AdminDashboard;