const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = 5000;

// snafiul700
// mNhUfNBQqtDc1I0E
//
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://snafiul700:mNhUfNBQqtDc1I0E@cluster0.s5vxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const chillGame = client.db("chillGame");
    const reviews = chillGame.collection("reviews");
    const watchList = chillGame.collection("watchList");

    // POST a review data
    app.post("/add-review", async (req, res) => {
      const data = req.body;
      const result = await reviews.insertOne(data);
      res.send(result);
    });

    // edit a review
    app.patch("/review/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await reviews.updateOne(query, {
        $set: updatedData,
      });
      res.send(result);
    });

    // get all review data
    app.get("/reviews", async (req, res) => {
      const data = await reviews.find().toArray();
      res.send(data);
    });

    // highest rated review games
    app.get("/highest", async (req, res) => {
      const data = await reviews
        .find()
        .sort({ gameRating: -1 })
        .limit(6)
        .toArray();
      res.send(data);
    });

    // find single review data
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviews.findOne(query);
      res.send(result);
    });

    // delete a review data
    app.delete("/review-delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviews.deleteOne(query);
      res.send(result);
    });

    // get review data with user email
    app.get("/review/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await reviews.find(query).toArray();
      res.send(result);
    });

    // POST a watchlist data
    app.post("/add-watchlist", async (req, res) => {
      const data = req.body;
      const result = await watchList.insertOne(data);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Hellooooooooooooooooo");
});
// server start fnc
app.listen(port, () => {
  console.log(`the server is running on PORT: ${port}`);
});
