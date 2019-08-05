const sequelize = require("./model.js");
const person = sequelize.models.person;


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
  case 'create_user':
      if(process.argv.length!==5){
        console.log("Usage: node quizzes.js create_user name age");
      } else {
        create_user(process.argv[3], process.argv[4]);
      }
      break;
  case 'read_user':
      if(process.argv.length!==4){
        console.log("Usage: node quizzes.js read_user name");
      } else {
        read_user(process.argv[3]);
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
  default:
      console.log('Sorry, that is not something I know how to do.');
}


/*
* Functions that initializes the database
*/
function init(){
  sequelize.sync()
  .then(() => person.count())
  .then((count) => {
    if (count===0) {
      return (
        person.bulkCreate([
          { name: 'Peter', age: 22},
          { name: 'Anna', age: 23},
          { name: 'John', age: 30}
        ])
        .then( c => console.log(`  DB created with ${c.length} elems`))
      )
    } else {
      console.log(`  DB exists & has ${count} elems`);
    }
  })
  .catch( err => console.log(`   ${err}`));
}

/*
* Functions that lists all the users in the database
*/
function list_users(){
  person.findAll()
  .then( people =>
    people.forEach( p => console.log(`  ${p.name} is ${p.age} years old`))
  )
  .catch( err => console.log(`   ${err}`));
}

/*
* Functions that creates a user in the database with the given data
*/
function create_user(name, age){
  person.create({ name, age })
  .then(() =>
    console.log(`   ${name} created with ${age} years`)
  )
  .catch( err => console.log(`   ${err}`));
}


/*
* Functions that reads a user from the database with the given name
*/
function read_user(name){
  person.findOne( {where: {name}})
  .then( person => {
    if (!person) {throw new Error(`  '${name}' is not in DB`)};
    console.log(`  ${person.name} is ${person.age} years old`);
  })
  .catch( err => console.log(`  '${err}`));
}


/*
* Functions that updates a user from the database with the given name
*/
function update_user(name, new_name, new_age){

  person.update( {name: new_name, age: Number(new_age)}, {where: {name: name}})
  .then( n => {
    if (n[0]!==0) { console.log(`  ${name} updated to ${age}`) }
    else { throw new Error(`  ${name} not in DB`) };
  })
  .catch( err => console.log(`  ${err}`));
}


/*
* Functions that deletes a user from the database with the given name
*/
function delete_user(name){
  person.destroy( {where: {name} })
  .then( n => {
    if (n!==0) {
      console.log(`  ${name} deleted from DB`)
    }
    else {
      throw new Error(`  ${name} not in DB`)
    };
  })
  .catch( err => console.log(`  ${err}`));
}
