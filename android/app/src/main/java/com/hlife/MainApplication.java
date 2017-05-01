package com.hlife;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.BV.LinearGradient.LinearGradientPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.beefe.picker.PickerViewPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
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

import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.hlife.RCTPingPP.RCTPingPPPackage;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import com.hlife.RCTShare.RCTSharePackage;
import com.umeng.socialize.Config;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost;

    {
        mReactNativeHost = new ReactNativeHost(this) {

            @Override
            protected String getJSBundleFile() {
                return CodePush.getJSBundleFile();
            }

            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
                        new RNSoundPackage(),
                        new CodePush("LRFxUILuHnlMKRCW_JBlR6hpihP9Ek1T6J40f", MainApplication.this, BuildConfig.DEBUG),
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
                        new RCTPingPPPackage(),
                        new RCTSharePackage()
//                        new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG)
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
        Config.DEBUG = true;
        UMShareAPI.get(this); /* 友盟U-Share初始化 */
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    //友盟各个平台的配置，建议放在全局Application或者程序入口
    {
        PlatformConfig.setWeixin("wxdcaaa68c51754994", "4adb3299b4f1917d1b3e79949a61cae6");
        PlatformConfig.setSinaWeibo("3518147218", "92f09fd6160d4a9bf48d741b5643dd6e", "http://xiaojee.cn/sns");
        PlatformConfig.setQQZone("1105990907", "uCDdYxKFG6P8PDQF");
    }
}
