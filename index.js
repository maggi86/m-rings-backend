const express = require('express');
const db = require("./config/dbmysql");
const path = require('path');
const cors = require('cors');
const token = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT

app.set("port", port || 0402)

app.use(express.json(), cors(), express.static("public"))

app.use((req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    });
    next();
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

const productRoute = require('./routes/productsRoute')
app.use("/products", productRoute)

const userRoute = require('./routes/userRoute')
app.use("/users", userRoute)

const cartRoute = require("./routes/cartRoute")
app.use(cartRoute)
