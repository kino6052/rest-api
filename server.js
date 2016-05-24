var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.get('/', function(req, res){
    res.send('Hello! The API is at http://localhost' + port + '/api');
});

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res){
   res.json({
       'message': 'REST API for Your Next App!'
   });
});

apiRoutes.get('/users', function(req, res){
   User.find({}, function(err, users){
       res.json(users);
   });
});

apiRoutes.post('/authenticate', function(req, res){
    User.findOne({
        name: req.body.name
    }, function(err, user){
        if (err) 
            throw err;
        if (!user) {
            res.json({success: false, message: 'Authentication Failed. User not Found.'});
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication Failed. Wrong Password.'});
            } else {
                var token = jwt.sign(user, app.get('superSecret'), {
                   'expiresIn': '1440m' 
                });
                res.json({
                    success: true,
                    message: 'Enjoy Your Token!',
                    token: token
                });
            }
        }
    });
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at port: ' + port);

app.get('/setup', function(req, res){
    var iolearn = new User({
        name: 'kino6052',
        password: 'cat8dog123!',
        admin: true
    });
    iolearn.save(function(err){
        console.log('here');
        if (err)
            throw err;
        console.log('User saved successfully');
        res.json({success:true});
    });
});

