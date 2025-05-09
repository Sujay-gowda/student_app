import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Table, Modal } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:8080/api/student/";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(API_BASE);
    setStudents(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}${id}`);
    fetchStudents();
  };

  return (
    <div className="container mt-4">
      <h2>Student Management</h2>
      <Button className="mb-3" onClick={() => navigate("/add")}>Add Student</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.username}</td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => navigate(`/view/${s.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => navigate(`/edit/${s.id}`)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(s.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const StudentForm = ({ isEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      axios.get(`${API_BASE}${id}`).then((res) => setFormData(res.data));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`${API_BASE}${id}`, formData);
    } else {
      await axios.post(API_BASE, formData);
    }
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Student" : "Add Student"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}${id}`).then((res) => setStudent(res.data));
  }, [id]);

  return (
    <div className="container mt-4">
      <h2>Student Details</h2>
      {student ? (
        <div>
          <p><strong>ID:</strong> {student.id}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Username:</strong> {student.username}</p>
          <p><strong>Password:</strong> {student.password}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const StudentApp = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StudentList />} />
      <Route path="/add" element={<StudentForm isEdit={false} />} />
      <Route path="/edit/:id" element={<StudentForm isEdit={true} />} />
      <Route path="/view/:id" element={<StudentView />} />
    </Routes>
  </Router>
);

export default StudentApp;
