-- Build tables and databases

-- Database
DROP DATABASE IF EXISTS management_db;
CREATE DATABASE management_db;

USE management_db;

-- Department
CREATE TABLE department (
    id INT PRIMARY KEY,
    name: VARCHAR(30)
);

-- Role
CREATE TABLE role (
    id INT PRIMARY KEY,
    -- holds role title
    title VARCHAR(30),
    -- holds role salary
    salary DECIMAL,
    -- hold reference to department role belongs to
    department_id INT
);

-- Employee
CREATE TABLE employee (
    id INT PRIMARY KEY,
    -- holds employee first and last name
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    -- hold reference to employee role
    role_id INT, 
    -- hold reference to another employee that is the manager of current employee
    -- null if no manager
    manager_id INT 
);