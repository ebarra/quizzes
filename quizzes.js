const sequelize = require("./model.js");
const user = sequelize.models.user;
const quiz = sequelize.models.quiz;
const favourites = sequelize.models.favourites;

process.argv.slice(2).forEach(function (val, index, array) {
  console.log(index + ': ' + val);

});


switch (process.argv[2]) {
  case 'init':
      init();
      break;
  case 'list_users':
      list_users();
      break;
  case 'list_quizzes_users':
      list_quizzes_users();
      break;
  case 'list_users_quizzes':
      list_users_quizzes();
      break;
  case 'create_user':
      if(process.argv.length!==5){
        console.log("Usage: node quizzes.js create_user name age");
      } else {
        create_user(process.argv[3], process.argv[4]);
      }
      break;
  case 'create_user_quiz':
      if(process.argv.length!==6){
        console.log("Usage: node quizzes.js create_user_quiz name question answer");
      } else {
        create_user_quiz(process.argv[3], process.argv[4], process.argv[5]);
      }
      break;
  case 'read_user':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js read_user name");
      } else {
        read_user(process.argv[3]);
      }
      break;
  case 'read_user_quizzes':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js read_user_quizzes name");
      } else {
        read_user_quizzes(process.argv[3]);
      }
      break;
  case 'update_user':
      if(process.argv.length!==6){
        console.log("Usage: node quizzes.js update_user name new_name new_age");
      } else {
        update_user(process.argv[3], process.argv[4], process.argv[5]);
      }
      break;
  case 'delete_user':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js delete_user name");
      } else {
        delete_user(process.argv[3]);
      }
      break;
  case 'update_quiz':
      if(process.argv.length!==6){
        console.log("Usage: node quizzes.js update_quiz question new_question new_answer");
      } else {
        update_quiz(process.argv[3], process.argv[4], process.argv[5]);
      }
      break;
  case 'delete_quiz':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js delete_quiz question");
      } else {
        delete_quiz(process.argv[3]);
      }
      break;
  case 'delete_user_quizzes':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js delete_user_quizzes name");
      } else {
        delete_user_quizzes(process.argv[3]);
      }
      break;
  case 'mark_fav':
      if(process.argv.length!==5){
        console.log("Usage: node quizzes.js mark_fav name question");
      } else {
        mark_fav(process.argv[3], process.argv[4]);
      }
      break;
  case 'favourites':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js favourites name");
      } else {
        get_favourites(process.argv[3]); //we don't use favourites for the function name as it has already been declare when importing the model
      }
      break;
  default:
      console.log('Sorry, that is not something I know how to do.');
}


