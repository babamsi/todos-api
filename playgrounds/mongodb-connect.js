// const MongoClient = require('mongodb').MongoClient; //init a mongodb
const {MongoClient, ObjectID} = require("mongodb");

const id = new ObjectID();
console.log(id)

MongoClient.connect(`mongodb://localhost:27017/TodoApp`,{ useNewUrlParser: true }, (err, db) => {
    if(err) {
        return console.log("Un able to connect to the monogdb Server")
    }
    console.log("Connected To the mongoDB")
    const dbName = 'TodosApp'
    // db.db('TodosApp').collection('Todos').insertOne({
    //     text: "Something To do",
    //     completed: false
    // }, (error , result) => {
    //     if (error) {
    //         return console.log("Unable to insert Document ", error)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })  //this is how to make Todos collection and insert it a Docoment
    
    // db.db(dbName).collection('Users').insertOne({ //you can make your own _id
    //     _id: 2,
    //     name: "Suheyb Abdulwahid Abdullahi", 
    //     age: 17, 
    //     location: "Somalia"
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Un Able to insert to Users collection a Document ", error)
    //     }
    //     console.log("Inserted one user to the Database ")
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    //     console.log("The ID ", result.ops[0]._id)
    // })

    db.close();
})


// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'myproject';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });