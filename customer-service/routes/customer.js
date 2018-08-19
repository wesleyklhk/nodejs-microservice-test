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
    console.log(req.body);
    Customer.create(req.body).then((cus)=>{
        res.status(200);
        res.json(cus);
    });
  // res.send('respond with a customer resource');

});

router.put('/:id', function(req, res, next) {
    upd_cus = req.body;
    Customer.findOne({
        where:{
            id: req.params.id
        }
    }).then((cus)=>{
        console.log('b4 update');
        return cus.update({
            last_name: upd_cus.last_name,
            first_name: upd_cus.first_name,
            hkid: upd_cus.hkid
        });
    }).then((cus) => {
        console.log('after update');
        res.status(200);
        res.json(cus);
    });
});


router.delete('/:id', function(req, res, next) {
    Customer.findOne({
        where:{
            id: req.params.id
        }
    }).then((cus)=>{
        return cus.destroy({ force: true });
    }).then((cus) => {
        console.log(cus);
        res.status(200);
        res.json(cus);
    });    
});

module.exports = router;
