const db = require("../models");
const model = require("../models");
const Book = model.book;
const Author = model.author;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  const book = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false, 
    price: req.body.price ? req.body.price : 0,
  };

  Book.create(book)
    .then((data) => {
      const authorId = req.body.authorId ? req.body.authorId : null;

      if (authorId !== null) {
        Author.findByPk(authorId)
          .then((author) => {
            if (!author) {
              return res.status(404).send({ message: "Author not found." });
            }

            data.setAuthor(author)
              .then(() => {
                res.send(data);
              }).catch((err) => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the book."
                });
              });

          }).catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the book."
            });
          });
      }

    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the book."
      });
    });

}

exports.findAll = (req, res) => {
  
  Book.findAll({ include: 'author' })
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the books."
      });
    });

}

exports.findByTitle = (req, res) => {

  const title = req.query.title;

  Book.findAll({
    where: {
      title: {
        [Op.like]: `%${title}%`
      }
    },
    include: 'author'
  })
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the books."
      });
    });

}

exports.findById = (req, res) => {

  const id = req.params.id;

  Book.findByPk(id, { include: 'author' })
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the book."
      });
    });

}

exports.updateStatus = (req, res) => {

  const id = req.params.id;

  Book.update(req.body, {
    where: { id: id }
  })
    .then((num) => {
      if(num [0] === 1) {
        res.send({
          message:
            "Sucessfully Update Data"
        });
      } else {
        res.status(500).send({
          message:
            "Some error occurred while updating the book."
        });
      }
      console.log(num)
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the book."
      });
    });

}

exports.delete = (req, res) => {

  const id = req.params.id;

  Book.destroy({
    where: {id: id}
  })
    .then((num) => {
      if(num === 1) {
        res.send({
          message:
            "Sucessfully Delete Data"
        });
      } else {
        res.status(500).send({
          message:
            "Some error occurred while updating the book."
        });
      }
      console.log(num);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the book."
      });
    });
    
}