/**
 * @class Home
 */

import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Switch,
    NetInfo
} from "react-native";

import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {StackNavigator, NavigationActions,} from 'react-navigation';
import DefaultPreference from 'react-native-default-preference';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';

import { HEXCOLOR } from "../styles/hexcolor.js";
import CommonStyle from "../styles/restaurant.css";
import Database from "../firebase/database";
import DismissKeyboard from "dismissKeyboard";
import {Icon} from "react-native-elements";
import * as firebase from "firebase";

class PublishTable extends Component {
  static navigationOptions = {
      title: 'Publish table',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: HEXCOLOR.lightBrown,
      },
      headerTintColor: HEXCOLOR.pureWhite
  };
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.navigation.state.params.userId,
      restaurantKey: this.props.navigation.state.params.restaurantKey,
      people: 2,
      isDateTimePickerVisible: false,
      timePickerFor: 0,
      startTime: 'SET START TIME',
      endTime: 'SET END TIME',
      isOnline: false
    };

    this.plus = this.plus.bind(this);
    this.minus = this.minus.bind(this);
    this.publishTable = this.publishTable.bind(this);
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    this.unmountNetworkListner = this.unmountNetworkListner.bind(this);
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      this.setState({isOnline: isConnected});
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    console.log("componentWillMount called publish table.");
  }

  componentWillUnmount(){
    console.log('componentWillUnmount publiish table');
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


  plus(){
    this.setState({people: (this.state.people + 1)});
  }

  minus(){
    if(this.state.people > 1) this.setState({people: this.state.people - 1});
  }

  publishTable(){
    if(this.state.startTime >= this.state.endTime){
      alert("Start time should be less than end time.");
      return;
    }
    var table = {
      restAdmin: this.state.userId,
      restaurantKey: this.state.restaurantKey,
      pax: this.state.people,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      isBooked: false,
      searchKey: this.state.restaurantKey + "_0"
    };

    const th = this;

    Database.publishTable(table, function(res){
      console.log('Publish table', res);
      th.props.navigation.goBack();
    });
  }

  _showDateTimePicker = (openFor) => {this.setState({ timePickerFor: openFor, isDateTimePickerVisible: true})};

  _hideDateTimePicker = () => this.setState({timePickerFor: 0, isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    if(this.state.timePickerFor == 1){
      var idealEndTime = Moment(date).add(2,'hours')
      this.setState({startTime: date.getTime(), endTime: idealEndTime._d.getTime() });
    }else if(this.state.timePickerFor == 2){
      this.setState({endTime: date.getTime()});
    }
    this._hideDateTimePicker();
  };

  render() {
    if(!this.state.isOnline){
      return (
        <View style={[CommonStyle.container, {padding: 10}]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[CommonStyle.headerText, {color: '#FFF'}]}>We can’t seem to connect to the First Served network. Please check your internet connection.</Text>
          </View>
        </View>
      );
    }else{
      return (
        <View style={{flex: 1,
    		backgroundColor: 'black'}}>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <Text style={{color: HEXCOLOR.lightBrown}}>Available table for</Text>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row'}]}>
              <TouchableHighlight
                onPress={() => this.minus()}
                underlayColor={HEXCOLOR.lightBrown}>
                <View style={[CommonStyle.rectangle, {width: 40, height: 40, flexDirection:'row'}]}>
                  <Text style={{color: HEXCOLOR.pureWhite, fontSize: 24}}>-</Text>
                </View>
              </TouchableHighlight>
              <View style={[CommonStyle.rectangle, {width: 120, height: 40, flexDirection:'row'}]}>
                <Text style={{color: HEXCOLOR.lightBrown}}>{this.state.people} people</Text>
              </View>
              <TouchableHighlight
                onPress={() => this.plus()}
                underlayColor={HEXCOLOR.lightBrown}>
                <View style={[CommonStyle.rectangle, {width: 40, height: 40, flexDirection:'row'}]}>
                  <Text style={{color: HEXCOLOR.pureWhite, fontSize: 24}}>+</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <TouchableHighlight
              onPress={() => this._showDateTimePicker(1)}
              underlayColor={HEXCOLOR.lightBrown}>
              <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row', borderColor: HEXCOLOR.pureWhite}]}>
                <Text style={{color: HEXCOLOR.pureWhite, fontSize: 18}}>
                  {this.state.startTime === 'SET START TIME' ? this.state.startTime : Moment(this.state.startTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <TouchableHighlight
              onPress={() => this._showDateTimePicker(2)}
              underlayColor={HEXCOLOR.lightBrown}>
              <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row', borderColor: HEXCOLOR.pureWhite}]}>
                <Text style={{color: HEXCOLOR.pureWhite, fontSize: 18}}>
                  {this.state.endTime === 'SET END TIME' ? this.state.endTime : Moment(this.state.endTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            style={[CommonStyle.publish, {marginTop: 40}]}
            onPress={() => this.publishTable()}
            underlayColor={HEXCOLOR.pureWhite}>
              <Text style={[CommonStyle.publishText]}>Publish</Text>
          </TouchableHighlight>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            is24Hour={true}
            mode='time'/>
        </View>
      );
    }
  }
}
module.exports = PublishTable;
