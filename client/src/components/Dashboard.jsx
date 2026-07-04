import React, { useState } from 'react';

export default function Dashboard({ user, onLogout }) {
  // Role toggling configuration fallback to user's choice
  const [currentRole, setCurrentRole] = useState(user?.role || 'Employee'); 

  // ==================== STATE MANAGEMENT ====================
  // Attendance Management (3.4)
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState("Not Checked In");
  const [attendanceHistory, setAttendanceHistory] = useState([
    { day: 1, date: '2026-07-01', status: 'Present' },
    { day: 2, date: '2026-07-02', status: 'Present' },
    { day: 3, date: '2026-07-03', status: 'Half-day' },
    { day: 4, date: '2026-07-04', status: 'Absent' },
  ]);

  // Profile Customization (3.3)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Aishi Das",
    id: user?.employeeId || "EMP-789",
    email: user?.email || "aishi@company.com",
    phone: "+91 98765 43210",
    address: "Baranagar, West Bengal, India",
    department: "Engineering & Technology",
    baseSalary: 75000,
    allowances: 12000
  });

  // Leave Tracker Roster (3.5)
  const [leaveBalance, setLeaveBalance] = useState(14);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveRemarks, setLeaveRemarks] = useState('');
  
  const [globalLeaveRequests, setGlobalLeaveRequests] = useState([
    { id: 1, name: "Alex Mercer", type: "Sick", dates: "07/10 - 07/12", remarks: "Medical rest", status: "Pending" },
    { id: 2, name: "Samira Khan", type: "Paid", dates: "07/15 - 07/20", remarks: "Family vacation", status: "Approved" },
  ]);

  // Global Corporate Roster (3.2.2 & 3.6.2)
  const [corporateRoster, setCorporateRoster] = useState([
    { id: "EMP-101", name: "Alex Mercer", role: "Frontend Dev", baseSalary: 65000, allowances: 8000, attendance: "Present", phone: "+91 99887 76655", address: "Kolkata, WB", email: "alex@company.com" },
    { id: "EMP-102", name: "Samira Khan", role: "UI/UX Designer", baseSalary: 58000, allowances: 7500, attendance: "Leave", phone: "+91 88776 65544", address: "Salt Lake, WB", email: "samira@company.com" },
    { id: "EMP-103", name: "David Chen", role: "Backend Lead", baseSalary: 90000, allowances: 15000, attendance: "Present", phone: "+91 77665 54433", address: "New Town, WB", email: "david@company.com" },
  ]);

  // Admin Switcher Filter Focus state (Requirement 3.2.2)
  const [selectedAdminViewEmployee, setSelectedAdminViewEmployee] = useState("ALL");

  // ==================== INTERACTION LOGIC ====================
  const handleAttendanceToggle = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!isCheckedIn) {
      const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setAttendanceLog(`Checked In (${timeStamp})`);
      setAttendanceHistory([...attendanceHistory, { day: attendanceHistory.length + 1, date: todayStr, status: 'Present' }]);
    } else {
      setIsCheckedIn(false);
      setAttendanceLog("Checked Out / Shift Ended");
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    alert("Profile records updated successfully!");
  };

  const handleLeaveApplication = (e) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd) {
      alert("Please choose a valid date range on the calendar fields.");
      return;
    }
    const targetString = `${leaveStart} to ${leaveEnd}`;
    const trackingObj = {
      id: Date.now(),
      name: profileData.name,
      type: leaveType,
      dates: targetString,
      remarks: leaveRemarks || "None provided",
      status: "Pending"
    };
    setGlobalLeaveRequests([trackingObj, ...globalLeaveRequests]);
    setShowLeaveForm(false);
    alert("Leave application sent to HR processing queue!");
  };

  const handleAdminApproval = (id, newStatus, comment = "") => {
    setGlobalLeaveRequests(globalLeaveRequests.map(req => {
      if (req.id === id) {
        if (req.name === profileData.name && newStatus === "Approved") {
          setLeaveBalance(prev => Math.max(0, prev - 2));
        }
        return { ...req, status: newStatus, remarks: comment ? `${req.remarks} (HR Comment: ${comment})` : req.remarks };
      }
      return req;
    }));
    alert(`Request marked as ${newStatus}!`);
  };

  const updateSalaryStructure = (empId, field, value) => {
    setCorporateRoster(corporateRoster.map(emp => 
      emp.id === empId ? { ...emp, [field]: parseInt(value) || 0 } : emp
    ));
  };

  const simulateLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      alert("Session Terminated. Redirecting to login gateway...");
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      
      {/* SECTION ROLE SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px', alignItems: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Evaluation View Toggle:</span>
        <button onClick={() => setCurrentRole('Employee')} style={{ ...viewToggleBtn, background: currentRole === 'Employee' ? '#646cff' : '#333' }}>Employee View</button>
        <button onClick={() => setCurrentRole('Admin')} style={{ ...viewToggleBtn, background: currentRole === 'Admin' ? '#646cff' : '#333' }}>Admin / HR View</button>
      </div>

      {currentRole === 'Employee' ? (
        /* =========================================================================
           3.2.1 EMPLOYEE DASHBOARD
           ========================================================================= */
        <div>
          <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>Workspace Dashboard</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Welcome back, <strong style={{ color: '#646cff' }}>{profileData.name}</strong> ({profileData.id})</p>
            </div>
            {/* Requirement 3.2.1 Logout Mechanism */}
            <button onClick={simulateLogout} style={{ ...actionBtnStyle, background: '#ff4646', marginTop: 0 }}>⚙️ Log Out</button>
          </header>

          {/* Quick-Access Dashboard Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            
            {/* 3.3 Profile Card without Picture */}
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

            {/* 3.4.1 Attendance Input Card */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>⏱️ Live Attendance</h3>
              <p style={{ margin: '12px 0', fontSize: '1.1rem', fontWeight: 'bold', color: isCheckedIn ? '#44bb44' : '#ff4646' }}>
                {attendanceLog}
              </p>
              <button onClick={handleAttendanceToggle} style={{ ...actionBtnStyle, background: isCheckedIn ? '#ff4646' : '#44bb44' }}>
                {isCheckedIn ? "Check Out" : "Check In"}
              </button>
            </div>

            {/* 3.5.1 Leave Balance Card */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>📅 Time-Off Controls</h3>
              <p style={{ margin: '12px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{leaveBalance} Days Remaining</p>
              <button onClick={() => setShowLeaveForm(!showLeaveForm)} style={{ ...actionBtnStyle, background: '#646cff' }}>
                {showLeaveForm ? "Hide Application" : "Apply for Leave"}
              </button>
            </div>
          </div>

          {/* 3.3.2 Edit Profile Layout */}
          {isEditingProfile && (
            <div style={expandedSectionStyle}>
              <h3 style={{ color: '#646cff', marginTop: 0 }}>3.3.2 Profile Management Record</h3>
              <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Full Name (Read-Only)</label>
                  <input type="text" value={profileData.name} readOnly style={{ ...inputStyle, background: '#111', color: '#888' }} />
                </div>
                <div>
                  <label style={labelStyle}>Employee ID (Read-Only)</label>
                  <input type="text" value={profileData.id} readOnly style={{ ...inputStyle, background: '#111', color: '#888' }} />
                </div>
                <div>
                  <label style={labelStyle}>Editable Phone Field</label>
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Editable Address Location</label>
                  <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} style={inputStyle} />
                </div>
                <button type="submit" style={{ ...actionBtnStyle, background: '#44bb44', gridColumn: 'span 2', marginTop: '10px' }}>Save Profile Edits</button>
              </form>
            </div>
          )}

          {/* 3.5.1 Leave Application Form & Dynamic Calendar Inputs */}
          {showLeaveForm && (
            <div style={expandedSectionStyle}>
              <h3 style={{ color: '#646cff', marginTop: 0 }}>3.5.1 Leave Application Portal</h3>
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
                    <label style={labelStyle}>Start Date Calendar Choice</label>
                    <input type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>End Date Calendar Choice</label>
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

          {/* 3.4.2 Attendance Metrics & Monthly Log Markers */}
          <div style={{ ...expandedSectionStyle, marginTop: '20px' }}>
            <h3 style={{ color: '#646cff', marginTop: 0 }}>3.4.2 Personal Attendance Marker Log</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {attendanceHistory.map((item) => (
                <div key={item.day} style={{ background: '#222', padding: '15px', borderRadius: '6px', borderLeft: `4px solid ${item.status === 'Present' ? '#44bb44' : item.status === 'Half-day' ? '#ffb700' : '#ff4646'}`, minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.date}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '5px' }}>Day Log #{item.day}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '3px', color: '#aaa' }}>Status: {item.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3.6.1 Employee Read-Only Payroll Summary View */}
          <div style={{ ...expandedSectionStyle, marginTop: '20px', background: '#1e1c24', border: '1px dashed #646cff' }}>
            <h3 style={{ color: '#646cff', marginTop: 0 }}>3.6.1 Payroll Statement (Read-Only)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', textAlign: 'center' }}>
              <div style={{ background: '#111', padding: '15px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Base Structure Pay</span>
                <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem' }}>₹{profileData.baseSalary.toLocaleString()}</h4>
              </div>
              <div style={{ background: '#111', padding: '15px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Corporate Allowances</span>
                <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem' }}>₹{profileData.allowances.toLocaleString()}</h4>
              </div>
              <div style={{ background: '#111', padding: '15px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Net Gross Salary</span>
                <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#44bb44' }}>₹{(profileData.baseSalary + profileData.allowances).toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           3.2.2 ADMIN / HR DASHBOARD
           ========================================================================= */
        <div>
          <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>Admin / HR Control Center</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Global Management Console & Approval Workflows</p>
            </div>

            {/* Requirement 3.2.2 Interactive Filter Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1a1a1a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #333' }}>
              <label style={{ fontSize: '0.85rem', color: '#ff4646', fontWeight: 'bold' }}>🎯 Switch Employee Profile view:</label>
              <select 
                value={selectedAdminViewEmployee} 
                onChange={(e) => setSelectedAdminViewEmployee(e.target.value)}
                style={{ ...inputStyle, width: '180px', padding: '4px' }}
              >
                <option value="ALL">Show Roster Overview</option>
                <option value={profileData.id}>{profileData.name} ({profileData.id})</option>
                {corporateRoster.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                ))}
              </select>
            </div>
          </header>

          {/* Conditional rendering based on Selected Individual View Focus */}
          {selectedAdminViewEmployee !== "ALL" ? (
            <div style={{ ...expandedSectionStyle, borderColor: '#646cff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#646cff', margin: 0 }}>Focused Employee Resource File ({selectedAdminViewEmployee})</h3>
                <button onClick={() => setSelectedAdminViewEmployee("ALL")} style={{ ...actionBtnStyle, marginTop: 0 }}>Back to Global List</button>
              </div>
              
              {/* Dynamic retrieval rendering logic of focused card details without picture placeholder */}
              {[profileData, ...corporateRoster].filter(e => (e.id === selectedAdminViewEmployee)).map(focused => (
                <div key={focused.id} style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#646cff' }}>{focused.name} ({focused.id})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.95rem' }}>
                    <p><strong>Contact Mail:</strong> {focused.email || 'internal@company.com'}</p>
                    <p><strong>Phone Connection:</strong> {focused.phone || '+91 90000 11111'}</p>
                    <p><strong>Location Address:</strong> {focused.address || 'West Bengal, India'}</p>
                    <p><strong>Salary Matrix:</strong> ₹{(focused.baseSalary + focused.allowances).toLocaleString()}/month</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* 3.5.2 Administrative Leave Approvals Management Section */}
              <div style={{ ...expandedSectionStyle, borderColor: '#ffb700', marginBottom: '30px' }}>
                <h3 style={{ color: '#ffb700', marginTop: 0, marginBottom: '15px' }}>3.5.2 Leave Request Approval Queue</h3>
                {globalLeaveRequests.filter(r => r.status === 'Pending').length === 0 ? (
                  <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>No pending workforce leave applications require processing.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {globalLeaveRequests.map((req) => (
                      <div key={req.id} style={{ background: '#222', padding: '15px', borderRadius: '6px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', color: '#646cff' }}>{req.name}</h4>
                          <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#ccc' }}><strong>Type:</strong> {req.type} Leave | <strong>Range:</strong> {req.dates}</p>
                          <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#aaa' }}><em>Remarks: "{req.remarks}"</em></p>
                        </div>
                        {req.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleAdminApproval(req.id, 'Approved', 'Approved by HR Manager')} style={{ ...actionBtnStyle, background: '#44bb44', padding: '6px 12px' }}>Approve</button>
                            <button onClick={() => handleAdminApproval(req.id, 'Rejected', 'Exceeds seasonal criteria')} style={{ ...actionBtnStyle, background: '#ff4646', padding: '6px 12px' }}>Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3.4.2 Global Attendance Viewer & 3.6.2 Payroll Tracker Table */}
              <div style={expandedSectionStyle}>
                <h3 style={{ color: '#ff4646', marginTop: 0, marginBottom: '15px' }}>3.2.2 / 3.6.2 Employee Directory, Attendance & Salary Structures</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333', color: '#aaa' }}>
                      <th style={{ padding: '10px 5px' }}>ID</th>
                      <th>Name</th>
                      <th>3.4.2 Attendance</th>
                      <th>3.6.2 Base Salary (₹)</th>
                      <th>3.6.2 Allowance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Admin user self-row entry */}
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#646cff' }}>{profileData.id}</td>
                      <td>{profileData.name} (You)</td>
                      <td style={{ color: isCheckedIn ? '#44bb44' : '#ff4646', fontWeight: 'bold' }}>{isCheckedIn ? "Present" : "Not Checked In"}</td>
                      <td><input type="number" value={profileData.baseSalary} onChange={(e) => setProfileData({...profileData, baseSalary: parseInt(e.target.value) || 0})} style={tableInputStyle} /></td>
                      <td><input type="number" value={profileData.allowances} onChange={(e) => setProfileData({...profileData, allowances: parseInt(e.target.value) || 0})} style={tableInputStyle} /></td>
                    </tr>
                    {/* Employee Roster Mapping iteration */}
                    {corporateRoster.map((emp) => (
                      <tr key={emp.id} style={{ borderBottom: '1px solid #222', color: '#ccc' }}>
                        <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{emp.id}</td>
                        <td>{emp.name} ({emp.role})</td>
                        <td style={{ color: emp.attendance === 'Present' ? '#44bb44' : '#ffb700', fontWeight: 'bold' }}>{emp.attendance}</td>
                        <td><input type="number" value={emp.baseSalary} onChange={(e) => updateSalaryStructure(emp.id, 'baseSalary', e.target.value)} style={tableInputStyle} /></td>
                        <td><input type="number" value={emp.allowances} onChange={(e) => updateSalaryStructure(emp.id, 'allowances', e.target.value)} style={tableInputStyle} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== DESIGN UI OBJECT STYLES ====================
const viewToggleBtn = {
  padding: '6px 12px',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.85rem'
};

const cardStyle = {
  border: '1px solid #333',
  padding: '20px',
  borderRadius: '8px',
  background: '#1a1a1a',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const actionBtnStyle = {
  marginTop: '10px',
  background: '#333',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.85rem'
};

const expandedSectionStyle = {
  marginTop: '25px',
  padding: '20px',
  border: '1px solid #444',
  borderRadius: '8px',
  background: '#111'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  marginBottom: '5px',
  color: '#aaa'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #444',
  background: '#242424',
  color: '#fff',
  boxSizing: 'border-box',
  outline: 'none'
};

const tableInputStyle = {
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #444',
  background: '#242424',
  color: '#fff',
  width: '100px'
};