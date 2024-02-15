<br>
  <h1 align="center">SQL: Employee Tracker</h1>

  ## Description
  The purpose of this application was to create an interface that allows non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. I have built a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.
  <br>

  ![](./assets/employment-tracker.gif)
  
  <br>

  ![Badge](https://img.shields.io/badge/License-MIT-yellow.svg)
 

  ## Table of Contents
  - [Installation](#installation)
  - [User Story](#user-story)
  - [Acceptance Criteria](#acceptance-criteria)
  - [Usage](#usage)
  - [Example](#example)
  - [License](#license)
  - [Contributing](#contributing)
  - [Questions](#questions)

  ## Installation
  `npm init -y`: create a package.json file
  <br>
  `npm install`: install dependencies

  ### Dependencies
  `npm i mysql2`: database management system
  <br>
  `npm i inquirer@8.2.4`: accepting userinput
  <br>
  `npm i dotenv`: protection of sensitive information
  
  ## User Story
 ```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

  ## Acceptance Criteria
```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

  ## Usage
  Run this application with the command:
  ` node index.js
  `

  ## Example
  The following video shows an example of the application being used from the command line:

  [![A video thumbnail shows the command-line employee management application.]()]

  ## License
  The application is covered under the following license: [MIT](https://opensource.org/licenses/MIT)

  ## Contributing
  I will not be accepting contributions to this repository at this time.
  <br>

  ## Questions
  Questions about this repository? My best point of contact is via [Email](mailto:jayastarrbaldwin@gmail.com) 
  <br>
  If you'd like to view more of my work in GitHub, my profile is: [jayabaldwin](https://github.com/jayabaldwin) 



The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application.]()]


## Bonus

Add some additional functionality to your application, such as the ability to do the following:

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.