const Author = require("./author.model");

module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("book", {
    title: {
      type: Sequelize.STRING
    }, 
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }, 
    price: {
      type: Sequelize.FLOAT
    }
  });

  return Book;
}