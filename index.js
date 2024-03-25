require("dotenv").config();
const { client, createTables, seed } = require('./db'); 

const express = require("express");
const morgan = require("morgan");

const app = express();

//middleware
app.use(express.json());
app.use(morgan("combined"));

app.use("/api", require("./api"));

//init function 

const init = async () => {
  await client.connect();
  console.log("db connected");

  await createTables();
  console.log("tables created");

   await seed();
   console.log("data seeded");

    app.listen(process.env.PORT, () => {
    console.log(`server is listening on Port ${process.env.PORT}`);

})

};

init();