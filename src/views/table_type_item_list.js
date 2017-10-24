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
        <View style={styles.rowContainerLF}>
          <View style={styles.headingLeft}>
            <Text style={{color: HEXCOLOR.pureWhite, fontSize: 18}}>
              Table for {this.props.tableType.tableType} people
            </Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <Text style={{color: HEXCOLOR.pureWhite, fontSize: 18}}>
              {this.props.tableType.noOfUsers} user
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = TableTypeListItem;
