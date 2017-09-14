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

import styles from "../styles/common.css";
import {Icon} from "react-native-elements";
import FullWidthImage from "../components/full_width_image"
import Toolbar from 'react-native-toolbar';

class RestaurantListItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    return (
      <View style={styles.listItem}>
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.isModelVisible[this.props.restaurant._key] === true ? true : false}
          onRequestClose={() => {this.props.setModalVisible(this.props.restaurant._key, false)}}
          >

         <View style={styles.container}>
         <Toolbar ref={(toolbar) => {this.toolbar = toolbar}} presets={{
                            toolbar1: {
                                hover: true,
                                rightButton: {
                                    icon: 'bars',
                                    iconStyle: {color: 'blue', fontSize: 25,},
                                    iconFontFamily: 'FontAwesome',
                                    onPress: () => {},
                                },
                                search: {
                                    placeholderText: 'Where to Next?',
                                    placeholderTextColor: 'blue',
                                    textStyle: {color: 'grey', fontSize: 14},
                                    onSubmit: () => {},
                                    onFocus: () => {this.onSearchFocused()},
                                    onTextChanged: (text) => {console.log(text)},
                                    icon: 'search',
                                    iconStyle: {color: 'blue', fontSize: 18,},
                                    iconFontFamily: 'FontAwesome',
                                }
                            },
                            toolbar2: {
                                leftButton: {
                                    icon: 'chevron-circle-left',
                                    iconStyle: {color: 'blue', fontSize: 25,},
                                    iconFontFamily: 'FontAwesome',
                                    text: 'Back',
                                    textStyle: {color: 'blue', fontSize: 14,},
                                    onPress: () => {},
                                },
                                rightButton: {
                                    icon: 'bars',
                                    iconStyle: {color: 'blue', fontSize: 25,},
                                    iconFontFamily: 'FontAwesome',
                                    onPress: () => {},
                                },
                            },
                        }}/>
          <View>

                <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.props.setModalVisible(this.props.restaurant._key, false)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
        <View style={{flex: 1, borderBottomWidth: 1}}>
          <View style={styles.rowContainer}>
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
              <Text style={styles.listItemTitle}>{this.props.restaurant.name}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.rowContainer}>
            <TouchableHighlight
              onPress={() => this.props.setModalVisible(this.props.restaurant._key, true)}>
              <FullWidthImage source={{uri: this.props.restaurant.images[0].imageUrl}} />
            </TouchableHighlight>
          </View>
          <View style={styles.notiView}>
              <View style={styles.notiIconView}>
                  <Icon
                      name='heart'
                      type='font-awesome'
                      color='red'/>
                  <View style={{paddingLeft: 5}}><Text>{this.props.restaurant.short_description}</Text></View>
              </View>
          </View>
          <View style={styles.notiView}>
              <View style={styles.notiIconView}>
                  <Icon
                      name='map-marker'
                      type='font-awesome'/>
                  <View style={{paddingLeft: 5}}><Text>{this.props.restaurant.address}</Text></View>
              </View>
          </View>
          <TouchableHighlight
            style={styles.submit}
            onPress={() => Linking.openURL(this.props.restaurant.booking_url)}
            underlayColor='#fff'>
              <Text style={[styles.submitText]}>Regular booking</Text>
          </TouchableHighlight>
          <View style={styles.rowContainer}>
            <Text style={{fontSize: 11}}>Get notified when additional tables become available</Text>
          </View>
          <View style={styles.listNotiView}>
              <View style={styles.notiIconView}>
                  <Icon
                      name='bell'
                      type='font-awesome'
                      color='#626262'/>
                  <View style={{paddingLeft: 5}}><Text>Notifications</Text></View>
              </View>

              <Switch onValueChange={(value) => this.props.setValue(this.props.restaurant._key, value)}
              value={this.props.isRestaurantNotiOn[this.props.restaurant._key] === true ? true : false}/>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = RestaurantListItem;
