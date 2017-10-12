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
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';

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
          backgroundColor: '#98866F',
      },
      headerTintColor: '#FFF'
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
    };

    this.plus = this.plus.bind(this);
    this.minus = this.minus.bind(this);
    this.publishTable = this.publishTable.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount called publish table.");
  }

  componentWillUnmount(){
    console.log('componentWillUnmount publiish table');
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
      restaurantKey: this.state.restaurantKey,
      pax: this.state.people,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    };

    const th = this;

    Database.publishTable(table, function(res){
      console.log('Publish table', res);
      th.props.navigation.goBack();
    });
  }

  _showDateTimePicker = (openFor) => this.setState({ timePickerFor: openFor, isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({timePickerFor: 0, isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    if(this.state.timePickerFor == 1){
      this.setState({startTime: date.getTime()});
    }else if(this.state.timePickerFor == 2){
      this.setState({endTime: date.getTime()});
    }
    this._hideDateTimePicker();
  };

  render() {
    return (
      <View style={CommonStyle.container}>
        <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
          <Text style={{color: '#98866F'}}>Available table for</Text>
        </View>
        <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
          <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row'}]}>
            <TouchableHighlight
              onPress={() => this.minus()}
              underlayColor='#98866F'>
              <View style={[CommonStyle.rectangle, {width: 40, height: 40, flexDirection:'row'}]}>
                <Text style={{color: '#FFF', fontSize: 24}}>-</Text>
              </View>
            </TouchableHighlight>
            <View style={[CommonStyle.rectangle, {width: 120, height: 40, flexDirection:'row'}]}>
              <Text style={{color: '#98866F'}}>{this.state.people} people</Text>
            </View>
            <TouchableHighlight
              onPress={() => this.plus()}
              underlayColor='#98866F'>
              <View style={[CommonStyle.rectangle, {width: 40, height: 40, flexDirection:'row'}]}>
                <Text style={{color: '#FFF', fontSize: 24}}>+</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
          <TouchableHighlight
            onPress={() => this._showDateTimePicker(1)}
            underlayColor='#98866F'>
            <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row', borderColor: '#FFF'}]}>
              <Text style={{color: '#FFF', fontSize: 18}}>
                {this.state.startTime === 'SET START TIME' ? this.state.startTime : Moment(this.state.startTime).format('YYYY-MM-DD HH:mm')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
          <TouchableHighlight
            onPress={() => this._showDateTimePicker(2)}
            underlayColor='#98866F'>
            <View style={[CommonStyle.rectangle, {width: 200, height: 40, flexDirection:'row', borderColor: '#FFF'}]}>
              <Text style={{color: '#FFF', fontSize: 18}}>
                {this.state.endTime === 'SET END TIME' ? this.state.endTime : Moment(this.state.endTime).format('YYYY-MM-DD HH:mm')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          style={[CommonStyle.publish, {marginTop: 40}]}
          onPress={() => this.publishTable()}
          underlayColor='#fff'>
            <Text style={[CommonStyle.publishText]}>Publish</Text>
        </TouchableHighlight>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode='time'/>
      </View>
    );
  }
}
module.exports = PublishTable;