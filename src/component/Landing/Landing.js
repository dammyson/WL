import React, {Component} from 'react';
import { StyleSheet, KeyboardAvoidingView,FlatList, ScrollView, Alert,AsyncStorage, ActivityIndicator, Text, View, Image,ImageBackground, Dimensions, TextInput,TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { FontAwesome, AntDesign, Foundation } from '@expo/vector-icons';
import Loader from '../Loader/loader';

export default class Landing extends Component {
  static navigationOptions = {
    title: 'Product Details',
  };
  constructor(){
  super()


  this.state={
    loadan: false,
    userLevel: 1,
    ItemCode: '',
    ItemName: '',
    ItemPrice: '',
    Size: '',
    Quantity:'',
    image: '',
    loading: false,
    phone:'',
    add_quantity:'',
    transaction_id:'',
    input:'',
    data: [],
    shareholders: []
  }

}




componentDidMount = () =>{ 
  this.setState({
    ItemCode:  this.props.navigation.getParam("ItemCode", "defaultValue"),
  });
  this.makeRemoteRequest();
  AsyncStorage.getItem('phone').then((value) => this.setState({'phone': value}))
  AsyncStorage.getItem('transID').then((value) => this.setState({'transaction_id': value}))
}



AddtoCart(){
  this.setState({ loadan: true})
  const {ItemCode, phone, transaction_id, shareholders} = this.state

  fetch('http://portal.bafsta.com.ng/api/order', { method: 'POST',  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  }, body: JSON.stringify({
    product_code: ItemCode,
    seller_phone: phone,
    transaction_id: transaction_id,
    products: shareholders,

  }), 
  })
  .then(res => res.json())
  .then(res => {

  if(res.status){

  this.setState({ loadan: false})
  Alert.alert('Success', res.message, [{text: 'Okay'}])
  this.props.navigation.navigate('ProductsList')


  }else{
    this.setState({ loadan: false})
  Alert.alert('Operation failed', res.message, [{text: 'Okay'}])

  }
  })


          
}



makeRemoteRequest = () => {
 


  const url = 'http://portal.bafsta.com.ng/api/products_details/'+ this.props.navigation.getParam("ItemCode", "defaultValue")

  
  this.setState({ loading: true });

  fetch(url, { method: 'GET',  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  } }
  
  )
    .then(res => res.json())
    .then(res => {

      this.setState({
        ItemName:res.data[0].name,
        ItemPrice:res.data.amount,
        Size: res.data.size,
        Quantity: res.data.avail_qty,
        image: res.data.base64image,
        data:res.data,

        loading: false,
      });
     

    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
};



onchange = (e, i) =>{

  
 this.state.shareholders.push({ quantity: i,  size: e, });

console.warn(this.handleCheck(e))
}

handleCheck(val) {
  
  return this.state.shareholders.some(item => val === item.size);

 }


render() {


  if (this.state.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }



return (
<ImageBackground
source={require('../../images/background.png')}
style={styles.backgroundImage}
resizeMode="cover"
>
<Loader
          loading={this.state.loadan} />



<ScrollView>

            <KeyboardAvoidingView behavior="padding" style = {styles.container}> 

            <View style={styles.up}>
            <Image 
            style={styles.productImage}
            source={{uri: 'data:image/png;base64,'+this.state.image}}
            PlaceholderContent={<ActivityIndicator />}
            />

            </View>
            <View style={styles.mid}>


            <Card
            style={styles.cardView}
            >
            <View style={styles.cardView}>

            <Text style={styles.cardText} >{this.state.ItemName}</Text>
            <View style={styles.addcart}>


<View style={styles.detailsContainer}>
       <Text style={styles.headText} >Size </Text>
       <Text style={styles.headText} >available qty</Text>
       <Text style={styles.headText} >desired qty</Text>
       <Text style={styles.headText} >Price</Text>

         </View>
         <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    margin:5
  }}
/>
      



         <FlatList
        style={{paddingBottom:20}}
        data={this.state.data}
        renderItem={({ item }) => (
          <View style={styles.detailsContainer}>
          <Text style={styles.headText} >{item.size}</Text>
          <Text style={styles.headText} >{item.quantity}</Text>
   
          <View style={styles.conput}>       
          <TextInput
               placeholder= "qty"
               placeholderTextColor= 'rgba(255,255,255,0.7)'
               returnKeyType= "go"
               keyboardType = "numeric"
               maxLength={3}
               style = {styles.input}
               ref={(b)=> {this.add_quantity = b}}
               onChangeText = {(e) => {this.onchange(item.size, e)}}
               />
   </View>
   <Text style={styles.headText} >N:{item.amount}</Text>
            </View>

        )}
        keyExtractor={item => item.size}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
      />




            <TouchableOpacity style={styles.buttonContainer} 
            onPress={() => this.AddtoCart()}
            >
            <Text style={styles.buttonText} >Add to Cart</Text>

            </TouchableOpacity>
            </View>
            </View>
            </Card>
            </View>


            </KeyboardAvoidingView>

            </ScrollView>

</ImageBackground>
);
}
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
mid:{
  flex:1,
  flexDirection: "row"
 
},

headText:{
  flex: 1,
  textAlign:'center',
  color: "#fe0000",
  fontWeight: '700',
  marginLeft:20
},
conput:{
  flex:1,
  marginRight:10
} ,
detailsContainer: {
    flex: 7,
    flexDirection: "row",
    alignItems: 'center',
  justifyContent: 'center',
  marginTop:10
  },
buttonContainer:{
  backgroundColor: "#fe0000",
  paddingVertical: 10,
  borderRadius: 20,
  marginLeft:30,
  marginRight:30,
  marginTop:20,
},
buttonText:{
      textAlign:'center',
      color: "#FFFFFF",
      fontWeight: '700'
},
input:{
  height:40,
  width:50,
  backgroundColor: 'rgba(255, 0, 0, 0.4)',
  marginBottom:10,
  color: '#FFF',
  paddingHorizontal: 10,
  borderRadius: 10,
  marginLeft:30,
  marginRight:30,


},
backgroundImage: {
width: Dimensions.get('window').width,
height: Dimensions.get('window').height,
paddingHorizontal: 10,
},


up:{
  flex:1,
  alignItems: 'center',
  justifyContent: 'center',
},
  mid:{
  flex:3,
  flexDirection: "row",
  alignItems: 'center',
  justifyContent: 'center',
},


add:{
  width:60,
  height:60,
},


cardText:{
  textAlign:'center',
  color: "black",
  fontWeight: '700'
},

cardView:{
  width: Dimensions.get('window').width,
marginBottom:100,
paddingRight:20
},
row:{
  flex:1,
  alignItems: 'center',
  margin:1
  
},

productImage:{
    margin:60,
    height:100,
    width:280,
    justifyContent: 'center'
},

});