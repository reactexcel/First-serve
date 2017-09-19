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
    TouchableWithoutFeedback
} from "react-native";
import {NavigationActions,} from 'react-navigation';
import React, {Component} from "react";
import * as firebase from "firebase";
import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Sae} from "react-native-textinput-effects";
import DismissKeyboard from "dismissKeyboard";

import CommonStyle from "../styles/common.css";

class EmailLogin extends Component {
    static navigationOptions = {
        title: 'Login as restaurant',
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
                let routeName = 'RHome';
                if (snapshot.exists() && snapshot.val().isAdmin) {
                  routeName = 'AHome';
                }
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: routeName, params: {userId: user.uid}})]
                })
                if (th.unsubscribe) {
                  th.unsubscribe();
                  th.unsubscribe = null;
                }
                th.props.navigation.dispatch(resetAction)
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
                            iconColor={"#98866F"}
                            inputStyle={{ color: '#98866F' }}
                            onChangeText={(email) => this.setState({email})}
                            keyboardType="email-address"
                            autoCapitalize="none"/>
                        <Sae
                            label={"Password"}
                            iconClass={FontAwesomeIcon}
                            iconName={"key"}
                            iconColor={"#98866F"}
                            inputStyle={{ color: '#98866F' }}
                            onChangeText={(password) => this.setState({password})}
                            password={true}
                            secureTextEntry={true}
                            autoCapitalize="none"/>

                        <View style={styles.submit}>
                            <Button onPress={this.login} style={styles.buttons} textStyle={{fontSize: 18}}>
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
        color: "#000",
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
