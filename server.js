var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var auxilaryService = require('./services/auxilary');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.get('/', function(req, res){
    res.send('Hello! The API is at http://localhost' + port + '/api');
});

// Routes for the API
var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res){
   res.json({
       'message': 'REST API for Your Next App!'
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

// Auth Middleware
apiRoutes.use(function (req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if (err) {
                return res.json({success: false, message: 'Failed to Authenticate Token.'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No Token Provided.'
        });
    }
});

apiRoutes.get('/users', function(req, res){
   User.find({}, function(err, users){
       res.json({users: users});
   });
});

apiRoutes.get('/getUserName', function(req, res){
    var name = auxilaryService.findValueOfObjectParameter(req.decoded, '_doc').name;
    res.json({name: name});
});

apiRoutes.get('/:userName/tasks', function(req, res){
   User.findOne({'name': req.param('userName')}, function(err, user){
       if (user.data) res.json({data: user.data});
       else res.json({data: {}});
   });
});

apiRoutes.put('/:userName/addTask', function(req, res) {
   var taskObject = {task: req.body.task, completed: false};
   User.findOneAndUpdate({'name': req.param('userName')}, {$addToSet: {data: taskObject}}, function(err, doc){
       if (err) return res.send(500, {error: err});
       return res.send({success: true});
   });
});

// Update a Document inside of Array (Difficulty: Moderate)
apiRoutes.put('/:userName/completeTask', function(req, res) { // For Help: https://docs.mongodb.com/manual/reference/operator/update/positional/
   User.findOneAndUpdate({'name': req.param('userName'), 'data.task': req.body.task}, {$set: {'data.$.completed': {completed: true}}}, function(err, doc){
       if (err) return res.send(500, {error: err});
       return res.send({success: true});
   });
});

apiRoutes.put('/:userName/uncompleteTask', function(req, res) { // For Help: https://docs.mongodb.com/manual/reference/operator/update/positional/
   User.findOneAndUpdate({'name': req.param('userName'), 'data.task': req.body.task}, {$set: {'data.$.completed': {completed: false}}}, function(err, doc){
       if (err) return res.send(500, {error: err});
       return res.send({success: true});
   });
});


apiRoutes.delete('/:userName/removeTask', function(req, res) { // For Help: https://docs.mongodb.com/v2.6/reference/operator/update/pull/
   User.findOneAndUpdate({'name': req.param('userName')}, {$pull: {'data': {task: req.body.task}}}, function(err, doc){
       if (err) return res.send(500, {error: err});
       return res.send({success: true});
   });
});

apiRoutes.post('/createUser', function(req, res){
    var newUser = new User({
        name: req.body.name,
        password: req.body.password,
        admin: false,
        data: []
    });
    newUser.save(function(err){
        if (err) throw err;
        res.json({success: true});
    });
});

apiRoutes.delete('/removeUser', function(req, res){
    User.findOne({'name': req.body.userNameToBeRemoved}).remove(function(err, doc){
        if (err) throw err;
        res.json({success: true});
    });
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at port: ' + port);

app.get('/setup', function(req, res){
    var iolearn = new User({
        name: 'kino6052',
        password: 'cat8dog123!',
        admin: true,
        data: []
    });
    iolearn.save(function(err){
        if (err)
            throw err;
        console.log('User saved successfully');
        res.json({success:true});
    });
});

