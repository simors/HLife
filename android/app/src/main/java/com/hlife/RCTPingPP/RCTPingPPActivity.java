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
        Pingpp.createPayment(this, charge, qqId);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        String result = data.getExtras().getString("pay_result");
                /* 处理返回值
                 * "success" - payment succeed
                 * "fail"    - payment failed
                 * "cancel"  - user canceld
                 * "invalid" - payment plugin not installed
                 */
        String errorMsg = data.getExtras().getString("error_msg"); // 错误信息
        String extraMsg = data.getExtras().getString("extra_msg"); // 错误信息
        RCTPingPPModule.mResultCallback.invoke(result, errorMsg);
        finish();
    }
}