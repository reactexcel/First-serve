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
    NetInfo,
    Dimensions,
    Platform
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
const { width, height } = Dimensions.get('window');

class PublishTable extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'PUBLISH TABLE',
      headerRight: <Icon style={{marginRight:10}} size={19}  name='close' onPress={() => params.handleSave()} type='font-awesome' color='white'/>,
      headerTitleStyle: {fontSize:12,alignSelf: 'center', color: 'white',fontWeight:'bold',marginLeft:22 },
      headerStyle:{
          backgroundColor: '#023e4eff',
      },
      headerTintColor: '#023e4eff'
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.navigation.state.params.userId,
      restaurantKey: this.props.navigation.state.params.restaurantKey,
      people: 2,
      isDateTimePickerVisible: false,
      timePickerFor: 0,
      startTime: 'Set start time',
      endTime: 'Set end time',
      isOnline: false
    };

    this.plus = this.plus.bind(this);
    this.minus = this.minus.bind(this);
    this.publishTable = this.publishTable.bind(this);
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    this.unmountNetworkListner = this.unmountNetworkListner.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.handleClose });
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
  handleClose(){
    this.props.navigation.dispatch(NavigationActions.back())
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
    console.log(this.props);
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
    		backgroundColor: HEXCOLOR.pureWhite,}}>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 50}]}>
            <Text style={{fontSize:13,color: '#023e4eff'}}>Table available for :</Text>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <View style={[CommonStyle.rectangle, {width: (Platform.OS === 'ios'?null:210), height: (Platform.OS === 'ios'?null:38), flexDirection:'row'}]}>
              <TouchableHighlight
                onPress={() => this.minus()}
                underlayColor={HEXCOLOR.lightBrown}>
                <View style={[CommonStyle.rectangle, {width: 55, height: 45, flexDirection:'row'}]}>
                  <Text style={{marginLeft:12,marginBottom:7,color: '#023e4eff', fontSize: 44}}>-</Text>
                </View>
              </TouchableHighlight>
              <View style={[CommonStyle.rectangle, {borderLeftWidth:0,width: 125, height: 45, flexDirection:'row',borderRightWidth:0}]}>
                <Text style={{color: '#023e4eff'}}>{this.state.people} people</Text>
              </View>
              <TouchableHighlight
                onPress={() => this.plus()}
                underlayColor={HEXCOLOR.lightBrown}>
                <View style={[CommonStyle.rectangle, {width: 55, height: 45, flexDirection:'row'}]}>
                  <Text style={{marginBottom:4,marginRight:14,color: '#023e4eff', fontSize: 24}}>+</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 48}]}>
            <Text style={{fontSize:13,color: '#023e4eff'}}>Table is available from:</Text>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <TouchableHighlight
              onPress={() => this._showDateTimePicker(1)}
              underlayColor={HEXCOLOR.lightBrown}>
              <View style={[CommonStyle.rectangle, {width: 210, height: 38, flexDirection:'row', borderColor: '#023e4eff'}]}>
                <Text style={{color: '#023e4eff',fontSize:13}}>
                  {this.state.startTime === 'Set start time' ? this.state.startTime : Moment(this.state.startTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={[{flex:0.3,flexDirection:'row',justifyContent:'center', alignItems:'center', marginTop: 52}]}>
            <Text style={{width:230,fontSize:13,color: '#023e4eff',textAlign:'center'}}>The latest the guest should leave the table:</Text>
          </View>
          <View style={[CommonStyle.rowContainerHCenter, {marginTop: 20}]}>
            <TouchableHighlight
              onPress={() => this._showDateTimePicker(2)}
              underlayColor={'#023e4eff'}>
              <View style={[CommonStyle.rectangle, {width: 210, height: 38, flexDirection:'row', borderColor: '#023e4eff'}]}>
                <Text style={{color:"#023e4eff", fontSize: 13}}>
                  {this.state.endTime === 'Set end time' ? this.state.endTime : Moment(this.state.endTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop: 50,}}>
            <TouchableHighlight
              style={[CommonStyle.publish, {alignItems:'center',width:155,backgroundColor:'#023e4eff',borderRadius:0}]}
              onPress={() => this.publishTable()}
              underlayColor={HEXCOLOR.pureWhite}>
                <Text style={[CommonStyle.publishText,{color:'white'}]}>Publish</Text>
            </TouchableHighlight>
          </View>
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
