/* CREATING DATABASE */
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

/* CREATING TABLE */
USE bamazon;

CREATE TABLE products(
    item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INTEGER (10) NULL,
    PRIMARY KEY (item_id)
);

/* inserting data into products table */
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("Chiquita Bananas", "Produce", 0.20, 400),
        ("Golden Apples", "Produce", 0.40, 500),
        ("Dove Conditioner", "Grocery", 6.25, 6.27),
        ("Tropicana Orange Juice", "Grocery", 4.45, 267),
        ('Horizon Organic Milk', 'Grocery', 4.50, 200),
        ("Ben & Jerry Ice Cream", "Grocery", 4.45, 432),
        ("Paper Towels", "Grocery", 4.25, 400),
        ("Advil", "Pharmacy", 4.95, 380),
        ("Band Aid", "Pharmacy", 3.25, 550),
        ("T-shirts", "Clothing", 7, 250);


/* altering an existing table to add new column */
USE bamazon;
ALTER TABLE products
ADD product_sales INTEGER(10);


/* cretaing new departments table */
USE bamazon;
CREATE TABLE departments(
    department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100),
    over_head_costs INTEGER (10),
    product_sales INTEGER(10),
    total_profit INTEGER(10),
);