/*
* Functions that initializes the database
*/
async function init(){
  try {
    let seq = await sequelize.sync();
    let count = await user.count();
    if (count===0) {
      let c = await user.bulkCreate([
        { name: 'Peter', age: "22"},
        { name: 'Anna', age: 23},
        { name: 'John', age: 30}
      ]);
      let q = await quiz.bulkCreate([
        { question: 'Capital of Spain', answer: 'Madrid', authorId: 1},
        { question: 'Capital of France', answer: 'Paris', authorId: 1},
        { question: 'Capital of Italy', answer: 'Rome', authorId: 2},
        { question: 'Capital of Russia', answer: 'Moscow', authorId: 3}
      ]);
      let f = await favourites.bulkCreate([
        { userId: 1, quizId: 3},
        { userId: 2, quizId: 4},
        { userId: 2, quizId: 1},
        { userId: 2, quizId: 2},
        { userId: 3, quizId: 2}
      ]);
      console.log(`  DB created with ${c.length} users and ${q.length} quizzes and ${f.length} favourites.`);
      return;
    } else {
      console.log(`  DB exists & has ${count} elems`);
    }
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that lists all the users in the database
*/
async function list_users(){
  try{
    let people = await user.findAll();
    people.forEach( p => console.log(`  ${p.name} is ${p.age} years old`));
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that lists all the quizzes in the database with their authors
*/
async function list_quizzes_users(){
  try{
    let quizzes = await quiz.findAll({
          include: [{
            model: user,
            as: 'author'
          }]
        });
    quizzes.forEach( q => console.log(`  ${q.question} -> ${q.answer} (${q.author.name})`));
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that lists all the users in the database with their quizzes
*/
async function list_users_quizzes(){
  try{
    let users = await user.findAll({
          include: [{
            model: quiz,
            as: 'posts'
          }]
        });
    users.forEach( user => {
       console.log(`  ${user.name}'s quizzes`);
       user.posts.forEach( q =>
         console.log(`    ${q.question} -> ${q.answer}`)
       )
    });
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that creates a user in the database with the given data
*/
async function create_user(name, age){
  try {
    await user.create({ name, age });
    console.log(`   ${name} created with ${age} years`);
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that creates a quiz for a user in the database with the given data
*/
async function create_user_quiz(name, question, answer){
  try {
    let u = await user.findOrCreate(
      {where: {name}}
    );
    let q = await quiz.create(
        { question: question,
          answer: answer,
          authorId: u[0].id
        }
      );
    console.log(`   User ${name} created with quiz: ${question} -> ${answer}`);
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that reads a user from the database with the given name
*/
async function read_user(name){
  try {
    let person = await user.findOne( {where: {name}})
    if (!person) {throw new Error(`  '${name}' is not in DB`)};
    console.log(`  ${person.name} is ${person.age} years old`);
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that reads a user from the database with the given name and prints his/her quizzes
*/
async function read_user_quizzes(name){
  try {
    let person = await user.findOne( {where: {name},
      include: [{
        model: quiz,
        as: 'posts'
      }]
    })
    if (!person) {throw new Error(`  '${name}' is not in DB`)};
    person.posts.forEach( q =>
      console.log(`    ${q.question} -> ${q.answer}`)
    );
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that updates a user from the database with the given name
*/
async function update_user(name, new_name, new_age){
  try{
    let n = await user.update( {name: new_name, age: Number(new_age)}, {where: {name: name}})
    if (n[0]!==0) { console.log(`  ${name} updated to ${new_name} with ${new_age} age`) }
    else { throw new Error(`  ${name} not in DB`) };
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that deletes a user from the database with the given name
* should not be used after adding quizzes, as this method does not deletes the related quizzes
* use delete_user_quizzes instead
*/
async function delete_user(name){
  try {
    let n = user.destroy( {where: {name} })
    if (n!==0) {
      console.log(`  ${name} deleted from DB`)
    }
    else {
      throw new Error(`  ${name} not in DB`)
    };
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that updates a quiz from the database with the given content
*/
async function update_quiz(question, new_question, new_answer){
  try{
    let n = await quiz.update( {question: new_question, answer: new_answer}, {where: {question: question}})
    if (n[0]!==0) { console.log(`  new_quiz: ${new_question} -> ${new_answer}`); }
    else { throw new Error(`  ${question} not in DB`) };
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that deletes a quiz from the database with the given question
*/
async function delete_quiz(question){
  try {
    let n = quiz.destroy( {where: {question} })
    if (n!==0) {
      console.log(`  ${question} deleted from DB`)
    }
    else {
      throw new Error(`  ${question} not in DB`)
    };
  } catch (err) {
    console.log(`  ${err}`);
  }
}

/*
* Functions that deletes a user from the database and his/her quizzes
*/
async function delete_user_quizzes(name){
  try {
    let u = await user.findOne( {where: {name}});
    if (!u) { throw new Error(`${name} not in DB`)};
    await quiz.destroy({
      where: {authorId: u.id}
    });
    await u.destroy();
    console.log(` ${name} and his/her quizzes deleted from db`);
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that marks a quiz as favourite
*/
async function mark_fav(name, question){
  try {
    let u = await user.findOne({where: {name}});
    if (!u) { throw new Error(`  ${name} not in DB`)};
    let q = await quiz.findOne({ where: {question}});
    if (!q) { throw new Error(`  ${question} not in DB`)};
    let mark = favourites.build({userId: u.id});
    mark.quizId = q.id;
    await mark.save({ fields: ["userId", "quizId"]});
    console.log(`  '${question}' marked by ${name}`);    
  } catch (err) {
    console.log(`  ${err}`);
  }
}


/*
* Functions that shows user favourites
*/
async function get_favourites(name){
  try {
    let u = await user.findOne({ 
      where: {name}, 
      include: [{
        model: quiz, 
        as: 'favouriteQuizzes',
        include: [{
          model: user,
          as: 'author'
        }]
      }]
    });
    if (!u) { throw new Error(`  ${name} not in DB`)};
    console.log(`  ${name}'s favourites`);
    u.favouriteQuizzes.forEach( q =>
      console.log(`    ${q.question} -> ${q.answer} (${q.author.name})`)
    );   
  } catch (err) {
    console.log(`  ${err}`);
  }
}
