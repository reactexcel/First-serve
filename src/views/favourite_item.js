import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Switch,
  Linking,
  Modal,
  TouchableOpacity
} from 'react-native';

import styles from "../styles/admin.css";
import GallerySwiper from "../components/swiper";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import RestaurantView from "./restaurant_view";

class FavouriteItem extends Component {

  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1, borderBottomWidth: 1}}>
          <View style={styles.rowContainer}>
            <Text style={styles.listItemTitle}>{this.props.restaurant.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <GallerySwiper {...this.props} openModel={() => this.props.setModalVisible(this.props.restaurant._key, true)} />
          </View>
          <View style={[styles.notiView, {paddingLeft: 15, paddingRight: 15, justifyContent: 'center'}]}>
            <TouchableHighlight
            style={{flexDirection: 'row'}}
              onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
              underlayColor='#fff'>
                <View style={[styles.notiIconView, {flexDirection: 'row'}]}>
                    <Icon
                        name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='red'/>
                        <View style={[{paddingLeft: 10}]}><Text>{this.props.restaurant.short_description}</Text></View>
                </View>
              </TouchableHighlight>
          </View>
          <View style={[styles.notiView, {paddingBottom: 58}]}>
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

          <View style={[styles.rowContainer, {paddingTop: 15}]}>
            <Text style={{fontSize: 11}}>Get notified when additional tables become available</Text>
          </View>
          <View style={[styles.listNotiView, {paddingBottom: this.props.isAdmin ? 0 : 58}]}>
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
        </View>
      </View>
    );
  }
}

module.exports = FavouriteItem;
