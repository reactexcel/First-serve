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
var {height, width} = Dimensions.get('window');

export default class GallerySwiper extends Component {
    render() {
        return (
          <View style={styles.swiperConatiner}>
            <Swiper  height={260} horizontal={true}  dotStyle={{borderWidth:2,borderColor:'white'}} activeDotColor={"white"} >
              {this.props.restaurant.images.map((image, key) => {
                return(
                    <View key={key} style={styles.swiperConatiner}>
                      <TouchableHighlight style={styles.swiperConatiner} onPress={()=>{this.props.openModel()}}>
                        <Image
                          Key={key}
                          style={{flex:1,
                            height: undefined,
                            width: undefined
                          }}
                          resizeMode={'cover'}
                          source={{uri: image.imageUrl }}
                        />
                      </TouchableHighlight>
                    </View>
                )
              })}
            </Swiper>
          </View>
        );
    }
}
