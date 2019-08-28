var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayItems();
});

displayItems = () => {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("\n ----- Items for Sale ----- \n");
        for (i = 0; i < res.length; i++) {
            console.log("item-id : " + res[i].item_id + "\n" + " product : " + res[i].product_name + " Price : $" + res[i].price + "\n");
        }
        questionPrompt();
    })
};

questionPrompt = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the product you want to buy. ",
            name: "purchaseID",
            validate: (value) => {
                if (!isNaN(value)) {
                    return true;
                } else {
                    return false;
                };
            },
        },
        {
            type: "input",
            message: "How many units of this product would you like to buy ?",
            name: "purchaseUnits",
            validate: (value) => {
                if (!isNaN(value)) {
                    return true;
                } else {
                    return false;
                };
            },
        },
    ]).then((answers) => {
        connection.end()

    })
};
