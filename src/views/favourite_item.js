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
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
              <Text style={styles.listItemTitle}>{this.props.restaurant.name.toUpperCase()}</Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.rowContainer,{marginTop:0}]}>
            <GallerySwiper {...this.props} openModel={() => this.props.setModalVisible(this.props.restaurant._key, true)} />
          </View>
          <View style={[styles.notiView, {alignItems:'center',marginTop:13}]}>
            <View style={{justifyContent:'center',alignItems:'center'}}><Text style={{textAlign:'center',fontSize:12,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.type.toUpperCase()}</Text></View>

          </View>
          <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:-30,marginRight:25}}>
            <TouchableHighlight
            style={{flexDirection: 'row'}}
              onPress={() => this.props.setFavourite(this.props.restaurant._key, (this.props.favourites[this.props.restaurant._key] === true ? false : true))}
              underlayColor='#fff'>
                <View style={styles.notiIconView}>
                    <Icon
                        size={30}
                        name={this.props.favourites[this.props.restaurant._key] === true ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color={this.props.favourites[this.props.restaurant._key] === true ? 'red' : 'black'}/>
                </View>
              </TouchableHighlight>
          </View>
          <View style={styles.notiView}>
            <View>
              <TouchableOpacity
                onPress={()=>{this.props.openMap(this.props.restaurant.address)}}
                >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Icon
                        size={18}
                        color='#023e4eff'
                        name='map-marker'
                        type='font-awesome'/>
                </View>

              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{this.props.openMap(this.props.restaurant.address)}}
                >
              <View style={{paddingLeft: 5,paddingTop:5}}><Text style={{fontSize:14,fontWeight:'bold',color:'#023e4eff'}}>{this.props.restaurant.address}</Text></View>
            </TouchableOpacity>
            </View>
          </View>

          <View style={[{flex: 1,flexDirection:'row',alignItems:'center',justifyContent: 'center'}, {paddingTop: 8,paddingBottom:10}]}>
            <Text style={{fontSize: 12,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.short_description}</Text>
          </View>
          <View style={[styles.listNotiView, {paddingBottom: this.props.isAdmin ? 0 : 0}]}>
              <View style={styles.notiIconView}>
                  <Text style={{color:'#023e4eff',fontWeight:'bold',fontSize:13}}>TABLE NOTIFICATIONS</Text>
              </View>
          </View>
          <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:-22,marginBottom:24,marginRight:25}}>
            <Switch onValueChange={(value) => this.props.setValue(this.props.restaurant._key, value)}
              value={this.props.isRestaurantNotiOn[this.props.restaurant._key] === true ? true : false}/>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = FavouriteItem;
