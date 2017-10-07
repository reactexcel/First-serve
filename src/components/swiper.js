import React, {
  Component
} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableHighlight
} from 'react-native';
import Swiper from 'react-native-swiper'
import FullWidthImage from "./full_width_image"
import styles from "../styles/admin.css";

export default class GallerySwiper extends Component {
    render() {
        return (
          <View style={styles.swiperConatiner}>
            <Swiper  height={255} horizontal={true} removeClippedSubviews={false} >
              {this.props.restaurant.images.map((images, key) => {
                return(
                    <View key={key} style={styles.swiperConatiner}>
                      <TouchableHighlight style={styles.swiperConatiner} onPress={()=>{this.props.openModel()}}>
                        <FullWidthImage
                          source={{uri: this.props.restaurant.images.length > 0 ? images.imageUrl : 'https://firebasestorage.googleapis.com/v0/b/first-served-c9197.appspot.com/o/restaurant_images%2Frestaurant.jpg?alt=media&token=b0ca19be-6594-4bb1-bfdb-3c9474a0b234'}} />
                      </TouchableHighlight>
                    </View>
                )
              })}
            </Swiper>
          </View>
        );
    }
}
