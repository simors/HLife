package com.hlife.RCTPingPP;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.pingplusplus.android.PaymentActivity;

/**
 * Created by wanpeng on 2017/3/30.
 */


public class RCTPingPPModule extends ReactContextBaseJavaModule {

    public static Callback mResultCallback;

    public RCTPingPPModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override public String getName() {
        return "RCTPingPPModule";
    }

    @ReactMethod
    public void createPayment(String charge, String qqId, Callback resultCallback) {
        mResultCallback = resultCallback;
        Intent intent = new Intent(getCurrentActivity(), RCTPingPPActivity.class);
        intent.putExtra("charge", charge);
        intent.putExtra("qqId", qqId);
        getCurrentActivity().startActivity(intent);
    }
}