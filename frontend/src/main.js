//api.js
const API_URL = 'http://localhost:4000/api';
function getEmployees() {
	return fetch(`${API_URL}/employees`).then(r => r.json());
}
function addEmployee(name) {
	return fetch(`${API_URL}/employees`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	}).then(r => r.json());
}
function getReviews() {
	return fetch(`${API_URL}/reviews`).then(r => r.json());
}
function addReview(employeeId, title) {
	return fetch(`${API_URL}/reviews`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ employeeId, title })
	}).then(r => r.json());
}
function assignReviewers(reviewId, reviewerIds) {
	return fetch(`${API_URL}/reviews/${reviewId}/assign`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ reviewerIds })
	}).then(r => r.json());
}
function submitFeedback(reviewId, reviewerId, rating, comment) {
	return fetch(`${API_URL}/reviews/${reviewId}/feedback`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ reviewerId, rating, comment })
	}).then(r => r.json());
}

// AdminDashboard
const e = React.createElement;
function AdminDashboard() {
	const [employees, setEmployees] = React.useState([]);
	const [reviews, setReviews] = React.useState([]);
	const [newEmp, setNewEmp] = React.useState('');
	const [reviewTitle, setReviewTitle] = React.useState('');
	const [reviewEmp, setReviewEmp] = React.useState('');
	const [assignReviewId, setAssignReviewId] = React.useState('');
	const [assignReviewersList, setAssignReviewersList] = React.useState([]);

	React.useEffect(() => { refresh(); }, []);
	function refresh() {
		getEmployees().then(setEmployees);
		getReviews().then(setReviews);
	}
	function handleAddEmployee(evn) {
		evn.preventDefault();
		if (!newEmp) return;
		addEmployee(newEmp).then(() => { setNewEmp(''); refresh(); });
	}
	function handleAddReview(evn) {
		evn.preventDefault();
		if (!reviewEmp || !reviewTitle) return;
		addReview(Number(reviewEmp), reviewTitle).then(() => {
			setReviewTitle(''); setReviewEmp(''); refresh();
		});
	}
	function handleAssignReviewers(evn) {
		evn.preventDefault();
		if (!assignReviewId || assignReviewersList.length === 0) return;
		assignReviewers(Number(assignReviewId), assignReviewersList.map(Number)).then(() => {
			setAssignReviewId(''); setAssignReviewersList([]); refresh();
		});
	}
	return e('div', null,
		e('h2', null, 'Employees'),
		e('form', { onSubmit: handleAddEmployee },
			e('input', {
				placeholder: 'Employee name',
				value: newEmp,
				onChange: ev => setNewEmp(ev.target.value)
			}),
			e('button', { type: 'submit' }, 'Add')
		),
		e('ul', { className: 'list' },
			employees.map(emp => e('li', { key: emp.id, className: 'list-item' }, emp.name))
		),
		e('h2', null, 'Create Review'),
		e('form', { onSubmit: handleAddReview },
			e('select', {
				value: reviewEmp,
				onChange: ev => setReviewEmp(ev.target.value)
			},
				e('option', { value: '' }, 'Select employee'),
				employees.map(emp => e('option', { key: emp.id, value: emp.id }, emp.name))
			),
			e('input', {
				placeholder: 'Review title',
				value: reviewTitle,
				onChange: ev => setReviewTitle(ev.target.value)
			}),
			e('button', { type: 'submit' }, 'Create')
		),
		e('h2', null, 'Assign Reviewers'),
		e('form', { onSubmit: handleAssignReviewers },
			e('select', {
				value: assignReviewId,
				onChange: ev => setAssignReviewId(ev.target.value)
			},
				e('option', { value: '' }, 'Select review'),
				reviews.map(r => {
					const emp = employees.find(e => e.id === r.employeeId);
					return e('option', { key: r.id, value: r.id }, `${r.title} (${emp ? emp.name : 'Unknown'})`);
				})
			),
			e('select', {
				multiple: true,
				value: assignReviewersList,
				onChange: ev => {
					const opts = Array.from(ev.target.selectedOptions).map(o => o.value);
					setAssignReviewersList(opts);
				}
			},
				employees.map(emp => e('option', { key: emp.id, value: emp.id }, emp.name))
			),
			e('button', { type: 'submit' }, 'Assign')
		),
		e('h2', null, 'All Reviews'),
		e('ul', { className: 'list' },
			reviews.map(r => {
				const emp = employees.find(e => e.id === r.employeeId);
				return e('li', { key: r.id, className: 'list-item' },
					e('div', null, `${r.title} for ${emp ? emp.name : 'Unknown'}`),
					e('div', null, 'Reviewers: ',
						r.reviewers.map(rid => {
							const reviewer = employees.find(e => e.id === rid);
							return reviewer ? reviewer.name : 'Unknown';
						}).join(', ') || 'None'
					),
					e('div', null, 'Feedback count: ', r.feedback.length)
				);
			})
		)
	);
}

