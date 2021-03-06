import React, {Component, } from "react";

import {AppRegistry, Text, Image, View, StyleSheet, ActivityIndicator, NetInfo,Dimensions} from "react-native";
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
import SplashScreen from 'react-native-splash-screen'
var {height, width} = Dimensions.get('window');
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import Firestack from 'react-native-firestack';
const firestack = new Firestack();

class Landing extends Component {
  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }
  };
  constructor(props) {
    super(props);

    Firebase.initialise();

    this.state = {
      loading: true,
      userLoaded: false,
      firstServedView: null,
      isOnline: false,
      isLoggedIn: false,
      loginProgress:true
    };
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

    DefaultPreference.getMultiple(['userType', 'uid', 'name', 'photoUrl', 'justSignIn']).then(function(value) {
      let restaurantPath = "/restaurants/" + value[1];
      var routeName = null;
      var title = "Restaurants";
      if(value[0] === 'user'){
        routeName = 'UHome';
      }else if (value[0] === 'restaurant') {
        routeName = 'RHome';
        title = "Loading...";
      }else if (value[0] === 'admin') {
        routeName = 'AHome';
      }
      if(routeName){
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: routeName,
            params: {
              title: title,
              userId: value[1],
              name: value[2],
              photoUrl: value[3],
              isFirstTime: false
            }
          })]
        });
        firestack.auth.unlistenForAuth();
        console.log('=================== from index.android first not listener.');
        th.props.navigation.dispatch(resetAction);
      }else{
        console.log("componentWillMount not routeName called.");
        firestack.auth.listenForAuth(function(evt) {
          if (!evt.authenticated) {
            // console.error(evt.error)
          } else {
            console.log('User detailssdasdasdasdasdsadasdasdsadsadsadsa', evt.user);
            let userMobilePath = "/users/" + evt.user.uid;
            DefaultPreference.getMultiple(['userType', 'uid', 'name', 'photoUrl']).then(function(value) {
              if(value[0] === 'user') return;
              DefaultPreference.setMultiple({
                userType: 'user',
                uid: evt.user.uid,
                name: evt.user.displayName,
                photoUrl: evt.user.photoUrl
              });
              let userMobilePath = "/users/" + evt.user.uid;
              firebase.database().ref(userMobilePath).update({
                  isUser: true,
                  name: evt.user.displayName
              });

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
                    name: evt.user.displayName,
                    isFirstTime: true
                  }
                })]
              })
              firestack.auth.unlistenForAuth();
              th.setState({loginProgress:true})

              console.log('=================== from index.android');
              th.props.navigation.dispatch(resetAction)
            });
          }
        }).then(() => {
          console.log('Listening for authentication changes')
        });
        th.setState({loading: false});
      }
    });
  }

  componentDidMount(){
    SplashScreen.hide();
    console.log('componentDidMount index');
  }

  componentWillUnmount(){
    console.log('componentWillUnmount index');
    firestack.auth.unlistenForAuth();
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
            {this.state.loginProgress?<Image style={{ flex: 1, alignSelf: 'stretch',width: undefined,height: undefined}} source={require('./src/images/Background.jpg')} >
        <View style={{marginTop:60,marginBottom:60,marginLeft:20,marginRight:20,flex:1 ,backgroundColor:'white',opacity:0.8}}>
          <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
            <View style={{marginTop:55}}>
                <Image style={{width:160,height:75}}  source={require('./src/images/firstlogo.png')} />
            </View>
            <View style={{paddingLeft:45,paddingRight:45,justifyContent:'center',alignItems:'center'}} >
              <Text style={{fontSize:14.4,textAlign: 'center',color:'#122438'}}>
                The fastest and easiest way to get a table at a gourmet restaurant in Copenhagen today. FirstServed will send you notifications when tables become available at the restaurants of your choice – booking a table is first-come-first-served.
              </Text>
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
                      })
                      this.setState({loginProgress:false})
                    })
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("logout.")
              }}/>
          </View>
          <View style={styles.btnEmailLogin}>
            <Text style={{color:'#122438',fontWeight:'bold'}} onPress={() => {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({routeName: 'ELogin', params: {title: 'Login as restaurant'}})]
                })
                this.props.navigation.dispatch(resetAction)
              }
            }>Login as restaurant</Text>
          </View>
        </View>
      </View>
    </Image>:
    <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Progress.Circle size={30} indeterminate={true}  />
    </View>
  }
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
    },
    imageView: {
      flex:1,
    },
    fbButtonView: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerTextView: {
      justifyContent: 'center'
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    btnEmailLogin: {
      marginBottom:30,
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
