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
import com.umeng.socialize.bean.SHARE_MEDIA;
import android.app.Activity;
import android.net.Uri;
import com.umeng.socialize.media.UMImage;
import android.graphics.BitmapFactory;
import com.umeng.socialize.ShareAction;
import javax.annotation.Nullable;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.media.UMWeb;

import android.widget.Toast;





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
        return "RCTshareComponent";
    }

    @ReactMethod
    public void openShareAction(String content,String title,String url,ReadableMap imageSource)
    {
        final SHARE_MEDIA[] displaylist = new SHARE_MEDIA[]
                {
                        SHARE_MEDIA.WEIXIN,SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.QQ,SHARE_MEDIA.QZONE
                };
        final Activity tempActivity = this.getCurrentActivity();
        final Context tempContext = this.getReactApplicationContext();
        final String finalContent = content;
        final String finaltitle = title;
        final RCTShareModule finalThis = this;
        try{
            final String ALLOWED_URI_CHARS = "@#&=*+-_.,:!?()/~'%";

            final String finalurl = Uri.encode(url,ALLOWED_URI_CHARS) ;
            final String imageUrl = imageSource.getString("uri");

            this.getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    try{
                        UMImage image;
                        if(imageUrl.contains("http://")||imageUrl.contains("https://"))
                        {
                            image = new UMImage(tempActivity, Uri.encode(imageUrl,ALLOWED_URI_CHARS));

                        }
                        else{
                            Uri uri = Uri.parse(imageUrl);
                            Bitmap bitmap;
                            if(uri.getScheme() == null)
                            {
                                int resId = finalThis.getResourceDrawableId(tempContext,imageUrl);
                                bitmap = BitmapFactory.decodeResource(tempActivity.getResources(),resId);
                            }
                            else{
                                String tempUrlString = "";
                                tempUrlString = imageUrl.replace("file://","");
                                bitmap = BitmapFactory.decodeFile(tempUrlString);
                            }
                            image = new UMImage(tempActivity,bitmap);
                        }
//                        new ShareAction(tempActivity).setDisplayList(displaylist)
//                                .withText(finalContent)
//                                .withTitle(finaltitle)
//                                .withTargetUrl(finalurl)
//                                .withMedia(image)
//                                .open();
                        UMWeb web = new UMWeb("https://baidu.com");
                        web.setTitle(finaltitle);
                        web.setThumb(image);
                        web.setDescription("邻家优店分享测试");

                        new ShareAction(tempActivity).setDisplayList(displaylist)
                                .withMedia(web).setCallback(umShareListener)
                                .open();
                    }
                    catch (Exception e)
                    {
                        Log.e("友盟分享错误",e.toString());
                    }

                }
            });
        }
        catch (Exception e) {
            Log.e("友盟分享错误", e.toString());
        }
    }

    private int getResourceDrawableId(Context context, @Nullable String name) {
        if (name == null || name.isEmpty()) {
            return 0;
        }
        name = name.toLowerCase().replace("-", "_");

        int id = context.getResources().getIdentifier(
                name,
                "drawable",
                context.getPackageName());
        return id;
    }

    private UMShareListener umShareListener = new UMShareListener() {

        @Override
        public void onStart(SHARE_MEDIA platform) {
            //分享开始的回调
        }
        @Override
        public void onResult(SHARE_MEDIA platform) {
            Log.d("plat","platform"+platform);

//            Toast.makeText(MainActivity.this, platform + " 分享成功啦", Toast.LENGTH_SHORT).show();

        }

        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
//            Toast.makeText(MainActivity.this,platform + " 分享失败啦", Toast.LENGTH_SHORT).show();
            if(t!=null){
                Log.d("throw","throw:"+t.getMessage());
            }
        }

        @Override
        public void onCancel(SHARE_MEDIA platform) {
//            Toast.makeText(MainActivity.this,platform + " 分享取消了", Toast.LENGTH_SHORT).show();
        }
    };



}
