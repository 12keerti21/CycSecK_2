import { getEmployees, getReviews, submitFeedback } from '../api.js';
const e = React.createElement;

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

export default EmployeeDashboard;
