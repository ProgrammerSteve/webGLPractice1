const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));
app.listen(3000, function () {
  console.log("Server running on port 3000");
});
