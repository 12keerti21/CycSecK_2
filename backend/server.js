const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { employees, reviews } = require('./data');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Get all employees
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Add a new employee
app.post('/api/employees', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const id = employees.length + 1;
  const employee = { id, name };
  employees.push(employee);
  res.status(201).json(employee);
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Create a new review
app.post('/api/reviews', (req, res) => {
  const { employeeId, title } = req.body;
  if (!employeeId || !title) return res.status(400).json({ error: 'employeeId and title are required' });
  const id = reviews.length + 1;
  const review = { id, employeeId, title, reviewers: [], feedback: [] };
  reviews.push(review);
  res.status(201).json(review);
});

// Assign reviewers to a review
app.post('/api/reviews/:id/assign', (req, res) => {
  const { id } = req.params;
  const { reviewerIds } = req.body;
  const review = reviews.find(r => r.id == id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  review.reviewers = reviewerIds;
  res.json(review);
});

// Submit feedback for a review
app.post('/api/reviews/:id/feedback', (req, res) => {
  const { id } = req.params;
  const { reviewerId, rating, comment } = req.body;
  const review = reviews.find(r => r.id == id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (!review.reviewers.includes(reviewerId)) return res.status(403).json({ error: 'Not assigned as reviewer' });
  review.feedback.push({ reviewerId, rating, comment });
  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
