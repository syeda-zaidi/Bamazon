var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId +"\n");
    displayItems();
});

displayItems = () => {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\n ----- Items for Sale ----- \n");
        for (i=0; i<res.length; i++) {
            console.log("item-id : " + res[i].item_id + "\n"+ " product : " + res[i].product_name + " Price : $" + res[i].price + "\n");
        }
        connection.end();
    })
};
