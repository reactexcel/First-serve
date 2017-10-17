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

import Button from "apsl-react-native-button";
import styles from "../styles/admin.css";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import RestaurantView from "./restaurant_view";
import GallerySwiper from "../components/swiper";
import Moment from 'moment';

class BookedItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
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
            favourites={this.props.favourites}/>
        </Modal>
        <View style={{flex: 1, borderBottomWidth: 1}}>
          <View style={styles.rowContainer}>
            <Text style={styles.listItemTitle}>{this.props.restaurant.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <GallerySwiper {...this.props} openModel={() => {             this.props.setModalVisible(this.props.restaurant._key, true)}} />
          </View>
          <View style={[styles.notiView, {paddingLeft: 15, paddingRight: 15, justifyContent: 'center'}]}>
            <TouchableHighlight
            style={{flexDirection: 'row'}}
              onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
              underlayColor='#fff'>
              <View style={styles.notiIconView,{flexDirection:'row'}}>
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
