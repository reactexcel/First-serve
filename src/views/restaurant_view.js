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
    Linking
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {Sae} from "react-native-textinput-effects";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import CommonStyle from "../styles/admin.css";
import Database from "../firebase/database";
import FullWidthImage from "../components/full_width_image"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";
import Firebase from "../firebase/firebase";
import call from 'react-native-phone-call'

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
      <View style={[CommonStyle.container, {paddingBottom: 16}]}>
        <View style={CommonStyle.navBar}>
          <View style={CommonStyle.leftContainer}>
            <Text style={[CommonStyle.text, {textAlign: 'left'}]}>{'<'}</Text>
          </View>
          <Text style={[CommonStyle.text, {color: 'white'}]}>{this.props.restaurant.name}</Text>
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
          <FullWidthImage source={{uri: this.props.restaurant.images.length > 0 ? this.props.restaurant.images[0].imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
          <View style={[{paddingLeft: 15, paddingRight: 15}]}>
            <Text style={[{paddingTop: 16, paddingBottom: 20}]}>{this.props.restaurant.long_description}</Text>
            <View style={[CommonStyle.rowContainer, CommonStyle.topBorder, {paddingTop: 15}]}>
              <Text style={{fontSize: 11}}>Get notified when additional tables become available</Text>
            </View>
            <View style={[CommonStyle.listNotiView, CommonStyle.bottomBorder, {paddingBottom: 16}]}>
                <View style={CommonStyle.notiIconView}>
                    <Icon
                        name='bell'
                        type='font-awesome'
                        color='#626262'/>
                    <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
                </View>

                <Switch onValueChange={(value) => this.props.setValue(this.props.restaurant._key, value)}
                value={this.props.isRestaurantNotiOn[this.props.restaurant._key] === true ? true : false}/>
            </View>
            <View style={{paddingBottom: 16}}>
              <View style={[CommonStyle.rowContainer, {paddingTop: 16}]}>
                <TouchableHighlight
                  style={CommonStyle.centerContainer}
                  onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
                  underlayColor='#fff'>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#626262'/>
                    </View>
                    <Text>Favourite</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.website_url.length > 0){
                      Linking.openURL(this.props.restaurant.website_url)
                    }else{
                      console.log('Website', "Url Not Present.")
                    }
                  }}
                  underlayColor='#fff'>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='home'
                        type='font-awesome'
                        color='#626262'/>
                    </View>
                    <Text>Website</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={[CommonStyle.rowContainer, {paddingTop: 16}]}>
                <TouchableHighlight
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.instagram_url.length > 0){
                      Linking.openURL(this.props.restaurant.instagram_url)
                    }else{
                      console.log('Instagram', "Url Not Present.")
                    }
                  }}
                  underlayColor='#fff'>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='instagram'
                        type='font-awesome'
                        color='#626262'/>
                    </View>
                    <Text>Instagram</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  style={CommonStyle.centerContainer}
                  onPress={() => {
                    if(this.props.restaurant.phone_number.length > 0){
                      call({number: this.props.restaurant.phone_number, prompt: false}).catch(console.error);
                    }else{
                      console.log('PhoneNumber', "Not Present.")
                    }
                  }}
                  underlayColor='#fff'>
                  <View style={CommonStyle.centerContainer}>
                    <View style={CommonStyle.circle}>
                      <Icon
                        name='phone'
                        type='font-awesome'
                        color='#626262'/>
                    </View>
                    <Text>{this.props.restaurant.phone_number}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={CommonStyle.rowContainer}>
              <Icon
                name='map-marker'
                type='font-awesome'
                color='#626262'/>
              <Text style={{paddingLeft: 5}}>{this.props.restaurant.address}</Text>
            </View>
            <View style={[CommonStyle.rowContainer, {paddingBottom: 40}]}>
              <TouchableHighlight
                style={[CommonStyle.btn, CommonStyle.centerContainer]}
                onPress={() => this.props.editRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[CommonStyle.submitText, {paddingLeft: 20, paddingRight: 20}]}>Edit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[CommonStyle.btn, CommonStyle.centerContainer]}
                onPress={() => this.props.deleteRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[CommonStyle.submitText, {paddingLeft: 20, paddingRight: 20}]}>Delete</Text>
              </TouchableHighlight>
            </View>
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
