import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import gql from 'graphql-tag';
import { Query,ApolloConsumer } from 'react-apollo';
import { Mutation } from "react-apollo";
import { Table,
          Button,
          ButtonGroup,
          Radio,
          FormControl,
          Grid,
          Row,
          Col,
          FormGroup,
          ControlLabel
} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';



const GET_CUSTOMERS = gql`
query get_cust {
  all_customers: getCustomers {
    id
    first_name
    last_name
    hkid
    balance
  }
}
`;

const CREATE_CUSTOMERS = gql`
mutation post_cust($newcust: CustomerInput) {
  new_cus: createCustomer(cust: $newcust){
    last_name
  }
}
`;


const CREATE_TRANSACTION = gql`
  mutation post_tran($newtran: TransactionInput) {
    new_tran: createTransaction(tran: $newtran){
      status
      transaction{
        id
        customer_id
        amount
        createdAt
        updatedAt      
      }
      customer{
        id
        first_name
        last_name
        hkid
        balance
      }
    }
  }
`;


class CreateTransaction extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <Mutation mutation={CREATE_TRANSACTION}>
        {(createTran, { data }) => (
          <div>
              <Button onClick={e => {
                e.preventDefault();
                let newtran = {
                  'customer_id':this.props.cus.id,
                  'amount':this.props.amount
                };
                let create_tran_promise = createTran({ variables: { newtran: newtran } });
                create_tran_promise.then((data)=>{
                  // console.log(data.data.new_tran);
                  this.props.refresh_customers(data.data.new_tran);
                });
              }}>{this.props.button_label}</Button>
          </div>
        )}
      </Mutation>
    );    
  }
}

class QueryCustomers extends Component{

  constructor(props) {
    super(props);
    this.state = {'all_customers':[],'fresh':true};

  }

  onCustomersFetched = all_customers => this.setState(() => ({'all_customers': all_customers,'fresh':false }));
  reFetch = () => {
    console.log(this.state);
    this.setState(() => ({'fresh':true ,'all_customers': []}));
  };
  refreshCustomers = (newtran) => {

    // this.setState(() => ({'fresh':true ,'all_customers': []}));
    if (newtran.status == "SUCCESS"){
      this.setState((prevState, props) => {
        //selected_customer: prevState.selected_customer + props.increment
        let new_all_customers = this.state.all_customers.slice().map( (customer) => {
          if (customer.id == newtran.customer.id){
            // return newtran.customer;
            return Object.assign(customer,newtran.customer);
          }
          return customer;
        });

        return {'all_customers':new_all_customers};
      });      
    }else{
      alert('negative balance is not allowed');
    }
    
  };

  render(){
    return (
      <div>
        {
          (() => {
            if (true) return;
            return <Button onClick={()=>this.reFetch()}>Re-Fetch</Button>; 
          })()          
        }
        <ApolloConsumer>
          {(client) => {
            let component_self = this;
            if (this.state.fresh){
              console.log('is fresh');
              client.query({
                  query: GET_CUSTOMERS,
                  //variables: { breed: "bulldog" }
              }).then((data)=>{
                let all_customers = JSON.parse(JSON.stringify(data.data.all_customers))
                component_self.onCustomersFetched(all_customers);
              })

              return (<div> Loading .... </div>);
            }else{
              console.log('render Customers');
              console.log(this.state.all_customers);
              return <Customers all_customers={this.state.all_customers} refresh_customers={this.refreshCustomers} ></Customers>
            } 
          }
        }
        </ApolloConsumer>
      </div>
    );    
    // return (
    //   <Query query={GET_CUSTOMERS}>
    //     {({ loading, error, data }) => {
    //       if (loading) return 'Loading...';
    //       if (error) return `Error! ${error.message}`;

    //       //this.all_customers = data.all_customers;
    //       this.onCustomersFetched(data.all_customers);
    //       return (
    //         <div>
    //           <Customers all_customers={data.all_customers}></Customers>
    //         </div>
    //       );
    //     }}
    //   </Query>
    // );
  }
}



class Customers extends Component{
  constructor(props) {
    super(props);
    this.state = {'selected_customer_id':null,'selected_customer':null,'amount':0};

  }

  render_customers(){
    if (!this.props.all_customers){
      return;
    }
    //console.log(this.props.all_customers);
    let customer_rows = this.props.all_customers.map((customer) => {
      return (
        <tr key={customer.id}>
          <td><Radio name="selected_customer" name="selected_customer" value={customer.id} onChange={(e) => this.handleChange(e)}></Radio></td>
          <td>{customer.first_name}</td>
          <td>{customer.last_name}</td>
        </tr>
      )
    });
    return customer_rows;
  }


