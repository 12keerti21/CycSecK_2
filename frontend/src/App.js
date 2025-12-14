const e = React.createElement;

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

// Lazy load pages
function AdminDashboard() {
  const [Comp, setComp] = React.useState(null);
  React.useEffect(() => {
    import('./pages/AdminDashboard.js').then(m => setComp(() => m.default));
  }, []);
  return Comp ? e(Comp) : e('div', null, 'Loading...');
}

function EmployeeDashboard() {
  const [Comp, setComp] = React.useState(null);
  React.useEffect(() => {
    import('./pages/EmployeeDashboard.js').then(m => setComp(() => m.default));
  }, []);
  return Comp ? e(Comp) : e('div', null, 'Loading...');
}

export default App;
