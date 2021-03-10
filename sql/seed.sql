USE dbTracker;

INSERT INTO department (id, name)
VALUES (1,"Sales");
INSERT INTO department (id, name)
VALUES (2,"Engineering");
INSERT INTO department (id, name)
VALUES (3,"Finance");
INSERT INTO department (id, name)
VALUES (4,"Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (1,"Sales Lead", 100000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (2,"Lead Engineer", 150000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (3,"Software Engineer", 120000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (4,"Accountant", 125000, 3);
INSERT INTO role (id, title, salary, department_id)
VALUES (5,"Legal Team Lead", 250000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1,"Gene", "Wolcott", 1, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2,"Reggie", "Shaw", 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3,"Arthur", "Loudermilk", 3, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4,"Julien", "White", 4, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5,"Emeric", "Valdemar", 5, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6,"Vincent", "VanGhoul", 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7,"Despard", "Murgatroyd", 4, 7);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8,"Lionel", "Grisbane", 1, 2);

--adding stuff into employee
-- try {
--   var post  = {first_name: "pat", last_name:"d",role_id:"3",manager_id:"1"};//the record set
--   var query = connection.query('INSERT INTO employee SET ?', post, function (error, results, fields) {
--     if (error) throw error;
--     // Neat!
--   });
--   console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
-- }
-- catch (error) {
--   console.log("Cant add user try again dummy");
-- }

--show the table first then explain how to 
--maybe make a list of teh table info and have teh user select the item from that (inquirer)
--the below would get rid of vincent 
-- connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', ['1', '6'], function (error, results, fields) {
--   if (error) throw error;
--   // ...
-- });

