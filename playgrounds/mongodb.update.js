const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodosApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect with mongodb")
    }
    console.log("Connected to the mongodb server")
    // db.db('TodosApp').collection('Users').findOneAndUpdate({
    //     _id: 1
    // }, {
    //     $set: {
    //         name: "Hacker Boy"
    //     }
    // },{
    //     returnOriginal: false
    // }).then(res => {
    //     console.log(res)
    // })
    db.db('TodosApp').collection('Users').findOneAndUpdate({
        _id: 1
    }, {
        $inc: {
            age: 1
        },
        $set: {
            name: "Suhayb Cabdulahi"
        }
    }, {
        returnOriginal: false
    }).then(res => {
        console.log(res)
    })
})