import * as firebase from "firebase";

class Firebase {
	/**
	 * Initialises Firebase
	 */
	static initialise() {
		if(!firebase.apps.length){
			firebase.initializeApp({
				apiKey: "AIzaSyA8rJHxDdWPNgxCMUSJ4kpLFAygJpUBqgI",
				authDomain: "first-served-c9197.firebaseapp.com",
				databaseURL: "https://first-served-c9197.firebaseio.com",
				storageBucket: "first-served-c9197.appspot.com"
			});
		}
	}

}

module.exports = Firebase;