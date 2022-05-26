const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izdcq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const partCollection = client.db('manu_factureer').collection('parts');
        const userCollection = client.db('manu_factureer').collection('users');

        app.get('/part', async(req,res)=>{
            const query={};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        app.put('/user/:email', async(req,res)=>{
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = {upsert: true };
            const updateDoc = { 
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc,options);
            res.send(result);
        })

        app.post('/add-profile', async(req,res)=>{
         
                const data = req.body;
                const result = await partCollection.insertOne(data);
                res.send(result);
           });

           app.put('/update-profile/:id', async(req,res)=>{
               const {id} = req.params;
               const data = req.body;

               const filter = { _id: ObjectId(id) };
               const updateDoc = {$set: data};
               const option = {upsert: true};

               const result = await partCollection.updateOne(filter, updateDoc,option);
               res.send(result);
           });
    }
    finally{

    }
}

run().catch(console.dir);

// Body

app.get("/dummy-route/user2", async (req, res) => {
    const data = req.body;
  
    res.json(data);
  });

  // Query

app.get("/dummy-route/user", async (req, res) => {
    const { education,city,phone } = req.query;
    console.log(education);
    console.log(city);
    res.json(phone);
  });

  // Param

app.get("/dummy-route/user/:id", async (req, res) => {
    const { id } = req.params;
  
    res.json(id);
  });
  


app.get('/', async (req, res) => {
    res.json('Running Manufacturer server');
});

app.listen(port, ()=>{
    console.log('Listening to port',port);
})