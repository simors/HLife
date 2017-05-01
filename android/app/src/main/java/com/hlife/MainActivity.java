package com.hlife;

import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;
//import com.microsoft.codepush.react.CodePush;
import com.zachary.reactnative.leancloudsdk.AvOsCloudPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.zachary.reactnative.leancloudsdk.AvOsCloudPackage;
import com.ReactCamera.RNCameraViewPackage;
import com.eguma.barcodescanner.BarcodeScanner;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import android.os.Bundle;
import com.hlife.RCTShare.RCTShareModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HLife";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RCTShareModule.initSocialSDK(this);
    }
}
