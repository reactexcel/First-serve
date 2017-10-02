/**
 * @class Home
 */

import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Switch
} from "react-native";

import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {StackNavigator, NavigationActions,} from 'react-navigation';
import DefaultPreference from 'react-native-default-preference';

import CommonStyle from "../styles/restaurant.css";
import Database from "../firebase/database";
import DismissKeyboard from "dismissKeyboard";
import {Icon} from "react-native-elements";
import * as firebase from "firebase";

class RestaurantSettings extends Component {
  static navigationOptions = {
      title: 'Restaurant Settings',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
        backgroundColor: '#98866F',
      },
      headerTintColor: '#FFF'
  };
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.navigation.state.params.userId,
      restaurantKey: '',
      isFullyBooked: false
    };

    this.logout = this.logout.bind(this);
    this.setFullyBooked = this.setFullyBooked.bind(this);
  }

  async logout() {
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

    componentWillMount() {
      console.log("componentWillMount called restaurant settings.");
      this.restaurantRef = firebase.database().ref("/restaurants/" + this.state.userId);
      this.restaurantRef.on('value', (dataSnapshot) => {
        restaurant = {};
        dataSnapshot.forEach((ch) => {
          restaurant = {
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
            _uid: dataSnapshot.key,
            _key: ch.key
          };
        });
        this.setState({restaurant: restaurant, restaurantKey: restaurant._key});
      })
    }

    componentWillUnmount(){
      console.log('componentWillUnmount restaurant home');
      this.restaurantRef.off();
    }

    setFullyBooked(isFullyBooked) {
      if(this.state.restaurantKey != ''){
        Database.setRestaurantFullyBooked(this.state.userId, this.state.restaurantKey, isFullyBooked);
        this.setState({isFullyBooked: isFullyBooked});
      }
    }

    render() {
        return (
          <View style={CommonStyle.container}>
            <TouchableHighlight
              onPress={() => this.logout()}>
              <View style={[CommonStyle.rowContainerLF, {paddingTop: 25}]}>
                <View style={[CommonStyle.headingRight]}>
                  <Icon
                    name='sign-out'
                    type='octicon'
                    color='#fff'/>
                  <Text style={{color: '#fff', fontSize: 16, paddingLeft: 10}}>Sign out</Text>
                </View>
              </View>
            </TouchableHighlight>

            <View style={[CommonStyle.rowContainerLF, {paddingTop: 25}]}>
              <View style={[CommonStyle.headingLeft]}>
                <Text style={{color: '#fff', fontSize: 24, paddingLeft: 10}}>Fully booked</Text>
              </View>
              <View style={[CommonStyle.headingRight]}>
                <Switch onValueChange={(value) => this.setFullyBooked(value)}
                  onTintColor="#fff"
                  style={{marginBottom: 10}}
                  thumbTintColor="#fff"
                  tintColor="#98866F"
                  value={this.state.isFullyBooked}/>
              </View>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    heading: {
        textAlign: "center"
    },
    logout: {
        padding: 50
    },
    form: {
        paddingTop: 50
    }
});

module.exports = RestaurantSettings;
