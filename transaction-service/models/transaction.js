const sequelize = require('../db');
const Sequelize = require('sequelize');

const Transaction = sequelize.define('transaction', {
  id: { type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true },
  customer_id: { type: Sequelize.INTEGER,allowNull: false },
  amount: { type: Sequelize.INTEGER },
  createdAt: { type: Sequelize.Sequelize.DATE },
  updatedAt: { type: Sequelize.Sequelize.DATE }
},{
  tableName: 't_transaction'
});


Transaction.findAll({}).then((cus)=>{
  console.log(cus[0].dataValues);
});



Transaction.findOne({
  where:{
    id: 1
  }
}).then((tran)=>{
  console.log(tran.dataValues);
});


module.exports = Transaction;
