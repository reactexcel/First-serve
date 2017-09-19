/**
 * @class Database
 */

import * as firebase from "firebase";
import Firebase from "./firebase";
import Firestack from 'react-native-firestack';
const firestack = new Firestack();

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

    static setUserNotiSetting(userId, notiOn){
      let userMobilePath = "/users/" + userId;

      firebase.database().ref(userMobilePath).update({
          notiOn: notiOn
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
    static listenUserRestaurantNotiSetting(userId, callback) {
        let userMobilePath = "/users/" + userId + "/restaurants_noti";

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
          firebase.database().ref(userMobilePath).off('value');
            callback(snapshot)
        });
    }
    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserNotiSetting(userId, callback) {
        let userMobilePath = "/users/" + userId;

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
          firebase.database().ref(userMobilePath).off('value');
            var notiOn = false;
            if (snapshot.val()) {
                notiOn = snapshot.val().notiOn
            }

            callback(notiOn)
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
        ref.set(restaurant);
        callback(ref.key);
        // alert('Your account was created!');
      }).catch((err) => {
        debugger
        callback("error");
        console.error('An error occurred', err);
      });
    }

    static addRestaurantImage(restaurantId, imageData){
        let restaurantImagesPath = "/restaurant_images/" + restaurantId;
        firebase.database().ref(restaurantImagesPath).push(imageData);
    }
}

module.exports = Database;
