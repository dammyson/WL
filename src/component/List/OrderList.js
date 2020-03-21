
import React, { Component } from 'react';
import { StyleSheet,View, Text, ImageBackground, FlatList, AsyncStorage ,Image, ActivityIndicator, Dimensions,  TouchableOpacity } from 'react-native';
import { List, ListItem, SearchBar} from 'react-native-elements';
import { FontAwesome, AntDesign, Foundation } from '@expo/vector-icons';


class OrderList extends Component {
  static navigationOptions = {
    title: 'Orders',
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      status: false,
      data: [],
      search: '',
      transaction_id:'',
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
    this.makeRemoteRequest();
    AsyncStorage.getItem('transID').then((value) => this.setState({'transaction_id': value}))
  }

  makeRemoteRequest = () => {
    const url = 'http://portal.bafsta.com.ng/api/orders';
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
  };

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
      const itemData = `${item.transaction_id.toUpperCase()} ${item.customer_name.toUpperCase()}`;

      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      
      <SearchBar
      style = {styles.search}
        placeholder="Type Here..."
        round
        value={this.state.search}
        onChangeText={this.searchFilterFunction}
      />
    );
  };



  render() {
    const { search } = this.state;

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
        <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
<TouchableOpacity
    activeOpacity={0.7}
      onPress={() => this.props.navigation.navigate('OrderLanding', {
        order_id: item.transaction_id,
      
      })}
      >
          <ListItem
            title={<Text style = {styles.title}>Txn  YEdID: {item.transaction_id.toUpperCase() }</Text>}
            subtitle={

              <View>
               
               
                <Text style={styles.textSub} >{'Seller Phone: '+item.seller_phone }</Text>
                 <Text  style={styles.textSub} >{'Customers name: '+item.customer_name }</Text>
                <Text  style={styles.textSub} >{'Customer Phone: '+item.customer_phone }</Text>
       

        <View style={styles.subtitle}>
             <Text  style={styles.textSub} >{'Ammount: '+item.total_amount }</Text>
              </View>


        </View>
            
            }
           
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
      justifyContent: 'center',
    },
    search: {
      backgroundColor: 'red',
     
    },
    title: {
      display: 'flex',
      color:'red',
      fontSize:20,
      fontWeight: 'bold',
      marginLeft:10

    },

    textSub: {
      display: 'flex',
      fontSize:15,
      fontWeight: 'bold',
      marginLeft:10

    },


    subtitle: {
      display: 'flex',
      flexDirection: 'row',
    },

    TouchableOpacityStyle: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
    },
   
    FloatingButtonStyle: {
      resizeMode: 'contain',
      width: 50,
      height: 50,
      //backgroundColor:'black'
    },

    backgroundImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },


  });

export default OrderList;