module.exports = app => {
  
  const bookController = require("../controllers/book.controller");

  var router = require("express").Router();

  router.post("/", bookController.create);

  router.get("/", bookController.findAll);

  router.get("/title", bookController.findByTitle);

  router.get("/:id", bookController.findById);

  router.put("/:id", bookController.updateStatus);

  router.delete("/:id", bookController.delete);

  app.use('/api/book', router);

}