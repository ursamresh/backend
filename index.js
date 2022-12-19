const express = require("express");
const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/json", (req, res) => {
  res.json({
    name: "AMRESH",
    surname: "MAURYA",
    gender: "Male",
    age: 22,
  });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
