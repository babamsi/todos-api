const { MongoClient } = require("mongodb")

MongoClient.connect("mongodb://localhost:27017/TodosApp", {useNewUrlParser: true}, (error, db) => {
    if (error) {
       return console.log("Un able to connect to the mongodb server ", error)
    }
    // db.db("TodosApp").collection("Todos").find({completed: true}).toArray().then((doc) => {
    //     console.log(JSON.stringify(doc, undefined, 2))
    // }, (erro)=>{
    //     console.log("un able to fetch the document ", erro)
    // });
    db.db("TodosApp").collection("Users").find({name: "Suheyb Abdulwahid Abdullahi"}).toArray().then((docs) => {
        console.log(`There is ${JSON.stringify(docs, undefined, 2)} documents`)
    }, (err) => {
        console.log(`Un able to fetch the document ${err}`)
    })
})