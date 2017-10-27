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
    TouchableOpacity
} from "react-native";
import {NavigationActions,} from 'react-navigation';
import React, {Component} from "react";
import * as firebase from "firebase";
import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Sae} from "react-native-textinput-effects";
import DismissKeyboard from "dismissKeyboard";
import DefaultPreference from 'react-native-default-preference';
import { HEXCOLOR } from "../styles/hexcolor.js";
import {Icon} from "react-native-elements";
import CommonStyle from "../styles/common.css";

class EmailLogin extends Component {
    static navigationOptions = {
        title: 'LOGIN AS RESTAURANT',
        headerTitleStyle: {marginLeft:-15,extAlign: 'center',fontSize:13,alignSelf: "center", color: 'white',fontWeight:'bold' },
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
            response: ""
        };

        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.unsubscribe = null;
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
            }, 1500);
        } catch (error) {
            this.setState({
                response: error.toString()
            })
        }
    }

    async login() {
        DismissKeyboard();
        const th = this;
        try {
          this.unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              console.log("No user is signed in: " + user.uid);
              let userMobilePath = "/users/" + user.uid;
              firebase.database().ref(userMobilePath).on('value', (snapshot) => {
                DefaultPreference.setMultiple({userType: 'restaurant', uid: user.uid});

                if (snapshot.exists() && snapshot.val().isAdmin) {
                  DefaultPreference.setMultiple({userType: 'admin', uid: user.uid});
                }

                th.props.navigation.state.params.unlistenForAuth();
                if (th.unsubscribe) {
                  th.unsubscribe();
                  th.unsubscribe = null;
                }
                console.log("user is signed in go back.");
                th.props.navigation.goBack('Home');
              });
            } else {
              console.log("No user is signed in.");
            }
          });
          await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
          this.setState({response: "Logged In!"});
        } catch (error) {
            this.setState({response: error.toString()})
        }
    }

    componentWillUnmount(){
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {DismissKeyboard()}}>
                <View style={CommonStyle.container}>
                    <View style={styles.formGroup}>
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
                            <View style={{margin:8}}/>
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
                    </View>
                    <View>
                        <Text style={styles.response}>{this.state.response}</Text>
                    </View>
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
