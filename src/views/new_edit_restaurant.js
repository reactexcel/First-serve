/**
 * @class AdminHome
 */

import React, {Component} from "react";
import {
    Text,
    TextInput,
    Switch,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    ListView,
    ScrollView
} from "react-native";

import Button from "apsl-react-native-button";
import {Icon} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import {Sae} from "react-native-textinput-effects";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import CommonStyle from "../styles/admin.css";
import Database from "../firebase/database";
import ImageListItem from "./image_list_item"
import DismissKeyboard from "dismissKeyboard";
import * as firebase from "firebase";

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    this.setState({uploading: true});
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('restaurant_images').child(`${sessionId}`)

debugger
    fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      }).then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      }).then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      }).then((url) => {
        this.setState({uploading: false});
        resolve(url, sessionId);
      }).catch((error) => {
        this.setState({uploading: false});
        reject(error);
    })
  })
}

class NewEditRestaurant extends Component {
  static navigationOptions = {
      title: 'New Restaurant',
      headerTitleStyle :{alignSelf: 'center', color: 'white'},
      headerStyle:{
          backgroundColor: '#122438',
      }
  };
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.storageId !== row2.storageId});
      this.state = {
          restaurant: this.props.navigation.state.params.restaurant,
          email: "",
          password: "",
          confirmPassword: "",
          uploading: false,
          dataSource: dataSource.cloneWithRows(this.props.navigation.state.params.restaurant.images)
      };

      this.setVal = this.setVal.bind(this);
  }

  componentWillMount() {
  }

  componentWillUnmount(){
  }

  render() {
        return (
          <ScrollView keyboardDismissMode={'none'}>
            <View style={CommonStyle.container}>
                <View style={{padding: 15}}>
                    <Sae
                        label={"Restaurant Name"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(name) => this.setVal("name", name)}
                        value={this.state.restaurant.name}
                        keyboardType="default"
                        autoCapitalize="none"/>
                    <Sae
                        label={"Email Address"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(email) => this.setState({email: email})}
                        value={this.state.email}
                        keyboardType="email-address"
                        autoCapitalize="none"/>
                    <Sae
                        label={"Password"}
                        iconClass={FontAwesomeIcon}
                        iconName={"key"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(password) => this.setState({password: password})}
                        value={this.state.password}
                        password={true}
                        secureTextEntry={true}
                        autoCapitalize="none"/>

                    <Sae
                        label={"Confirm Password"}
                        iconClass={FontAwesomeIcon}
                        iconName={"key"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(confirmPassword) => this.setState({confirmPassword: confirmPassword})}
                        value={this.state.confirmPassword}
                        password={true}
                        secureTextEntry={true}
                        autoCapitalize="none"/>

                    <Sae
                        label={"Address"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(address) => this.setVal("address", address)}
                        value={this.state.restaurant.address}
                        keyboardType="default"
                        autoCapitalize="none"/>

                    <Sae
                        label={"Phone Number"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(phone_number) => this.setVal("phone_number", phone_number)}
                        value={this.state.restaurant.phone_number}
                        keyboardType="phone-pad"
                        autoCapitalize="none"/>

                    <Sae
                        label={"Website"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(website_url) => this.setVal("website_url", website_url)}
                        value={this.state.restaurant.website_url}
                        keyboardType="url"
                        autoCapitalize="none"/>

                    <Sae
                        label={"Link to Instagram"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(instagram_url) => this.setVal("instagram_url", instagram_url)}
                        value={this.state.restaurant.instagram_url}
                        keyboardType="url"
                        autoCapitalize="none"/>

                    <Sae
                        label={"Restaurant Kitchen Type"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(type) => this.setVal("type", type)}
                        value={this.state.restaurant.type}
                        keyboardType="default"
                        autoCapitalize="none"/>

                    <Sae
                        label={"Booking URL"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(booking_url) => this.setVal("booking_url", booking_url)}
                        value={this.state.restaurant.booking_url}
                        keyboardType="url"
                        autoCapitalize="none"/>

                    <Text style={{color: '#7873B1', fontSize: 18, fontWeight: 'bold', paddingTop: 16}}>Short Description</Text>
                    <TextInput
                        style={{color: '#9A886F', fontSize: 18}}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(short_description) => this.setVal("short_description", short_description)}
                        value={this.state.restaurant.short_description}/>

                    <Text style={{color: '#7873B1', fontSize: 18, fontWeight: 'bold', paddingTop: 16}}>Long Description</Text>
                    <TextInput
                        style={{color: '#9A886F', fontSize: 18}}
                        multiline={true}
                        numberOfLines={8}
                        onChangeText={(long_description) => this.setVal("long_description", long_description)}
                        value={this.state.restaurant.long_description}/>

                    <Text style={{color: '#7873B1', fontSize: 18, fontWeight: 'bold', paddingTop: 16}}>Booking Message</Text>
                    <TextInput
                        style={{color: '#9A886F', fontSize: 18}}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={(booking_message) => this.setVal("booking_message", booking_message)}
                        value={this.state.restaurant.booking_message}/>

                    <Sae
                        label={"Price Range"}
                        iconClass={FontAwesomeIcon}
                        iconName={"pencil"}
                        iconColor={"#98866F"}
                        inputStyle={{ color: '#98866F' }}
                        onChangeText={(price_range) => this.setVal("price_range", price_range)}
                        value={this.state.restaurant.price_range}
                        keyboardType="default"
                        autoCapitalize="none"/>
                    <View>
                      <Text style={{color: '#7873B1', fontSize: 18, fontWeight: 'bold', paddingTop: 16}}>Restaurant Images:</Text>
                      <ListView
                        style={{paddingTop: 10}}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={this._renderItem.bind(this)}
                        style={CommonStyle.listView}/>
                    </View>

                    {this.state.uploading && <Progress.CircleSnail color={['red', 'green', 'blue']} />}

                    <View style={styles.submit}>
                      <Button onPress={this.addImage.bind(this)} style={CommonStyle.buttons} textStyle={{fontSize: 18}}>
                          Add Image
                      </Button>
                        <Button onPress={this.save.bind(this)} style={CommonStyle.buttons} textStyle={{fontSize: 18}}>
                            Save
                        </Button>
                        <Button onPress={this.cancel.bind(this)} style={styles.buttons} textStyle={{fontSize: 18}}>
                            Cancel
                        </Button>
                    </View>
                </View>
                <View>
                    <Text style={styles.response}>{this.state.response}</Text>
                </View>
            </View>
        </ScrollView>
    );
  }

  setVal(propName, val){
    rest = this.state.restaurant;
    rest[propName] = val;
    this.setState({restaurant: rest});
  }

  addImage(){
    var options = {
      title: 'Select Avatar',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }else {
        uploadImage(response.uri).then((url, sessionId) => {

          this.setState({ uploadURL: url });
        }).catch(error => console.log(error))
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({avatarSource: source});
      }
    });
  }

  save(){
    if(this.state.password == this.state.confirmPassword){
      Database.addRestaurant(this.state.email, this.state.password, this.state.restaurant, function(restaurantKey){
        console.log("Restaurant Key", restaurantKey);
      })
      this.props.navigation.goBack();
    }else{
      alert('Password and confirm password are not matched!');
      this.setState({password: "", confirmPassword: ""});
    }
  }

  cancel(){
    this.props.navigation.goBack();
  }

  deleteImage(){

  }

  primaryImage(){

  }

  _renderItem(image) {
    return (
      <ImageListItem image={image}
      deleteImage={this.deleteImage.bind(this)}
      primaryImage={this.primaryImage.bind(this)} />
    );
  }
}

const styles = StyleSheet.create({
    title: {
        paddingBottom: 16,
        textAlign: "center",
        color: "#000",
        fontSize: 35,
        fontWeight: "bold",
        opacity: 0.8,
    },
    submit: {
        paddingTop: 30
    },
    response: {
        textAlign: "center",
        paddingTop: 0
    }
});

module.exports = NewEditRestaurant;
