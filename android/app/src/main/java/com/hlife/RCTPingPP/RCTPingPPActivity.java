package com.hlife.RCTPingPP;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Window;
import com.pingplusplus.android.Pingpp;
import android.util.Log;
/**
 * Created by wanpeng on 2017/3/30.
 */


public class RCTPingPPActivity extends Activity {
    private static final String TAG = "RCTPingPPActivity";

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        String charge = getIntent().getStringExtra("charge");
        String qqId = getIntent().getStringExtra("qqId");
        Pingpp.enableDebugLog(true);
        Log.e(TAG, "enableDebugLog true!");
        Pingpp.createPayment(this, charge, qqId);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RCTPingPPModule.mResultCallback.invoke(data.getStringExtra("pay_result"));
        finish();
    }
}