# user_quiz
User quiz project

## Download, instalation and usage

This proyect can be downloaded, installed and used as follows:

```
$ git clone https://github.com/ebarra/quizzes
$ cd quizzes
$
$ npm install
$
$ npm run migrate
$ npm run seed
$ node quizzes.js list_users
$ node quizzes.js create_user Enrique 37
$ node quizzes.js delete_user Enrique
$ node quizzes.js update_user John Juan 38
$ node quizzes.js read_user Juan
$ node quizzes.js list_quizzes_users
$ node quizzes.js list_users_quizzes
$ node quizzes.js create_user_quiz Peter 'Capital of Portugal' 'Lisboa'
$ node quizzes.js read_user_quizzes Peter
$ node quizzes.js update_quiz 'Capital of Portugal' 'Capital of Chile' 'Santiago'
$ node quizzes.js delete_quiz 'Capital of Spain'
$ node quizzes.js delete_user_quizzes Anna
$ node quizzes.js mark_fav Peter 'Capital of France'
$ node quizzes.js favourites Peter
$
```
