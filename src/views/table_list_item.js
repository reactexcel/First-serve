import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import { HEXCOLOR } from "../styles/hexcolor.js";
import styles from "../styles/restaurant.css";
import {Icon} from "react-native-elements";
import Moment from 'moment';
import FixWidthImage from "../components/fix_width_image"

class TableListItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    return (
      <View style={[styles.listItem,]}>
        <View style={[styles.rowContainerLF]}>
          <View style={styles.headingLeft}>
            <TouchableHighlight
              onPress={() => this.props.toogleNamePhone(this.props.table.key, this.props.isBooked)}
              underlayColor='#98866F'>
              <Text style={{fontWeight:'500', color: 'grey', fontSize: 14}}>
                {this.props.table.people} people
              </Text>
            </TouchableHighlight>
          </View>
          {this.props.isBooked && <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
            <TouchableHighlight
              onPress={() => this.props.toogleNamePhone(this.props.table.key, this.props.isBooked)}
              underlayColor='#98866F'>
              <Text style={{fontWeight:'500', color: 'grey', fontSize: 14}}>
                {this.props.table.shouldShowName ? this.props.table.bookedBy : this.props.table.bookedByPhone}
              </Text>
            </TouchableHighlight>
          </View>}
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <TouchableHighlight
              onPress={() => this.props.toogleNamePhone(this.props.table.key, this.props.isBooked)}
              underlayColor='#98866F'>
              <Text style={{fontWeight:'500', color: 'grey', fontSize: 14}}>
                {Moment(this.props.table.startTime).format('HH:mm')}-{Moment(this.props.table.endTime).format('HH:mm')}
              </Text>
            </TouchableHighlight>
          </View>
          {!this.props.isBooked && <TouchableHighlight
            style={styles.headingRight}
            onPress={() => this.props.deleteTable(this.props.table.key)}
            underlayColor='#98866F'>
            <View>
              <Icon
                size={20}
                name='ios-trash'
                type='ionicon'
                color={'grey'}/>
              </View>
          </TouchableHighlight>}
        </View>
      </View>
    );
  }
}

module.exports = TableListItem;
