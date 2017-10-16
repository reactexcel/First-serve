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
    Linking,
    Modal
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
import FavourateItem from "./favourite_item"
import BookedItem from "./booked_item"
import AvailableTable from "./available_table"
import DismissKeyboard from "dismissKeyboard";
import DefaultPreference from 'react-native-default-preference';
import FixWidthImage from "../components/fix_width_image"
import * as firebase from "firebase";
import Firestack from 'react-native-firestack';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager
} = FBSDK;

const firestack = new Firestack();

class UserHome extends Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: `${state.params.title}`,
      headerTitleStyle: {alignSelf: 'center', color: 'white'},
      headerStyle: {
        backgroundColor: '#122438',
      }
    }
  };

  constructor(props) {
    super(props);
    this.restaurantRef = firebase.database().ref("/restaurants");

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const favoriteDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const bookedDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      userId: this.props.navigation.state.params.userId,
      isDataAdded: false,
      notificationOn: false,
      dataSource: dataSource,
      favoriteDataSource: favoriteDataSource,
      bookedDataSource: bookedDataSource,
      favourites: {},
      isNoFavourite: true,
      isNoBooked: true,
      restaurants: [],
      isLoadingRestaurants:true,
      isRestaurantNotiOn: {},
      isModalVisible: {},
      isBookingModelVisible: false,
      currentTab: 0,
      bookingRestaurantKey: '',
      bookingTable: {pax: 2, startTime: 1489829490000, endTime: 1489829490000},
      bookingRestaurant: {images: [], name: 'rsgdvad', booking_message: 'vad  waefa asf', address: 'kjnvkqwneu asjn aqwegj asg'},
      pax: 2,
      mobile: '',
      isLoading:true,
      saved:false,
      isModalVisibleForViewResurant:{},
      favouritesModal:false
    };

    this._setUserNoti = this._setUserNoti.bind(this);
    this._setMobile = this._setMobile.bind(this);
    this._setPax = this._setPax.bind(this);
    this.save = this.save.bind(this);
    this._setFavourite = this._setFavourite.bind(this);
    this.setBookingModalVisible = this.setBookingModalVisible.bind(this);
    this.book = this.book.bind(this);

    const th = this;
    const os = Platform.OS;
    FCM.on(FCMEvent.Notification, async (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        }
        // await someAsyncCall();
        var table = {
          restaurantKey: notif.restaurantKey,
          startTime: notif.startTime,
          endTime: notif.endTime,
          key: notif.tableId,
          pax: notif.pax
        };
        var bookingRestaurantKey = notif.restaurantKey;
        var rest = {images: [], name: '', booking_message: '', address: ''};
        for(i = 0; i < this.state.restaurants.length; i++){
          if(this.state.restaurants[i]._key == notif.restaurantKey){
            rest = this.state.restaurants[i];
            break;
          }
        }
        th.setState({bookingTable: table, bookingRestaurant: rest, bookingRestaurantKey: bookingRestaurantKey});
        // th.setBookingModalVisible(true);

        if(os ==='ios'){
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch(notif._notificationType){
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }
    });
    FCM.on(FCMEvent.RefreshToken, (token) => {
        console.log("RefreshToken", token)
        Database.setNotiId(th.state.userId, token);
        // fcm token may not be available on first load, catch it here
    });
  }

  componentWillMount() {
      // start listening for firebase updates
    this.listenForRestaurants(this.restaurantRef);

    try {
      Database.listenUser(this.state.userId, (userSnap) => {
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

        var keys = Object.keys(this.state.favourites);
        var favourites = [];
        for(i = 0; i < this.state.restaurants.length; i++){
          if(keys.indexOf(this.state.restaurants[i]._key) > -1) favourites.push(this.state.restaurants[i]);
        }

        var isLoadingRestaurants = true;
        if(this.state.restaurants.length > 0)   isLoadingRestaurants = false;
        var isNoFavourite = true;
        if(favourites.length > 0) isNoFavourite = false;
        this.setState({
          isNoFavourite: isNoFavourite,
          isLoadingRestaurants: isLoadingRestaurants,
          isRestaurantNotiOn: isRestaurantNotiOn,
          favourites: this.state.favourites,
          notificationOn: userSnap.val().notiOn,
          mobile: userSnap.val().phone_number ? userSnap.val().phone_number : '',
          pax: userSnap.val().pax ? userSnap.val().pax : '0',
          favoriteDataSource: this.state.favoriteDataSource.cloneWithRows(favourites)
        });
      });
      const th = this;
      this.ref = firebase.database().ref("tables");
      this.ref.orderByChild("bookedBy").equalTo(this.state.userId).on("value", function(snapshot) {
        var tables = [];
        snapshot.forEach((ch) => {
          tables.push({
            restaurantKey: ch.val().restaurantKey,
            startTime: ch.val().startTime,
            endTime: ch.val().endTime,
            pax: ch.val().pax,
            bookedBy: ch.val().bookedBy,
            key: ch.key,
          });
        });

        var bookedRestaurant = [];
        for(i = 0; i < tables.length; i++){
          var table = tables[i];
          for(j = 0; j < th.state.restaurants.length; j++){
            var restaurant = th.state.restaurants[j];
            if(table.restaurantKey == restaurant._key){
              bookedRestaurant.push({
               restaurant: restaurant,
               table: table
             });
            }
          }
        }

        var isNoBooked = true;
        if(bookedRestaurant.length > 0) isNoBooked = false;

        th.setState({
          isNoBooked: isNoBooked,
          bookedDataSource: th.state.bookedDataSource.cloneWithRows(bookedRestaurant)
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount(){
    const th = this;
    FCM.requestPermissions()
      .then(() => console.log('granted'))
      .catch(()=>console.log('notification permission rejected'));

    FCM.getFCMToken().then(token => {
        console.log(token)
        Database.setNotiId(th.state.userId, token);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
    });

    // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
    // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
    FCM.getInitialNotification().then(notif=>console.log(notif));
  }

  componentWillUnmount(){
    this.notificationListener.remove();
    this.restaurantRef.off('value');
    Database.listenUserStop();
    this.ref.orderByChild("bookedBy").equalTo(this.state.userId).off("value");
  }

  render() {
    console.log(this.state.isBookingModelVisible);
    const buttonName = (this.state.saved  ? "Saved" : "Save Changes" )
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isBookingModelVisible}
          onRequestClose={() => {this.setBookingModalVisible(false)}}>

          <AvailableTable
            restaurant={this.state.bookingRestaurant}
            table={this.state.bookingTable}
            setModalVisible={this.setBookingModalVisible}
            bookTable={this.book}/>
        </Modal>
        {this.state.currentTab == 0 && <View style={styles.container}>
          {/*<View style={[styles.notiView, styles.bottomBorder]}>
              <View style={styles.notiIconView}>
                  <Icon name='bell' type='font-awesome' color='#626262'/>
                  <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
              </View>

              <Switch
                  onValueChange={(value) => this._setUserNoti(value)}
                  value={this.state.notificationOn}/>
          </View>*/}
          {this.state.isLoadingRestaurants ?
            <View style={styles.midContainer}>
             <Text style={{fontSize: 20}}>Loading Restaurants .... </Text>
           </View>
           :
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            removeClippedSubviews={false}
            renderRow={this._renderItem.bind(this)}
            style={[styles.listView, {marginTop: 10}]}/>}
        </View>}
        {this.state.currentTab == 1 && <View style={styles.container}>
            {this.state.isNoFavourite ? <View style={styles.midContainer}>
              <Text style={{fontSize: 20}}>No Favourites</Text>
            </View>: <ListView
              dataSource={this.state.favoriteDataSource}
              enableEmptySections={true}
              removeClippedSubviews={false}
              renderRow={this._renderFavoriteItem.bind(this)}
              style={[styles.listView, {marginTop: 10}]}/>}
        </View>}
        {this.state.currentTab == 2 && <View style={styles.container}>
          {this.state.isNoBooked && <View style={styles.midContainer}>
            <Text style={{fontSize: 20}}>No Bookings</Text>
          </View>}
          {!this.state.isNoBooked && <ListView
            dataSource={this.state.bookedDataSource}
            enableEmptySections={true}
            renderRow={this._renderBookedItem.bind(this)}
            style={[styles.listView, {marginTop: 10}]}/>}
        </View>}
        {this.state.currentTab == 3 && (this.state.isLoading ?<ScrollView keyboardDismissMode={'none'}>
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
                    style={{width:80  ,borderWidth:1}}
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
                    keyboardType={'phone-pad'}
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
          labelColor="white"
          rippleColor="white"
          style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
          onTabChange={(newTabIndex) => this.tabChanged(newTabIndex)}
          activeTab={this.state.currentTab}>
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
    );
  }
    logout(th, callback){
      firestack.auth.signOut()
        .then(res => {
            LoginManager.logOut();
            callback(th, res);
        })
        .catch(err => {
          console.error('Uh oh... something weird happened error: ' + err);
        })
    }

    tabChanged(idx){
      console.log("currentTab", idx);
      const {setParams} = this.props.navigation;
      let title = "Restaurants";
      if(idx == 1){
        title = "Favourites";
      }else if (idx == 2) {
        title = "Bookings";
      }else if (idx == 3) {
        title = "Profile";
        this.setState({saved:false});
      }
      // UserHome.navigationOptions.title = "favorites";
      this.setState({currentTab: idx});
      setParams({ title: title });
    }

    _setUserNoti(val){
        Database.setUserNotiSetting(this.state.userId, val);
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
            setFavourite={this._setFavourite}
            isModelVisible={this.state.isModalVisible}
            setModalVisible={this._setModalVisible.bind(this)} />
        );
    }

    _renderFavoriteItem(restaurant) {
      return (
        <FavourateItem restaurant={restaurant}
        isRestaurantNotiOn={this.state.isRestaurantNotiOn}
        favourites={this.state.favourites}
        setValue={this._setValue.bind(this)}
        openMap={this._openMapview.bind(this)}
        isAdmin={false}
        isModelVisible={this.state.isModalVisibleForViewResurant}
        setModalVisible={this._setModalVisibleForViewResurant.bind(this)}
        setFavourite={this._setFavourite}/>
      );
    }

    _renderBookedItem(bookedTable) {
      return (
        <BookedItem
        restaurant={bookedTable.restaurant}
        table={bookedTable.table}
        favourites={this.state.favourites}
        setFavourite={this._setFavourite}/>
      );
    }

    _setValue(id, value){
        Database.setUserRestaurantNotiSetting(id, this.state.userId, value);
        this.state.isRestaurantNotiOn[id] = value;
        var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isRestaurantNotiOn: this.state.isRestaurantNotiOn,
          dataSource: source.cloneWithRows(this.state.restaurants)
        });
    }

    _setFavourite(id, value){
        Database.setUserFavourites(id, this.state.userId, value);
        this.state.favourites[id] = value;
        var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var keys = Object.keys(this.state.favourites);
        var favourites = [];
        for(i = 0; i < this.state.restaurants.length; i++){
          if(keys.indexOf(this.state.restaurants[i]._key) > -1 && this.state.favourites[this.state.restaurants[i]._key]) favourites.push(this.state.restaurants[i]);
        }

        var isNoFavourite = true;
        if(favourites.length > 0) isNoFavourite = false;
        this.setState({
          isNoFavourite: isNoFavourite,
          favourites: this.state.favourites,
          dataSource: source.cloneWithRows(this.state.restaurants),
          favoriteDataSource: this.state.favoriteDataSource.cloneWithRows(favourites)
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
    _setModalVisibleForViewResurant(id,value){

      var source = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var keys = Object.keys(this.state.favourites);
      var favourites = [];
      for(i = 0; i < this.state.restaurants.length; i++){
        if(keys.indexOf(this.state.restaurants[i]._key) > -1 && this.state.favourites[this.state.restaurants[i]._key]) favourites.push(this.state.restaurants[i]);
      }
      var isNoFavourite = true;
      if(favourites.length > 0) isNoFavourite = false;
      this.state.isModalVisibleForViewResurant[id] = value;
      this.setState({
        favoriteDataSource: source.cloneWithRows(favourites),
        isModalVisibleForViewResurant: this.state.isModalVisibleForViewResurant,
      });
      if (true) {

      }
    }
    _openMapview(address){
      Linking.openURL('https://www.google.com/maps/search/?api=1&query='+ `${address}` );
    }
    setBookingModalVisible(value){
      this.setState({isBookingModelVisible: value});
    }

    book(){
      const th = this;
      Database.bookTable(this.state.userId, this.state.bookingTable.key, function(isBooked){
        if(isBooked){
          alert("Your table has been booked.");
          th.setBookingModalVisible(false)
          th.setState({currentTab: 2});
        }else{
          alert("Sorry, Table already booked.");
          th.setState({isBookingModelVisible: false});
        }
        FCM.removeAllDeliveredNotifications();
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
        rest = {images: [], name: '', booking_message: '', address: ''};
        for(i = 0; i < restaurants.length; i++){
          if(restaurants[i]._key == this.state.bookingRestaurantKey){
            rest = restaurants[i];
            break;
          }
        }
        this.setState({
          restaurants: restaurants,
          bookingRestaurant: rest,
          dataSource: this.state.dataSource.cloneWithRows(restaurants)
        });
      });
    }
}

module.exports = UserHome;
