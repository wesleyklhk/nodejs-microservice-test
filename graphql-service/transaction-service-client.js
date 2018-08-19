const axios = require('axios');

const base_url = 'http://localhost:3000/transaction';

const instance = axios.create({
    baseURL: base_url
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = {
    'getAllTransactions': () => {
        return instance.get('');
    },
    'getTransactionById': (id) => {
        return instance.get(`/${id}`); 
    },
    'createTransaction': (cust) => {
        return instance.post(``,cust);
    }
};