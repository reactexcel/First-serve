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

import Button from "apsl-react-native-button";
import styles from "../styles/admin.css";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import RestaurantView from "./restaurant_view";
import Moment from 'moment';

class BookedItem extends Component {
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
              <View style={styles.notiIconView}>
                  <Icon
                      name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                      type='font-awesome'
                      color='red'/>
              </View>
              <View style={[{paddingLeft: 10}]}><Text>{this.props.restaurant.short_description}</Text></View>
          </View>
          <View style={styles.notiView}>
              <View style={styles.notiIconView}>
                  <Icon
                      name='map-marker'
                      type='font-awesome'/>
                  <View style={{paddingLeft: 5}}><Text>{this.props.restaurant.address}</Text></View>
              </View>
          </View>
          <View style={[{paddingLeft: 15, paddingRight: 15, paddingTop: 15}]}>
            <Text style={{fontSize: 18}}>{this.props.table.pax} people</Text>
            <Text style={{fontSize: 18}}>{Moment(parseInt(this.props.table.startTime)).format('HH:mm')} - {Moment(parseInt(this.props.table.endTime)).format('HH:mm')}</Text>
          </View>
          <View style={[styles.bottomBorder, {paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 58}]}>
            <Text style={{fontSize: 15}}>{this.props.restaurant.phone_number}</Text>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = BookedItem;
