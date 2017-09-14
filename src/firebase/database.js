/**
 * @class Database
 */

import * as firebase from "firebase";

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

      return firebase.database().ref(userMobilePath).set({
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

        firebase.database().ref(userMobilePath).on('value', (snapshot) => {
            var notiOn = false;
            if (snapshot.val()) {
                notiOn = snapshot.val().notiOn
            }

            callback(notiOn)
        });
    }

    static setUserRestaurantNotiSetting(restaurantId, userId, notiOn){
      let userMobilePath = "/users/" + userId + "/restaurants_noti/" + restaurantId;

      return firebase.database().ref(userMobilePath).set({
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
            var notiOn = false;
            if (snapshot.val()) {
                notiOn = snapshot.val().notiOn
            }

            callback(notiOn)
        });
    }

    static addRestaurant(userId, restaurant){
        let restaurantPath = "/restaurants/" + userId;
        let ref = firebase.database().ref(restaurantPath).push();
        ref.set(restaurant);
        return ref.key;
    }

    static addRestaurantImage(restaurantId, imageData){
        let restaurantImagesPath = "/restaurant_images/" + restaurantId;
        firebase.database().ref(restaurantImagesPath).push(imageData);
    }
}

module.exports = Database;
