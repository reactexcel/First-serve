/**
 * @class Home
 */

import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ListView,
    Modal,
    Alert,
    ScrollView,
    NetInfo,
    Platform
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
import TableTypeListItem from "./table_type_item_list";

class RestaurantHome extends Component {
  static navigationOptions  = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: params.title.toUpperCase(),
      headerTitleStyle :{marginLeft:0,fontSize:13,alignSelf: 'center', color: 'white'},
      headerLeft: <View style={{marginLeft:15}}/>,
      headerStyle:{
          backgroundColor: '#023e4eff',
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
              fontSize={14}
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
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const aDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
      return (row1.startTime !== row2.startTime ||
        row1.endTime !== row2.endTime ||
        row1.bookedBy !== row2.bookedBy ||
        row1.shouldShowName !== row2.shouldShowName
      );
    }});

    const bDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
      return (row1.startTime !== row2.startTime ||
        row1.endTime !== row2.endTime ||
        row1.bookedBy !== row2.bookedBy ||
        row1.shouldShowName !== row2.shouldShowName
      );
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
      isModalVisible: false,
      dataSource: dataSource.cloneWithRows([]),
      availableTablesDb: aDataSource.cloneWithRows([]),
      bookedTablesDb: bDataSource.cloneWithRows([]),
      curTime: Moment(new Date()).format('DD-MM-YYYY'),
      isOnline: false
    };

    this.openPublish = this.openPublish.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.deleteTable = this.deleteTable.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this._toogleNamePhone = this._toogleNamePhone.bind(this);
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

    console.log("componentWillMount restaurant home.");
    this.restaurantRef = firebase.database().ref("/restaurants/" + this.state.userId);
    this.userRef = firebase.database().ref("/users");
    this.ref = firebase.database().ref("/tables");

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

      if(!this.state.watchOnWaitingList){
        this.userRef.orderByChild("restaurants_noti" + "/" + this.state.restaurantKey + "/notiOn").equalTo(true).on("value", function(snapshot) {
          var waitingListCount = 0;
          var users = snapshot.val();
          var keys = Object.keys(users);
          var tableTypes = {};
          for(i = 0; i < keys.length; i++){
            var u = users[keys[i]];
            waitingListCount++;
            if(!u.pax) u.pax = '0';
            if(tableTypes[u.pax]){
              tableTypes[u.pax] += 1;
            }else{
              tableTypes[u.pax] = 1;
            }
            if(u.notificationId){
              // waitingListCount++;
            }
          }
          var tableTypes1 = [];
          keys = Object.keys(tableTypes);
          for(i = 0; i < keys.length; i++){
            tableTypes1.push({tableType: keys[i], noOfUsers: tableTypes[keys[i]]})
          }
          th.setState({
            users: users,
            dataSource: th.state.dataSource.cloneWithRows(tableTypes1),
            waitingListCount: waitingListCount
          });
        });
        this.setState({watchOnWaitingList: true});
      }

      if(!this.state.watchOnTables){
        this.ref.orderByChild("restaurantKey").equalTo(this.state.restaurantKey).on("value", function(snapshot) {
          var aTables = [];
          var bTables = [];
          snapshot.forEach((ch) => {
            var curTime = new Date().getTime();
            if(curTime < ch.val().endTime) {
              if(ch.val().bookedBy){
                bTables.push({
                  restaurantKey: ch.val().restaurantKey,
                  startTime: ch.val().startTime,
                  bookedBy: ch.val().bookedBy,
                  endTime: ch.val().endTime,
                  people: ch.val().pax,
                  shouldShowName: true,
                  bookedBy: th.state.users[ch.val().bookedBy].name,
                  bookedByPhone: th.state.users[ch.val().bookedBy].phone_number,
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
            }
          });
          th.setState({
            bookedTables: bTables,
            availableTablesDb: th.state.availableTablesDb.cloneWithRows(aTables),
            bookedTablesDb: th.state.bookedTablesDb.cloneWithRows(bTables)
          });
        });
        this.setState({watchOnTables: true});
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

  setModalVisible(value){
    this.setState({isModalVisible: value});
  }

  render() {
    if(!this.state.isOnline){
      return (
        <View style={[CommonStyle.container, {padding: 10}]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[CommonStyle.headerText, {color: '#FFF'}]}>We can’t seem to connect to the First Served network. Please check your internet connection.</Text>
          </View>
        </View>
      );
    }else if(this.state.progress){
      return(
        <View style={CommonStyle.container}>
          <View style={[CommonStyle.rowContainer, {paddingTop: 25}]}>
            <Progress.CircleSnail color={['green', 'red', 'blue']} />
          </View>
        </View>
      )
    }else{
      return (
        <View style={[CommonStyle.container,{padding:20,paddingTop:0}]}>
          <ScrollView>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => {this.setModalVisible(false)}}>

            <View style={{flex: 1, backgroundColor:  HEXCOLOR.pureWhite}}>
              <View style={CommonStyle.navBar}>
                <View style={CommonStyle.leftContainer}>

                </View>
                <Text style={[CommonStyle.navtext, {fontWeight:'bold',marginLeft:30,fontSize: 13,marginTop:(Platform.OS === 'ios') ? 5 : 0, color: 'white'}]}>{this.state.restaurant.name.toUpperCase()}</Text>
                <View style={[CommonStyle.rightContainer, {paddingRight: 15}]}>
                  <TouchableHighlight
                    onPress={() => this.setModalVisible(false)}>
                    <View>
                      <Icon
                        size={21}
                        name='close'
                        type='font-awesome'
                        color='white'/>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
              <ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                removeClippedSubviews={false}
                renderRow={this._renderItem.bind(this)}
                style={[CommonStyle.listView, {marginTop: 30}]}/>
            </View>
          </Modal>
          <View style={[CommonStyle.rowContainerLF, CommonStyle.bottomBorderBrown, {paddingTop: 30}]}>
            <View style={CommonStyle.headingLeft}><Text style={{fontWeight:'500',color: '#023e4eff'}}>Available tables</Text></View>
            <View style={CommonStyle.headingRight}><Text style={{fontWeight:'500',color: '#023e4eff'}}>{this.state.curTime}</Text></View>
          </View>
          <View style={[CommonStyle.rowContainerLF,{marginTop:15}]}>
            <ListView
              dataSource={this.state.availableTablesDb}
              enableEmptySections={true}
              renderRow={this.renderTable.bind(this)}/>
          </View>
          <View style={[CommonStyle.rowContainerLF, CommonStyle.bottomBorderBrown, {paddingTop: 10}]}>
            <View style={CommonStyle.headingLeft}><Text style={{fontWeight:'500',color: '#023e4eff'}}>Booked tables</Text></View>
            <View style={CommonStyle.headingRight}><Text style={{fontWeight:'500',color: '#023e4eff'}}>{this.state.curTime}</Text></View>
          </View>

          <View style={[CommonStyle.rowContainerLF,{marginTop:15}]}>
            <ListView
              dataSource={this.state.bookedTablesDb}
              enableEmptySections={true}
              renderRow={this.renderBookedTable.bind(this)}/>
          </View>
          <View style={[CommonStyle.rowContainerLF,CommonStyle.bottomBorderBrown, {paddingTop: 10}]}>
            <TouchableHighlight
              onPress={() => this.setModalVisible(true)}
              underlayColor={HEXCOLOR.pureWhite}>
              <Text style={{fontWeight:'500',color: '#023e4eff', fontSize: 14}}>Waiting List</Text>
            </TouchableHighlight>
          </View>
          <View style={[CommonStyle.rowContainerLF,{marginTop:20,marginLeft:7}]}>
            <TouchableHighlight
              onPress={() => this.setModalVisible(true)}
              underlayColor={HEXCOLOR.pureWhite}>
              <View style={[CommonStyle.rowContainerLF]}>
                <Icon
                  size={20}
                  name='cutlery'
                  type='font-awesome'
                  color={'grey'}/>
                <Text style={{color: 'grey', fontSize: 14, paddingLeft: 10}}>{this.state.waitingListCount} People</Text>
              </View>
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            style={[CommonStyle.publish, {marginTop: 40,backgroundColor:'#023e4eff',borderRadius:0}]}
            onPress={() => this.openPublish()}
            underlayColor={HEXCOLOR.pureWhite}>
              <Text style={[CommonStyle.publishText,{color:'white'}]}>Publish Table </Text>
          </TouchableHighlight>
          </ScrollView>
        </View>
      );
    }
  }

  _renderItem(tableType) {
      return (
          <TableTypeListItem tableType={tableType}/>
      );
  }

  deleteTable(tableKey){
    Alert.alert(
      'Table',
      'Are you sure you want to delete this table?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Delete', onPress: () => {
          Database.deleteTable(tableKey, function(res){
            if(res == 'error'){
              alert("Unable to delete table. Please try again.");
            }else{
              console.log("Delete table", "Table deleted.");
            }
          });
        }},
      ],
      { cancelable: false }
    )
  }

  _toogleNamePhone(tableKey, isBooked){
    if(!isBooked) return;
    var bTables = this.state.bookedTables;

    for (var i = 0; i < bTables.length; i++) {
      var tbl = bTables[i];
      if(tbl.key == tableKey){
        tbl.shouldShowName = !tbl.shouldShowName;
        break;
      }
    }

    const bDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
      return (row1.startTime !== row2.startTime ||
        row1.endTime !== row2.endTime ||
        row1.bookedBy !== row2.bookedBy ||
        row1.shouldShowName !== row2.shouldShowName
      );
    }});

    this.setState({
      bookedTables: bTables,
      bookedTablesDb: bDataSource.cloneWithRows(bTables)
    });
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
        toogleNamePhone={this._toogleNamePhone}
        deleteTable={this.deleteTable}
        isBooked={true} />
    )
  }
}

module.exports = RestaurantHome;
