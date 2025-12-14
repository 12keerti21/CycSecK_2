const API_URL = 'http://localhost:4000/api';

export function getEmployees() {
  return fetch(`${API_URL}/employees`).then(r => r.json());
}

export function addEmployee(name) {
  return fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(r => r.json());
}

export function getReviews() {
  return fetch(`${API_URL}/reviews`).then(r => r.json());
}

export function addReview(employeeId, title) {
  return fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, title })
  }).then(r => r.json());
}

export function assignReviewers(reviewId, reviewerIds) {
  return fetch(`${API_URL}/reviews/${reviewId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerIds })
  }).then(r => r.json());
}

export function submitFeedback(reviewId, reviewerId, rating, comment) {
  return fetch(`${API_URL}/reviews/${reviewId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerId, rating, comment })
  }).then(r => r.json());
}
