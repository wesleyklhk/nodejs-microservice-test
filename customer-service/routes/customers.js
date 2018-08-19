var express = require('express');
var router = express.Router();
const Customer = require('../models/customer');

router.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
    Customer.findAll({}).then((cus)=>{
        res.status(200);
        res.json(cus);
    });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    // console.log(req.params.id);
    Customer.findOne({
        where:{
            id: req.params.id
        }
    }).then((cus)=>{
        res.status(200);
        res.json(cus);
    });
});

router.post('/', function(req, res, next) {

    Customer.create({
        first_name: 'wes2',
        last_name: 'lau2',
        hkid: 'G1234567'
    }).then((cus)=>{
        res.status(200);
        res.json(cus);
    });
  // res.send('respond with a customer resource');

});

module.exports = router;
