import React, {Component, } from "react";

import {AppRegistry, Text, Image, View, StyleSheet, ActivityIndicator} from "react-native";
import {StackNavigator, NavigationActions,} from 'react-navigation';

import * as firebase from "firebase";

import EmailLogin from "./src/views/email_login";
import UserHome from "./src/views/user_home";
import RestaurantHome from "./src/views/restaurant_home";
import Firebase from "./src/firebase/firebase";

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
      firstServedView: null
    };
  }

  componentWillMount(){
    const th = this;
    firestack.auth.listenForAuth(function(evt) {
      // evt is the authentication event
      // it contains an `error` key for carrying the
      // error message in case of an error
      // and a `user` key upon successful authentication
      if (!evt.authenticated) {
        // There was an error or there is no user
        // console.error(evt.error)
      } else {
        // evt.user contains the user details
        console.log('User details', evt.user);
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'UHome', params: {userId: evt.user.uid}})
          ]
        })
        th.props.navigation.dispatch(resetAction)
      }
    })
    .then(() => console.log('Listening for authentication changes'))
  }

  componentDidMount(){
    this.setState({
      loading: false
    })
  }

  componentWillUnmount(){
    firestack.auth.unlistenForAuth();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={styles.container}>
          <View style={styles.imageView}>
            <Image source={require('./src/images/restaurant.png')} />
          </View>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>sdgasdgasdg</Text>
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
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        firestack.auth.signInWithProvider('facebook', data.accessToken, '').then((user)=>{ // facebook will need only access token.
                          console.log(user);
                        })
                        console.log(data);
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("logout.")
              }}/>
          </View>
          <View style={styles.btnEmailLogin}>
            <Text onPress={() => navigate('ELogin', { title: 'Login as restaurant' })}>Login as restaurant</Text>
          </View>
        </View>
    );
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

const FirstServed = StackNavigator({ Home: {screen: Landing}, ELogin: { screen: EmailLogin }, UHome: { screen: UserHome }, RHome: { screen: RestaurantHome }, });

AppRegistry.registerComponent("FirstServed", () => FirstServed);
