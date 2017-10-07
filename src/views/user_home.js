/**
 * @class Home
 */

import React, {Component} from "react";
import {
    Text,
    Switch,
    View,
    StyleSheet,
    TouchableHighlight,
    ListView
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {StackNavigator, NavigationActions,} from 'react-navigation';

import { HEXCOLOR } from "../styles/hexcolor.js";
import styles from "../styles/common.css";
import Database from "../firebase/database";
import RestaurantListItem from "./restaurant_list_item"
import DismissKeyboard from "dismissKeyboard";
import DefaultPreference from 'react-native-default-preference';
import * as firebase from "firebase";
import Firestack from 'react-native-firestack';

const firestack = new Firestack();

class UserHome extends Component {
    static navigationOptions = {
        title: 'Restaurant',
        headerTitleStyle: {alignSelf: 'center', color: 'white'},
        headerStyle: {
            backgroundColor: HEXCOLOR.endeavour,
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
            favourites: {},
            isModalVisible: {},
            currentTab: 0
        };

        this._setUserNoti = this._setUserNoti.bind(this);
    }

    componentWillMount() {
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
          {this.state.currentTab == 0 && <View style={styles.container}>
            <View style={[styles.notiView, styles.bottomBorder]}>
                <View style={styles.notiIconView}>
                    <Icon name='bell' type='font-awesome' color={HEXCOLOR.lightGrey}/>
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
          </View>}
          {this.state.currentTab == 3 && <View style={styles.notiView}>
            <TouchableHighlight
              style={[styles.rowContainer, {paddingTop: 25}]}
              onPress={() => this.logout(function(){
                DefaultPreference.clearAll();
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Home'})]
                })
                this.props.navigation.dispatch(resetAction);
              })}>
                <View style={[styles.headingRight]}>
                  <Text style={{color: HEXCOLOR.black, fontSize: 16, paddingLeft: 10}}>Sign out</Text>
                  <Icon
                    name='sign-out'
                    type='octicon'
                    color={HEXCOLOR.black}/>
              </View>
            </TouchableHighlight>
          </View>}
          <BottomNavigation
            labelColor={HEXCOLOR.pureWhite}
            rippleColor={HEXCOLOR.pureWhite}
            style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
            onTabChange={(newTabIndex) => this.tabChanged(newTabIndex)}>
            <Tab
              barBackgroundColor={HEXCOLOR.endeavour}
              label="Restaurants"
              icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="restaurant" />}/>
            <Tab
              barBackgroundColor={HEXCOLOR.endeavour}
              label="Favourites"
              icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="favorite-border" />}/>
            <Tab
              barBackgroundColor={HEXCOLOR.endeavour}
              label="Bookings"
              icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="query-builder" />}/>
            <Tab
              barBackgroundColor={HEXCOLOR.endeavour}
              label="Account"
              icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="account-circle" />}/>
          </BottomNavigation>
        </View>
      );
    }

    logout(callback){
      firestack.auth.signOut()
        .then(res => {
          callback(res);
        })
        .catch(err => {
          console.error('Uh oh... something weird happened')
        })
    }

    tabChanged(idx){
      this.setState({currentTab: idx});
    }

    _setUserNoti(val){
        Database.setUserNotiSetting(this.props.navigation.state.params.userId, val);
        this.setState({notificationOn: val});
    }

    _renderItem(restaurant) {
        return (
            <RestaurantListItem restaurant={restaurant}
            isRestaurantNotiOn={this.state.isRestaurantNotiOn}
            favourites={this.state.favourites}
            isAdmin={false}
            setValue={this._setValue.bind(this)}
            setFavourite={this._setFavourite.bind(this)}
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
            restaurants.push({
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

module.exports = UserHome;
