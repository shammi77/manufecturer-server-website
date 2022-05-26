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

        app.get('/part', async(req,res)=>{
            const query={};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        app.post('/add-part', async(req,res)=>{
         
                const data = req.body;
                const result = await partCollection.insertOne(data);
                res.send(result);
           });
    }
    finally{

    }


}

run().catch(console.dir);


app.get('/', async (req, res) => {
    res.json('Running Manufacturer server');
});

app.listen(port, ()=>{
    console.log('Listening to port',port);
})