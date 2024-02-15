// Import 
const util = require('util');
const inquirer = require('inquirer');
const db = require('./db/connections');

// Promise version of queries
db.query = util.promisify(db.query);

async function menu() {
  const answers = await inquirer.prompt([{
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: [
      'View All Departments',
      'Add Department',
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'Delete',
      'Quit'

    // Optional:
    // View By Department
    // View By Department Budget
    // View By Manager
      ]
  }]);

  switch (answers.choice) {
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'Add Department':
      addDepartment();
      break;
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'Add Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      updateEmployeeRole();
      break;
    case 'View All Roles':
      viewAllRole();
      break;
    case 'Add Role':
      addRole();
      break;
    case 'DeleteInfo':
      deleteInfo();
      break;
    default: 
      db.end() 
      break;
  };
};

async function addEmployee() {
  const roles = await db.query('SELECT id AS value, title AS name FROM role');
  const managers = await db.query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee');
  const answers = await inquirer.prompt([
    {
    type: 'input',
    name: 'firstName',
    message: 'What is the new employees first name?'
  },
    {
    type: 'input',
    name: 'lastName',
    message: 'What is the new employees last name?'
  },
    {
    type: 'list',
    name: 'roles',
    message: 'What is the new employees role?',
    choices: roles
  },
    {
    type: 'list',
    name: 'manager',
    message: 'Who is the employees manager?',
    choices: managers
  },
]); 

await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)',[answers.firstName, answers.lastName, answers.roles, answers.manager]);

console.log('Added New Employee to Database');
menu()
};

menu()