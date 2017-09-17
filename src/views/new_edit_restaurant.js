/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    Switch,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ListView
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'

import styles from "../styles/common.css";
import Database from "../firebase/database";
import RestaurantListItem from "./restaurant_list_item"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";

class AdminHome extends Component {
  static navigationOptions = {
      title: 'New Restaurant',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: '#122438',
      }
  };
  constructor(props) {
      super(props);
      this.restaurantRef = firebase.database().ref("/restaurants");

      this.state = {
          restaurant: {}
      };
  }

  componentWillMount() {
  }

  componentWillUnmount(){
  }

  render() {
      return (
        return (
          <TouchableWithoutFeedback onPress={() => {DismissKeyboard()}}>
              <View style={CommonStyle.container}>
                  <View style={styles.formGroup}>
                      <Text style={styles.title}>First Served</Text>
                      <Sae
                          label={"Restaurant Name"}
                          iconClass={FontAwesomeIcon}
                          iconName={"pencil"}
                          iconColor={"white"}
                          onChangeText={(name) => this.setState({name})}
                          keyboardType="default"
                          autoCapitalize="none"/>
                      <Sae
                          label={"Email Address"}
                          iconClass={FontAwesomeIcon}
                          iconName={"pencil"}
                          iconColor={"white"}
                          onChangeText={(email) => this.setState({email})}
                          keyboardType="email-address"
                          autoCapitalize="none"/>
                      <Sae
                          label={"Password"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(password) => this.setState({password})}
                          password={true}
                          secureTextEntry={true}
                          autoCapitalize="none"/>

                      <Sae
                          label={"Confirm Password"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                          password={true}
                          secureTextEntry={true}
                          autoCapitalize="none"/>

                      <Sae
                          label={"Address"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(address) => this.setState({address})}
                          keyboardType="default"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Phone Number"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(phone_number) => this.setState({phone_number})}
                          keyboardType="phone-pad"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Website"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(website_url) => this.setState({website_url})}
                          keyboardType="url"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Link to Instagram"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(instagram_url) => this.setState({instagram_url})}
                          keyboardType="url"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Restaurant Kitchen Type"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(type) => this.setState({type})}
                          keyboardType="default"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Booking URL"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(booking_url) => this.setState({booking_url})}
                          keyboardType="url"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Short Description"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(short_description) => this.setState({short_description})}
                          keyboardType="default"
                          autoCapitalize="none"/>

                      <Sae
                          label={"Short Description"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(short_description) => this.setState({short_description})}
                          keyboardType="default"
                          multiline={true}
                          numberOfLines={4}
                          autoCapitalize="none"/>

                      <Sae
                          label={"Long Description"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(long_description) => this.setState({long_description})}
                          keyboardType="default"
                          multiline={true}
                          numberOfLines={8}
                          autoCapitalize="none"/>

                      <Sae
                          label={"Booking Message"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(booking_message) => this.setState({booking_message})}
                          keyboardType="default"
                          multiline={true}
                          numberOfLines={4}
                          autoCapitalize="none"/>

                      <Sae
                          label={"Price Range"}
                          iconClass={FontAwesomeIcon}
                          iconName={"key"}
                          iconColor={"white"}
                          onChangeText={(price_range) => this.setState({price_range})}
                          keyboardType="default"
                          autoCapitalize="none"/>

                      <View style={styles.submit}>
                          <Button onPress={this.save} style={CommonStyle.buttons} textStyle={{fontSize: 18}}>
                              Save
                          </Button>
                          <Button onPress={this.cancel} style={styles.buttons} textStyle={{fontSize: 18}}>
                              Cancel
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
