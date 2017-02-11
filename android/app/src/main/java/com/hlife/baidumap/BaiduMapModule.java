package com.hlife.baidumap;

import com.facebook.react.bridge.ReactApplicationContext;

/**
 * Created by zuokai on 2/9/2016.
 */
public class BaiduMapModule extends BaseModule {

    private static final String REACT_CLASS = "BaiduMapModule";
    public BaiduMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    public String getName() {
        return REACT_CLASS;
    }
}
