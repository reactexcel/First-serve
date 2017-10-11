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
    ListView,
    Image,
    TextInput,
    ScrollView,
    Picker,
    Platform,
    ToastAndroid,
    AlertIOS,
    Linking
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {StackNavigator, NavigationActions,} from 'react-navigation';

import * as Progress from 'react-native-progress';
import { HEXCOLOR } from "../styles/hexcolor.js";
import styles from "../styles/common.css";
import Database from "../firebase/database";
import RestaurantListItem from "./restaurant_list_item"
import DismissKeyboard from "dismissKeyboard";
import DefaultPreference from 'react-native-default-preference';
import FixWidthImage from "../components/fix_width_image"
import * as firebase from "firebase";
import Firestack from 'react-native-firestack';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager
} = FBSDK;

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
            currentTab: 0,
            pax: 2,
            mobile: '',
            isLoading:true,
            saved:false
        };

        this._setUserNoti = this._setUserNoti.bind(this);
        this._setMobile = this._setMobile.bind(this);
        this._setPax = this._setPax.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
        // start listening for firebase updates
        this.listenForRestaurants(this.restaurantRef);

        try {
            Database.listenUser(this.props.navigation.state.params.userId, (userSnap) => {
              let isRestaurantNotiOn = {};
              if(userSnap.val().restaurants_noti){
                var keys = Object.keys(userSnap.val().restaurants_noti);
                for(i = 0; i < keys.length; i++){
                  isRestaurantNotiOn[keys[i]] = userSnap.val().restaurants_noti[keys[i]].notiOn;
                }
              }
              if(userSnap.val().favourite_restaurants){
                var keys = Object.keys(userSnap.val().favourite_restaurants);
                for(i = 0; i < keys.length; i++){
                  this.state.favourites[keys[i]] = userSnap.val().favourite_restaurants[keys[i]].isFavourite;
                }
              }
              this.setState({
                isRestaurantNotiOn: isRestaurantNotiOn,
                favourites: this.state.favourites,
                notificationOn: userSnap.val().notiOn,
                mobile: userSnap.val().phone_number ? userSnap.val().phone_number : '',
                pax: userSnap.val().pax ? userSnap.val().pax : '0'
              });
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
      const buttonName = (this.state.saved  ? "Saved" : "Save Changes" )
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
                removeClippedSubviews={false}
                renderRow={this._renderItem.bind(this)}
                style={styles.listView}/>
          </View>}
          {this.state.currentTab == 1 && <View style={styles.container}>
            <Text>Pending</Text>
          </View>}
          {this.state.currentTab == 2 && <View style={styles.container}>
            <Text>Pending</Text>
          </View>}
          {this.state.currentTab == 3 && (this.state.isLoading ? <ScrollView keyboardDismissMode={'none'}>
            <View style={styles.container}>
              <View style={styles.navBar}>
                <TouchableHighlight
                  style={[styles.headingRight]}
                  onPress={() => this.logout(this, function(uh){
                    DefaultPreference.clearAll();
                    const resetAction = NavigationActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName: 'Home'})]
                    });
                    uh.props.navigation.dispatch(resetAction);
                  })}>
                  <View style={[styles.headingRight]}>
                    <Text style={{color: '#000', fontSize: 16, paddingRight: 10}}>Sign out</Text>
                    <Icon
                      name='sign-out'
                      type='octicon'
                      color='#000'/>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={[styles.rowContainer]}>
                <View style={[styles.avtarCircle]}>
                  <Image style={{position: 'absolute', width: 80, height: 80, borderRadius: 40}} source={{uri: this.props.navigation.state.params.photoUrl ? this.props.navigation.state.params.photoUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/both.jpg?alt=media&token=9c17e2cf-262f-4450-959a-91d8b109a6fe'}} />
                </View>
              </View>
              <View style={[styles.rowContainer, {paddingTop: 5}]}>
                <Text style={{color: '#626262', fontSize: 24}}>{this.props.navigation.state.params.name}</Text>
              </View>
              <View style={[styles.container, {flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 15}]}>
                <View style={[styles.rowContainer, styles.bottomTopBorder, {paddingTop: 5, justifyContent: 'flex-start'}]}>
                  <Icon
                    name='cutlery'
                    type='font-awesome'
                    color='#000'/>
                    <Text style={{color: '#626262', fontSize: 16, paddingLeft: 10}}>Table for</Text>
                        <Picker
                          style={{width:55,borderWidth:1}}
                          selectedValue={this.state.pax}
                          onValueChange={(itemValue, itemIndex) => this.setState({pax: itemValue})}>
                          <Picker.Item  label="0" value="0" />
                          <Picker.Item  label="1" value="1" />
                          <Picker.Item  label="2" value="2" />
                          <Picker.Item  label="3" value="3" />
                          <Picker.Item  label="4" value="4" />
                          <Picker.Item  label="5" value="5" />
                          <Picker.Item  label="6" value="6" />
                          <Picker.Item  label="7" value="7" />
                          <Picker.Item  label="8" value="8" />
                          <Picker.Item  label="9" value="9" />
                          <Picker.Item  label="10" value="10" />
                        </Picker>
                    <Text> people</Text>
                </View>
                <View style={[styles.rowContainer, styles.bottomBorder, {paddingTop: 5, justifyContent: 'flex-start'}]}>
                  <Icon
                    name='mobile'
                    type='font-awesome'
                    color='#000'/>
                    <TextInput
                        style={{color: '#626262', flex: 1, marginLeft: 15, marginRight: 150}}
                        onChangeText={(mobile) => this._setMobile(mobile)}
                        value={this.state.mobile}/>
                </View>
              </View>
              <View style={[{paddingTop: 15}]}>
                <View style={{marginLeft: 60, marginRight: 60}}>
                  <Button onPress={()=>{this.save()}} style={{backgroundColor: '#122438'}} textStyle={{color: '#FFF', fontSize: 18}}>
                    {buttonName}
                    </Button>
                  </View>
              </View>
            </View>
          </ScrollView>:<View style={{flex:1,justifyContent:'center',flexDirection:'column',alignItems:'center'}}><Progress.Circle size={30} indeterminate={true} /></View>)}
          <BottomNavigation
            labelColor={HEXCOLOR.pureWhite}
            rippleColor={HEXCOLOR.pureWhite}
            style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
            onTabChange={(newTabIndex) => this.tabChanged(newTabIndex)}
            activeTab={this.state.currentTab}>
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

    logout(th, callback){
      firestack.auth.signOut()
        .then(res => {
            LoginManager.logOut();
            callback(th, res);
        })
        .catch(err => {
          console.error('Uh oh... something weird happened')
        })
    }

    tabChanged(idx){
      console.log("currentTab", idx);
      this.setState({currentTab: idx});
    }

    _setUserNoti(val){
        Database.setUserNotiSetting(this.props.navigation.state.params.userId, val);
        this.setState({notificationOn: val});
    }

    _setPax(val){
        this.setState({pax: val});
    }

    _setMobile(val){
        this.setState({mobile: val});
    }

    save(){
      this.setState({isLoading:false,saved:true})
      if (this.state.mobile && this.state.pax) {
        Database.setUserData(this.props.navigation.state.params.userId, this.state.pax, this.state.mobile).then(()=>{
          this.setState({isLoading:true})
        });
      }else {
        this.setState({isLoading:true})
        if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Feild can not be empty ', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      } else if (Platform.OS === 'ios') {
        AlertIOS.alert('Feild can not be empty');
      }
      }
    }

    _renderItem(restaurant) {
        return (
            <RestaurantListItem restaurant={restaurant}
            isRestaurantNotiOn={this.state.isRestaurantNotiOn}
            favourites={this.state.favourites}
            isAdmin={false}
            openMap={this._openMapview.bind(this)}
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
    _openMapview(address){
      Linking.openURL('https://www.google.com/maps/search/?api=1&query='+ `${address}` );
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
