// NOTE: this file is completely separate (self-contained) from the proshop application
// its purpose is to seed the database with usable data
// usable means products belong to a user with administrator privileges

import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
//
import users from "./data/users.js";
import products from "./data/products.js";
//
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
//
import connectDB from "./config/db.js";

// configure dotenv for backend functionality
dotenv.config();

// connect to database
connectDB();

// create data in the database
const importData = async () => {
    // NOTE: every mongoose method returns a promise
  try {
    // first: clear everything
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // create users from user data (array), where admin happens to be first in list
    const createdUsers = await User.insertMany(users);
    // get the admin user
    const adminUser = createdUsers[0]._id;

    // insert an admin user to each product
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });

    // insert the products into the database
    await Product.insertMany(sampleProducts);

    // developer success progress feedback
    console.log("Data successfully seeded into database".green.inverse);

    // exit the process; NOTE: argument of 1 would kill the process
    process.exit();
  } catch (err) {
    console.log(`Error seeding database: ${err}`.red.inverse);
    process.exit(1);
  }
};


// destroy all data in the database
const destroyData = async () => {
    //
    try {
        // destroy data
        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();
        //
        console.log("Data successfully deleted in database".green.inverse);
        //
        process.exit();
    } catch (err) {
        console.log(`Error destroying data in database: ${err}`.red.inverse);
        process.exit(1);
    }
}

// which function to run
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}