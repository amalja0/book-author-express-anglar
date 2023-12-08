module.exports = app => {

  const authorController = require("../controllers/author.controller");

  var router = require("express").Router();

  router.post('/', authorController.create);

  router.get("/", authorController.findAll);

  router.get("/name", authorController.findByName);

  router.get("/:id", authorController.findById);

  router.put("/:id", authorController.update);

  router.delete("/:id", authorController.delete);

  app.use('/api/author', router);

}