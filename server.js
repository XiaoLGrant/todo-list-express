const express = require('express') //enables app to use express, also tells server that express is required
const app = express() // calls express without having to rewrite things
const MongoClient = require('mongodb').MongoClient  //enabling app to use mongodb, also tells server that mongo is required
const PORT = 2121 // sets the channel for the host
require('dotenv').config() // allows you to use environmental variables (e.g. set mongodb stream so you can hide sensitive info like passwords, API keys)


let db, //define db variable
    dbConnectionStr = process.env.DB_STRING, //define variable and assign value to mongodb connection string via a hidden environmental variable (named DB_STRING) (value would be defined in dotenv file)
    dbName = 'todo' //define and assign value to dbName variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects to database stored in mongodb. unifiedtopology connects database to newest mongo connection engine
    .then(client => { //after connection is established, for the data that's being transferred (referenced as param client), do the following
        console.log(`Connected to ${dbName} Database`) // console.log the database name so we know the connection was successful
        db = client.db(dbName) //assign database variable to the mongodb database
    })
    
app.set('view engine', 'ejs') //sets templating language to ejs
app.use(express.static('public')) //sets the static directory to public (this is where express will look up files in relation to). Ensures you don't need to write the path file every time.
app.use(express.urlencoded({ extended: true })) //app will recognize incoming request objects as strings or arrays
app.use(express.json()) //allows app to recognize incoming Request Objects as a JSON Objets


app.get('/', async (request, response)=>{ //read request for root route
    const todoItems = await db.collection('todos').find().toArray() //declare and assign variable to store an asynchronous call to the database that finds to do tasks and converts them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // declare and assign variable to store an asynchronous call to the database to count the number of tasks that have not been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // passes the to do tasks and the number of tasks left to do to the index.ejs page
    // db.collection('todos').find().toArray() //same as above, but doesn't use async/await syntax
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create request that will run when /addTodo route is called
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds to do task and completion status document to todos database (promise)
    .then(result => { //after data comes back from the database do the following
        console.log('Todo Added') //console.log 'Todo Added" so user knows that the database was updated
        response.redirect('/') // reload the root page (will trigger get request for this page)
    })
    .catch(error => console.error(error)) //catches any errors and displays them on the console
})

app.put('/markComplete', (request, response) => { //update request that will run when /markComplete route is called
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates to do task by searching for the body of the to do task
        $set: { //set the value of the following property
            completed: true // sets completed property of to do task to true
          }
    },{
        sort: {_id: -1}, //sorts database collection in descending order by id value
        upsert: false //don't add new document if todo task from query doesn't match
    })
    .then(result => { //after data comes back from database do the following
        console.log('Marked Complete') //console.log 'mark Complete' so user knows database was updated successfully
        response.json('Marked Complete') //tells front end that the database was updated succesfully (as 'marked complete')
    })
    .catch(error => console.error(error)) // catches any errors and displays them on the console

})

app.put('/markUnComplete', (request, response) => { //update request that will run when /markUnComplete route is called
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates to do dask by searching for the body of the to do task
        $set: { //set the value of the following property
            completed: false //sets completed property of to do task to false
          }
    },{
        sort: {_id: -1}, //sorts database collection in descending order by id value
        upsert: false //don't add new document if todo task from query doesn't match
    })
    .then(result => { //after data comes back from database do the following
        console.log('Marked Complete') //console.log 'mark complete' so user knows database was updated successfully
        response.json('Marked Complete') // tells front end that the database was updated succesfully (as 'marked complete')
    })
    .catch(error => console.error(error)) //catches any errors and displays them on the console

})

app.delete('/deleteItem', (request, response) => { //delete request that will run when /deleteItem route is called
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //searches for task (uses value of request.body.itemFromJS as query) and deletes it from the database
    .then(result => { //after data comes back from database do the following
        console.log('Todo Deleted') //console.log 'todo deleted' so user knows database was updated successfully
        response.json('Todo Deleted') // tells front end that the database was udpated successfully 
    })
    .catch(error => console.error(error)) //catches any errors and displays them on the console

})

app.listen(process.env.PORT || PORT, ()=>{ //connects app to channel/port (defined on line 4) so it can run on a host, process.env.port will allow another host/server (e.g. heroku) to define and use its own port
    console.log(`Server running on port ${PORT}`) //console.logs the port the app is running on so user knows the connection was successful
})