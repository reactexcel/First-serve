import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  // Switch,
  Linking,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';

import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window')
import styles from "../styles/admin.css";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import GallerySwiper from "../components/swiper"
import RestaurantView from "./restaurant_view";
import  Switch  from '../components/switch';
import Triangle from 'react-native-triangle';

class RestaurantListItem extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  componentDidMount(){
    if(this.props.isFirstTime){
      // this.refs['tooltip' + this.props.restaurant._key].toggle();
    }
  }

  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)

    if(this.props.restaurant.isAddButton !== true){
      return (
        <View style={styles.listItem}>
          <View style={{flex: 1, borderBottomWidth: 2,borderColor:'#023e4eff'}}>
            <View style={styles.rowContainer}>
              <TouchableHighlight
                onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
                <Text style={styles.listItemTitle}>{this.props.restaurant.name.toUpperCase()}</Text>
              </TouchableHighlight>
            </View>
              <GallerySwiper {...this.props} openModel={() => this.props.setModalVisible(this.props.restaurant._key, true)} />
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
                <View style={{paddingLeft: 5,paddingTop:5}}><Text style={{fontSize:13,fontWeight:'bold',color:'#023e4eff'}}>{this.props.restaurant.address}</Text></View>
              </TouchableOpacity>
              </View>
            </View>
            {/* <TouchableHighlight
              style={this.props.restaurant.fully_booked ? styles.submitDisable : styles.submit}
              onPress={() => {
                if(this.props.restaurant.fully_booked){
                  console.log('Regular booking', 'fully booked');
                }else{
                  if(this.props.restaurant.website_url.length > 0){
                    Linking.openURL(this.props.restaurant.website_url);
                  }else{
                    console.log('Website', "Url Not Present.");
                  }
                }
              }}
              underlayColor='#fff'>
                <Text style={this.props.restaurant.fully_booked ? styles.submitTextDisable : styles.submitText}>{this.props.restaurant.fully_booked ? 'FULLY BOOKED' : 'Regular booking'}</Text>
            </TouchableHighlight> */}
            <View>
            </View>
            <View style={[{flex: 1,flexDirection:'row',alignItems:'center',justifyContent: 'center'}, {paddingTop: 8,paddingBottom:10}]}>
              <Text style={{fontSize: 13,textAlign:'center',paddingLeft:30,paddingRight:30,color:'#a79a95ff',fontWeight:'bold'}}>{this.props.restaurant.short_description}</Text>
            </View>
            <View style={[styles.listNotiView, {paddingBottom: this.props.isAdmin ? 0 : 0}]}>
                <View style={styles.notiIconView}>
                    <Text style={{color:'#023e4eff',fontWeight:'bold',fontSize:13}}>TABLE NOTIFICATIONS</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end',marginTop:-24,marginBottom: this.props.isFirstTime ? 100 : 24,marginRight:25}}>
              <Switch
                active={this.props.isRestaurantNotiOn[this.props.restaurant._key]}
                onChangeState={(value)=>{this.props.setValue(this.props.restaurant._key, value)}}
                buttonRadius={12}
                switchHeight={16}
                switchWidth={37}
                activeBackgroundColor='#056681'
                inactiveBackgroundColor='#BDC3C7'
                activeButtonColor='#023e4eff'
                activeButtonPressedColor='#023e4eff'
                inactiveButtonColor='white'
                inactiveButtonPressedColor='white'/>
                {this.props.isFirstTime && <View style={{width: 320, justifyContent:'center', position: 'absolute', top: 30, right: 0}}>
                  <View style={{flexDirection:'row', paddingRight: 20, justifyContent:'flex-end', alignItems:'center'}}>
                    <Triangle
                      width={25}
                      height={25}
                      color={'#F04847'}
                      direction={'up'}/>
                  </View>
                  <View style={{flexDirection:'row', padding: 15, justifyContent:'center', alignItems:'center', backgroundColor: '#F04847'}}>
                    <Text style={{flex: 1, color: '#FFF'}}>Get notified when tables become available. When notified - hurry up and book to be FirstServed</Text>
                    <TouchableHighlight
                      style={{flexDirection: 'row'}}
                      onPress={() => this.props.hideTooltip()}
                      underlayColor='#F04847'>
                        <View style={[styles.notiIconView, {marginLeft: 5}]}>
                            <Icon
                                size={15}
                                name={'times'}
                                type='font-awesome'
                                color={'#FFF'}/>
                        </View>
                      </TouchableHighlight>
                  </View>
                </View>}
            </View>
            {this.props.isAdmin && <View style={[styles.rowContainer, {paddingBottom: 58}]}>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => this.props.editRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[styles.submitText, {paddingLeft: 30, paddingRight: 30}]}>Edit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => this.props.deleteRestaurant(this.props.restaurant)}
                underlayColor='#fff'>
                  <Text style={[styles.submitText, {paddingLeft: 20, paddingRight: 20}]}>Delete</Text>
              </TouchableHighlight>
            </View>}
          </View>
        </View>);
      }else{
        return(
          <View style={[styles.listItem]}>
            <View style={[styles.listNotiView, {flex: 1}]}>
              <TouchableHighlight
                style={styles.submit}
                onPress={() => this.props.newRestaurant()}
                underlayColor='#fff'>
                <Text style={[styles.submitText, {paddingLeft: 40, paddingRight: 40}]}>Add Restaurant</Text>
              </TouchableHighlight>
            </View>
          </View>);
      }
  }
}

module.exports = RestaurantListItem;
