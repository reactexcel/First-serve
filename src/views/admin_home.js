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
            isModalVisible: {}
        };

        this._setUserNoti = this._setUserNoti.bind(this);
    }

    componentWillMount() {
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
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
          <View style={styles.container}>
              <View style={[styles.notiView, styles.bottomBorder]}>
                  <View style={styles.notiIconView}>
                      <Icon name='bell' type='font-awesome' color='#626262'/>
                      <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
                  </View>

                  <Switch
                      onValueChange={(value) => this._setUserNoti(value)}
                      value={this.state.notificationOn}/>
              </View>
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
            addRestaurant={this._addRestaurant.bind(this)}
            editRestaurant={this._editRestaurant.bind(this)}
            isAdmin={true}
            isRestaurantNotiOn={this.state.isRestaurantNotiOn}
            setValue={this._setValue.bind(this)}
            isModelVisible={this.state.isModalVisible}
            setModalVisible={this._setModalVisible.bind(this)} />
        );
    }

    _addRestaurant(){
      const { navigate } = this.props.navigation;
      navigate('NERestaurant', { title: 'Create Restaurant', userId: this.props.navigation.state.params.userId,
      restaurant: {fully_booked: true, images: [{imageUrl: 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234', primary: true, storageId: '493892473492'}, {imageUrl: 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234', primary: false, storageId: '493892473492'}]},})
    }

    _editRestaurant(restaurant){
      const { navigate } = this.props.navigation;
      navigate('NERestaurant', { title: restaurant.name })
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
                if(ch.val().images[key].primary){images << ch.val().images[key].imageUrl;}
              }
            }
            if(images.length == 0) images << 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234';
            restaurants.splice((restaurants.length), 0, {
              name: ch.val().name,
              type: ch.val().type,
              phone_number: ch.val().phone_number,
              short_description: ch.val().short_description,
              booking_message: ch.val().long_description,
              address: ch.val().address,
              website_url: ch.val().website_url,
              booking_url: ch.val().booking_url,
              instagram_url: ch.val().instagram_url,
              fully_booked: ch.val().fully_booked,
              images: images,
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
