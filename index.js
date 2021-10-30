const express= require('express')
const app=express()
const port= process.env.PORT || 5000
require('dotenv').config()
const objectId=require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const cors=require('cors')

//middleware
app.use(cors())
app.use(express.json())
//name: foodCateringService   pass:X8kUMKxb4iWQ5rJK
// connect to mongo db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he9di.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        console.log('connect to the database')
        const database=client.db("food_catering_service")
        const catering_serviceCollection= database.collection("foodItems")
        const orderedCollection=database.collection("orderedDetail")
        //GET API (load data from database)
        app.get('/foodItems',async(req,res)=>{
            const cursor = await catering_serviceCollection.find({}).toArray()
            res.send(cursor)
        })
        //GET API (load order place detail data)
        app.get('/orderplace/:id',async(req,res)=>{
        console.log(req.params.id)
        const result=await catering_serviceCollection.findOne({_id : objectId(req.params.id)})
            res.send(result)
            console.log(result)
            
        })
        //POST API (post ordered item in database)
     app.post('/confirmorder',async(req,res)=>{
         console.log(req.body)
         const result = await orderedCollection.insertOne(req.body)
         console.log(`inserted order with id ${result.insertedId}`)
         res.json(result)
         console.log(result)
     })
     //GET API (load  my orders in MY order page)
     app.get('/getmyorder/:email',async(req,res)=>{
         console.log(req.params.email)
         const result= await orderedCollection.find({email: req.params.email}).toArray()
         res.json(result)
     })
     }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/',async(req,res)=>{
    res.send('food catering from node')
})

app.listen(port,()=>{
    console.log('hitting with port',port)
})