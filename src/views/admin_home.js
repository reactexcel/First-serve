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

import styles from "../styles/common.css";
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
            isDataAdded: false,
            notificationOn: false,
            dataSource: dataSource,
            restaurants: [],
            isRestaurantNotiOn: {},
            isModalVisible: {}
        };

        this._setUserNoti = this._setUserNoti.bind(this);
    }

    componentDidMount() {
        // start listening for firebase updates
        this.listenForRestaurants(this.restaurantRef);

        try {
            // Listen for Mobile Changes
            Database.listenUserNotiSetting(this.props.navigation.state.params.userId, (notificationOn) => {
                this.setState({
                    notificationOn: notificationOn
                });
            });
            Database.listenUserRestaurantNotiSetting(this.props.navigation.state.params.userId, (restaurantNotiSnap) => {
              let isRestaurantNotiOn = {};
              if(restaurantNotiSnap.hasChildren()){
                restaurantNotiSnap.forEach((child) => {
                  isRestaurantNotiOn[child.key] = child.val().notiOn;
                });
              }
              this.setState({
                isRestaurantNotiOn: isRestaurantNotiOn
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
            isRestaurantNotiOn={this.state.isRestaurantNotiOn}
            setValue={this._setValue.bind(this)}
            isModelVisible={this.state.isModalVisible}
            setModalVisible={this._setModalVisible.bind(this)} />
        );
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
      debugger
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
        dataSnapshot.forEach((child) => {
            child.forEach((ch) => {
                let restaurantImageRef = firebase.database().ref("/restaurant_images/" + ch.key);
                restaurantImageRef.once('value').then(imageSnap => {
                  var images = [];
                  imageSnap.forEach((img) => {
                     images.push({imageUrl: img.val().image_url});
                  });
                  restaurants.push({
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

                  this.setState({
                    restaurants: restaurants,
                    dataSource: this.state.dataSource.cloneWithRows(restaurants)
                  });
                });
            });
        });
      });
    }
}

module.exports = AdminHome;
