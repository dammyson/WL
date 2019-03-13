import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, TouchableOpacity, StatusBar, Alert, Picker} from 'react-native';
import { withNavigation } from 'react-navigation';
import Loader from '../Loader/loader';


class LoginForm extends Component {
  constructor(props) {
    super(props);
  this.state = {
    loading: false,
  username: "", 
  password: ""
}

  }

  
  checkLogin(){
    this.setState({ loading: true})
const {username, password} = this.state
fetch('http://portal.bafsta.com.ng/api/login', { method: 'POST',  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}, body: JSON.stringify({
  phone: username,
  pin: password,
}),  })
.then(res => res.json())
.then(res => {

  if(res.status){
   AsyncStorage.setItem('userType', res.data.permission.toString());
   AsyncStorage.setItem('phone', res.data.phone);
   AsyncStorage.setItem('name', res.data.name);
   AsyncStorage.setItem('email', res.data.email);
  this.setState({ loading: false})
  this.props.navigation.navigate('Home')

  }else{

Alert.alert('Login failed', res.message, [{text: 'Okay'}])
this.setState({ loading: false})
  }
})


            
  }
  render() {
    return (
      <View style={styles.container}>
<Loader
          loading={this.state.loading} />

<StatusBar barStyle="light-content" > </StatusBar>

<TextInput
placeholder= "Phone"
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType = "next"
onSubmitEditing = {() => this.passwordInput.focus()}
keyboardType = "numeric"
autoCapitalize= "none"
autoCorrect = {false}
   style = {styles.input}
   onChangeText = {text => this.setState({username: text})}
/>

<TextInput
placeholder= "Pin"
secureTextEntry
keyboardType = "numeric"
maxLength={4}
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType= "go"
 style = {styles.input}
 onChangeText = {text => this.setState({password: text})}
 ref={(input)=> this.passwordInput = input}
/>



<TouchableOpacity style={styles.buttonContainer} >
<Text style={styles.buttonText}
onPress ={() => this.checkLogin()} >LOGIN</Text>

</TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   padding:20
  },
  input:{
      height:40,
      backgroundColor: 'rgba(255, 0, 0, 0.4)',
      marginBottom:10,
      color: '#FFF',
      paddingHorizontal: 10,
      borderRadius: 10,
      marginLeft:10,
      marginRight:10,


  },
  buttonContainer:{
    backgroundColor: "#fe0000",
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft:10,
    marginRight:10,
  },
  buttonText:{
        textAlign:'center',
        color: "#FFFFFF",
        fontWeight: '700'
  },
  lngText:{
    textAlign:'center',
    color: "#fe0000",
    fontWeight: '700'
}

});


export default withNavigation(LoginForm);