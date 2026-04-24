const fs = require('fs');

// Update login form
let login = fs.readFileSync('views/auth/login.ejs', 'utf8');
login = login.replace(
  '<form method="POST" action="/auth/login">',
  '<form method="POST" action="/auth/login">\n  <input type="hidden" name="_csrf" value="<%= csrfToken %>">'
);
fs.writeFileSync('views/auth/login.ejs', login);
console.log('login.ejs done!');

// Update register form
let register = fs.readFileSync('views/auth/register.ejs', 'utf8');
register = register.replace(
  '<form method="POST" action="/auth/register">',
  '<form method="POST" action="/auth/register">\n  <input type="hidden" name="_csrf" value="<%= csrfToken %>">'
);
fs.writeFileSync('views/auth/register.ejs', register);
console.log('register.ejs done!');

// Update create patient form
let createPatient = fs.readFileSync('views/admin/createPatient.ejs', 'utf8');
createPatient = createPatient.replace(
  '<form method="POST" action="/admin/patients/create">',
  '<form method="POST" action="/admin/patients/create">\n  <input type="hidden" name="_csrf" value="<%= csrfToken %>">'
);
fs.writeFileSync('views/admin/createPatient.ejs', createPatient);
console.log('createPatient.ejs done!');

// Update book appointment form
let bookApt = fs.readFileSync('views/patient/bookAppointment.ejs', 'utf8');
bookApt = bookApt.replace(
  '<form method="POST" action="/appointments/book">',
  '<form method="POST" action="/appointments/book">\n  <input type="hidden" name="_csrf" value="<%= csrfToken %>">'
);
fs.writeFileSync('views/patient/bookAppointment.ejs', bookApt);
console.log('bookAppointment.ejs done!');

console.log('All forms updated with CSRF tokens!');