var express = require('express');
var router = express.Router();
const Transaction = require('../models/transaction');

router.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
    Transaction.findAll({}).then((tran)=>{
        res.status(200);
        res.json(tran);
    });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    // console.log(req.params.id);
    Transaction.findOne({
        where:{
            id: req.params.id
        }
    }).then((tran)=>{
        res.status(200);
        res.json(tran);
    });
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    Transaction.create(req.body).then((tran)=>{
        res.status(200);
        res.json(tran);
    });
  // res.send('respond with a customer resource');

});


module.exports = router;
