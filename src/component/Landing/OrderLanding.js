import React, { Component } from 'react';
import { StyleSheet,View, Alert,Text, FlatList,ImageBackground, Dimensions ,ActivityIndicator,AsyncStorage, TouchableOpacity } from 'react-native';
import { List, ListItem, SearchBar} from 'react-native-elements';
import { FloatingAction } from 'react-native-floating-action';
import Loader from '../Loader/loader';

class OrderLanding extends Component {
  static navigationOptions = {
    title: 'Order Details',
  };

  constructor(props) {
    
    super(props);

    this.state = {
      loading: false,
      status: false,
      loadan: false,
      data: [],
      search: '',
      order_ID: '',
      transaction_id: '',
      sta:'',
      staName:'',
      userType:'',

      customer_name: '',
      customer_phone: '',
      seller_phone: '',
      quantity:'',
      total_amount:'',

       
    
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
   AsyncStorage.getItem('userType').then((value) => this.setState({'userType': value}))
 this.makeRemoteRequest();
   
this.setState({
  order_ID:this.props.navigation.getParam("order_id", "defaultValue")
})
  }

  makeRemoteRequest = () => {



    const url = 'http://portal.bafsta.com.ng/api/order/details/'+this.props.navigation.getParam("order_id", "defaultValue");
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
          customer_name: res.order_details.customer_name,
          customer_phone: res.order_details.customer_phone,
          seller_phone: res.order_details.seller_phone,
          quantity:res.order_details.quantity,
          total_amount:res.order_details.total_amount,
          sta: res.order_details.status,
        });
if(res.order_details.status == "0"){
  this.setState({
    staName: 'UNPAID'
  });
}else if(res.order_details.status == "1"){
  this.setState({
    staName: 'PAID'
  });
}else if(res.order_details.status == "2"){
  this.setState({
    staName: 'READY FOR PICK UP'
  });
}else if(res.order_details.status == "3"){
  this.setState({
    staName: 'DELIVERD'
  });
}else{
  this.setState({
    staName: 'CANNOT VERIFY STATUS'
  });
}



      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };



  Placechange = (current) =>{
 this.setState({ loadan: true})


  const {order_ID, sta} = this.state
  fetch('http://portal.bafsta.com.ng/api/status', { method: 'POST',  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  }, body: JSON.stringify({
  transaction_id: order_ID,
	status: current
  }), 
  })
  .then(res => res.json())
  .then(res => {
  
  if(res.status){
  
  this.setState({ loadan: false})
  Alert.alert('Success', res.message, [{text: 'Okay'}])
  
  this.setState({
    data: res.data,
    loadan: false,
    sta: res.order_details.status,
  });
if(res.order_details.status == "0"){
this.setState({
staName: 'UNPAID'
});
}else if(res.order_details.status == "1"){
this.setState({
staName: 'PAID'
});
}else if(res.order_details.status == "2"){
this.setState({
staName: 'READY FOR PICK UP'
});
}else if(res.order_details.status == "3"){
this.setState({
staName: 'DELIVERD'
});
}else{
this.setState({
staName: 'CANNOT VERIFY STATUS'
});
}








  
  }else{
    this.setState({ loadan: false})
  Alert.alert('Failed', res.message, [{text: 'Okay'}])
  
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
        const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()} ${item.product_code.toUpperCase()}`;

      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
        });
        this.setState({
      data: newData,
    });
  };

  renderHeader = () => {

    if(this.state.userType == "3"){
      if(this.state.sta == "0"){
        return (
          <View>
              <TouchableOpacity style={styles.buttonContainer} 
                onPress={() => this.Placechange("1")}
            >
            <Text style={styles.buttonText} >Confim payment</Text>
            </TouchableOpacity>
      
              </View>
          );
      
        }
    

    }else if(this.state.userType == "2" && this.state.sta !="0"){
      return (
        <View>
            <TouchableOpacity style={styles.buttonContainer} 
              onPress={() => this.Placechange('2')}
          >
          <Text style={styles.buttonText} >Ready for Pick up</Text>
          </TouchableOpacity>
    
            </View>
        );
    


    }
    return (
      <View>
         
          </View>
      );


  };


  render() {
    if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
            <Text>Loading Order</Text>
          </View>
        );
      }
  
      if (!this.state.status) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No Order found</Text>
          </View>
        );
      }
  


 
    return (
        <ImageBackground
        source={require('../../images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

        <View style = {styles.container}>
         <Loader
          loading={this.state.loadan} />



<View style={styles.userdetails} >
               
               <Text style={styles.textSub} >{'Seller Phone: '+this.state.seller_phone }</Text>
                <Text  style={styles.textSub} >{'Customers name: '+this.state.customer_name }</Text>
               <Text  style={styles.textSub} >{'Customer Phone: '+this.state.customer_phone }</Text>
            <Text  style={styles.textSub} >{'Ammount: '+this.state.total_amount }</Text>
            <Text  style={styles.textSub} >Status: { this.state.staName }</Text>
          


       </View>
           




          <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
          <TouchableOpacity
                >
          <ListItem
            title={<Text style = {styles.title}>{item.name }</Text>}
            subtitle={
             <View style={styles.subtitle}>
          <Text>{ item.product_code}</Text>
          <Text>{'Size:  '+item.size}</Text>
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


        

           
</View>

</ImageBackground>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:25,
      justifyContent: 'center',
    },

    
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
      },
    buttonContainer:{
        backgroundColor: "#fe0000",
        paddingVertical: 10,
        borderRadius: 10,
        flex: 1,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
      },

      buttonGreen:{
        backgroundColor: "#00ff00",
        paddingVertical: 10,
        borderRadius: 10,
        flex: 1,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
      },
      buttonText:{
            textAlign:'center',
            color: "#FFFFFF",
            fontWeight: '700'
      },
      userdetails : {
        margin:10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        
        padding:10
       
      },
      textSub: {
        display: 'flex',
        fontSize:15,
        fontWeight: 'bold',
        marginLeft:10
  
      },
  
    search: {
      backgroundColor: 'red',
     
    },
    title: {
      display: 'flex',
      color:'red',
      fontSize:16,
      fontWeight: 'bold',

    },
    subtitle: {
      flexDirection: 'row',
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
  

  });

export default OrderLanding;