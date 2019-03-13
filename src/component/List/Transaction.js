import React, { Component } from 'react';
import { StyleSheet,View, Text, FlatList,Alert, ImageBackground, Dimensions, TextInput,KeyboardAvoidingView, ActivityIndicator,AsyncStorage, TouchableOpacity } from 'react-native';
import {Card, List, ListItem, SearchBar} from 'react-native-elements';
import { FloatingAction } from 'react-native-floating-action';
import Loader from '../Loader/loader';


class Transaction extends Component {
  static navigationOptions = {
    title: 'Current Cart',
  };
  constructor(props) {
    
    super(props);

    this.state = {
      loading: false,
      status: false,
      loadan: false,
      data: [],
      search: '',
      transaction_id: '',
      Sphone: '',
      Cphone: '',
      customer_name:'',
    
    };

   this.arrayholder = [];


   const actions = [{
    text: 'Accessibility',
    name: 'bt_accessibility',
    position: 2
  }];

  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  componentDidMount() {
   AsyncStorage.getItem('transID').then((value) => this.setState({'transaction_id': value}))
   AsyncStorage.getItem('phone').then((value) => this.setState({'Sphone': value}))
   this.makeRemoteRequest();
   


  }

  makeRemoteRequest = () => {
    AsyncStorage.getItem('transID').then((value) => {
      if(value !== null){
        const url = 'http://portal.bafsta.com.ng/api/order/precart/'+value;
        this.setState({ loading: true });
    
        fetch(url, { method: 'GET',  headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        } }
        
        )
          .then(res => res.json())
          .then(res => {
             
            this.setState({
              data: res.data,
              loading: false,
              status: res.status,
              
            });
            this.arrayholder = res.data;
          })
          .catch(error => {
            this.setState({ error, loading: false });
          
          });

    

       }else{
         this.setState({ dialogVisible: true });
       }
       
  
  });



    

      
  };



  PlaceOrder(){
  const {Cphone, customer_name, Sphone, transaction_id} = this.state
  this.setState({ loadan: true})
  fetch('http://portal.bafsta.com.ng/api/order/complete', { method: 'POST',  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  }, body: JSON.stringify({
    transaction_id: transaction_id,
    seller_phone: Sphone,
    customer_name: customer_name,
    customer_phone: Cphone,
  }), 
  })
  .then(res => res.json())
  .then(res => {
  
  if(res.status){
  AsyncStorage.setItem('transID', "");
  AsyncStorage.removeItem('transID');
  this.setState({ loadan: false})
  Alert.alert('Success', res.message, [{text: 'Okay'}])
  this.props.navigation.navigate('ProductsList')
  AsyncStorage.setItem('transID', "");
  
  
  }else{
    this.setState({ loadan: false})
  Alert.alert('Operation Failed', res.message, [{text: 'Okay'}])
  
  }
  })
  
  
            
  }



  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#fe0000',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = search => {
        this.setState({ search });
        console.log(this.arrayholder);
        const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()} ${item.product_code.toUpperCase()}`;

      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
        });
        this.setState({
      data: newData,
    });
  };


  render() {
    const { search } = this.state;
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text>Loading Cart</Text>
        </View>
      );
    }

    if (!this.state.status) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Your Cart is empty </Text>
        </View>
      );
    }


    return (
      <ImageBackground
      source={require('../../images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Loader
          loading={this.state.loadan} />

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Landing', {
                ItemCode: item.product_code,
            
            })}
                >
          <ListItem
            title={<Text style = {styles.title}>{item.name }</Text>}
            subtitle={
             <View style={styles.subtitle}>
          <Text>{ item.product_code}</Text>
          <Text>{'Size:  '+item.size}</Text>
          <Text>{'Qty: '+item.quantity}</Text>
          <Text>{'N'+item.amount}</Text>
             </View>
            
            }
            leftAvatar={{ source: { uri: 'data:image/png;base64,'+item.base64image } } }
            containerStyle={{ borderBottomWidth: 0 }}
          />
     
            </TouchableOpacity>
            )}
            keyExtractor={item => item.id+"rf"}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
      />


 <View style={styles.cardView}>

            <TextInput
            placeholder= "Customer Name"
            placeholderTextColor= 'rgba(255,255,255,0.7)'
            returnKeyType = "next"
            onSubmitEditing = {() => this.cusphone.focus()}
            autoCapitalize= "none"
            autoCorrect = {false}
            style = {styles.input}
            onChangeText = {text => this.setState({customer_name: text})}
            />
            <TextInput
            placeholder= "Phone"
            placeholderTextColor= 'rgba(255,255,255,0.7)'
            returnKeyType= "go"
            keyboardType = "numeric"
            maxLength={15}
            style = {styles.input}
            ref={(input)=> this.cusphone = input}
            onChangeText = {text => this.setState({Cphone: text})}
            />


            <TouchableOpacity style={styles.buttonContainer} 
            onPress={() => this.PlaceOrder()}
            >
            <Text style={styles.buttonText} >Complete Transaction</Text>

            </TouchableOpacity>
            </View>

 </KeyboardAvoidingView>

 </ImageBackground>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:23,
      justifyContent: 'center',
    },
    search: {
      backgroundColor: 'red',
     
    },
    cardView:{
    marginBottom:100
    },
    title: {
      display: 'flex',
      color:'red',
      fontSize:16,
      fontWeight: 'bold',

    },
    backgroundImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      paddingHorizontal: 10,
      },
      
    subtitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
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
        marginBottom:10,
      },
      buttonText:{
            textAlign:'center',
            color: "#FFFFFF",
            fontWeight: '700'
      },
      page: {
        display: 'flex',
        color:'red',
        fontSize:26,
        fontWeight: 'bold',
  
      },

  });

export default Transaction;