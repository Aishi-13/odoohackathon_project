import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [currentRole, setCurrentRole] = useState(user?.role || 'Employee'); 
  const employeeId = user?.employee_id || "EMP-789";

  // ==================== STATE MANAGEMENT ====================
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState("Not Checked In");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Employee",
    id: employeeId,
    email: user?.email || "",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "West Bengal, India",
    department: user?.department || "Engineering & Technology",
    baseSalary: 75000,
    allowances: 12000
  });

  const [leaveBalance, setLeaveBalance] = useState(14);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveRemarks, setLeaveRemarks] = useState('');
  
  const [globalLeaveRequests, setGlobalLeaveRequests] = useState([]);
  const [corporateRoster, setCorporateRoster] = useState([]);
  const [selectedAdminViewEmployee, setSelectedAdminViewEmployee] = useState("ALL");

  // ==================== FETCH PERSISTENT DATA ====================
  useEffect(() => {
    if (currentRole === 'Admin') {
      fetchAdminData();
    }
  }, [currentRole]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/dashboard-data');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCorporateRoster(data.roster || []);
      setGlobalLeaveRequests(data.pendingLeaves || []);
    } catch (err) {
      console.error("Error connecting to local DB:", err.message);
    }
  };

  // ==================== TRANSACTION LOGIC ====================
  const handleAttendanceToggle = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, status: 'Present' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsCheckedIn(data.isCheckedIn);
      setAttendanceLog(data.isCheckedIn ? "Checked In Successfully" : "Checked Out / Shift Ended");
      
      const todayStr = new Date().toISOString().split('T')[0];
      setAttendanceHistory([...attendanceHistory, { day: attendanceHistory.length + 1, date: todayStr, status: data.isCheckedIn ? 'Present' : 'Checked Out' }]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: profileData.phone, address: profileData.address })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsEditingProfile(false);
      alert("Profile edits securely saved to SQL Database!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveApplication = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, leaveType, startDate: leaveStart, endDate: leaveEnd, remarks: leaveRemarks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowLeaveForm(false);
      alert("Leave transaction written to persistent database!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdminApproval = async (id, status) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/leaves/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) throw new Error("Action failed");
      fetchAdminData();
      alert(`Request marked as ${status}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      {/* EVALUATION VIEW TOGGLE */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px', alignItems: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Evaluation View Toggle:</span>
        <button onClick={() => setCurrentRole('Employee')} style={{ ...viewToggleBtn, background: currentRole === 'Employee' ? '#646cff' : '#333' }}>Employee View</button>
        <button onClick={() => setCurrentRole('Admin')} style={{ ...viewToggleBtn, background: currentRole === 'Admin' ? '#646cff' : '#333' }}>Admin / HR View</button>
      </div>

      {currentRole === 'Employee' ? (
        /* EMPLOYEE VIEW */
        <div>
          <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>Workspace Dashboard</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Welcome back, <strong style={{ color: '#646cff' }}>{profileData.name}</strong> ({profileData.id})</p>
            </div>
            <button onClick={onLogout} style={{ ...actionBtnStyle, background: '#ff4646', marginTop: 0 }}>⚙️ Log Out</button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {/* PROFILE CARD */}
            <div style={cardStyle}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>👤 My Profile</h3>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ccc' }}><strong>Dept:</strong> {profileData.department}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ccc' }}><strong>Contact:</strong> {profileData.phone}</p>
              </div>
              <button onClick={() => setIsEditingProfile(!isEditingProfile)} style={actionBtnStyle}>
                {isEditingProfile ? "Close Editor" : "Manage Profile"}
              </button>
            </div>

            {/* ATTENDANCE CARD */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>⏱️ Live Attendance</h3>
              <p style={{ margin: '12px 0', fontSize: '1.1rem', fontWeight: 'bold', color: isCheckedIn ? '#44bb44' : '#ff4646' }}>
                {attendanceLog}
              </p>
              <button onClick={handleAttendanceToggle} style={{ ...actionBtnStyle, background: isCheckedIn ? '#ff4646' : '#44bb44' }}>
                {isCheckedIn ? "Check Out" : "Check In"}
              </button>
            </div>

            {/* LEAVE CONTROL */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>📅 Time-Off Controls</h3>
              <p style={{ margin: '12px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{leaveBalance} Days Remaining</p>
              <button onClick={() => setShowLeaveForm(!showLeaveForm)} style={{ ...actionBtnStyle, background: '#646cff' }}>
                {showLeaveForm ? "Hide Application" : "Apply for Leave"}
              </button>
            </div>
          </div>

          {/* EDIT PROFILE SUBSYSTEM */}
          {isEditingProfile && (
            <div style={expandedSectionStyle}>
              <h3 style={{ color: '#646cff', marginTop: 0 }}>Profile Management Record</h3>
              <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Full Name (Read-Only)</label>
                  <input type="text" value={profileData.name} readOnly style={{ ...inputStyle, background: '#111', color: '#888' }} />
                </div>
                <div>
                  <label style={labelStyle}>Editable Phone Field</label>
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Editable Address Location</label>
                  <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} style={inputStyle} />
                </div>
                <button type="submit" style={{ ...actionBtnStyle, background: '#44bb44', gridColumn: 'span 2', marginTop: '10px' }}>Save Profile Edits</button>
              </form>
            </div>
          )}

          {/* LEAVE APPLICATOR */}
          {showLeaveForm && (
            <div style={expandedSectionStyle}>
              <h3 style={{ color: '#646cff', marginTop: 0 }}>Leave Application Portal</h3>
              <form onSubmit={handleLeaveApplication} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Leave Type</label>
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} style={inputStyle}>
                      <option value="Paid">Paid Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Unpaid">Unpaid Leave</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>End Date</label>
                    <input type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Applicant Remarks</label>
                  <input type="text" value={leaveRemarks} onChange={(e) => setLeaveRemarks(e.target.value)} placeholder="State operational reason here..." style={inputStyle} />
                </div>
                <button type="submit" style={{ ...actionBtnStyle, background: '#44bb44', width: '200px' }}>Submit Leave Request</button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* ADMIN / HR CONTROL CENTER */
        <div>
          <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>Admin / HR Control Center</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Live Database Directory View</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1a1a1a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #333' }}>
              <label style={{ fontSize: '0.85rem', color: '#ff4646', fontWeight: 'bold' }}>🎯 Switch View Target:</label>
              <select value={selectedAdminViewEmployee} onChange={(e) => setSelectedAdminViewEmployee(e.target.value)} style={{ ...inputStyle, width: '180px', padding: '4px' }}>
                <option value="ALL">Show Roster Overview</option>
                {corporateRoster.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </header>

          {/* APPROVAL QUEUE CARD */}
          <div style={{ ...expandedSectionStyle, borderColor: '#ffb700', marginBottom: '30px' }}>
            <h3 style={{ color: '#ffb700', marginTop: 0, marginBottom: '15px' }}>Leave Request Approval Queue</h3>
            {globalLeaveRequests.length === 0 ? (
              <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>No pending applications found in SQLite database.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {globalLeaveRequests.map((req) => (
                  <div key={req.id} style={{ background: '#222', padding: '15px', borderRadius: '6px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#646cff' }}>{req.name} ({req.employee_id})</h4>
                      <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#ccc' }}><strong>Type:</strong> {req.leave_type} | {req.start_date} to {req.end_date}</p>
                    </div>
                    {req.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleAdminApproval(req.id, 'Approved')} style={{ ...actionBtnStyle, background: '#44bb44' }}>Approve</button>
                        <button onClick={() => handleAdminApproval(req.id, 'Rejected')} style={{ ...actionBtnStyle, background: '#ff4646' }}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SYSTEM ROSTER DIRECTORY TABLE */}
          <div style={expandedSectionStyle}>
            <h3 style={{ color: '#ff4646', marginTop: 0, marginBottom: '15px' }}>SQL System Directory Overview</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333', color: '#aaa' }}>
                  <th style={{ padding: '10px 5px' }}>ID</th>
                  <th>Name</th>
                  <th>Attendance Status</th>
                  <th>Base Pay (₹)</th>
                </tr>
              </thead>
              <tbody>
                {corporateRoster.map((emp) => (
                  <tr key={emp.employee_id} style={{ borderBottom: '1px solid #222', color: '#ccc' }}>
                    <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{emp.employee_id}</td>
                    <td>{emp.name}</td>
                    <td style={{ color: emp.attendance !== 'Not Checked In' ? '#44bb44' : '#ff4646', fontWeight: 'bold' }}>{emp.attendance}</td>
                    <td>₹{emp.base_salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== DESIGN UI MODULE STYLE BLOCKS ====================
const viewToggleBtn = { padding: '6px 12px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' };
const cardStyle = { border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const actionBtnStyle = { marginTop: '10px', background: '#333', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' };
const expandedSectionStyle = { marginTop: '25px', padding: '20px', border: '1px solid #444', borderRadius: '8px', background: '#111' };
const labelStyle = { display: 'block', fontSize: '0.85rem', marginBottom: '5px', color: '#aaa' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#242424', color: '#fff', boxSizing: 'border-box', outline: 'none' };   