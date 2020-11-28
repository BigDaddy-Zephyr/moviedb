var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pgcreds= require('./postgresccreds.json');
var app = express();
app.listen(() => console.log("app listening on port 3000"));
const Sequelize = require('sequelize');
const sequelize = new Sequelize(pgcreds.dbname, pgcreds.user, pgcreds.password, {
   HOST: "localhost",
  dialect: "postgres",
  operatorsAliases: false,
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }


});



sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Movie = sequelize.define('movie', {
    movieid: {
      type: Sequelize.INTEGER,
      primarykey:true,
      allowNull: true
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    genre: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },{timestamps: false});

const Rating= sequelize.define('rating', {
    userid: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    movieid: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    rating: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    timestamp: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },{timestamps: false});

const Op = Sequelize.Op;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);




app.get('/byrating',async function(req,res){
	var resultarray=new Array();
var result1array=new Array();
	// await console.log(req.rating)
	for(var j=req.body.ratinglower;j<req.body.ratinghigher;j++){
var result=await Rating.findAll({where:{rating:j}})
	for(var i = 0; i < result.length; i++) {
    var obj = result[i];

   	resultarray.push(obj.movieid);
   }
}	


	for(j=req.body.startyear;j<=req.body.endyear;j++){
	var result1=await Movie.findAll({ where: {genre:{[Op.substring]:req.body.genre}, title:{[Op.substring]:j}} })
	for(var i = 0; i < result1.length; i++) {
    var obj = result1[i];
    // console.log(obj)
   	result1array.push(obj.movieid);
   }
}
const intersection = result1array.filter(element => resultarray.includes(element));
	intersection.forEach(async function(item){
		var temp=await Movie.findOne({where:{movieid:parseInt(item)}})
		res.write(temp.title)
	})
	setInterval(function(){res.end()},1000);
})

app.get('/bygenre', function(req, res) {
  Movie.findAll({ where: { genre: {[Op.substring]:req.body.genre} } })
  .then((data)=>{  	
  	JSON.parse(JSON.stringify(data))
  	res.send(data);
  
  	})
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
