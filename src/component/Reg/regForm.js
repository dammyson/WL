import React, {Component} from 'react';
import { StyleSheet, Text, Alert, View, TextInput, TouchableOpacity, StatusBar, Picker} from 'react-native';
import { withNavigation } from 'react-navigation';
import Loader from '../Loader/loader';

class regForm extends Component {
  constructor(props) {
    super(props);
  this.state = {
    loading: false,
  email: "", 
  phone: "",
  name: "", 
  pin: "",
  type:''
}

  }


  checkReg(){
    this.setState({ loading: true})
const {email, phone, pin, name, type} = this.state
fetch('http://portal.bafsta.com.ng/api/signup', { method: 'POST',  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}, body: JSON.stringify({
  email: email,
  phone: phone,
  pin: pin,
  name: name,
  permission: type,
}), 
 })
.then(res => res.json())
.then(res => {

  if(res.status){

  this.setState({ loading: false})
  Alert.alert('Success', res.message, [{text: 'Okay'}])
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


<TextInput
placeholder= "Fullname"
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType = "next"
onSubmitEditing = {() => this.userInput.focus()}
autoCapitalize= "none"
autoCorrect = {false}
   style = {styles.input}
   onChangeText = {text => this.setState({name: text})}
/>


<TextInput
placeholder= "Email"
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType = "next"
onSubmitEditing = {() => this.userphone.focus()}
keyboardType = "email-address"
autoCapitalize= "none"
autoCorrect = {false}
   style = {styles.input}
   ref={(userinput)=> this.userInput = userinput}
   onChangeText = {text => this.setState({email: text})}
/>


<TextInput
placeholder= "Phone"
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType = "next"
onSubmitEditing = {() => this.passwordInput.focus()}
keyboardType = "numeric"
autoCapitalize= "none"
autoCorrect = {false}
   style = {styles.input}
   ref={(userinput)=> this.userphone = userinput}
   onChangeText = {text => this.setState({phone: text})}
/>



<Picker
  selectedValue={this.state.type}
  style = {styles.input}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({type: itemValue})
  }>
  <Picker.Item label="Set permission" value="" />
  <Picker.Item label="Seller" value="1" />
   <Picker.Item label="Store Keeper" value="2" />
   <Picker.Item label="Admin" value="3" />
</Picker>

<TextInput
placeholder= "Pin"
secureTextEntry
placeholderTextColor= 'rgba(255,255,255,0.7)'
returnKeyType= "go"
keyboardType = "numeric"
maxLength={4}
 style = {styles.input}
 ref={(input)=> this.passwordInput = input}
 onChangeText = {text => this.setState({pin: text})}
/>
<TouchableOpacity style={styles.buttonContainer} 
 onPress ={() => this.checkReg()} 
>
<Text style={styles.buttonText} >REGISTER</Text>

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
  }

});


export default withNavigation(regForm);