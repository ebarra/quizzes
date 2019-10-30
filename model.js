
const { Sequelize, Model, DataTypes } = require('sequelize');

const options = { logging: false};
const sequelize = new Sequelize("sqlite:db.sqlite", options);

class User extends Model {}
class Quiz extends Model {}

User.init({
    name: {
      type: DataTypes.STRING,
      unique: { msg: "Name already exists"},
      validate: {
        is: { args: /^[a-z]+$/i, msg: "name: invalid characters"}
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: { args:   [0], msg: "Age less than 0"},
        max: { args: [150], msg: "Age higher than 150"}
      }
    }
  }, { sequelize, modelName: 'user' });


Quiz.init({
  question: {
    type: DataTypes.STRING,
    unique: { msg: "Quiz already exists"}
  },
  answer: DataTypes.STRING
  }, { sequelize, modelName: 'quiz' });


Quiz.belongsTo(User, {as: 'author', foreignKey: 'authorId'});
User.hasMany(Quiz, {as: 'posts', foreignKey: 'authorId'});

module.exports = sequelize;
