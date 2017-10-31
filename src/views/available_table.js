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
    Platform,
    TouchableOpacity
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
    console.log(this.props);
    return (
      <View style={[CommonStyle.container, {paddingBottom: 0}]}>
        <View style={CommonStyle.navBar}>
          <View style={CommonStyle.leftContainer}>
          </View>
          <Text style={[CommonStyle.text, {paddingTop:0,fontSize:12,alignSelf: 'center', color: 'white',fontWeight:'bold',marginLeft:15 }]}>AVAIBLE TABLE</Text>
          <View style={CommonStyle.rightContainer}>
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(false)}>
              <View>
                <Icon
                  size={14}
                  name='close'
                  type='font-awesome'
                  color='white'/>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView keyboardDismissMode={'none'}>
          <View style={[CommonStyle.rowContainer, {paddingTop: 8,paddingBottom:0,marginBottom:2}]}>
            <Text style={{fontWeight:'500',color:'#023e4eff',fontSize:14}}>A new table has just become available</Text></View>
          <View style={[CommonStyle.rowContainer, { paddingTop: 0,paddingBottom:7}]}>
            <Text style={CommonStyle.listItemTitle}>{this.props.restaurant.name.toUpperCase()}</Text></View>
          <FullWidthImage source={{uri: this.props.restaurant.images.length > 0 ? this.props.restaurant.images[0].imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
          <View style={[CommonStyle.notiView, {alignItems:'center',marginTop:13}]}>
            <View style={{justifyContent:'center',alignItems:'center'}}><Text style={{textAlign:'center',fontSize:12,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.type.toUpperCase()}</Text></View>
          </View>

          <View style={CommonStyle.notiView}>
            <View>
              <TouchableOpacity
                onPress={()=>{this.props.openMap(this.props.restaurant.address)}}
                >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Icon
                        size={18}
                        color='#023e4eff'
                        name='map-marker'
                        type='font-awesome'/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{this.props.openMap(this.props.restaurant.address)}}
                >
              <View style={{paddingLeft: 5,paddingTop:5}}><Text style={{fontSize:14,fontWeight:'bold',color:'#023e4eff'}}>{this.props.restaurant.address}</Text></View>
            </TouchableOpacity>
            </View>
          </View>
          <View style={[{flex: 1,flexDirection:'row',alignItems:'center',justifyContent: 'center'}, {paddingTop: 8,paddingBottom:10}]}>
            <Text style={{fontSize: 12,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.booking_message}</Text>
          </View>
        <View style={[ CommonStyle.bottomBorder,CommonStyle.topBorder,{margin:15,marginTop:17}]}>

            <View style={[{paddingTop: 20,paddingBottom:20}]}>
              <Text style={{fontWeight:'500',color:'#023e4eff', fontSize: 13,textAlign:'center'}}>TABLE FOR {this.props.table.pax} PEPOLE</Text>
              <Text style={{fontWeight:'500',color:'#023e4eff',fontSize: 13,textAlign:'center'}}>{Moment(parseInt(this.props.table.startTime)).format('HH:mm')} - {Moment(parseInt(this.props.table.endTime)).format('HH:mm')} </Text>
            </View>

          </View>
          <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingTop: 15,paddingBottom:18}]}>
              <Button onPress={this.props.bookTable} style={{borderRadius:0,width:147,height:45 ,backgroundColor: '#023e4eff',borderWidth:0}} textStyle={{color: '#FFF', fontSize: 15}}>
                Book table
              </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

module.exports = AvailableTable;
