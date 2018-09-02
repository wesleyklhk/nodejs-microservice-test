var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema,GraphQLScalarType } = require('graphql');
var { Kind } = require('graphql/language');
const cors = require('cors');

// import { GraphQLScalarType } from 'graphql';
// import { Kind } from 'graphql/language';

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
};

var customer_client = require('./customer-service-client');

var transaction_client = require('./transaction-service-client');

// GraphQL schema
var schema = buildSchema(`
    scalar Date

    type Query {
        getCustomerById(id: Int!): Customer
        getCustomers: [Customer]
        getTransactionById(id: Int!): Transaction
        getTransactions: [Transaction]        
    },
    type Mutation {
        createCustomer(cust: CustomerInput): Customer
        saveCustomer(id: Int!, cust: CustomerInput): Customer
        deleteCustomer(id: Int!): Customer

        createTransaction(tran: TransactionInput): TransactionOperationOutput
    },
    type Customer {
        id: Int
        last_name: String
        first_name: String
        hkid: String
        balance: Int
    },
    input CustomerInput {
        last_name: String
        first_name: String
        hkid: String
    },
    type Transaction {
        id: Int
        customer_id: Int
        amount: Int
        createdAt: Date
        updatedAt: Date
    },
    input TransactionInput {
        customer_id: Int
        amount: Int
    },
    type TransactionOperationOutput {
        status: String
        transaction: Transaction
        customer: Customer
    }
`);


var root = {
    'getCustomerById': (args) => {
        var id = args.id;
        return customer_client.getCustomerById(id).then((cus) => {
            return cus.data;
        });
    },
    'getCustomers': (args) => {
        return customer_client.getAllCustomers().then((cus) => {
            return cus.data;
        }); 
    },
    'createCustomer': (args) => {
        return customer_client.createCustomer(args.cust).then((cus)=>{
            return cus.data;
        });
    },
    'saveCustomer': (args) => {
        var id = args.id;
        return customer_client.saveCustomer(id,args.cust).then((cus)=>{
            return cus.data;
        });
    },
    'deleteCustomer': (args) => {
        var id = args.id;
        return customer_client.deleteCustomer(id).then((cus)=>{
            return cus.data;
        });        
    },

    'getTransactionById': (args) => {
        var id = args.id;
        return transaction_client.getTransactionById(id).then((cus) => {
            return cus.data;
        });
    },
    'getTransactions': (args) => {
        return transaction_client.getAllTransactions().then((cus) => {
            return cus.data;
        }); 
    },
    'createTransaction': (args) => {
        let tran = args.tran;
        let transactionOperationOutput = {'status': 'FAIL','transaction':null,'customer':null};
        return customer_client.getCustomerById(tran.customer_id).then((cus) => {
            let customer = cus.data;
            let balance = customer.balance;
            let new_balance = balance + tran.amount;
            if (new_balance >= 0){
                customer.balance = new_balance;
                return customer_client.saveCustomer(tran.customer_id,customer);
            }
            throw new Error('negative balance is not allowed');
        }).then((upd_cus)=>{
            console.log('going to create new transaction');
            transactionOperationOutput.customer = upd_cus.data;
            return transaction_client.createTransaction(tran);
        },(error)=>{
            console.log('reject');
            return Promise.reject(transactionOperationOutput);
            // return transactionOperationOutput;
        }).then((cus_tran)=>{
            console.log('everything good');
            transactionOperationOutput.status = 'SUCCESS';
            transactionOperationOutput.transaction = cus_tran.data;
            return Promise.resolve(transactionOperationOutput);
        }).catch((data)=>{
            console.log('catch');
            console.log(data);
            return data;
        });
    },    
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors());

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));