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
                if (!isNaN(value) && value > 0 && value < 11) {
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
                if (!isNaN(value) && value > 0) {
                    return true;
                } else {
                    return false;
                };
            },
        },
    ]).then((answers) => {
        connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: answers.purchaseID,
            },
            function (err, res) {
                if (err) throw err;
                console.log(res);
                console.log(res[0].stock_quantity);
                if (res[0].stock_quantity < answers.purchaseUnits) {
                    if (res[0].stock_quantity === 0) {
                        console.log("This item is OUT OF STOCK!")
                    } else if (res[0].stock_quantity > 0 && res[0].stock_quantity < answers.purchaseUnits) {
                        console.log("Insufficient Quantity! The store only have " + res[0].stock_quantity + " available units for purchase.");
                    }
                } else {
                    console.log("\n --- purchase order placed ! ---\n ");
                    var cost = answers.purchaseUnits * res[0].price;
                    console.log("TOTAL cost of your purchase is : $" + cost);
                    console.log("\n updating inventory");
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (res[0].stock_quantity - answers.purchaseUnits)
                            },
                            {
                                item_id: answers.purchaseID

                            }
                        ], 
                        function(err, res) {
                            if (err) throw err;
                            console.log("Inventory updated " + res.affectedRows + " row affected"); 
                        })
                }
                connection.end();
            });
    });
};

