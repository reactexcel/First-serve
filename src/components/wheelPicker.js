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
import Picker from 'react-native-wheel-picker'
var PickerItem = Picker.Item;

export default class WheelPicker extends Component {
    render() {
        return (
            <View style={styles.container}>
            <View style={{marginTop:30}}>
              <Text style={styles.welcome}>
                How many people are you ?
              </Text>
            </View>
              <View style={{marginBottom:10 }}>
                <Picker style={{width: 150, height: 180}}
                  selectedValue={this.props.selectedMember}
                  itemStyle={{ color:"black", fontSize:26}}
                  onValueChange={(index) => {this.props.onPikcerSelect(index)}}>
                    {this.props.itemList.map((value, i) => (
                      <PickerItem label={value} value={i} key={"money"+value}/>
                    ))}
                </Picker>
              </View>
              <View style={{flex:0,marginLeft:30,marginRight:30,flexDirection:'row',marginBottom:25,justifyContent:'space-around'}}>
                <View style={{flex:1,alignItems:'center',marginRight:20,backgroundColor:'#ABB7B7'}}>
                  <Text style={{color: 'black',padding:10}}
                    onPress={()=>{this.props.onItemSelect()}}>
                    Set
                  </Text>
                </View>
                <View style={{flex:1,alignItems:'center',marginLeft:20,backgroundColor:'#ABB7B7'}}>
                  <Text style={{ color: 'black',padding:10}}
                    onPress={()=>{this.props.onCancel()}}>
                    Cancel
                  </Text>
                </View>
              </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:70,
    marginBottom:80,
    margin:40,
    justifyContent:'space-between',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    // marginBottom: 10,
    color: 'black',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
