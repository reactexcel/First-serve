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

class TableTypeListItem extends Component {
  render() {
    // We are going to return a simple list item with just a title for now
    // this.props.setModalVisible(this.props.restaurant._key, true)
    return (
      <View style={styles.listItem}>
        <View style={[styles.rowContainerLF,{marginLeft:10,marginRight:10}]}>
          <View style={styles.headingLeft}>
            <Text style={{color: '#023e4eff', fontSize: 14,marginTop:5}}>
              Table for {this.props.tableType.tableType} people
            </Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end',marginTop:10}}>
            <Text style={{color: '#023e4eff', fontSize: 14  }}>
              {this.props.tableType.noOfUsers} user
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = TableTypeListItem;
