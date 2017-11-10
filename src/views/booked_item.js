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
import call from 'react-native-phone-call'

class BookedItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1, borderBottomWidth: 0.5,borderColor:'#023e4eff'}}>
          <View style={styles.rowContainer}>
            <Text style={styles.listItemTitle}>{this.props.restaurant.name.toUpperCase()}</Text>
          </View>
            <GallerySwiper {...this.props} openModel={() => {             this.props.setModalVisible(this.props.restaurant._key, true)}} />
          <View style={[styles.notiView, {alignItems:'center',marginTop:3}]}>
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
            <Text numberOfLines={2} style={{fontSize: 12,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.short_description}</Text>
          </View>
          <View style={[ styles.bottomBorder,styles.topBorder,{margin:15,marginTop:17}]}>

              <View style={[{paddingTop: 20,paddingBottom:20}]}>
                <Text style={{fontWeight:'500',color:'#023e4eff', fontSize: 13,textAlign:'center'}}>TABLE FOR {this.props.table.pax} PEPOLE</Text>
                <Text style={{fontWeight:'500',color:'#023e4eff',fontSize: 13,textAlign:'center'}}>{Moment(parseInt(this.props.table.startTime)).format('HH:mm')} - {Moment(parseInt(this.props.table.endTime)).format('HH:mm')} </Text>
                <Text style={{fontWeight:'500',color:'#023e4eff',fontSize: 13,textAlign:'center'}}>{Moment(parseInt(this.props.table.startTime)).format('DD-MM-YYYY')}</Text>
              </View>

          </View>
          <View style={[{flex: 1,flexDirection:'row',alignItems:'center',justifyContent: 'center'}, {paddingTop: 8,paddingBottom:10}]}>
            <Text numberOfLines={2} style={{fontSize: 12,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.booking_message}</Text>
          </View>
          <TouchableHighlight
            onPress={()=>{
              Linking.openURL(`tel:${this.props.restaurant.phone_number}`)
            }}
            >
          <View style={[{marginTop:7,marginBottom:5,alignItems:'center'}]}>
            <Icon
              size={28}
              style={{marginLeft:4}}
              name='mobile'
              type='font-awesome'
              color='#023e4eff'/>
          </View>
        </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              if(this.props.restaurant.phone_number.length > 0){
                Linking.openURL(`tel:${this.props.restaurant.phone_number}`)
              }else{
                console.log('PhoneNumber', "Not Present.")
              }
            }}
            >
            <Text style={{marginBottom:23,textAlign:'center',fontWeight:'600',fontSize: 15,color:'#023e4eff'}}>{this.props.restaurant.phone_number}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = BookedItem;
