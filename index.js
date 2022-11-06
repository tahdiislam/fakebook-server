const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("fakebook server is running");
});

//connect to the db
// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.rgyxe1r.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const Posts = client.db("fakebook").collection("posts");

    // get all post of a specific user
    app.get("/posts", async (req, res) => {
      const email = req.query.email;
      let query = {}
      if(email){
        query = { email: email };
      }
      const cursor = Posts.find(query);
      const storedPosts = await cursor.toArray();
      res.status(200).send(storedPosts);
    });
    // create a new user
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await Posts.insertOne(post);
      res.status(201).send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`fakebook server is running on PORT: ${port}`);
});
