import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {QueryCustomers,Customers,Customer,NewCustomer} from './CustomerComponent';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Nav,NavItem } from 'react-bootstrap';


class App extends Component {
  render() {
    return (
        <div>
          <Nav bsStyle="tabs">
            <NavItem eventKey={1} >
              <Link to="/">Customers Management</Link>
            </NavItem>
            <NavItem eventKey={1} >
              <Link to="/create">Create Customer</Link>
            </NavItem>            
          </Nav>

          <hr/>

          <Route exact path="/" component={QueryCustomers}/>
          <Route exact path="/create" component={NewCustomer}/>
        </div>      





    );
  }
}

export default App;
