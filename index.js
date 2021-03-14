const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root1",//work pwd Mysql111!
  database: "dbTracker"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  firstPrompt();
});

// function which prompts the user for what action they should take
// Build a command-line application that at a minimum allows the user to:
// Add departments, roles, employees
// View departments, roles, employees
// Update employee roles

// Bonus points if you're able to:
// Update employee managers
// View employees by manager
// Delete departments, roles, and employees
// View the total utilized budget of a department -- ie the combined salaries of all employees in that department
function firstPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role",
        "Remove Employees",
        "Add Role",
        // "Remove Role",
        // "Update Employee Manager",
        "End"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          //viewEmployee();
          queryTable("employee",`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employee e
          LEFT JOIN role r
          ON e.role_id = r.id
          LEFT JOIN department d
          ON d.id = r.department_id
          LEFT JOIN employee m
          ON m.id = e.manager_id`);
          break;
        case "View Roles":
          //viewRole();
          queryTable("role",  `SELECT * from role`);
          break;
        case "View Departments":
          //viewDepartment();
          queryTable("department",`SELECT * from department`)
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;      
        case "End":
          connection.end();
          break;
      }
    });
}

//this handles all of the view select read querys so you pass a table name and the sql query stings and done deal your welcome
function queryTable(tblName, qryString){
  console.log("Viewing " + tblName + "\n");

  var query =
    qryString//`SELECT * from department`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log(tblName + " viewed!\n");

    firstPrompt();
  });
  // console.log(query.sql);
}

function addDepartment() {
  
  var deptTable = 'SELECT * FROM department'
  connection.query(deptTable, function (err, res) {
    console.table(res);
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department name?"
      },
    ])
    .then(function (answer) {
      console.log(answer)
      try {
        var query = connection.query('INSERT INTO department SET ?', answer, function (error, results, fields) {
          if (error) throw error;

        });
        console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
      }
      catch (error) {
        console.log("Cant add department try again dummy");
      }

      firstPrompt();
    });
}

//"Add Role"
function addRole() {

  var roleTable = 'SELECT * FROM role'
  connection.query(roleTable, function (err, res) {
    console.table(res);
  });

  var query = `SELECT department.id, department.name from department`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Role title?"
      },
      {
        type: "input",
        name: "salary",
        message: "Role Salary?"
      },
      {
        type: "list",
        name: "department_id",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then(function (answer) {
      console.log(answer)
      try {
        var query = connection.query('INSERT INTO role SET ?', answer, function (error, results, fields) {
          if (error) throw error;

        });
        console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
      }
      catch (error) {
        console.log("Cant add role try again dummy");
      }

      firstPrompt();
    });
}











//"Add employee"
//show existing list of employees
function addEmployee() {
//show the employee table
//get data from role for inquirer
//get data from department for inquirer

  //show them the employee table so no bad entires
  let empTable = 'SELECT * FROM employee'
  connection.query(empTable, function (err, res) {
    console.table(res);
  });

  //make a query that gives choices for the role and department 
  // let roleQuery = `SELECT role.id, role.title, role.salary, role.department_id FROM role`
  //   connection.query(roleQuery, function (err, res) {
  //   if (err) throw err;
  //   console.log(roleQuery);
  //   let roleChoices = res.map(({ id, title }) => ({
  //     value: id, title: `${id} ${title}`
      
  //   }));

  // });

  let deptQuery = `SELECT department.id, department.name from department`

    connection.query(deptQuery, function (err, res) {
    if (err) throw err;

      let departmentChoices = res.map(({ id, name, }) => ({
        value: id, name: `${id} ${name}`
      }));
      console.log(departmentChoices);
      promptAddEmployee(departmentChoices);
    });
  }

