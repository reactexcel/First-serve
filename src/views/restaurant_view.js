/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    TextInput,
    // Switch,
    View,
    StyleSheet,
    Image,
    TouchableHighlight,
    ListView,
    ScrollView,
    Platform,
    Linking,
    TouchableOpacity
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {Sae} from "react-native-textinput-effects";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import { HEXCOLOR } from "../styles/hexcolor.js";
import GallerySwiper from "../components/swiper"
import CommonStyle from "../styles/admin.css";
import Database from "../firebase/database";
import FullWidthImage from "../components/full_width_image"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";
import Firebase from "../firebase/firebase";
import call from 'react-native-phone-call'
import  Switch  from '../components/switch';

Firebase.initialise();

class RestaurantView extends Component {
  static navigationOptions = {
      title: 'New Restaurant',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: '#122438',
      }
  };

  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => {
        return (row1.primary !== row2.primary || row1.storageId !== row2.storageId || row1.imageUrl !== row2.imageUrl);
      }});
      this.state = {
          restaurant: this.props.restaurant,
          email: "",
          password: "",
          confirmPassword: "",
          uploading: false,
          dataSource: dataSource.cloneWithRows(this.props.restaurant.images)
      };
  }

  componentWillMount() {
  }

  componentWillUnmount(){
  }

  render() {
    return (
      <View style={[CommonStyle.container, {paddingBottom: 16 }]}>
        <View style={CommonStyle.navBar}>
          <View style={CommonStyle.leftContainer}>

          </View>
          <Text style={[CommonStyle.navtext, {color: 'white'}]}>{this.props.restaurant.name}</Text>
          <View style={CommonStyle.rightContainer}>
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(this.props.restaurant._key, false)}>
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
          <View style={CommonStyle.swiperModal}>
            <GallerySwiper {...this.props} openModel={() => {}} />
          </View>
          <View style={[{paddingLeft: 15, paddingRight: 15}]}>
            <Text style={[{color: '#023e4eff', paddingTop: 16, paddingBottom: 20}]}>{this.props.restaurant.long_description}</Text>

            <View style={[CommonStyle.listNotiView, CommonStyle.bottomBorder,CommonStyle.topBorder, {paddingBottom: 33,paddingTop:30}]}>
              {/* <View style={[CommonStyle.listNotiView, {paddingBottom: this.props.isAdmin ? 0 : 0}]}> */}
                  <View style={CommonStyle.notiIconView}>
                      <Text style={{paddingTop:3,color:'#023e4eff',fontWeight:'bold',fontSize:13}}>TABLE NOTIFICATIONS</Text>
                  </View>
              {/* </View> */}
            </View>
              <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:-60,marginBottom:25,marginRight:5}}>
                  <Switch
                  active={this.props.isRestaurantNotiOn[this.props.restaurant._key]}
                  onChangeState={(value)=>{this.props.setValue(this.props.restaurant._key, value)}}
                  buttonRadius={12}
                  switchHeight={16}
                  switchWidth={37}
                  activeBackgroundColor='#056681'
                  inactiveBackgroundColor='#BDC3C7'
                  activeButtonColor='#023e4eff'
                  activeButtonPressedColor='#023e4eff'
                  inactiveButtonColor='white'
                  inactiveButtonPressedColor='white'
                  />
              </View>
            <View style={{paddingBottom: 16}}>
              <View style={[CommonStyle.rowContainer, {paddingTop: 16}]}>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color={this.props.favourites[this.props.restaurant._key] === true ? '#023e4eff' : '#023e4eff'}/>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Favourite</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() =>{}}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Text style={{color:'#023e4eff',fontSize:17}}>{this.props.restaurant.price_label}</Text>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Price Level</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.website_url.length > 0){
                      Linking.openURL(this.props.restaurant.website_url.startsWith('http') ? this.props.restaurant.website_url : 'http://' + this.props.restaurant.website_url)
                    }else{
                      console.log('Website', "Url Not Present.")
                    }
                  }}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        size={28}
                        name='ios-home-outline'
                        type='ionicon'
                        color={'#023e4eff'  }/>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Website</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[CommonStyle.rowContainer, {paddingTop: 16}]}>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.instagram_url.length > 0){
                      Linking.openURL(this.props.restaurant.instagram_url.startsWith('http') ? this.props.restaurant.instagram_url : 'http://' + this.props.restaurant.instagram_url)
                    }else{
                      console.log('Instagram', "Url Not Present.")
                    }
                  }}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='instagram'
                        type='font-awesome'
                        color={'#023e4eff'}/>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Instagram</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.instagram_url.length > 0){
                      Linking.openURL(this.props.restaurant.booking_url.startsWith('http') ? this.props.restaurant.booking_url : 'http://' + this.props.restaurant.booking_url)
                      Database.logEvent(this.props.restaurant, true);
                    }else{
                      console.log('Instagram', "Url Not Present.")
                    }
                  }}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='calendar'
                        type='font-awesome'
                        color={'#023e4eff'}/>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Online booking</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.phone_number.length > 0){
                      Linking.openURL(`tel:${this.props.restaurant.phone_number}`)
                    }else{
                      console.log('PhoneNumber', "Not Present.")
                    }
                  }}
                  underlayColor={HEXCOLOR.pureWhite}>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='phone'
                        type='font-awesome'
                        color={'#023e4eff'}/>
                    </View>
                    <Text style={{color:'#023e4eff'}}>Phone</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
            <View style={CommonStyle.rowContainer}>
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
            {this.props.isAdmin && <View style={[CommonStyle.rowContainer, {paddingBottom: 40}]}>
              <TouchableHighlight
                style={[CommonStyle.btn, CommonStyle.centerContainer]}
                onPress={() => this.props.editRestaurant(this.props.restaurant)}
                underlayColor={HEXCOLOR.pureWhite}>
                  <Text style={[CommonStyle.submitText, {paddingLeft: 20, paddingRight: 20}]}>Edit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[CommonStyle.btn, CommonStyle.centerContainer]}
                onPress={() => this.props.deleteRestaurant(this.props.restaurant)}
                underlayColor={HEXCOLOR.pureWhite}>
                  <Text style={[CommonStyle.submitText, {paddingLeft: 20, paddingRight: 20}]}>Delete</Text>
              </TouchableHighlight>
            </View>}
          </View>
        </ScrollView>
      </View>
    );
  }

  cancel(){
    this.props.navigation.goBack();
  }
}

module.exports = RestaurantView;
