package com.firstserved;

import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FirstServed";
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        String rawResponse = "oauth_token=127791106-4iHWUYptCMXmcGtxdKfdSjZijQq25jC6FjTOSLpz&oauth_token_secret=V8DMlyMF4Pzu3bfXZySW2KunqDUxoYuqZ7i1GBh8FiLvK&user_id=127791106&screen_name=mksingh31&x_auth_expires=0";
    }
    @Override
      protected void onCreate(Bundle savedInstanceState) {
          SplashScreen.show(this,true);
          super.onCreate(savedInstanceState);
  }
}
