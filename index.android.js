import React, {Component, } from "react";

import {AppRegistry, Text, Image, View, StyleSheet, ActivityIndicator, NetInfo} from "react-native";
import {StackNavigator, NavigationActions,} from 'react-navigation';

import * as firebase from "firebase";
import * as Progress from 'react-native-progress';

import EmailLogin from "./src/views/email_login";
import UserHome from "./src/views/user_home";
import AdminHome from "./src/views/admin_home";
import RestaurantHome from "./src/views/restaurant_home";
import RestaurantSettings from "./src/views/restaurant_settings";
import NewEditRestaurant from "./src/views/new_edit_restaurant";
import PublishTable from "./src/views/publish_table";
import Firebase from "./src/firebase/firebase";
import DefaultPreference from 'react-native-default-preference';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import Firestack from 'react-native-firestack';
const firestack = new Firestack();

class Landing extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  constructor(props) {
    super(props);

    Firebase.initialise();

    this.state = {
      loading: true,
      userLoaded: false,
      firstServedView: null,
      isOnline: false
    };
    this.unsubscribe = null;
    this._unlistenForAuth = this._unlistenForAuth.bind(this);
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    this.unmountNetworkListner = this.unmountNetworkListner.bind(this);
  }

  componentWillMount(){
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      this.setState({isOnline: isConnected});
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    console.log('componentWillMount index');
    const th = this;

    DefaultPreference.getMultiple(['userType', 'uid', 'name', 'photoUrl']).then(function(value) {
      let restaurantPath = "/restaurants/" + value[1];
      firebase.database().ref(restaurantPath).once('value').then(function(child){
      var routeName = null;
      var title = "Restaurants";
      if(value[0] === 'user'){
        routeName = 'UHome';
      }else if (value[0] === 'restaurant') {
        child.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            title = childData.name;
        });
        routeName = 'RHome';
      }else if (value[0] === 'admin') {
        routeName = 'AHome';
      }
      if(routeName){
        console.log("componentWillMount routeName called.");
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: routeName,
            params: {
              title: title,
              userId: value[1],
              name: value[2],
              photoUrl: value[3]
            }
          })]
        })
        firestack.auth.unlistenForAuth();
        if (th.unsubscribe) {th.unsubscribe(); th.unsubscribe = null;}
        th.props.navigation.dispatch(resetAction);
      }else{
        console.log("componentWillMount not routeName called.");
        firestack.auth.listenForAuth(function(evt) {
          if (!evt.authenticated) {
            // console.error(evt.error)
          } else {
            console.log('User details', evt.user);
            let userMobilePath = "/users/" + evt.user.uid;
            firebase.database().ref(userMobilePath).on('value', (snapshot) => {
              if (snapshot.exists() && snapshot.val().isUser) {
                routeName = 'UHome';
                title = "Restaurants";
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({
                    routeName: routeName,
                    params: {
                      title: title,
                      userId: evt.user.uid,
                      photoUrl: evt.user.photoUrl,
                      name: evt.user.displayName
                    }
                  })]
                })
                firestack.auth.unlistenForAuth();
                if (th.unsubscribe) {
                  th.unsubscribe();
                  th.unsubscribe = null;
                }
                th.props.navigation.dispatch(resetAction)
              }
            })
          }
        }).then(() => console.log('Listening for authentication changes'))

        this.unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            let userMobilePath = "/users/" + user.uid;
            let restaurantPath = "/restaurants/" + user.uid;
            firebase.database().ref(userMobilePath).on('value', (snapshot) => {
              firebase.database().ref(restaurantPath).once('value').then(function(child){
                let routeName = null;
                let title = "Restaurants";
                child.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    title = childData.name;
                });
                if (snapshot.exists() && snapshot.val().isAdmin) {
                  console.log("AHome");
                  routeName = 'AHome';
                }else if (snapshot.exists() && snapshot.val().isRestaurantAdmin) {
                  routeName = 'RHome';
                  console.log("rhome");
                }
                if(routeName){
                  console.log("routeName",routeName);
                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: routeName, params: {userId: user.uid, title: title}})]
                  })
                  firestack.auth.unlistenForAuth();
                  if (th.unsubscribe) {
                    th.unsubscribe();
                    th.unsubscribe = null;
                  }
                  th.props.navigation.dispatch(resetAction)
                }
              });
            });
          }
        });
        th.setState({loading: false});
      }
    });
  });
  }

  componentDidMount(){
    console.log('componentDidMount index');
  }

  componentWillUnmount(){
    console.log('componentWillUnmount index');
    firestack.auth.unlistenForAuth();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unmountNetworkListner();
  }

  unmountNetworkListner(){
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange(isConnected) {
    console.log('Then, from listener is ' + (isConnected ? 'online' : 'offline'));
    this.setState({isOnline: isConnected});
  }

  render() {
    const { navigate } = this.props.navigation;
    if(this.state.loading){
      return (
        <View style={{flex:1,justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
          <Progress.Circle size={30} indeterminate={true} />
        </View>
      );
    }else if(!this.state.isOnline){
      return (
        <View style={styles.container}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.headerText}>We can’t seem to connect to the First Served network. Please check your internet connection.</Text>
          </View>
        </View>
      );
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.imageView}>
            <Image source={require('./src/images/restaurant.png')} />
          </View>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Restaurant Header Text</Text>
          </View>
          <View style={styles.fbButtonView}>
            <LoginButton
              readPermissions={["public_profile", "email"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                      firestack.auth.signInWithProvider('facebook', data.accessToken, '').then((user)=>{ // facebook will need only access token.
                        DefaultPreference.setMultiple({
                          userType: 'user',
                          uid: user.user.uid,
                          name: user.user.displayName,
                          photoUrl: user.user.photoUrl
                        });
                        let userMobilePath = "/users/" + user.user.uid;
                        firebase.database().ref(userMobilePath).update({
                            isUser: true,
                            name: user.user.displayName
                        });
                      })
                      console.log(data);
                    })
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("logout.")
              }}/>
          </View>
          <View style={styles.btnEmailLogin}>
            <Text onPress={() => {
              navigate('ELogin', { title: 'Login as restaurant', unlistenForAuth: this._unlistenForAuth })}
            }>Login as restaurant</Text>
          </View>
        </View>
      );
    }
  }

  _unlistenForAuth(){
    this.setState({loading: true});
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    imageView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fbButtonView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerTextView: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    btnEmailLogin: {
      flexDirection: 'row',
      justifyContent: 'center'
    }
});

const FirstServed = StackNavigator({
  Home: {screen: Landing},
  ELogin: { screen: EmailLogin },
  UHome: { screen: UserHome },
  RHome: { screen: RestaurantHome },
  AHome: { screen: AdminHome },
  NERestaurant: {screen: NewEditRestaurant},
  RSettings: {screen: RestaurantSettings},
  PTable: {screen: PublishTable}
});

AppRegistry.registerComponent("FirstServed", () => FirstServed);
