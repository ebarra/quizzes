
const Sequelize = require('sequelize');

const options = { logging: false};
const sequelize = new Sequelize("sqlite:db.sqlite", options);

const user = sequelize.define(
  'user',
  { name: { 
      type: Sequelize.STRING,
      unique: { msg: "Name already exists"},
      validate: {
        is: { args: /^[a-z]+$/i, msg: "name: invalid characters"}
      }
    },
    age: {
      type: Sequelize.INTEGER,
      validate: {
        min: { args:   [0], msg: "Age less than 0"},
        max: { args: [150], msg: "Age higher than 150"}
      }
    }
  }
);


const quiz = sequelize.define(
  'quiz',
  { question: { 
      type: Sequelize.STRING,
      unique: { msg: "Quiz already exists"}
    },
    answer: Sequelize.STRING
  }
);

quiz.belongsTo(user, {as: 'author', foreignKey: 'authorId'});
user.hasMany(quiz, {as: 'posts', foreignKey: 'authorId'});

module.exports = sequelize;
