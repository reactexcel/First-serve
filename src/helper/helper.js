
export function listenRestaurants(dataSnapshot) {
    return new Promise((reslove) => {
      var restaurants = [];
      var count = 0;
      restaurants.push({isAddButton: true});
       return dataSnapshot.forEach((child) => {
        child.forEach((ch) => {
          var images = [];
          if(ch.val().images !== undefined){
            for (var key in ch.val().images) {
              var img = ch.val().images[key];
              images.splice((img.primary ? 0 : images.length), 0, {
                imageUrl: img.imageUrl, storageId: key, primary: img.primary, fileName: img.fileName, uid: child.key, restaurantId: ch.key
              });
            }
          }
          restaurants.splice((restaurants.length), 0, {
            name: (ch.val().name ? ch.val().name : ''),
            type: (ch.val().type ? ch.val().type : ''),
            phone_number: (ch.val().phone_number ? ch.val().phone_number : ''),
            short_description: (ch.val().short_description ? ch.val().short_description : ''),
            long_description: (ch.val().long_description ? ch.val().long_description : ''),
            booking_message: (ch.val().booking_message ? ch.val().booking_message : ''),
            address: (ch.val().address ? ch.val().address : ''),
            website_url: (ch.val().website_url ? ch.val().website_url : ''),
            booking_url: (ch.val().booking_url ? ch.val().booking_url : ''),
            price_label: (ch.val().price_label ? ch.val().price_label : ''),
            instagram_url: (ch.val().instagram_url ? ch.val().instagram_url : ''),
            fully_booked: ch.val().fully_booked,
            images: images,
            _uid: child.key,
            _key: ch.key
          });
        });
        console.log(restaurants);
        reslove (restaurants);
      });
  });
}
