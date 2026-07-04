const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Create and open the SQLite relational database file
const dbPath = path.resolve(__dirname, 'hrms_local.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected securely to local SQLite database.');
});

// Initialize database schemas/tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    employee_id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    department TEXT,
    base_salary REAL,
    attendance TEXT DEFAULT 'Not Checked In'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT,
    leave_type TEXT,
    start_date TEXT,
    end_date TEXT,
    remarks TEXT,
    status TEXT DEFAULT 'Pending'
  )`);

  // Insert mock profile row for validation testing if missing
  db.run(`INSERT OR IGNORE INTO employees (employee_id, name, role, department, base_salary) 
          VALUES ('EMP-789', 'Aishi Das', 'Employee', 'Engineering & Technology', 75000)`);
});

// API Endpoint to fetch data for Admin/HR review dashboard
app.get('/api/admin/dashboard-data', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, roster) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all('SELECT l.*, e.name FROM leaves l JOIN employees e ON l.employee_id = e.employee_id WHERE l.status = "Pending"', [], (err, leaves) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ roster, pendingLeaves: leaves });
    });
  });
});

// API Endpoint to handle live check-ins/check-outs
app.post('/api/attendance/toggle', (req, res) => {
  const { employeeId } = req.body;
  db.get('SELECT attendance FROM employees WHERE employee_id = ?', [employeeId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const nextStatus = row?.attendance === 'Present' ? 'Not Checked In' : 'Present';
    db.run('UPDATE employees SET attendance = ? WHERE employee_id = ?', [nextStatus, employeeId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ isCheckedIn: nextStatus === 'Present' });
    });
  });
});

// API Endpoint to submit leave transaction records
app.post('/api/leaves/apply', (req, res) => {
  const { employeeId, leaveType, startDate, endDate, remarks } = req.body;
  db.run('INSERT INTO leaves (employee_id, leave_type, start_date, end_date, remarks) VALUES (?, ?, ?, ?, ?)',
    [employeeId, leaveType, startDate, endDate, remarks], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
  });
});

// API Endpoint for Admin approval pipeline actions
app.post('/api/admin/leaves/action', (req, res) => {
  const { id, status } = req.body;
  db.run('UPDATE leaves SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Local SQL database running at: ${dbPath}`);
  console.log(`Secure Backend Engine running on Port ${PORT}`);
});