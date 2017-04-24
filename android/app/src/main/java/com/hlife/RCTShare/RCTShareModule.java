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
import com.facebook.react.bridge.ReadableMap;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.bean.SHARE_MEDIA;
import android.app.Activity;
import android.net.Uri;
import com.umeng.socialize.media.UMImage;
import android.graphics.BitmapFactory;
import com.umeng.socialize.ShareAction;
import javax.annotation.Nullable;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.media.UMWeb;
import android.content.Intent;
import com.umeng.socialize.UMShareAPI;


import android.widget.Toast;





/**
 * Created by wanpeng on 2017/4/21.
 */

public class RCTShareModule extends ReactContextBaseJavaModule {
    private Context context;
    private static Activity ma;

    public RCTShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext.getBaseContext();
    }

    @Override
    public String getName() {
        return "RCTshareComponent";
    }

    public static void initSocialSDK(Activity activity){
        ma = activity;
    }

    @ReactMethod
    public void share(String platform, String url, String title, String thumbnail, String description) {
        SHARE_MEDIA shareMedia = SHARE_MEDIA.SINA;
        UMImage image = new UMImage(ma, thumbnail);
        UMWeb  web = new UMWeb(url);
        web.setTitle(title);//标题
        web.setThumb(image);
        web.setDescription(description);

        switch (platform)
        {
            case "WEIXIN":
                shareMedia = SHARE_MEDIA.WEIXIN;
                break;
            case "WEIXIN_CIRCLE":
                shareMedia = SHARE_MEDIA.WEIXIN_CIRCLE;
                break;
            case "QQ":
                shareMedia = SHARE_MEDIA.QQ;
                break;
            case "QZONE":
                shareMedia = SHARE_MEDIA.QZONE;
                break;
            case "SINA":
                shareMedia = SHARE_MEDIA.SINA;
                break;
            default:
                break;
        }

        new ShareAction(ma).setPlatform(shareMedia)
                .withMedia(web)
                .setCallback(new UMShareListener() {
                                 @Override
                                 public void onStart(SHARE_MEDIA share_media) {

                                 }

                                 @Override
                                 public void onResult(SHARE_MEDIA share_media) {

                                 }

                                 @Override
                                 public void onError(SHARE_MEDIA share_media, Throwable throwable) {

                                 }

                                 @Override
                                 public void onCancel(SHARE_MEDIA share_media) {

                                 }
                             }
                )
                .share();
    }
}