function promptAddEmployee(departmentChoices) {

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Employee first name?"
          },
          {
            type: "input",
            name: "last_name",
            message: "Employee last name?"
          },
          // {
          //   type: "list",
          //   name: "role",
          //   message: "Role?",
          //   choices: roleChoices
          // },
          {
            type: "list",
            name: "department_id",
            message: "Department?",
            choices: departmentChoices
          },
        ])
        .then(function (answer) {
          console.log(answer)
          try {
            var query = connection.query('INSERT INTO employee SET ?', answer, function (error, results, fields) {
              if (error) throw error;

            });
            console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
          }
          catch (error) {
            console.log("Cant add role try again dummy");
          }

          firstPrompt();
        });
    }

  











//  try {
  //    var post  = {first_name: "pat", last_name:"d",role_id:"3",manager_id:"1"};//the record set
  //    var query = connection.query('INSERT INTO employee SET ?', post, function (error, results, fields) {
  //      if (error) throw error;
  //      // Neat!
  //    });
  //    console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
  //  }
  //  catch (error) {
  //    console.log("Cant add user try again dummy");
  //  }














// 2."View Employees by Department" / READ by, SELECT * FROM
// Make a department array
// function viewEmployeeByDepartment() {
//   console.log("Viewing employees by department\n");

//   var query =
//     `SELECT d.id, d.name, r.salary AS budget
//   FROM employee e
//   LEFT JOIN role r
// 	ON e.role_id = r.id
//   LEFT JOIN department d
//   ON d.id = r.department_id
//   GROUP BY d.id, d.name`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     const departmentChoices = res.map(data => ({
//       value: data.id, name: data.name
//     }));

//     console.table(res);
//     console.log("Department view succeed!\n");

//     promptDepartment(departmentChoices);
//   });
//   // console.log(query.sql);
// }

// // User choose the department list, then employees pop up
// function promptDepartment(departmentChoices) {

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "departmentId",
//         message: "Which department would you choose?",
//         choices: departmentChoices
//       }
//     ])
//     .then(function (answer) {
//       console.log("answer ", answer.departmentId);

//       var query =
//         `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
//   FROM employee e
//   JOIN role r
// 	ON e.role_id = r.id
//   JOIN department d
//   ON d.id = r.department_id
//   WHERE d.id = ?`

//       connection.query(query, answer.departmentId, function (err, res) {
//         if (err) throw err;

//         console.table("response ", res);
//         console.log(res.affectedRows + "Employees are viewed!\n");

//         firstPrompt();
//       });
//     });
// }

// // 3."View Employees by Manager"

// // 4."Add Employee" / CREATE: INSERT INTO
// // Make a employee array
// function ooooooooooaddEmployee() {
//   console.log("Inserting an employee!")

//   var query =
//     `SELECT r.id, r.title, r.salary 
//       FROM role r`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     const roleChoices = res.map(({ id, title, salary }) => ({
//       value: id, title: `${title}`, salary: `${salary}`
//     }));

//     console.table(res);
//     console.log("RoleToInsert!");

//     promptInsert(roleChoices);
//   });
// }

// function promptInsert(roleChoices) {

//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "first_name",
//         message: "What is the employee's first name?"
//       },
//       {
//         type: "input",
//         name: "last_name",
//         message: "What is the employee's last name?"
//       },
//       {
//         type: "list",
//         name: "roleId",
//         message: "What is the employee's role?",
//         choices: roleChoices
//       },
//       // {
//       //   name: "manager_id",
//       //   type: "list",
//       //   message: "What is the employee's manager_id?",
//       //   choices: manager
//       // }
//     ])
//     .then(function (answer) {
//       console.log(answer);
      
      
//       try {
//         var post  = {first_name: "pat", last_name:"d",role_id:"3",manager_id:"1"};//the record set
//          var query = connection.query('INSERT INTO employee SET ?', post, function (error, results, fields) {
//            if (error) throw error;
//            // Neat!
//          });
//          console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
//        }
//        catch (error) {
//          console.log("Cant add user try again dummy");
//        }



//       var query = `INSERT INTO employee SET ?`
//       connection.query(query,
//         {
//           first_name: answer.first_name,
//           last_name: answer.last_name,
//           role_id: answer.roleId,
//           manager_id: answer.managerId,
//         },
//         function (err, res) {
//           if (err) throw err;

//           console.table(res);
//           console.log(res.insertedRows + "Inserted successfully!\n");

