import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import styles from "../styles/restaurant.css";
import {Icon} from "react-native-elements";
import Moment from 'moment';
import FixWidthImage from "../components/fix_width_image"

class TableListItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    return (
      <View style={styles.listItem}>
        <View style={styles.rowContainerLF}>
          <View style={styles.headingLeft}>
            <Text style={{color: '#FFF', fontSize: 18}}>
              {this.props.table.people} people
            </Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <Text style={{color: '#FFF', fontSize: 18}}>
              {Moment(this.props.table.startTime).format('HH:mm')}-{Moment(this.props.table.endTime).format('HH:mm')}
            </Text>
          </View>
          {!this.props.isBooked && <TouchableHighlight
            style={styles.headingRight}
            onPress={() => this.props.deleteTable(this.props.table.key)}
            underlayColor='#98866F'>
            <View>
              <Icon
                name='trashcan'
                type='octicon'
                color='#fff'/>
              </View>
          </TouchableHighlight>}
        </View>
      </View>
    );
  }
}

module.exports = TableListItem;
