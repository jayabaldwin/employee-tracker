INSERT INTO
    department (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 160000, 2),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3);

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES
    ('Olivia', 'Anderson', 1, null),
    ('Ethan', 'Martin', 2, 1),
    ('Sophia', 'Clark', 3, null),
    ('Liam', 'White', 4, 3),
    ('Ava', 'Thompson', 5, null),
    ('Noah', 'Brown', 6, 5),
    ('Emma', 'Harris', 7, null),
    ('Alex', 'Kempnich', 8, 7);