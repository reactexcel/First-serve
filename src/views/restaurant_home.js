/**
 * @class Home
 */

import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ListView
} from "react-native";

import Button from "apsl-react-native-button";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import { HEXCOLOR } from "../styles/hexcolor.js";
import CommonStyle from "../styles/restaurant.css";
import TableListItem from "./table_list_item";
import Database from "../firebase/database";
import DismissKeyboard from "dismissKeyboard";
import * as Progress from 'react-native-progress';
import {Icon} from "react-native-elements";
import Moment from 'moment';
import * as firebase from "firebase";

class RestaurantHome extends Component {
  static navigationOptions  = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'Restaurant',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: HEXCOLOR.lightBrown,
      },
      headerRight: (
        <TouchableHighlight
          onPress={() => {
            navigation.navigate('RSettings', {
              title: 'Restaurant Settings',
              userId: params.userId
            });
          }}>
          <View style={{paddingRight: 8}}>
            <Icon
              name='cog'
              type='font-awesome'
              color='white'/>
          </View>
        </TouchableHighlight>
      )
    }
  };
  constructor(props) {
    super(props);
    const aDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
      return (row1.startTime !== row2.startTime || row1.endTime !== row2.endTime || row1.bookedBy !== row2.bookedBy);
    }});

    const bDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
      return (row1.startTime !== row2.startTime || row1.endTime !== row2.endTime || row1.bookedBy !== row2.bookedBy);
    }});

    this.state = {
      userId: this.props.navigation.state.params.userId,
      restaurant: {},
      restaurantKey: '',
      progress: true,
      watchOnTables: false,
      watchOnWaitingList: false,
      waitingListCount: 0,
      availableTables: [],
      bookedTables: [],
      availableTablesDb: aDataSource.cloneWithRows([]),
      bookedTablesDb: bDataSource.cloneWithRows([]),
      curTime: Moment(new Date()).format('MMM DD YYYY, HH:mm')
    };

    this.openPublish = this.openPublish.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.deleteTable = this.deleteTable.bind(this);
  }

  componentWillMount(){
    console.log("componentWillMount restaurant home.");
    this.restaurantRef = firebase.database().ref("/restaurants/" + this.state.userId);
    this.userRef = firebase.database().ref("users");
    this.ref = firebase.database().ref("tables");

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

      this.setState({restaurant: restaurant, restaurantKey: restaurant._key, progress: false});

      const th = this;
      if(!this.state.watchOnTables){
        this.ref.orderByChild("restaurantKey").equalTo(this.state.restaurantKey).on("value", function(snapshot) {
          var aTables = [];
          var bTables = [];
          snapshot.forEach((ch) => {
            if(ch.val().bookedBy){
              bTables.push({
                restaurantKey: ch.val().restaurantKey,
                startTime: ch.val().startTime,
                bookedBy: ch.val().bookedBy,
                endTime: ch.val().endTime,
                people: ch.val().pax,
                key: ch.key
              });
            }else{
              aTables.push({
                restaurantKey: ch.val().restaurantKey,
                startTime: ch.val().startTime,
                endTime: ch.val().endTime,
                people: ch.val().pax,
                key: ch.key
              });
            }
          });
          th.setState({
            availableTablesDb: th.state.availableTablesDb.cloneWithRows(aTables),
            bookedTablesDb: th.state.bookedTablesDb.cloneWithRows(bTables)
          });
        });
        this.setState({watchOnTables: true});
      }
      if(!this.state.watchOnWaitingList){
        this.userRef.orderByChild("restaurants_noti" + "/" + this.state.restaurantKey + "/notiOn").equalTo(true).on("value", function(snapshot) {
          var waitingListCount = 0;
          var users = snapshot.val();
          var keys = Object.keys(users);
          for(i = 0; i < keys.length; i++){
            var u = users[keys[i]];
            waitingListCount++;
            if(u.notificationId){
              // waitingListCount++;
            }
          }
          th.setState({waitingListCount: waitingListCount});
        });
        this.setState({watchOnWaitingList: true});
      }
    });
  }

  componentDidMount() {
    console.log("componentDidMount restaurant home.");
    this.timeoutHandle = setTimeout(()=>{
          this.setState({ curTime: Moment(new Date()).format('MMM DD YYYY, HH:mm') })
     }, 60000);
  }

  componentWillUnmount(){
    console.log('componentWillUnmount restaurant home');
    clearTimeout(this.timeoutHandle);
    this.restaurantRef.off();
    this.ref.off();
    this.userRef.off();
  }

  openSettings(navigation) {
    navigation.navigate('RSettings', {
      title: 'Restaurant Settings',
      restaurant: navigation.state.params.restaurant
    });
  }

  openPublish() {
    this.props.navigation.navigate('PTable', {
      title: 'Publish table',
      restaurantKey: this.state.restaurantKey,
      userId: this.state.userId
    });
  }

  render() {
    if(this.state.progress){
      return(
        <View style={CommonStyle.container}>
          <View style={[CommonStyle.rowContainer, {paddingTop: 25}]}>
            <Progress.CircleSnail color={['green', 'red', 'blue']} />
          </View>
        </View>
      )
    }else{
      return (
        <View style={CommonStyle.container}>
          <View style={[CommonStyle.rowContainerLF, CommonStyle.bottomBorderBrown, {paddingTop: 30}]}>
            <View style={CommonStyle.headingLeft}><Text style={{color: HEXCOLOR.lightBrown}}>Available tables</Text></View>
            <View style={CommonStyle.headingRight}><Text style={{color: HEXCOLOR.lightBrown}}>{this.state.curTime}</Text></View>
          </View>
          <View style={[CommonStyle.rowContainerLF]}>
            <ListView
              dataSource={this.state.availableTablesDb}
              enableEmptySections={true}
              renderRow={this.renderTable}/>
          </View>
          <View style={[CommonStyle.rowContainerLF, CommonStyle.bottomBorderBrown, {paddingTop: 10}]}>
            <View style={CommonStyle.headingLeft}><Text style={{color: HEXCOLOR.lightBrown}}>Booked tables</Text></View>
            <View style={CommonStyle.headingRight}><Text style={{color: HEXCOLOR.lightBrown}}>{this.state.curTime}</Text></View>
          </View>

          <View style={[CommonStyle.rowContainerLF]}>
            <ListView
              dataSource={this.state.bookedTablesDb}
              enableEmptySections={true}
              renderRow={this.renderBookedTable}/>
          </View>
          <View style={[CommonStyle.rowContainerLF, {paddingTop: 10}]}>
            <Text style={{color: HEXCOLOR.pureWhite, fontSize: 16}}>Waiting List</Text>
          </View>
          <View style={[CommonStyle.rowContainerLF]}>
            <Icon
              name='cutlery'
              type='font-awesome'
              color={HEXCOLOR.pureWhite}/>
            <Text style={{color: HEXCOLOR.pureWhite, fontSize: 16, paddingLeft: 10}}>{this.state.waitingListCount} People</Text>
          </View>

          <TouchableHighlight
            style={[CommonStyle.publish, {marginTop: 40}]}
            onPress={() => this.openPublish()}
            underlayColor={HEXCOLOR.pureWhite}>
              <Text style={[CommonStyle.publishText]}>Publish</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  deleteTable(tableKey){
    Database.deleteTable(tableKey, function(res){
      console.log('deleteTable', res);
    });
    console.log('deleteTable', '');
  }

  renderTable(table) {
    return (
      <TableListItem
        table={table}
        deleteTable={this.deleteTable}
        isBooked={false} />
    )
  }
  renderBookedTable(table) {
    return (
      <TableListItem
        table={table}
        deleteTable={this.deleteTable}
        isBooked={true} />
    )
  }
}

module.exports = RestaurantHome;