//EmployeeDashboard 
function EmployeeDashboard() {
	const [employees, setEmployees] = React.useState([]);
	const [reviews, setReviews] = React.useState([]);
	const [selectedEmp, setSelectedEmp] = React.useState('');
	const [feedback, setFeedback] = React.useState({});

	React.useEffect(() => {
		getEmployees().then(setEmployees);
		getReviews().then(setReviews);
	}, []);

	function assignedReviews() {
		if (!selectedEmp) return [];
		return reviews.filter(r => r.reviewers.includes(Number(selectedEmp)));
	}

	function handleFeedbackChange(rid, field, value) {
		setFeedback(fb => ({ ...fb, [rid]: { ...fb[rid], [field]: value } }));
	}

	function handleSubmitFeedback(evn, rid) {
		evn.preventDefault();
		const { rating, comment } = feedback[rid] || {};
		if (!rating || !comment) return;
		submitFeedback(rid, Number(selectedEmp), rating, comment).then(() => {
			setFeedback(fb => ({ ...fb, [rid]: {} }));
			getReviews().then(setReviews);
		});
	}

	return e('div', null,
		e('h2', null, 'Select Employee'),
		e('select', {
			value: selectedEmp,
			onChange: ev => setSelectedEmp(ev.target.value)
		},
			e('option', { value: '' }, 'Select your name'),
			employees.map(emp => e('option', { key: emp.id, value: emp.id }, emp.name))
		),
		selectedEmp && e('div', null,
			e('h2', null, 'Assigned Reviews'),
			assignedReviews().length === 0 && e('div', null, 'No reviews assigned.'),
			assignedReviews().map(r => {
				const fb = r.feedback.find(f => f.reviewerId === Number(selectedEmp));
				return e('div', { key: r.id, className: 'list-item' },
					e('div', null, e('strong', null, r.title)),
					e('div', null, 'For: ', (employees.find(e => e.id === r.employeeId) || {}).name || 'Unknown'),
					fb ? e('div', null, 'Feedback submitted: ',
						e('span', null, `Rating: ${fb.rating}, Comment: ${fb.comment}`)
					) : e('form', { onSubmit: ev => handleSubmitFeedback(ev, r.id) },
						e('input', {
							type: 'number',
							min: 1,
							max: 5,
							placeholder: 'Rating (1-5)',
							value: (feedback[r.id] || {}).rating || '',
							onChange: ev => handleFeedbackChange(r.id, 'rating', ev.target.value)
						}),
						e('input', {
							placeholder: 'Comment',
							value: (feedback[r.id] || {}).comment || '',
							onChange: ev => handleFeedbackChange(r.id, 'comment', ev.target.value)
						}),
						e('button', { type: 'submit' }, 'Submit')
					)
				);
			})
		)
	);
}


function App() {
	const [page, setPage] = React.useState('home');
	return e('div', { className: 'container' },
		e('h1', null, 'Performance Review App'),
		e('div', { className: 'flex' },
			e('button', { onClick: () => setPage('admin') }, 'Admin Dashboard'),
			e('button', { onClick: () => setPage('employee') }, 'Employee Dashboard')
		),
		page === 'admin' && e(AdminDashboard, null),
		page === 'employee' && e(EmployeeDashboard, null),
		page === 'home' && e('p', null, 'Select a dashboard to begin.')
	);
}


const root = document.getElementById('root');
ReactDOM.createRoot(root).render(React.createElement(App));
