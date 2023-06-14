const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlsud.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const serviceCollection = client.db('teacher').collection('services');
        const commentCollection = client.db('teacher').collection('comments');
        const bookingCollection = client.db('teacher').collection('book')
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        });
        app.post('/comment', async (req, res) => {
            const comment = req.body;
            const addComment = await commentCollection.insertOne(comment);
            res.send(addComment)
        });
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const booked = await bookingCollection.insertOne(booking);
            res.send(booked)
        });
        app.get('/booking', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = bookingCollection.find(query);
            const bookedItems = await cursor.toArray();
            res.send(bookedItems);
        });
        //delete booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/comment', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = commentCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        });
        //delete comment 
        app.delete('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await commentCollection.deleteOne(query);
            res.send(result)
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        });
        app.get('/allservice', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const allService = await cursor.toArray();
            res.send(allService)
        });
        app.get('/allservice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('teacher site is running on server')
});


app.listen(port, () => {
    console.log(`port is running on ${port}`)
})