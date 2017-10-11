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
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    if(this.props.restaurant.isAddButton !== true){
      return (
        <View style={styles.listItem}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.props.isModelVisible[this.props.restaurant._key] === true ? true : false}
            onRequestClose={() => {this.props.setModalVisible(this.props.restaurant._key, false)}}>

            <RestaurantView restaurant={this.props.restaurant}
              setModalVisible={this.props.setModalVisible}
              setValue={this.props.setValue}
              isAdmin={this.props.isAdmin}
              isRestaurantNotiOn={this.props.isRestaurantNotiOn}
              setFavourite={this.props.setFavourite}
              favourites={this.props.favourites}
              editRestaurant={this.props.editRestaurant}
              deleteRestaurant={this.props.deleteRestaurant}/>
          </Modal>
          <View style={{flex: 1, borderBottomWidth: 1}}>
            <View style={styles.rowContainer}>
              <TouchableHighlight
                onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
                <Text style={styles.listItemTitle}>{this.props.restaurant.name}</Text>
              </TouchableHighlight>
            </View>
              <GallerySwiper {...this.props} openModel={() => this.props.setModalVisible(this.props.restaurant._key, true)} />
            <View style={[styles.notiView, {paddingLeft: 15, paddingRight: 15, justifyContent: 'center'}]}>
              <TouchableHighlight
              style={{flexDirection: 'row'}}
                onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
                underlayColor='#fff'>
                  <View style={styles.notiIconView}>
                      <Icon
                          name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                          type='font-awesome'
                          color='red'/>
                  </View>
                </TouchableHighlight>
                <View style={[{paddingLeft: 10}]}><Text>{this.props.restaurant.short_description}</Text></View>
            </View>
            <View style={styles.notiView}>
              <TouchableOpacity
                onPress={()=>{this.props.openMap(this.props.restaurant.address)}}
                >
                <View style={styles.notiIconView}>
                    <Icon
                        name='map-marker'
                        type='font-awesome'/>
                    <View style={{paddingLeft: 5}}><Text>{this.props.restaurant.address}</Text></View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableHighlight
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
            </TouchableHighlight>
            <View style={[styles.rowContainer, {paddingTop: 15}]}>
              <Text style={{fontSize: 11}}>Get notified when additional tables become available</Text>
            </View>
            <View style={[styles.listNotiView, {paddingBottom: this.props.restaurant.isAdmin ? 0 : 58}]}>
                <View style={styles.notiIconView}>
                    <Icon
                        name='bell'
                        type='font-awesome'
                        color='#626262'/>
                    <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
                </View>

                <Switch onValueChange={(value) => this.props.setValue(this.props.restaurant._key, value)}
                value={this.props.isRestaurantNotiOn[this.props.restaurant._key] === true ? true : false}/>
            </View>
            {this.props.isAdmin && <View style={[styles.rowContainer, {paddingBottom: 58}]}>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => this.props.editRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[styles.submitText, {paddingLeft: 20, paddingRight: 20}]}>Edit</Text>
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
