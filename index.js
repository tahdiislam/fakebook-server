const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

// jwt verify
function verifyJWT(req, res, next) {
  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, emon) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.emon = emon;
    next();
  });
}

async function run() {
  try {
    const Posts = client.db("fakebook").collection("posts");

    // get all post of a specific user
    app.get("/posts", verifyJWT, async (req, res) => {
      const emon = req.emon;
      if(emon.email !== req.query.email)
      {
        res.status(401).send({message: "unauthorized access"})
      }
      const email = req.query.email;
      const query = { email: email };
      const cursor = Posts.find(query);
      const storedPosts = await cursor.toArray();
      res.status(200).send(storedPosts);
    });

    // give user access token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1 days",
      });
      res.status(200).send({ token });
    });

    // create a new user
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await Posts.insertOne(post);
      res.status(201).send(result);
    });

    // delete certain post
    app.delete("/posts/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Posts.deleteOne(query);
      res.status(200).send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`fakebook server is running on PORT: ${port}`);
});
