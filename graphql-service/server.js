var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');


var customer_client = require('./customer-service-client');
// GraphQL schema
var schema = buildSchema(`
    type Query {
        getCustomerById(id: Int!): Customer
        getCustomers: [Customer]
    },
    type Mutation {
        createCustomer(cust: CustomerInput): Customer
        saveCustomer(id: Int!, cust: CustomerInput): Customer
        deleteCustomer(id: Int!): Customer
    },
    type Customer {
        id: Int
        last_name: String
        first_name: String
        hkid: String
    },
    input CustomerInput {
        last_name: String
        first_name: String
        hkid: String
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
    }
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));