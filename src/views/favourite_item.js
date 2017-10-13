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
