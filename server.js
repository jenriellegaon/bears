//server.js

//BASE SETUP
var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin1:admin1@ds239703.mlab.com:39703/bears_db', {useNewUrlParser: true}); // connect to our database

//import packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// set our port
const port = process.env.PORT || 8080;

//Bear model
var Bear = require('./app/models/bear');

//configure bodyParser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * API ROUTES
 */

//get an instance of express Router
let router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening ....');
    next(); // make sure we go to the next routes and don't stop here
});


router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)

    .post(function(req, res) {

        let bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name
        bear.age = req.body.age;    // set the bears age

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


    

    



//test route
router.get('/', function(req, res) {
    res.json({ message: 'Welcome!' });   
});

// register routes
// all of our routes will be prefixed with /api
app.use('/api', router);

//start the server
app.listen(port);
console.log('Server started on port ' + port);

