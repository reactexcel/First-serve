/**
 * @class Database
 */

import * as firebase from "firebase";
import Firebase from "./firebase";
import Firestack from 'react-native-firestack';
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

    static bookTable(userId, tableKey, callback){
      let userMobilePath = "/tables/" + tableKey;
      firebase.database().ref(userMobilePath).transaction((table) => {
        if(table){
          if(table.bookedBy){
            return undefined;
          }else{
            table.bookedBy = userId;
            return table;
          }
        }else{
          return undefined;
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
          callback(true);
        }

        console.log('User table now: ', snapshot.val());
      });
    }

    static deleteTable(tableKey, callback){
      let userMobilePath = "/tables/" + tableKey;
      firebase.database().ref(userMobilePath).remove();
      callback('deleted');
    }

    static setUserNotiSetting(userId, notiOn){
      let userMobilePath = "/users/" + userId;

      firebase.database().ref(userMobilePath).update({
          notiOn: notiOn
      });
    }

    static setUserData(userId, pax, mobile){
      return new Promise((resolve) => {
        let userMobilePath = "/users/" + userId;
        return firebase.database().ref(userMobilePath).update({
            pax: pax,
            phone_number: mobile
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
        firebase.database().ref(userMobilePath).off('value');
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

    static addRestaurant(email, password, restaurant, callback){
      firestack.auth.createUserWithEmail(email, password)
      .then((user) => {
        console.log('user created', user)
        let userMobilePath = "/users/" + user.user.uid;
        firebase.database().ref(userMobilePath).update({
            isRestaurantAdmin: true
        });

        let restaurantPath = "/restaurants/" + user.user.uid;
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

    static deleteRestaurant(restaurant){
      let restaurantPath = "/restaurants/" + restaurant._uid;

      let ref = firebase.database().ref(restaurantPath);
      ref.delete()
      .then(() => callback('deleted'))
      .catch((err) => {
        callback("error");
        console.error('An error occurred', err);
      });
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
}

module.exports = Database;
