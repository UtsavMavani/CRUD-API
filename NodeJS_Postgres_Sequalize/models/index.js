const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DBNAME, 
  process.env.DB_USER, 
  process.env.DB_PWD, 
  {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DL,
  logging: false
});

sequelize.authenticate()
.then(() => {
    console.log('Database connected.');
})
.catch(err => {
  console.log('Database connection error.' + err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.js')(sequelize, DataTypes);
db.books = require('./book.js')(sequelize, DataTypes);

// Foreign key
db.users.hasMany(db.books, { foreginKey: 'userId' });
db.books.belongsTo(db.users);


db.sequelize.sync({ force: false })
.then(() => {
  console.log('Sync done.');
});

module.exports = db;