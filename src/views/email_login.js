/**
 * @class Login
 */

import {
    AppRegistry,
    TextInput,
    Text,
    View,
    StyleSheet,
    dismissKeyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image
} from "react-native";
import {NavigationActions,} from 'react-navigation';
import React, {Component} from "react";
import * as firebase from "firebase";
import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Sae} from "react-native-textinput-effects";
import DismissKeyboard from "dismissKeyboard";
import * as Progress from 'react-native-progress';
import DefaultPreference from 'react-native-default-preference';
import { HEXCOLOR } from "../styles/hexcolor.js";
import {Icon} from "react-native-elements";
import CommonStyle from "../styles/common.css";

class EmailLogin extends Component {
    static navigationOptions = {
        title: 'LOGIN AS RESTAURANT',
        headerTitleStyle: {marginLeft:-15,textAlign: 'center',fontSize:13,alignSelf: "center", color: 'white',fontWeight:'bold' },
        headerStyle: {
          marginBottom:-10,
          backgroundColor: '#023e4eff',
        },
        headerTintColor: 'white',
    };
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            response: "",
            isLoggedIn: false,
            process:false,
        };

        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }

    async signup() {
        DismissKeyboard();
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);

            this.setState({
                response: "account created"
            });

            setTimeout(() => {
                this.props.navigator.push({
                    name: "Home"
                })
                this.setState({process:false})
            }, 1500);
        } catch (error) {
            this.setState({
                response: error.toString()
            })
        }
    }

    async login() {
        this.setState({process:true})
        DismissKeyboard();
        const th = this;
        try {
          this.unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              if(th.state.isLoggedIn) return;
              th.setState({isLoggedIn: true})
              let userMobilePath = "/users/" + user.uid;
              let restaurantPath = "/restaurants/" + user.uid;
              let userP = firebase.database().ref(userMobilePath).once('value');
              let restP = firebase.database().ref(restaurantPath).once('value');
              Promise.all([userP, restP]).then(results => {
                let usr = results[0].val();
                let rest = results[1].val();
                let routeName = null;
                let title = "Restaurants";
                if(rest){
                  let keys = Object.keys(rest);
                  let key = keys[0];
                  rest = rest[key];
                  title = rest.name;
                }

                if (usr && usr.isAdmin) {
                  DefaultPreference.setMultiple({userType: 'admin', uid: user.uid, justSignIn: 'true'});
                  routeName = 'AHome';
                }else if (usr && usr.isRestaurantAdmin) {
                  DefaultPreference.setMultiple({userType: 'restaurant', uid: user.uid, justSignIn: 'true'});
                  routeName = 'RHome';
                  title = "Loading...";
                }

                if(routeName){
                  console.log("routeName",routeName);
                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: routeName, params: {userId: user.uid, title: title}})]
                  });
                  if (th.unsubscribe && th.unsubscribe()) {
                    th.unsubscribe = undefined;
                  }
                  console.log('=================== from email login');
                  th.props.navigation.dispatch(resetAction)
                }
              });
            }
          });
          await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
          this.setState({response: "Logged In!"});
        } catch (error) {
            this.setState({process:false,response: error.toString()})
        }
    }

    componentWillUnmount(){
      if(this.unsubscribe && this.unsubscribe()){
        this.unsubscribe = undefined;
      }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {DismissKeyboard()}}>
                <View style={CommonStyle.container}>
                    {!this.state.process ? <View style={styles.formGroup}>
                        <Sae
                            label={"Email Address"}
                            iconClass={FontAwesomeIcon}
                            iconName={"pencil"}
                            style={{borderBottomWidth:1,borderBottomColor:'#023e4eff'}}
                            labelStyle={{color:'#023e4eff'}}
                            iconColor={'#023e4eff'}
                            inputStyle={{color: '#023e4eff' }}
                            onChangeText={(email) => this.setState({email})}
                            keyboardType="email-address"
                            autoCapitalize="none"/>
                            <View style={{margin:8}}>
                            </View>
                        <Sae
                            label={"Password"}
                            iconClass={FontAwesomeIcon}
                            iconName={"key"}
                            style={{borderBottomWidth:1,borderBottomColor:'#023e4eff'}}
                            labelStyle={{color:'#023e4eff'}}
                            iconColor={'#023e4eff'}
                            inputStyle={{ color: '#023e4eff' }}
                            onChangeText={(password) => this.setState({password})}
                            password={true}
                            secureTextEntry={true}
                            autoCapitalize="none"/>

                        <View style={[styles.submit,{marginTop:30,flexDirection:'row',justifyContent:'center', alignItems:'center'}]}>
                            <Button onPress={this.login} style={[styles.buttons,{width:145,borderWidth:0,borderRadius:0,backgroundColor:'#023e4eff'}]} textStyle={{color:'white',fontSize: 15}}>
                                Login
                            </Button>
                        </View>
                        </View>:
                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                          <Progress.Circle size={30} indeterminate={true}  />
                        </View>
                      }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    formGroup: {
        padding: 50
    },
    title: {
        paddingBottom: 16,
        textAlign: "center",
        color: HEXCOLOR.black,
        fontSize: 35,
        fontWeight: "bold",
        opacity: 0.8,
    },
    submit: {
        paddingTop: 30
    },
    response: {
        textAlign: "center",
        paddingTop: 0,
        padding: 50
    }
});

module.exports = EmailLogin;
