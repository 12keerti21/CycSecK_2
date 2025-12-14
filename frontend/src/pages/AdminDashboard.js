import { getEmployees, addEmployee, getReviews, addReview, assignReviewers } from '../api.js';
const e = React.createElement;

function AdminDashboard() {
  const [employees, setEmployees] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [newEmp, setNewEmp] = React.useState('');
  const [reviewTitle, setReviewTitle] = React.useState('');
  const [reviewEmp, setReviewEmp] = React.useState('');
  const [assignReviewId, setAssignReviewId] = React.useState('');
  const [assignReviewersList, setAssignReviewersList] = React.useState([]);

  React.useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    getEmployees().then(setEmployees);
    getReviews().then(setReviews);
  }

  function handleAddEmployee(evn) {
    evn.preventDefault();
    if (!newEmp) return;
    addEmployee(newEmp).then(() => {
      setNewEmp('');
      refresh();
    });
  }

  function handleAddReview(evn) {
    evn.preventDefault();
    if (!reviewEmp || !reviewTitle) return;
    addReview(Number(reviewEmp), reviewTitle).then(() => {
      setReviewTitle('');
      setReviewEmp('');
      refresh();
    });
  }

  function handleAssignReviewers(evn) {
    evn.preventDefault();
    if (!assignReviewId || assignReviewersList.length === 0) return;
    assignReviewers(Number(assignReviewId), assignReviewersList.map(Number)).then(() => {
      setAssignReviewId('');
      setAssignReviewersList([]);
      refresh();
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

export default AdminDashboard;
