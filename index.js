const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
// app.use(express.json());
// middleware
const corsConfig = {
    origin: [
        'http://localhost:5173',
        'https://newspaper-3507b.web.app',
        'https://newspaper-3507b.firebaseapp.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig));
// app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ik9fyhp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const articlesCollection = client.db("newspaperDb").collection('articles');

        // get articlesCollection
        app.get('/articles', async (req, res) => {
            const result = await articlesCollection.find().toArray();
            res.send(result);
        })

        // post articlesCollection
        app.post('/articles', async (req, res) => {
            const cartItem = req.body;
            const result = await articlesCollection.insertOne(cartItem);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Newspaper is running')
});
app.listen(port, () => {
    console.log(`newspaper in sitting on port ${port}`);
})