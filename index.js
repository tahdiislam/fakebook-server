const express = require('express');
const cors = require('cors');
require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000;

// middle wire
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("fakebook server is running")
})

app.listen(port, () => {
    console.log(`fakebook server is running on PORT: ${port}`);
})