const db = require("../models");

const Author = db.sequelize.models.author;
const Book = db.sequelize.models.book;

Author.hasMany(Book, {
  as: "books"
});

Book.belongsTo(Author, {
  foreignKey: "authorId",
  as: "author"
});

