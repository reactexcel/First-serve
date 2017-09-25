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
import FixWidthImage from "../components/fix_width_image"

class ImageListItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    if(this.props.image.primary !== true){
      return (
        <View style={styles.listItem}>
          <View style={styles.rowContainerLF}>
            <FixWidthImage imgWidth={100} source={{uri: this.props.image.imageUrl ? this.props.image.imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
            <TouchableHighlight
              style={styles.btn}
              onPress={() => this.props.primaryImage(this.props.image.storageId)}
              underlayColor='#fff'>
                <Text style={[styles.submitText, {paddingLeft: 20, paddingRight: 20}]}>Primary</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.btn}
              onPress={() => this.props.deleteImage(this.props.image.uid, this.props.image.restaurantId, this.props.image.storageId, this.props.image.fileName)}
              underlayColor='#fff'>
                <Text style={[styles.submitText, {paddingLeft: 20, paddingRight: 20}]}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>);
      }else{
        return(
          <View style={styles.listItem}>
            <View style={styles.rowContainer}>
              <FixWidthImage imgWidth={200} source={{uri: this.props.image.imageUrl ? this.props.image.imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
            </View>
          </View>);
      }
  }
}

module.exports = ImageListItem;
