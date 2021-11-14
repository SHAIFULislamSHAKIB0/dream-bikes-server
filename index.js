const express = require("express");
const { MongoClient } = require('mongodb');
require("dotenv").config();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware we use here
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylakt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database')

        const database = client.db("dreamBikes");
        const bikesCollection = database.collection("bikes");
        const ordersCollection = database.collection("orders");

        // POST API'S
        app.post('/bikes', async (req, res) => {
            const bike = req.body;
            // console.log('post hitted', place);
            const result = await bikesCollection.insertOne(bike)
            res.json(result)
        })

        // POST orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // GET API'S
        app.get('/orders', async (req, res) => {
            /* const email = req.query.email;
            const query = { email: email } */
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
        })

        // GET SINGLE bikes
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific id', id)
            const query = { _id: ObjectId(id) }
            const bike = await bikesCollection.findOne(query);
            res.json(bike);

        })

        // DELETE SINGLE API 
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikesCollection.deleteOne(query);
            res.json(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running dream bikes');
})

app.listen(port, () => {
    console.log("running dream bikes server on port", port)
})