  handleChange(e){
    // console.log(e.target.value);
    // this.setState({'selected_customer':e.target.value});
    // this.setState((prevState, props) => {
    //   //selected_customer: prevState.selected_customer + props.increment
    //   return {'selected_customer':e.target.value};
    // });
    let target_value = e.target.value;
    let selected_customer = this.props.all_customers.filter((cus)=>{
      return cus.id == parseInt(target_value);
    });

    this.setState(function(prevState, props) {
      if (selected_customer.length > 0){
        return {
          'selected_customer_id':target_value,
          'selected_customer':selected_customer[0]
        };        
      }else{
        return {
          'selected_customer_id':target_value
        };
      }
      
    });    
  }

  handleAmountUpdate(e){
    this.setState({'amount':e.target.value});
  }

  render(){
    return (
      <form>
        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={6}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>First Name</th>
                    <th>Last Name</th>
                  </tr>
                </thead>
                <tbody>
                {this.render_customers()}
                </tbody>
              </Table>              
            </Col>

            <Col xs={6} md={6}>
              {
                (() => {
                  if (this.state.selected_customer){
                    return (
                      <div>
                        <Customer cus={this.state.selected_customer}></Customer>
                        <FormControl type="number" min={0} value={this.state.amount} onChange={(e)=>this.handleAmountUpdate(e)}/>
                        <CreateTransaction cus={this.state.selected_customer}
                                           refresh_customers={this.props.refresh_customers}
                                           button_label="Deposit"
                                           amount={this.state.amount}>
                                           </CreateTransaction>
                        <CreateTransaction cus={this.state.selected_customer}
                                           refresh_customers={this.props.refresh_customers}
                                           button_label="Withdraw"
                                           amount={-this.state.amount}>
                                           </CreateTransaction>

                      </div>
                    );                      
                  }
                })()
              }            
            </Col>
          </Row>
        </Grid>


      </form>
    );    
  }

}


let CustomerDetail = (selected_customer,amount,refresh_customers) => {

};

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {'cus':null};
  }

  render() {
    console.log('render single Customer');
    const cus = this.props.cus;
    if (!cus){
      return (
        <div>
          <h1>Please select a customer</h1>
        </div>
      );   
    }else{
      return (
        <div>
          <div className="customer-cmp">
            First Name: {this.props.cus.first_name}
          </div>
          <div className="customer-cmp">
            Last Name: {this.props.cus.last_name}
          </div>
          <div className="customer-cmp">
            HKID: {this.props.cus.hkid}
          </div>
          <div className="customer-cmp">
            Balance: {this.props.cus.balance}
          </div>
        </div>        
      );         

    }

  }
}


class NewCustomer extends Component{

  constructor(props) {
    super(props);
    this.state = {
      'cus':{
        'last_name':'',
        'first_name':'',
        'hkid':''
      }
    };
  }

  handleFieldChange(e,fieldName){
    let target_value = e.target.value
    this.setState((prevState, props) => {
      let cus_upd = Object.assign({},this.state.cus);
      cus_upd[fieldName] = target_value;
      return {'cus':cus_upd};
    });    
  }


  render(){
    return (
      <form>

        <FormGroup controlId={this.state.cus.last_name}>
          <ControlLabel>Last Name</ControlLabel>
          <FormControl type="text" value={this.state.cus.last_name} onChange={(e)=>this.handleFieldChange(e,'last_name')}/>
        </FormGroup>

        <FormGroup controlId={this.state.cus.first_name}>
          <ControlLabel>First Name</ControlLabel>
          <FormControl type="text" value={this.state.cus.first_name} onChange={(e)=>this.handleFieldChange(e,'first_name')}/>
        </FormGroup>

        <FormGroup controlId={this.state.cus.hkid}>
          <ControlLabel>HKID</ControlLabel>
          <FormControl type="text" value={this.state.cus.hkid} onChange={(e)=>this.handleFieldChange(e,'hkid')}/>
        </FormGroup>        
        
        <CreateCustomer cus={this.state.cus}>
        </CreateCustomer>
        
      </form>
    );
  }

}

class CreateCustomer extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <Mutation mutation={CREATE_CUSTOMERS}>
        {(createCus, { data }) => (
          <div>
              <Button onClick={e => {
                e.preventDefault();
                let newcust = this.props.cus;
                let create_cust_promise = createCus({ variables: { newcust: newcust } });
                create_cust_promise.then((data)=>{
                  console.log(data.data);
                  // this.props.refresh_customers(data.data.new_tran);
                });
              }}>Submit</Button>
          </div>
        )}
      </Mutation>
    );    
  }
}

export {Customers,Customer,QueryCustomers,NewCustomer};
