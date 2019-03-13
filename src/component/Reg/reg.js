import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView,  ImageBackground, Dimensions } from 'react-native';
import REGForm from './regForm';

export default class reg extends Component {
    constructor(){
        super()
        this.state={}
       
    }

  render() {
    return (
        <ImageBackground
        source={require('../../images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
      
  <View style = {styles.logoContainer}> 
<Image 
style={styles.logo}
source = {require('../../images/icon.png')}
/>

   </View>


  <View style = {styles.formContainer}>
    </View>
    <REGForm />
   
      </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer:{
  },
  logo:{
      width:100,
      height:100,
      justifyContent: 'center'
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: 30,
  }
,
title: {
    color: '#FFF',
    marginTop: 10,
    opacity: 0.6,
    fontSize:23 
}
});
