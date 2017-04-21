package com.hlife;

import android.app.Application;

import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.beefe.picker.PickerViewPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.facebook.react.ReactApplication;
import com.zachary.reactnative.leancloudsdk.AvOsCloudPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.hlife.baidumap.BaiduMapPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import java.util.Arrays;
import java.util.List;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.hlife.RCTPingPP.RCTPingPPPackage;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;



public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost;

    {
        mReactNativeHost = new ReactNativeHost(this) {
            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
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
    UMShareAPI.get(this); /* 友盟U-Share初始化 */
  }
    //友盟各个平台的配置，建议放在全局Application或者程序入口
    {
        PlatformConfig.setWeixin("wxdcaaa68c51754994", "4adb3299b4f1917d1b3e79949a61cae6");
        PlatformConfig.setSinaWeibo("3518147218", "92f09fd6160d4a9bf48d741b5643dd6e","http://xiaojee.cn/sns");
        PlatformConfig.setQQZone("1105990907", "uCDdYxKFG6P8PDQF");
    }

}
