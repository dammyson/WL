import  {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import Login from '../Login/Login';
import Reg from '../Reg/reg';
import Home from '../Home/Home';
import ProductsList from '../List/ProductList';
import Transaction from '../List/Transaction';
import Landing from '../Landing/Landing';
import OrderLanding from '../Landing/OrderLanding';
import OrderList from '../List/OrderList';


const AppNavigator = createStackNavigator({

 /* Login: {screen: Login,
    navigationOptions: {
      header:null        // this will do your task
    }},
  Home: {screen: Home,
    navigationOptions: {
      header:null        // this will do your task
    }}, */
    ProductsList: {screen: ProductsList},
    Landing: {screen: Landing},
    Transaction: {screen: Transaction},
    OrderList: {screen: OrderList},
    
   
  Reg: {screen: Reg,
    navigationOptions: {
      header:null        // this will do your task
    }},
 
  OrderLanding: {screen: OrderLanding},
 
  
 

  //F:\A-project\vt.jks
   
    
    
    
}
);

const App = createAppContainer(AppNavigator);

export default App;

