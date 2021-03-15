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
        //"Remove Employees",
        //"Add Role",
        // "Remove Role",
        // "Update Employee Manager",
        "End"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          //viewEmployee();
          queryTable("employee",`SELECT * FROM employee`);
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
        case "Update Employee Role":
          updateEmployeeRole();
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

//add departments
function addDepartment() {
  
  var deptTable = 'SELECT * FROM department'
  connection.query(deptTable, function (err, res) {
    console.table(res);
  });

  addDept();
}

function addDept(){
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

  // let deptQuery = `SELECT department.id, department.name from department`

  //   connection.query(deptQuery, function (err, res) {
  //   if (err) throw err;

  //     let departmentChoices = res.map(({ id, name, }) => ({
  //       value: id, name: `${id} ${name}`
  //     }));
  //     console.log(departmentChoices);
       getRole();
      //promptAddEmployee(departmentChoices);
    //});
  }



  function getRole() {
    //show the employee table
    //get data from role for inquirer
    //get data from department for inquirer
    
      //show them the employee table so no bad entires
      
      let roleQuery = `SELECT role.id, role.title from role`
    
        connection.query(roleQuery, function (err, res) {
        if (err) throw err;
    
          let roleChoices = res.map(({ id, title }) => ({
            value: id, title: `${id} ${title}`
          }));
          console.log("ROLE CHOICES" + roleChoices);
          promptAddEmployee(roleChoices);
        });
      }

function promptAddEmployee(roleChoices) {

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
          {
            type: "list",
            name: "role_id",
            message: "Employee role?",
            choices: roleChoices
          },
          {
            type: "input",
            name: "manager_id",
            message: "Manager id?",
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

function updateEmployeeRole() {
  
    //show them the employee table so no bad entires
    let updateTable = 'SELECT * FROM employee'
    connection.query(updateTable, function (err, res) {
      console.table(res);
    });
  
    inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message:'Please enter the id for the person you want to update'
      },
      {
        type: 'input',
        name: 'role_id',
        message:'Please enter the new role id'
      },
    ]).then(function (answer) {
      console.log(answer);
      connection.query(`UPDATE employee SET role_id='${answer.role_id}' WHERE id='${answer.id}'`)
      //console.log(query.sql);
      //if (error) throw error;
      //show the table adjusted with new info
      updateTable = 'SELECT * FROM employee'
      connection.query(updateTable, function (err, res) {
        console.table(res);
      });
      firstPrompt();
    })
   
    
}

//`UPDATE employee SET role_id='${answer.role_id}' WHERE first_name='${answer.first_name}' AND last_name='${answer.last_name}'`