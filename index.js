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
        "View By Department",
        "Add Department",
        "Delete Department",
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View By Manager",
        "Update Employee Manager",
        "Delete",
        "Quit",

        // Optional:
        // View By Department Budget
        // View combined salaries of all employees in that department.
        // Delete budget
      ],
    },
  ]);

  switch (answers.choice) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "View By Department":
      viewByDepartment();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Delete Department":
      deleteDepartment();
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
    case "Delete Role":
      deleteRole();
      break;
    case "View By Manager":
      viewByManager();
      break;
    case "Update Employee Manager":
      updateEmployeeManager();
      break;
    case "Delete":
      deleteInfo();
      break;
    default:
      db.end();
      break;
  }
};

// Viewing tables
// Employee
async function viewAllEmployees() {
  const employees = await db.query(
    "SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS MANAGER FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON m.id = e.manager_id"
  );
  console.table(employees);
  menu();
};

// Department
async function viewAllDepartments() {
  const department = await db.query("SELECT * FROM department");
  console.table(department);
  menu();
};

// By Department
async function viewByDepartment() {
  const departments = await db.query("SELECT id AS value, name AS name FROM department");

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Filter by department:",
      choices: departments
    },
  ]);

  const employees = await db.query(
    "SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON m.id = e.manager_id WHERE r.department_id = ?", [answers.department]
  );

  console.table(employees);
  menu();
};

// Role
async function viewAllRoles() {
  const roles = await db.query(
    "SELECT r.id, r.title, d.name AS department, r.salary FROM role r LEFT JOIN department d ON r.department_id = d.id"
  );
  console.table(roles);
  menu();
};

// By Manager
async function viewByManager() {
  const managers = await db.query(
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee'
  );

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Select a manager:",
      choices: managers,
    },
  ]);

  const managerId = answers.manager;

  // Counts the number of rows where the employee's ID matches a manager's ID
  const isManager = await db.query('SELECT COUNT(*) AS isManager FROM employee WHERE id = ? AND id IN (SELECT manager_id FROM employee)', [managerId]);
  // Checks if the employee's ID exists in the manager_id column of the employee table, if not they are not listed as a manager
  if (isManager[0].isManager === 0) {
    console.log("This employee is not a manager.");
    menu();
    return;
  }

  const employees = await db.query(
    `SELECT e.id, e.first_name AS 'first name', e.last_name AS 'last name', 
            r.title, d.name AS department, r.salary 
     FROM employee e 
     LEFT JOIN role r ON e.role_id = r.id 
     LEFT JOIN department d ON r.department_id = d.id 
     WHERE e.manager_id = ?`,
    [managerId]
  );

  console.table(employees);
  menu();
};

// Adding into tables
// Employee
async function addEmployee() {
  const roles = await db.query("SELECT id AS value, title AS name FROM role");
  const managers = await db.query(
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee'
  );

  // / Add an option for "None" or "Null" to the managers list
  const managerChoices = managers.concat({ value: null, name: "None" });

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
};

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
};

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
};

// Updating or editing tables
// Updating role
async function updateEmployeeRole() {
  const currentEmployees = await db.query(
    "SELECT id AS value, CONCAT(first_name, ' ' , last_name) AS name FROM employee"
  );
  const roles = await db.query("SELECT id AS value, title AS name FROM role");
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "updatedEmployee",
      message: "Which employee would you like to update?",
      choices: currentEmployees,
    },
    {
      type: "list",
      name: "updatedRole",
      message: "What is their new role?",
      choices: roles,
    },
  ]);

  await db.query("UPDATE employee SET role_id=? WHERE id=?", [answers.updatedRole, answers.updatedEmployee]);

  // Find the name of the updated employee
  let updatedEmployeeName;
  for (const employee of currentEmployees) {
    if (employee.value === answers.updatedEmployee) {
      updatedEmployeeName = employee.name;
      break;
    }
  };

  // Find the name of the updated role
  let updatedRoleName;
  for (const role of roles) {
    if (role.value === answers.updatedRole) {
      updatedRoleName = role.name;
      break;
    }
  };

  // Log the updated employee's name and role
  console.log(
    `${updatedEmployeeName}'s new role has been set to: ${updatedRoleName} in the Database`
  );
  menu();
};

// Updating manager
async function updateEmployeeManager() {
  // select employee from the list
  const currentEmployees = await db.query(
    "SELECT id AS value, CONCAT(first_name, ' ' , last_name) AS name FROM employee"
  );

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "currentEmployee",
      message: "Which employee would you like to update?",
      choices: currentEmployees,
    },
    {
      type: "list",
      name: "newManager",
      message: "Who is there new manager",
      choices: currentEmployees,
    },
  ]);

  await db.query("UPDATE employee SET manager_id=? WHERE id=?", [answers.newManager, answers.currentEmployee]);
  console.log('Manager has been updated and added to database');
  menu();
};

// Deleting information
// Delete department
async function deleteDepartment() {
  const departments = await db.query("SELECT name FROM department");
 
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department would you like to delete?",
      choices: departments,
    }
  ]);

  const removeDep = await db.query("DELETE FROM department WHERE name=?",[answers.department]);
  console.log('Department successfully deleted!');
  menu();
};
// Delete role
async function deleteRole() {
  const roles = await db.query("SELECT id AS value, title AS name FROM role");
 
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Which role would you like to delete?",
      choices: roles,
    }
  ]);

  const removeDep = await db.query("DELETE FROM role WHERE id=?",[answers.role]);
  console.log('Role successfully deleted!');
  menu();
};

// async function deleteInfo() {
//   const departments = await db.query("SELECT name FROM department");
//   const role = await db.query("Select title FROM role")
 
//   const answers = await inquirer.prompt([
//     {
//       type: "list",
//       name: "department",
//       message: "Select an option to delete.",
//       choices: ["Department", "Role"]
//     }
//   ]);

//   const removeDep = await db.query("DELETE FROM department WHERE name=?",[answers.department]);
//   console.log('Department successfully deleted!');
//   menu();
// };

menu();