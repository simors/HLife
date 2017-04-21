package com.hlife.RCTShare;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import java.util.ArrayList;
import android.text.TextUtils;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.util.Log;
import android.content.Context;



/**
 * Created by wanpeng on 2017/4/21.
 */

public class RCTShareModule extends ReactContextBaseJavaModule {
    private Context context;

    public RCTShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext.getBaseContext();
    }

    @Override
    public String getName() {
        return "ShareComponent";
    }

}
