import React, {Component, } from "react";

import {AppRegistry, Text, Image, View, StyleSheet, ActivityIndicator} from "react-native";
import {StackNavigator, NavigationActions,} from 'react-navigation';

import * as firebase from "firebase";

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
      firstServedView: null
    };
    this.unsubscribe = null;
    this._unlistenForAuth = this._unlistenForAuth.bind(this);
  }

  componentWillMount(){
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
    SplashScreen.hide();
    console.log('componentDidMount index');
  }

  componentWillUnmount(){
    console.log('componentWillUnmount index');
    firestack.auth.unlistenForAuth();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    if(this.state.loading){
      return null;
    }else{
      return (
        <View style={styles.container}>
            <Image style={{ flex: 1, alignSelf: 'stretch',width: undefined,height: undefined}} source={require('./src/images/Background.jpg')} >
        <View style={{marginTop:60,marginBottom:60,marginLeft:20,marginRight:20,flex:1 ,backgroundColor:'white',opacity:0.8}}>
          <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
            <View style={{marginTop:55}}>
                <Image style={{width:160,height:75}}  source={require('./src/images/firstlogo.png')} />
            </View>
            <View style={{paddingLeft:45,paddingRight:45,justifyContent:'center',alignItems:'center'}} >
              <Text style={{fontSize:16.4,textAlign: 'center',color:'#122438'}}>
                The fastest and easiest way to get a table at a good restaurant today. FirstServed will give you an overview of the best restaurant in town.
              </Text>
            </View>
          <View style={styles.fbButtonView}>
            <LoginButton
              style={{height:35,width:220,backgroundColor:'black'}}
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
            <Text style={{color:'#122438',fontWeight:'bold'}} onPress={() => {
              navigate('ELogin', { title: 'Login as restaurant', unlistenForAuth: this._unlistenForAuth })}
            }>Login as restaurant</Text>
          </View>
        </View>
      </View>
        </Image>
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
