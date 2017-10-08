/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    TextInput,
    Switch,
    View,
    StyleSheet,
    Image,
    TouchableHighlight,
    ListView,
    ScrollView,
    Platform
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import * as Progress from 'react-native-progress';
import {Sae} from "react-native-textinput-effects";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import CommonStyle from "../styles/admin.css";
import Database from "../firebase/database";
import FullWidthImage from "../components/full_width_image"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";
import Moment from 'moment';

class AvailableTable extends Component {
  static navigationOptions = {
      title: 'Avaible Table',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: '#122438',
      }
  };

  constructor(props) {
      super(props);
  }

  componentWillMount() {
  }

  componentWillUnmount(){
  }

  render() {
    return (
      <View style={[CommonStyle.container, {paddingBottom: 16}]}>
        <View style={CommonStyle.navBar}>
          <View style={CommonStyle.leftContainer}>
            <Text style={[CommonStyle.text, {textAlign: 'left'}]}>{'<'}</Text>
          </View>
          <Text style={[CommonStyle.text, {color: 'white'}]}>Avaible Table</Text>
          <View style={CommonStyle.rightContainer}>
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(false)}>
              <View>
                <Icon
                  name='close'
                  type='font-awesome'
                  color='white'/>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView keyboardDismissMode={'none'}>
          <View style={[CommonStyle.rowContainer, {paddingTop: 10}]}><Text>A table has just become available</Text></View>
          <View style={[CommonStyle.rowContainer, {paddingTop: 10}]}><Text style={CommonStyle.listItemTitle}>{this.props.restaurant.name}</Text></View>
          <FullWidthImage source={{uri: this.props.restaurant.images.length > 0 ? this.props.restaurant.images[0].imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
          <View style={[CommonStyle.rowContainer, {paddingTop: 10}]}>
            <Text style={[CommonStyle.listItemTitle, {paddingTop: 10}]}>{this.props.restaurant.booking_message}</Text>
          </View>
          <View style={[{paddingLeft: 15, paddingRight: 15, paddingTop: 10}]}>
            <View style={CommonStyle.rowContainer}>
              <Icon
                name='map-marker'
                type='font-awesome'
                color='#626262'/>
              <Text style={{paddingLeft: 5}}>{this.props.restaurant.address}</Text>
            </View>
            <View style={[{paddingTop: 15}]}>
              <Text style={{fontSize: 18}}>{this.props.table.pax} people</Text>
              <Text style={{fontSize: 18}}>{Moment(parseInt(this.props.table.startTime)).format('HH:mm')} - {Moment(parseInt(this.props.table.endTime)).format('HH:mm')}</Text>
            </View>
            <View style={[{paddingTop: 15}]}>
              <View style={{marginLeft: 60, marginRight: 60}}>
                <Button onPress={this.props.bookTable} style={{backgroundColor: '#122438'}} textStyle={{color: '#FFF', fontSize: 18}}>
                  Book now
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

module.exports = AvailableTable;
