require("dotenv").config()
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

// parse json in request body
app.use(express.json());

// parse form in request body
app.use(express.urlencoded({ extended: false }));

// promotes cross origin resource sharing
app.use(cors());

// use middleware for v1 api requests
app.use("/api", routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
