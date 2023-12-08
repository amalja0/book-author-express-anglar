module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define("author", {
    firstName: {
      type: Sequelize.STRING
    }, 
    lastName: {
      type: Sequelize.STRING
    }, 
  });

  return Author;
}