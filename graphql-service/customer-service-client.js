const axios = require('axios');

const base_url = 'http://localhost:3000/customer';

const instance = axios.create({
    baseURL: base_url
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = {
    'getAllCustomers': () => {
        return instance.get('');
    },
    'getCustomerById': (id) => {
        return instance.get(`/${id}`); 
    },
    'createCustomer': (cust) => {
        return instance.post(``,cust);
    },
    'saveCustomer': (id,cust) => {
        return instance.put(`/${id}`,cust);
    },
    'deleteCustomer': (id) => {
        return instance.delete(`/${id}`);
    }
};