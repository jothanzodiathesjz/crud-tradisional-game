const express = require('express')
const app = express()
const port = 5000
const morgan = require('morgan')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


// middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use('/public',express.static('public')); 
app.set('view engine', 'ejs')
app.listen(port, function () {
    console.log(`server is running in port: ${port}`)
})

// Set Cookie Parser, sessions and flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// errhandler
app.use(function (err, req, res, next) {
    console.log(err)
    res.sendStatus(500).json({
        status: fail,
        errors: err.massage
    })
})

const Routes = require('./routes/route')
app.use(Routes);

const ConnectionMongoDB = require('./models/mongoDb/connection')
ConnectionMongoDB()