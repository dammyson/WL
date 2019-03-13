import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage, Image,ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { FontAwesome, AntDesign, Foundation } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import Loader from '../Loader/loader';

export default class Home extends Component {

constructor(props) {
  super(props);

  this.state = {
    loading: false,
    data: [],
    name: '',
    email: '',
    phone: '',
    permission: '',
    NumberHolder : 1,
    transaction_id:'',
    dialogVisible: false,
   
  };


}

componentDidMount = () =>{ 
  AsyncStorage.getItem('userType').then((value) => this.setState({ 'permission': value.toString()}))
  AsyncStorage.getItem('name').then((value) => this.setState({'name': value}))
  AsyncStorage.getItem('email').then((value) => this.setState({'email': value }))
  AsyncStorage.getItem('phone').then((value) => this.setState({'phone': value}))
  AsyncStorage.getItem('transID').then((value) => this.setState({'transaction_id': value}))
}

makeRemoteRequest(){
  AsyncStorage.getItem('transID').then((value) => {
    if(value !== null){
      const url = 'http://portal.bafsta.com.ng/api/order/refund/'+value
  this.setState({ loading: true });
  fetch(url, { method: 'GET',  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  } }
  
  )
    .then(res => res.json())
    .then(res => {
      
       if(res.status){
        AsyncStorage.setItem('transID', "");
        AsyncStorage.removeItem('transID');
      this.setState({
        loading: false,
        status: res.status,
      });

      AsyncStorage.setItem('transID', "");

      var RandomNumber =  Math.random().toString(36).substr(4);
      AsyncStorage.setItem('transID', RandomNumber);
       this.props.navigation.navigate('ProductsList')


    }else{
      this.setState({
        loading: false,
      });
      this.props.navigation.navigate('ProductsList')
    }
    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
     }else{
       this.setState({ dialogVisible: true });
     }
     

});






 
};




showDialog = () => {

  AsyncStorage.getItem('transID').then((value) => {
    if(value == null){
      this.setState({ dialogVisible: false });
      var RandomNumber =  Math.random().toString(36).substr(4);
     AsyncStorage.setItem('transID', RandomNumber);
     this.props.navigation.navigate('ProductsList')
     }else{
       this.setState({ dialogVisible: true });
     }
     

});



  
};

handleYes = () => {
  this.setState({ dialogVisible: false });
  this.props.navigation.navigate('ProductsList')
};

handleNo = () => {
this.setState({ dialogVisible: false });
this.makeRemoteRequest();

};







render() {


  if(this.state.permission == "1" || this.state.permission == "2") {


    return (



      <ImageBackground
      source={require('../../images/dash.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      >
      
      <Loader
          loading={this.state.loading} />
      <View style = {styles.container}> 
      
      <View style={styles.up}>
      <Text style={styles.whiteBoldText} > Welcome</Text>
      <Text style={styles.whiteText} > {this.state.name}</Text>
     <Text style={styles.whiteText} > {this.state.email}</Text>
     <Text style={styles.whiteText} >{this.state.phone} </Text>
      </View>
      <View style={styles.mid}>
      
      <View style={styles.row}>
      
      <TouchableOpacity style={styles.button} onPress={this.showDialog}> 
      <Card
      style={{width: 50, height: 50}}
       >
       <AntDesign style={styles.logo} name="shoppingcart" size={100} color="#fe0000" />
       <Text style={styles.cardText} > New Order </Text>
      </Card>
      
      
      </TouchableOpacity> 
       
      
      
      </View>
      
      <View style={styles.row}>
      <TouchableOpacity style={styles.button}
      onPress={() => this.props.navigation.navigate('OrderList')}>
      <Card
       >
       <FontAwesome style={styles.logo} name="calendar-check-o" size={100} color="#fe0000" />
       <Text style={styles.cardText} >Sales </Text>
      </Card>
      
      
      </TouchableOpacity> 
      
      </View>
      
      
      </View>
      
      <View style={styles.down}>  
      </View>
      
      </View>

      <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Description>
            Procceed with previous transaction.
          </Dialog.Description>
          <Dialog.Button label="No" onPress={this.handleNo} />
          <Dialog.Button label="Yes" onPress={this.handleYes} />
        </Dialog.Container>
      
      </ImageBackground>
      );






  }else{

    return (

//set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.10.74

      <ImageBackground
      source={require('../../images/dash.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      >
        <Loader
          loading={this.state.loading} />
      
      <View style = {styles.container}> 
      
      <View style={styles.up}>
      <Text style={styles.whiteBoldText} > Welcome</Text>
      <Text style={styles.whiteText} > {this.state.name}</Text>
     <Text style={styles.whiteText} > {this.state.email}</Text>
     <Text style={styles.whiteText} >{this.state.phone} </Text>
      </View>
      <View style={styles.mid}>
      
      <View style={styles.row}>
      
      <TouchableOpacity style={styles.button} onPress={this.showDialog}> 
      <Card
      style={{width: 50, height: 50}}
       >
       <AntDesign style={styles.logo} name="shoppingcart" size={100} color="#fe0000" />
       <Text style={styles.cardText} > New Order </Text>
      </Card>
      
      
      </TouchableOpacity> 
       
      
      
      </View>
      
      <View style={styles.row}>
      <TouchableOpacity style={styles.button}
      onPress={() => this.props.navigation.navigate('OrderList')}>
      <Card
       >
       <FontAwesome style={styles.logo} name="calendar-check-o" size={100} color="#fe0000" />
       <Text style={styles.cardText} >Sales </Text>
      </Card>
      
      
      </TouchableOpacity> 
      
      </View>
      
      
      </View>
      
      <View style={styles.down}>
      <TouchableOpacity style={styles.button}
      onPress={() => this.props.navigation.navigate('Reg')}
      > 
      <Card
       >
      <AntDesign style={styles.logo} name="adduser" size={60} color="#fe0000" />
      
      </Card>
      
      </TouchableOpacity> 
      
      </View>
      
      </View>

      <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Description>
            Procceed with previous transaction.
          </Dialog.Description>
          <Dialog.Button label="No" onPress={this.handleNo} />
          <Dialog.Button label="Yes" onPress={this.handleYes} />
        </Dialog.Container>
      
      </ImageBackground>
      );

 
 
 
   
   
   
    }


}
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
backgroundImage: {
width: Dimensions.get('window').width,
height: Dimensions.get('window').height,
paddingHorizontal: 10,
},


up:{
  flex:1,
  justifyContent: 'center',
  alignItems: 'center',
},
  mid:{
  flex:1,
  flexDirection: "row"
 
},
down:{
  flex:1,
  justifyContent: 'center',
  alignItems: 'center',
  

},

logo:{
  justifyContent: 'center',
  alignItems: 'center',
},

add:{
  width:60,
  height:60,
},


cardText:{
  textAlign:'center',
  color: "#fe0000",
  fontWeight: '700'
},


whiteText:{
  textAlign:'center',
  color: "#fff",
  fontSize:12,
  fontWeight: 'bold',
},

whiteBoldText:{
  textAlign:'center',
  color: "#fff",
  fontSize:25,
  fontWeight: 'bold',
},
baby:{
  width:60,
  height:60,
},
row:{
  flex:1,
  flexDirection: "row",
  alignItems: 'center',
  margin:1
  
},

button:{

},

});