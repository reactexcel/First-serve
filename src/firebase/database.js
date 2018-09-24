/**
 * @class Database
 */

import * as firebase from "firebase";
import Firebase from "./firebase";
import Firestack from 'react-native-firestack';
import Moment from 'moment';
const firestack = new Firestack();
import { Platform, StyleSheet } from 'react-native';

class Database {
    static isDataAdded = false;

    /**
     * Sets a users mobile number
     * @param userId
     * @param mobile
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserMobile(userId, mobile) {
        let userMobilePath = "/users/" + userId;

        return firebase.database().ref(userMobilePath).set({
            mobile: mobile
        })
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserMobile(userId, callback) {
        let userMobilePath = "/users/" + userId;

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
            var mobile = "";
            if (snapshot.val()) {
                mobile = snapshot.val().mobile
            }

            callback(mobile)
        });
    }

    static setRestaurantFullyBooked(userId, restaurantKey, isFullyBooked){
      let userMobilePath = "/restaurants/" + userId + "/" + restaurantKey;

      firebase.database().ref(userMobilePath).update({
          fully_booked: isFullyBooked
      });
    }

    static publishTable(table, callback){
      let userMobilePath = "/tables/";
      firebase.database().ref(userMobilePath).push(table);
      callback("Published");
    }

    static bookTable(restaurant, userId, tableKey, callback){
      let userMobilePath = "/tables/" + tableKey;
      console.log(tableKey,'dasd');
      firebase.database().ref(userMobilePath).transaction((table) => {
        console.log(table);
        if(table){
          var curTime = new Date().getTime();
          // debugger
          if(table.bookedBy){
            return;
          }else if(curTime < table.endTime) {
            table.bookedBy = userId;
            table.isBooked = true;
            table.searchKey = table.restaurantKey + "_1";

            return table;
          }else{
            return;
          }
        }else{
          return;
        }
      }, (error, committed, snapshot) => {
        if (error) {
          console.log('Something went wrong', error);
          callback(false);
        } else if (!committed) {
          console.log('Aborted'); // Returning undefined will trigger this
          callback(false);
        } else {
          console.log('Table booked');
          Database.logEvent(restaurant, false);
          callback(true);
        }

        console.log('User table now: ', snapshot.val());
      });
    }

    static logEvent(restaurant, isClicked){
      let logKey = Moment(new Date()).format('YYYY-MM-DD');
      let userlogPath = "/logs/" + logKey;
      firebase.database().ref(userlogPath).transaction((log) => {
        if(log){
          if(isClicked){
            log.clickedCount += 1;
          }else{
            log.bookingCount += 1;
          }
          return log;
        }else{
          if(isClicked)
            return {date: logKey, restaurantName: restaurant.name, clickedCount: 1, bookingCount: 0};
          else {
            return {date: logKey, restaurantName: restaurant.name, clickedCount: 0, bookingCount: 1};
          }
        }
      }, (error, committed, snapshot) => {
        if (error) {
          console.log('Something went wrong', error);
        } else if (!committed) {
          console.log('Aborted'); // Returning undefined will trigger this
        } else {
          console.log('Table booked');
        }

        console.log('User table now: ', snapshot.val());
      });
    }

    static deleteTable(tableKey, callback){
      let userMobilePath = "/tables/" + tableKey;
      firebase.database().ref(userMobilePath).remove();
      callback('deleted');
    }

    static fetchTable(userId,callback){
      let userMobilePath = '/tables';
      firebase.database().ref(userMobilePath).on('value',(snapshot)=>{
        callback(snapshot);
      });
    }

    static setUserNotiSetting(userId, notiOn){
      let userMobilePath = "/users/" + userId;

      firebase.database().ref(userMobilePath).update({
          notiOn: notiOn
      });
    }

    static setUserData(userId, pax, mobile,startTime,endTime,email){
      return new Promise((resolve) => {
        let userMobilePath = "/users/" + userId;
        return firebase.database().ref(userMobilePath).update({
            pax: pax,
            phone_number: mobile,
            UserNotifStartTime:startTime,
            UserNotifEndTime:endTime,
            email:email
        }).then((val)=>{
          resolve(val)
        });
      });
    }

    static setNotiId(userId, token){
      let userMobilePath = "/users/" + userId;

      firebase.database().ref(userMobilePath).update({
          notificationId: token
      });
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserNotiSetting(userId, callback) {
        let userMobilePath = "/users/" + userId;

        firebase.database().ref(userMobilePath).once('value', (snapshot) => {
            var notiOn = false;
            if (snapshot.val()) {
                notiOn = snapshot.val().notiOn
            }

            callback(notiOn)
        });
    }

    static setUserRestaurantNotiSetting(restaurantId, userId, notiOn){
      let userMobilePath = "/users/" + userId + "/restaurants_noti/" + restaurantId;

      firebase.database().ref(userMobilePath).set({
          notiOn: notiOn
      });
    }
    static resetUserRestaurantNotiSetting( userId){
      let resetUserMobilePath = "/users/" + userId + "/restaurants_noti";

      firebase.database().ref(resetUserMobilePath).once('value', (snapshot) => {
        console.log(snapshot,'reset');
          snapshot.forEach((val)=>{
            var restaurantId = val.key;
            var isNotif = val.val().notiOn;
            if(isNotif){
              let userPath = "/users/" + userId + "/restaurants_noti/" + restaurantId;
              firebase.database().ref(userPath).update({
                  notiOn: false
              });
            }
          })
      });
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUser(userId, callback) {
        let userMobilePath = "/users/" + userId;

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
          console.log("listenUser", 'called');
            callback(snapshot)
        });
    }

    static listenUserStop(userId) {
        let userMobilePath = "/users/" + userId;
        firebase.database().ref(userMobilePath).off();
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserRestaurantNotiSetting(userId, callback) {
        let userMobilePath = "/users/" + userId + "/restaurants_noti";

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
          firebase.database().ref(userMobilePath).off('value');
            callback(snapshot)
        });
    }
    static unListenUserRestaurantNotiSetting(userId){
      let userMobilePath = "/users/" + userId + "/restaurants_noti";
      firebase.database().ref(userMobilePath).off();
    }

    static setUserFavourites(restaurantId, userId, isFavourite){
      let userMobilePath = "/users/" + userId + "/favourite_restaurants/" + restaurantId;
      try{
        if(isFavourite){
          firebase.database().ref(userMobilePath).set({isFavourite: isFavourite});
        }else{
          firebase.database().ref(userMobilePath).remove();
        }
      } catch (error) {
          console.log(error);
      }
    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserFavourites(userId, callback) {
        let userMobilePath = "/users/" + userId + "/favourite_restaurants";

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
          firebase.database().ref(userMobilePath).off('value');
            callback(snapshot)
        });
    }
    static unListenUserFavourites(userId){
      let userMobilePath = "/users/" + userId + "/favourite_restaurants";

      firebase.database().ref(userMobilePath).off();
    }

    static addRestaurant(email, password, restaurant, callback){
      firestack.auth.createUserWithEmail(email, password)
      .then((user) => {
        console.log('user created', user)
        var userID = (Platform.OS === 'ios')? user.uid : user.user.uid;
        let userMobilePath = "/users/" + userID;
        firebase.database().ref(userMobilePath).update({
            isRestaurantAdmin: true
        });

        let restaurantPath = "/restaurants/" + userID;
        let ref = firebase.database().ref(restaurantPath).push();
        var images = restaurant.images.slice();
        delete restaurant.images;
        ref.set(restaurant);
        restaurantPath = restaurantPath + "/" + ref.key + "/images";
        ref = firebase.database().ref(restaurantPath);
        for (var i = 0; i < images.length; i++) {
          var img = images[i];
          var storageId = img.storageId;
          delete img.storageId;
          ref.child(storageId).set(img);
        }
        callback(ref.key);
        // alert('Your account was created!');
      }).catch((err) => {
        callback("error");
        console.error('An error occurred', err);
      });
    }

    static editRestaurant(restaurant, callback){
      console.log(restaurant,"database");
      let restaurantPath = "/restaurants/" + restaurant._uid + "/" + restaurant._key;
      let ref = firebase.database().ref(restaurantPath);
      var images = restaurant.images.slice();
      delete restaurant.images;
      delete restaurant._uid;
      delete restaurant._key;
      ref.set(restaurant);
      restaurantPath = restaurantPath + "/images";
      ref = firebase.database().ref(restaurantPath);
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var storageId = img.storageId;
        delete img.storageId;
        delete img.uid;
        delete img.restaurantId;
        ref.child(storageId).set(img);
      }
      callback("Restaurant Updated")
    }

    static deleteRestaurant(restaurant, callback){
      firestack.auth.deleteUser(restaurant._uid).then((val)=>{console.log(val);})
      let restaurantPath = "/restaurants/" + restaurant._uid;

      let ref = firebase.database().ref(restaurantPath);
      ref.remove();
      callback('deleted');
    }

    static addRestaurantImage(restaurantId, imageData){
        let restaurantImagesPath = "/restaurant_images/" + restaurantId;
        let sRef = firebase.database().ref(restaurantImagesPath);
        firebase.database().ref(restaurantImagesPath).push(imageData);
    }
    static addRestaurantImage(restaurantId, imageData){
        let restaurantImagesPath = "/restaurant_images/" + restaurantId;
        firebase.database().ref(restaurantImagesPath).push(imageData);
    }
    static deleteRestaurantImage(restaurantId, imageId, imageData){
        let restaurantImagesPath = "/restaurant_images/" + restaurantId;
        firebase.database().ref(restaurantImagesPath).push(imageData);
    }

  static fetchRestaurant(userId,callback){
      firebase.database().ref("/restaurants/" + userId).on('value',(snapshot)=>{
      callback(snapshot);
    });
  }
}

module.exports = Database;
