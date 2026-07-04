const express = require('express');
const cors = require('cors'); // Make sure you have this
const app = express();

// THIS IS THE KEY: It must be configured to allow your frontend
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());


// Create and open the SQLite database file
const dbPath = path.resolve(__dirname, 'hrms_local.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected securely to local SQLite database.');
});

// Initialize database schemas according to SRS Section 3
db.serialize(() => {
  // 1. Employee Profiles (SRS 3.3) with Role-based constraints
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    employee_id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT CHECK(role IN ('Employee', 'HR')),
    department TEXT,
    base_salary REAL,
    address TEXT,
    phone TEXT,
    attendance_status TEXT DEFAULT 'Absent' CHECK(attendance_status IN ('Present', 'Absent', 'Half-day', 'Leave'))
  )`);

  // 2. Leave Management (SRS 3.5)
  db.run(`CREATE TABLE IF NOT EXISTS leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT,
    leave_type TEXT CHECK(leave_type IN ('Paid', 'Sick', 'Unpaid')),
    start_date TEXT,
    end_date TEXT,
    remarks TEXT,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    admin_comments TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
  )`);

  // Seed default data if empty (SRS User Classes)
  db.run(`INSERT OR IGNORE INTO employees (employee_id, email, password, name, role, department, base_salary, attendance_status) 
          VALUES ('EMP-789', 'aishi@company.com', 'SecurePass123', 'Aishi Das', 'Employee', 'Engineering & Technology', 75000, 'Absent')`);
          
  db.run(`INSERT OR IGNORE INTO employees (employee_id, email, password, name, role, department, base_salary, attendance_status) 
          VALUES ('HR-101', 'hr@company.com', 'AdminPass123', 'HR Manager', 'HR', 'Human Resources', 95000, 'Present')`);
});

// --- API ENDPOINTS ---

// SRS 3.1.2 - Sign In Pipeline
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT employee_id, name, email, role FROM employees WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Incorrect credentials display error messages.' });
    res.json({ success: true, user });
  });
});

// SRS 3.4.1 - Check-In / Check-Out Lifecycle
app.post('/api/attendance/mark', (req, res) => {
  const { employeeId, status } = req.body; // Expects 'Present', 'Absent', 'Half-day'
  db.run('UPDATE employees SET attendance_status = ? WHERE employee_id = ?', [status, employeeId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, currentStatus: status });
  });
});

// SRS 3.5.1 - Apply for Leave (Employee)
app.post('/api/leaves/apply', (req, res) => {
  const { employeeId, leaveType, startDate, endDate, remarks } = req.body;
  db.run('INSERT INTO leaves (employee_id, leave_type, start_date, end_date, remarks) VALUES (?, ?, ?, ?, ?)',
    [employeeId, leaveType, startDate, endDate, remarks], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, leaveId: this.lastID });
  });
});

// SRS 3.5.2 - Leave Approval Engine (Admin/HR)
app.post('/api/admin/leaves/action', (req, res) => {
  const { id, status, adminComments } = req.body; // status: 'Approved' or 'Rejected'
  db.run('UPDATE leaves SET status = ?, admin_comments = ? WHERE id = ?', [status, adminComments, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Connected securely to local SQLite database.`);
  console.log(`SRS Backend Server operational on Port ${PORT}`);
});
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  
  // This looks up the user in your database
  db.get('SELECT employee_id, name, email, role FROM employees WHERE email = ? AND password = ?', 
  [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Incorrect credentials.' });
    }
    res.json({ success: true, user });
  });
});
const PORT = 5000;
// Fetch all employees for the dashboard
app.get('/api/employees', (req, res) => {
    const sql = "SELECT * FROM employees";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ employees: rows });
    });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});