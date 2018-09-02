const sequelize = require('../db');
const Sequelize = require('sequelize');

const Customer = sequelize.define('customer', {
  id: { type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true },
  last_name: { type: Sequelize.STRING },
  first_name: { type: Sequelize.STRING },
  hkid: { type: Sequelize.STRING },
  balance: { type: Sequelize.INTEGER }
},{
  tableName: 't_customer',
  // I don't want createdAt
  createdAt: false,
  updatedAt: false
});


Customer.findAll({}).then((cus)=>{
  console.log(cus[0].dataValues);
});



Customer.findOne({
  where:{
    id: 1
  }
}).then((cus)=>{
  console.log(cus.dataValues);
});


module.exports = Customer;
