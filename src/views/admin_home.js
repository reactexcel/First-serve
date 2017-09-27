/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    Switch,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ListView
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'

import styles from "../styles/admin.css";
import Database from "../firebase/database";
import RestaurantListItem from "./restaurant_list_item"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";

class AdminHome extends Component {
    static navigationOptions = {
        title: 'Restaurant',
        headerTitleStyle :{alignSelf: 'center', color: 'white'},
        headerStyle:{
            backgroundColor: '#122438',
        }
    };

    constructor(props) {
        super(props);
        this.restaurantRef = firebase.database().ref("/restaurants");

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            notificationOn: false,
            dataSource: dataSource,
            restaurants: [],
            isRestaurantNotiOn: {},
            favourites: {},
            isModalVisible: {}
        };

        this._setUserNoti = this._setUserNoti.bind(this);
    }

    componentDidMount() {
        try {
            // start listening for firebase updates
            this.listenForRestaurants(this.restaurantRef);
            Database.listenUserNotiSetting(this.props.navigation.state.params.userId, (notificationOn) => {
              console.log("listenUserNotiSetting", "called");
                this.setState({
                    notificationOn: notificationOn
                });
            });

            Database.listenUserRestaurantNotiSetting(this.props.navigation.state.params.userId, (restaurantNotiSnap) => {
              console.log("listenUserRestaurantNotiSetting", "called");
              if(restaurantNotiSnap.hasChildren()){
                restaurantNotiSnap.forEach((child) => {
                  this.state.isRestaurantNotiOn[child.key] = child.val().notiOn;
                });
              }
              this.setState({
                isRestaurantNotiOn: this.state.isRestaurantNotiOn
              });
            });

            Database.listenUserFavourites(this.props.navigation.state.params.userId, (favouriteSnap) => {
              console.log("listenUserRestaurantNotiSetting", "called");
              if(favouriteSnap.hasChildren()){
                favouriteSnap.forEach((child) => {
                  this.state.favourites[child.key] = child.val().isFavourite;
                });
              }
              this.setState({
                favourites: this.state.favourites
              });
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
          <View style={styles.container}>
{/*              <View style={[styles.notiView, styles.bottomBorder]}>
                  <View style={styles.notiIconView}>
                      <Icon name='bell' type='font-awesome' color='#626262'/>
                      <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
                  </View>

                  <Switch
                      onValueChange={(value) => this._setUserNoti(value)}
                      value={this.state.notificationOn}/>
              </View>
*/}
              <ListView
                  dataSource={this.state.dataSource}
                  enableEmptySections={true}
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listView}/>
              <View style={styles.notiView}>
              <BottomNavigation
                labelColor="white"
                rippleColor="white"
                style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
                onTabChange={(newTabIndex) => console.log(`New Tab at position ${newTabIndex}`)}>
                <Tab
                  barBackgroundColor="#122438"
                  label="Restaurants"
                  icon={<Icon size={24} color="white" name="restaurant" />}/>
                <Tab
                  barBackgroundColor="#122438"
                  label="Favourites"
                  icon={<Icon size={24} color="white" name="favorite-border" />}/>
                <Tab
                  barBackgroundColor="#122438"
                  label="Bookings"
                  icon={<Icon size={24} color="white" name="query-builder" />}/>
                <Tab
                  barBackgroundColor="#122438"
                  label="Account"
                  icon={<Icon size={24} color="white" name="account-circle" />}/>
              </BottomNavigation>
              </View>
          </View>
        );
    }

    _setUserNoti(val){
        Database.setUserNotiSetting(this.props.navigation.state.params.userId, val);
        this.setState({notificationOn: val});
    }

    _renderItem(restaurant) {
        return (
            <RestaurantListItem restaurant={restaurant}
            newRestaurant={this._newRestaurant.bind(this)}
            editRestaurant={this._editRestaurant.bind(this)}
            isAdmin={true}
            isRestaurantNotiOn={this.state.isRestaurantNotiOn}
            setValue={this._setValue.bind(this)}
            favourites={this.state.favourites}
            setFavourite={this._setFavourite.bind(this)}
            isModelVisible={this.state.isModalVisible}
            setModalVisible={this._setModalVisible.bind(this)} />
        );
    }

    _newRestaurant(){
      const { navigate } = this.props.navigation;
      navigate('NERestaurant', { title: 'Create Restaurant', userId: this.props.navigation.state.params.userId,
      isNew: true,
      restaurant: {
        fully_booked: true,
        name: '',
        type: '',
        phone_number: '',
        short_description: '',
        long_description: '',
        booking_message: '',
        address: '',
        website_url: '',
        booking_url: '',
        instagram_url: '',
        images: []
      }})
    }

    _editRestaurant(restaurant){
      const { navigate } = this.props.navigation;
      navigate('NERestaurant', { title: 'Create Restaurant', userId: this.props.navigation.state.params.userId,
      isNew: false,
      restaurant: restaurant});
    }

    _deleteRestaurant(restaurant){
      Alert.alert(
        'Delete Restaurant',
        'Are you sure?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {

          }},
        ],
        { cancelable: false }
      )
    }

    _setValue(id, value){
        Database.setUserRestaurantNotiSetting(id, this.props.navigation.state.params.userId, value);
        this.state.isRestaurantNotiOn[id] = value;
        var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({
          isRestaurantNotiOn: this.state.isRestaurantNotiOn,
          dataSource: source.cloneWithRows(this.state.restaurants)
        });
    }

    _setFavourite(id, value){
        Database.setUserFavourites(id, this.props.navigation.state.params.userId, value);
        this.state.favourites[id] = value;
        var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({
          favourites: this.state.favourites,
          dataSource: source.cloneWithRows(this.state.restaurants)
        });
    }

    _setModalVisible(id, value){
      this.state.isModalVisible[id] = value;
      var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        isModalVisible: this.state.isModalVisible,
        dataSource: source.cloneWithRows(this.state.restaurants)
      });
    }

    listenForRestaurants(restaurantRef) {
      // listen for changes to the tasks reference, when it updates we'll get a
      // dataSnapshot from firebase
      restaurantRef.on('value', (dataSnapshot) => {
        // transform the children to an array
        var restaurants = [];
        var count = 0;
        restaurants.push({isAddButton: true});
        dataSnapshot.forEach((child) => {
          child.forEach((ch) => {
            var images = [];
            if(ch.val().images !== undefined){
              for (var key in ch.val().images) {
                var img = ch.val().images[key];
                images.splice((img.primary ? 0 : images.length), 0, {
                  imageUrl: img.imageUrl, storageId: key, primary: img.primary, fileName: img.fileName, uid: child.key, restaurantId: ch.key
                });
              }
            }

            restaurants.splice((restaurants.length), 0, {
              name: (ch.val().name ? ch.val().name : ''),
              type: (ch.val().type ? ch.val().type : ''),
              phone_number: (ch.val().phone_number ? ch.val().phone_number : ''),
              short_description: (ch.val().short_description ? ch.val().short_description : ''),
              long_description: (ch.val().long_description ? ch.val().long_description : ''),
              booking_message: (ch.val().booking_message ? ch.val().booking_message : ''),
              address: (ch.val().address ? ch.val().address : ''),
              website_url: (ch.val().website_url ? ch.val().website_url : ''),
              booking_url: (ch.val().booking_url ? ch.val().booking_url : ''),
              instagram_url: (ch.val().instagram_url ? ch.val().instagram_url : ''),
              fully_booked: ch.val().fully_booked,
              images: images,
              _uid: child.key,
              _key: ch.key
            });
          });
        });

        this.setState({
          restaurants: restaurants,
          dataSource: this.state.dataSource.cloneWithRows(restaurants)
        });
      });
    }
}

module.exports = AdminHome;
