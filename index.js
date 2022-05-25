const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const req = require('express/lib/request');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middlewere
app.use(cors());
app.use(express.json());

// api creation or loading data from database into server
// connecting to the database using new user and pass
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmqj6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// loading data into specific route from database to server
async function run(){
try{
    await client.connect();
    const fruitCollection = client.db('fruitBusket').collection('fruits');
    app.get('/fruits', async(req,res)=>{
        const query = {};
        const cursor = fruitCollection.find(query);
        const fruits = await cursor.toArray();
        res.send(fruits);
    })
    app.get('/fruits/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const fruit = await fruitCollection.findOne(query);
        res.send(fruit)
    })
    // post api : too add new inventory into db
    app.post('/fruits', async(req,res)=>{
        const newFruit = req.body;
        const result = await fruitCollection.insertOne(newFruit);
        res.send(result);
    })
    // udate price ;
    app.put('/fruits/:id', async(req,res)=>{
        const id = req.params.id;
        const updatequantity = req.body;
        const filter = {_id:ObjectId(id)};
        const options = {upsert : true};
        const updatedDoc = {
            $set : {updatequantity}
        }; 
        const result = await fruitCollection.updateOne(filter,updatedDoc,options);
        res.send(result);


    })
    // delete api : 
    app.delete('/fruits/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await fruitCollection.deleteOne(query);
        res.send(result);
    })
    // checking heroku endpoint
    app.get('/fruitbusket',(req,res)=>{
        res.send('heroku end point is working')
    })

}
finally{

}
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('server running')
})
app.listen(port,()=>{
    console.log('app is listening')
})