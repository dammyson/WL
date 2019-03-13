import React, { Component } from 'react';
import { StyleSheet,View, Text, ImageBackground, FlatList, AsyncStorage ,Image, ActivityIndicator, Dimensions,  TouchableOpacity } from 'react-native';
import { List, ListItem, SearchBar} from 'react-native-elements';
import { FontAwesome, AntDesign, Foundation } from '@expo/vector-icons';


class ProductList extends Component {
  static navigationOptions = {
    title: 'Products',
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
    const url = 'http://portal.bafsta.com.ng/api/products';
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
      const itemData = `${item.name.toUpperCase()} ${item.product_code.toUpperCase()}`;

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
          <Text>Loading products</Text>
        </View>
      );
    }

    if (!this.state.status) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No Product found at this time</Text>
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
        style={{paddingBottom:20}}
        data={this.state.data}
        renderItem={({ item }) => (
<TouchableOpacity
    activeOpacity={0.7}
      onPress={() => this.props.navigation.navigate('Landing', {
        ItemCode: item.product_code,
      
      })}
      >
          <ListItem
            title={<Text style = {styles.title}>{item.name }</Text>}
            subtitle={
             <View style={styles.subtitle}>
          <Text>{ item.product_code}</Text>
         
        </View>
            
            }
            leftAvatar={{ source: { uri: 'data:image/png;base64,'+item.base64image } } }
            containerStyle={{ borderBottomWidth: 0 }}
          />
     
</TouchableOpacity>
        )}
        keyExtractor={item => item.product_code}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
      />

<TouchableOpacity

          onPress={() => this.props.navigation.navigate('Transaction',
          {
            Transcac: this.state.transaction_id,
          
           
          }
        )}
          style={styles.TouchableOpacityStyle}>


<AntDesign name="shoppingcart" size={25} color="#ffffff" />
        
        </TouchableOpacity>

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
      fontSize:16,
      fontWeight: 'bold',

    },
    subtitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    TouchableOpacityStyle: {
      position: 'absolute',
      backgroundColor: 'red',
      width: 50,
      height: 50,
      padding:10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      right: 30,
      bottom: 100,
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

export default ProductList;