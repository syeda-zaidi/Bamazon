var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menuPrompt();
});

menuPrompt = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select an action from the following options",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "menu"
        }
    ]).then(function (action) {
        if (action.menu === "View Products for Sale") {
            displayItems();
            connection.end();
        } else if (action.menu === "View Low Inventory") {
            displayLowInventory();
            connection.end();
        } else if (action.menu === "Add to Inventory") {
            addToInventory();
            // connection.end();
        }
    })
};

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("\n ----- Items for Sale ----- \n");
        for (i = 0; i < res.length; i++) {
            console.log("Item-id : " + res[i].item_id + "\nProduct : " + res[i].product_name + "\nPrice : $" + res[i].price + "\nStock Quantity : " + res[i].stock_quantity + "\n-----------------\n");
        }
    })
};

function displayLowInventory() {
    connection.query("SELECT * FROM products Where stock_quantity < 100", function (err, res) {
        if (err) throw err;

        console.log("\n ----- Low Inventory Items ----- \n");
        for (var i = 0; i < res.length; i++) {
            console.log("Item-id : " + res[i].item_id + "\nProduct : " + res[i].product_name + "\nPrice : $" + res[i].price + "\nStock Quantity : " + res[i].stock_quantity + "\n-----------------\n");
        }
    })
};

function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Item-ID of the product you want to add inventory in",
            name: "ItemToAdd",
            validate: (value) => {
                if (!isNaN(value) && value > 0 && value < 11) {
                    return true;
                } else {
                    return false;
                };
            },
        },
        {
            type: "input",
            message: "Enter the quantity you want to add to stock",
            name: "QuantityToAdd",
            validate: (value) => {
                if (isNaN(value)) {
                    return false;
                } else {
                    return true;
                };
            },
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: answer.ItemToAdd,
            }, function (err, res) {
                if (err) throw err;
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (res[0].stock_quantity + parseInt(answer.QuantityToAdd)),
                        },
                        {
                            item_id: answer.ItemToAdd,
                        }],
                    function (err, response) {
                        if (err) throw err;

                        console.log("\nInventory Updated " + response.affectedRows + " row affected\n");
                        connection.end();
                    },
                );
            });
    });
};