const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodosApp', (error, db) => {
    if (error) {
        return console.log("Un able to connect with mongodb")
    }
    console.log("Connected to the mongodb successfuly")
    // db.db('TodosApp').collection("Users").deleteMany({name: "Khubayb"}).then(result => {
    //     console.log(result)
    // })
    db.db('TodosApp').collection("Users").findOneAndDelete({_id: new ObjectID("5c3c9ffc2994b649d2470269")}).then(res => {
        console.log(res)
    })
})