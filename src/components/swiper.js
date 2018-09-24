import React, {
  Component
} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper'
import FullWidthImage from "./full_width_image"
import styles from "../styles/admin.css";
import {Icon} from "react-native-elements";
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
                            width: undefined,
                            alignItems: 'flex-end'
                          }}
                          resizeMode={'cover'}
                          resizeMethod="resize"
                          source={{uri: image.imageUrl }}>
                          {!this.props.isInfoIconHidden && <Icon
                            style={{alignSelf: 'flex-end', top: 5, right: 5}}
                            size={30}
                            name='info'
                            type='octicon'
                            reverse='false'
                            color='transparent'
                            reverseColor='white'/>
                          }
                        </Image>
                      </TouchableHighlight>
                    </View>
                )
              })}
            </Swiper>
          </View>
        );
    }
}
