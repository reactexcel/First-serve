/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    Switch,
    View,
    StyleSheet,
    TouchableHighlight,
    ListView,
    Alert
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {StackNavigator, NavigationActions,} from 'react-navigation';

import styles from "../styles/admin.css";
import { HEXCOLOR } from "../styles/hexcolor.js";
import Database from "../firebase/database";
import RestaurantListItem from "./restaurant_list_item"
import DismissKeyboard from "dismissKeyboard";
import DefaultPreference from 'react-native-default-preference';
import * as firebase from "firebase";
import * as Helper from '../helper/helper';

console.log(Helper);
class AdminHome extends Component {
    static navigationOptions = {
        title: `${state.params.title}`,
        headerTitleStyle : styles.headerTitleStyle,
        headerStyle: styles.adminHeaderStyle
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
            isModalVisible: {},
            currentTab: 0
        };

        this._setUserNoti = this._setUserNoti.bind(this);
        this.logout = this.logout.bind(this);
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
              {this.state.currentTab == 0 && <ListView
                  dataSource={this.state.dataSource}
                  enableEmptySections={true}
                  removeClippedSubviews={false}
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listView}/>}
              {this.state.currentTab == 1 && <View style={styles.container}>
                <View style={{paddingRight: 10, paddingTop: 10}}>
                  <TouchableHighlight
                    style={[styles.headingRight]}
                    onPress={() => this.logout()}
                    underlayColor='#fff'>
                    <View style={[styles.headingRight, {flexDirection: 'row'}]}>
                      <Text style={{color: '#000', fontSize: 16, paddingRight: 10}}>Sign out</Text>
                      <Icon
                        name='sign-out'
                        type='octicon'
                        color='#000'/>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>}
              <BottomNavigation
                labelColor={HEXCOLOR.pureWhite}
                rippleColor={HEXCOLOR.pureWhite}
                style={styles.bottomNavigation}
                onTabChange={(newTabIndex) => this.tabChanged(newTabIndex)}
                activeTab={this.state.currentTab}>
                <Tab
                  barBackgroundColor={HEXCOLOR.endeavour}
                  label="Restaurants"
                  icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="restaurant" />}/>
                <Tab
                  barBackgroundColor={HEXCOLOR.endeavour}
                  label="Account"
                  icon={<Icon size={24} color={HEXCOLOR.pureWhite} name="account-circle" />}/>
              </BottomNavigation>
          </View>
        );
    }

    async logout(){
      try {
        await firebase.auth().signOut();
        DefaultPreference.clearAll();
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home'})]
        })
        this.props.navigation.dispatch(resetAction)
      } catch (error) {
        console.log(error);
      }
    }

    tabChanged(idx){
      console.log("currentTab", idx);
      const {setParams} = this.props.navigation;
      let title = "Restaurants";
      if(idx == 1){
        title = "Profile";
      }
      // UserHome.navigationOptions.title = "favorites";
      this.setState({currentTab: idx});
      setParams({ title: title });
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
            deleteRestaurant={this._deleteRestaurant.bind(this)}
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
      navigate('NERestaurant', { title: 'Edit Restaurant', userId: this.props.navigation.state.params.userId,
      isNew: false,
      restaurant: restaurant});
      this._setModalVisible(restaurant._key, false);
    }

    _deleteRestaurant(restaurant){
      const th = this;
      Alert.alert(
        'Delete Restaurant',
        'Are you sure?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {
            Database.deleteRestaurant(restaurant, function(res){
              if(res == 'error'){
                alert("Unable to delete restaurant. Please try again.");
              }else{
                  alert("Restaurant deleted.");
                  th._setModalVisible(restaurant._key, false);
              }
            });
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
      // dataSnapshot from firebase with a helper
      restaurantRef.on('value', (dataSnapshot) => {
        Helper.listenRestaurants(dataSnapshot).then((restaurants)=>{
          this.setState({
            restaurants: restaurants,
            dataSource: this.state.dataSource.cloneWithRows(restaurants)
          });
        })
      });
    }
}

module.exports = AdminHome;
