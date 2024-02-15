// Import
const util = require("util");
const inquirer = require("inquirer");
const db = require("./db/connections");

// Promise version of queries
db.query = util.promisify(db.query);

async function menu() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Departments",
        "Add Department",
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "Delete",
        "Quit",

        // Optional:
        // View By Department
        // View By Department Budget
        // View By Manager
      ],
    },
  ]);

  switch (answers.choice) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "Add Role":
      addRole();
      break;
    case "DeleteInfo":
      deleteInfo();
      break;
    default:
      db.end();
      break;
  }
}

// Viewing tables
// Employee
async function viewAllEmployees() {
  const employees = await db.query(
    "SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS MANAGER FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON m.id = e.manager_id"
  );
  console.log(employees);
  menu();
}

// Department
async function viewAllDepartments() {
  const department = await db.query("SELECT * FROM department");
  console.log(department);
  menu();
}

// Role
async function viewAllRoles() {
  const roles = await db.query(
    "SELECT r.id, r.title, d.name AS department, r.salary FROM role r LEFT JOIN department d ON r.department_id = d.id"
  );
  console.log(roles);
  menu();
}

// Adding into tables
// Employee
async function addEmployee() {
  const roles = await db.query("SELECT id AS value, title AS name FROM role");
  const managers = await db.query(
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee'
  );
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the new employees first name?",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter a first name.";
      },
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the new employees last name?",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter a last name.";
      },
    },
    {
      type: "list",
      name: "roles",
      message: "What is the new employees role?",
      choices: roles,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employees manager?",
      choices: managers,
    },
  ]);

  await db.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)",
    [answers.firstName, answers.lastName, answers.roles, answers.manager]
  );

  console.log("Added New Employee to Database");
  menu();
}

// Department
async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the name of the new department?",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter a department name.";
      },
    },
  ]);

  await db.query("INSERT INTO department(name) VALUES(?)", [
    answers.newDepartment,
  ]);

  console.log(`Added ${answers.newDepartment} to Database`);
  menu();
}

// Role
async function addRole() {
  const departments = await db.query(
    "SELECT id AS value, name AS name FROM department"
  );
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newRole",
      message: "What is the name of the new role?",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter a role name.";
      },
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
      validate: function (value) {
        const number = Number(value);
        if (!isNaN(number) && number !== 0) {
          return true;
        }
        return "Please enter a valid salary that is of a numerical value.";
      },
    },
    {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: departments,
    },
  ]);

  await db.query(
    "INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)",
    [answers.newRole, answers.salary, answers.department]
  );

  console.log(`Added ${answers.newRole} to Database`);
  menu();
}

menu();
