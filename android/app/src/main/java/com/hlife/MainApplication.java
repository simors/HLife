package com.hlife;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.beefe.picker.PickerViewPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.hlife.RCTPingPP.RCTPingPPPackage;
import com.hlife.baidumap.BaiduMapPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import com.zachary.reactnative.leancloudsdk.AvOsCloudPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost;

    {
        mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

//    @Override
//    protected String getJSBundleFile() {
//      return CodePush.getJSBundleFile();
//    }

            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
                        new CodePush("tMm4FpMvRLheM-NTKPwn63qgL9qSEk1T6J40f", MainApplication.this, BuildConfig.DEBUG),
                        new AvOsCloudPackage(),
                        new PickerPackage(),
                        new RNDeviceInfo(),
                        new RCTCameraPackage(),
                        new RNSendIntentPackage(),
                        new ReactNativeRestartPackage(),
                        new PickerViewPackage(),
                        new WebViewBridgePackage(),
                        new RNFSPackage(),
                        new ImagePickerPackage(),
                        new BaiduMapPackage(getApplicationContext()),
                        new LinearGradientPackage(),
                        new RCTPingPPPackage()
                        //new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG)
                        // Add/change this line.

                );
            }
        };
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
