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
  Modal
} from 'react-native';

import styles from "../styles/admin.css";
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
            <FullWidthImage source={{uri: this.props.restaurant.images.length > 0 ? this.props.restaurant.images[0].imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
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
              <View style={styles.notiIconView}>
                  <Icon
                      name='map-marker'
                      type='font-awesome'/>
                  <View style={{paddingLeft: 5}}><Text>{this.props.restaurant.address}</Text></View>
              </View>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = FavouriteItem;