//           firstPrompt();
//         });
//       // console.log(query.sql);
//     });
// }

// //5."Remove Employees" / DELETE, DELETE FROM
// // Make a employee array to delete
// function removeEmployees() {
//   console.log("Deleting an employee");

//   var query =
//     `SELECT e.id, e.first_name, e.last_name
//       FROM employee e`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
//       value: id, name: `${id} ${first_name} ${last_name}`
//     }));

//     console.table(res);
//     console.log("ArrayToDelete!\n");

//     promptDelete(deleteEmployeeChoices);
//   });
// }

// function promptDelete(deleteEmployeeChoices) {

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "employeeId",
//         message: "Which employee do you want to remove?",
//         choices: deleteEmployeeChoices
//       }
//     ])
//     .then(function (answer) {

//       var query = `DELETE FROM employee WHERE ?`;
//       connection.query(query, { id: answer.employeeId }, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(res.affectedRows + "Deleted!\n");

//         firstPrompt();
//       });
//       // console.log(query.sql);
//     });
// }

// //6."Update Employee Role" / UPDATE,
// function updateEmployeeRole() { 
//   employeeArray();

// }

// function employeeArray() {
//   console.log("Updating an employee");

//   var query =
//     `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
//   FROM employee e
//   JOIN role r
// 	ON e.role_id = r.id
//   JOIN department d
//   ON d.id = r.department_id
//   JOIN employee m
// 	ON m.id = e.manager_id`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     const employeeChoices = res.map(({ id, first_name, last_name }) => ({
//       value: id, name: `${first_name} ${last_name}`      
//     }));

//     console.table(res);
//     console.log("employeeArray To Update!\n")

//     roleArray(employeeChoices);
//   });
// }

// function roleArray(employeeChoices) {
//   console.log("Updating an role");

//   var query =
//     `SELECT r.id, r.title, r.salary 
//   FROM role r`
//   let roleChoices;

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     roleChoices = res.map(({ id, title, salary }) => ({
//       value: id, title: `${title}`, salary: `${salary}`      
//     }));

//     console.table(res);
//     console.log("roleArray to Update!\n")

//     promptEmployeeRole(employeeChoices, roleChoices);
//   });
// }

// function promptEmployeeRole(employeeChoices, roleChoices) {

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "employeeId",
//         message: "Which employee do you want to set with the role?",
//         choices: employeeChoices
//       },
//       {
//         type: "list",
//         name: "roleId",
//         message: "Which role do you want to update?",
//         choices: roleChoices
//       },
//     ])
//     .then(function (answer) {

//       var query = `UPDATE employee SET role_id = ? WHERE id = ?`
//       connection.query(query,
//         [ answer.roleId,  
//           answer.employeeId
//         ],
//         function (err, res) {
//           if (err) throw err;

//           console.table(res);
//           console.log(res.affectedRows + "Updated successfully!");

//           firstPrompt();
//         });
//     });
// }








// function viewDepartment() {
//   console.log("Viewing departments\n");

//   var query =
//     `SELECT * from department`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     console.table(res);
//     console.log("Departments viewed!\n");

//     firstPrompt();
//   });
//   // console.log(query.sql);
// }

// function viewRole() {
//   console.log("Viewing roles\n");

//   var query =
//     `SELECT * from role`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     console.table(res);
//     console.log("Roles viewed!\n");

//     firstPrompt();
//   });
//   // console.log(query.sql);
// }

// //"View Employees"/ READ all, SELECT * FROM
// function viewEmployee() {
//   console.log("Viewing employees\n");
//   //got lernt from Bobby so I put something a little extra hot sauce here 
//   var query =
//     `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
//   FROM employee e
//   LEFT JOIN role r
// 	ON e.role_id = r.id
//   LEFT JOIN department d
//   ON d.id = r.department_id
//   LEFT JOIN employee m
// 	ON m.id = e.manager_id`

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     console.table(res);
//     console.log("Employees viewed!\n");

//     firstPrompt();
//   });
//   // console.log(query.sql);
// }