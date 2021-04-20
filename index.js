const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w8sm0.mongodb.net/${process.env.DB_NAME}`;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("coronaVSupplies").collection("products");
  const ordersCollection = client.db("coronaVSupplies").collection("orders");
  const reviewsCollection = client.db("coronaVSupplies").collection("reviews");
  const adminCollection = client.db("coronaVSupplies").collection("admin");
  const subscriberCollection = client.db("coronaVSupplies").collection("subscriber");

    console.log('Database connected');
    
    app.post('/addEvent', (req, res)=>{
        const product = req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })
    
    app.get('/products', (req, res)=>{
        collection.find({}).toArray((err, documents)=>{
            res.send(documents);
        })
    })

    app.get('/checkout/:id', (req, res)=>{        
        collection.find({_id: ObjectId(req.params.id)}).toArray((err, documents)=>{
          res.send(documents[0]);
      })
  })

    app.delete('/delete/:id', (req, res)=>{        
        console.log("server side delete id:", ObjectId(req.params.id));
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
            console.log(result.deletedCount);
            res.send(result.deletedCount);
    })
    })


    
    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/orderPlacedByEmail', (req, res)=>{
      ordersCollection.find({email: req.query.email}).toArray((err, documents)=>{
          res.send(documents);
      })
  })

  app.post('/addReview', (req, res)=>{
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
})

app.get('/reviews', (req, res)=>{
    reviewsCollection.find({}).toArray((err, documents)=>{
        res.send(documents);
    })
})

app.post('/addAdmin', (req, res)=>{
    const adminId = req.body;
    adminCollection.insertOne(adminId)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
})

app.post('/addSubscriber', (req, res)=>{
    const subscriber = req.body;
    subscriberCollection.insertOne(subscriber)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
})
   

});

app.listen(process.env.PORT || port, () => {
  console.log("Listening to port", port);  
})
