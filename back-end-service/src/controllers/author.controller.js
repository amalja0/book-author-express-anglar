const db = require("../models");
const model = require("../models");
const Author = model.author;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  Author.create(author)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the author."
      });
    });

}

exports.findAll = (req, res) => {

  Author.findAll()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the authors."
      });
    });

}

exports.findByName = (req, res) => {

  const name = req.query.name;

  Author.findAll({
    where: {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${name}%`
          }
        },
        {
          lastName: {
            [Op.like]: `%${name}%`
          }
        }
      ]
    },
    include: 'books'
  })
  .then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the author."
      });
  });

}

exports.findById = (req, res) => {

  const id = req.params.id;

  Author.findByPk(id, { include: 'books' })
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the author."
      });
    });

}

exports.update = (req, res) => {

  const id = req.params.id;

  Author.update(req.body, {
    where: { id: id }
  })
    .then((num) => {
      if(num [0] === 1) {
        res.send({
          message:
            "Sucessfully Update author"
        });
      } else {
        res.status(500).send({
          message:
            "Some error occurred while updating the author."
        });
      }
    }).catch((err) => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while updating the author."
        });
    });

}

exports.delete = (req, res) => {

  const id = req.params.id;

  Author.destroy({
    where: {id: id}
  })
    .then((num) => {
      if(num === 1) {
        res.send({
          message:
            "Sucessfully Delete author"
        });
      } else {
        res.status(500).send({
          message:
            "Some error occurred while deleting the author."
        });
      }
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the author."
      });
    });
  
}