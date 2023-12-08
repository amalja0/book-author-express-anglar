const express = require("express");
const cors = require("cors");

require('dotenv').config();

function startServer() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  const db = require("./src/models");

  db.sequelize.sync()
    .then(() => {
      console.log("Synced to database");
    }).catch((err) => {
      console.log("Failed to sync database: " + err.message);
    });
  
  require("./src/routes/author.routes")(app);
  require("./src/routes/book.routes")(app);
  require("./src/associations");

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

module.exports = { start: startServer};