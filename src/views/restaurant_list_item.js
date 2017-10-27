import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Switch,
  Linking,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';

import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window')
import styles from "../styles/admin.css";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import GallerySwiper from "../components/swiper"
import RestaurantView from "./restaurant_view";

class RestaurantListItem extends Component {
  render() {
    console.log(this.props,"log");
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    if(this.props.restaurant.isAddButton !== true){
      return (
        <View style={styles.listItem}>
          <View style={{flex: 1, borderBottomWidth: 2,borderColor:'#023e4eff'}}>
            <View style={styles.rowContainer}>
              <TouchableHighlight
                onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
                <Text style={styles.listItemTitle}>{this.props.restaurant.name.toUpperCase()}</Text>
              </TouchableHighlight>
            </View>
              <GallerySwiper {...this.props} openModel={() => this.props.setModalVisible(this.props.restaurant._key, true)} />
            <View style={[styles.notiView, {alignItems:'center',marginTop:13}]}>
              <View style={{justifyContent:'center',alignItems:'center'}}><Text style={{textAlign:'center',fontSize:12,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.type.toUpperCase()}</Text></View>

            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:-30,marginRight:25}}>
              <TouchableHighlight
              style={{flexDirection: 'row'}}
                onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
                underlayColor='#fff'>
                  <View style={styles.notiIconView}>
                      <Icon
                          size={30}
                          name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                          type='font-awesome'
                          color={this.props.favourites[this.props.restaurant._key] === true ? 'red' : 'black'}/>
                  </View>
                </TouchableHighlight>
            </View>
            <View style={styles.notiView}>
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
                <View style={{paddingLeft: 5,paddingTop:5}}><Text style={{fontSize:13,fontWeight:'bold',color:'#023e4eff'}}>{this.props.restaurant.address}</Text></View>
              </TouchableOpacity>
              </View>
            </View>
            {/* <TouchableHighlight
              style={this.props.restaurant.fully_booked ? styles.submitDisable : styles.submit}
              onPress={() => {
                if(this.props.restaurant.fully_booked){
                  console.log('Regular booking', 'fully booked');
                }else{
                  if(this.props.restaurant.website_url.length > 0){
                    Linking.openURL(this.props.restaurant.website_url);
                  }else{
                    console.log('Website', "Url Not Present.");
                  }
                }
              }}
              underlayColor='#fff'>
                <Text style={this.props.restaurant.fully_booked ? styles.submitTextDisable : styles.submitText}>{this.props.restaurant.fully_booked ? 'FULLY BOOKED' : 'Regular booking'}</Text>
            </TouchableHighlight> */}
            <View>
            </View>
            <View style={[{flex: 1,flexDirection:'row',alignItems:'center',justifyContent: 'center'}, {paddingTop: 8,paddingBottom:10}]}>
              <Text style={{fontSize: 13,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.short_description}</Text>
            </View>
            <View style={[styles.listNotiView, {paddingBottom: this.props.isAdmin ? 0 : 0}]}>
                <View style={styles.notiIconView}>
                    <Text style={{color:'#023e4eff',fontWeight:'bold',fontSize:13}}>TABLE NOTIFICATIONS</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:-22,marginBottom:24,marginRight:25}}>
              <Switch onValueChange={(value) => this.props.setValue(this.props.restaurant._key, value)}
                value={this.props.isRestaurantNotiOn[this.props.restaurant._key] === true ? true : false}/>
            </View>
            {this.props.isAdmin && <View style={[styles.rowContainer, {paddingBottom: 58}]}>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => this.props.editRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[styles.submitText, {paddingLeft: 30, paddingRight: 30}]}>Edit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => this.props.deleteRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[styles.submitText, {paddingLeft: 20, paddingRight: 20}]}>Delete</Text>
              </TouchableHighlight>
            </View>}
          </View>
        </View>);
      }else{
        return(
          <View style={[styles.listItem]}>
            <View style={[styles.listNotiView, {flex: 1}]}>
              <TouchableHighlight
                style={styles.submit}
                onPress={() => this.props.newRestaurant()}
                underlayColor='#fff'>
                <Text style={[styles.submitText, {paddingLeft: 40, paddingRight: 40}]}>Add Restaurant</Text>
              </TouchableHighlight>
            </View>
          </View>);
      }
  }
}

module.exports = RestaurantListItem;
