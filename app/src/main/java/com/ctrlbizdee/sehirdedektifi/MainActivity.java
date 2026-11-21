package com.ctrlbizdee.sehirdedektifi;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Insets;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.IOException;
import java.util.Map;

public final class MainActivity extends Activity {
    private static final String ASSET_HOST = "appassets.androidplatform.net";
    private final Map<String, String> assetTypes = new java.util.HashMap<>();
    {
        assetTypes.put("/index.html", "text/html");
        assetTypes.put("/alanya.html", "text/html");
        assetTypes.put("/game.js", "text/javascript");
        assetTypes.put("/cities.json", "application/json");
    }
    private WebView game;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        game = new WebView(this);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowContentAccess(false);
        game.getSettings().setAllowFileAccess(false);
        game.setOnApplyWindowInsetsListener((view, insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                Insets edges = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(edges.left, edges.top, edges.right, edges.bottom);
            }
            return insets;
        });
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"https".equals(request.getUrl().getScheme()) || !ASSET_HOST.equals(request.getUrl().getHost());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String path = request.getUrl().getPath();
                if (!ASSET_HOST.equals(request.getUrl().getHost()) || path == null || !assetTypes.containsKey(path)) return null;
                try {
                    return new WebResourceResponse(assetTypes.get(path), "UTF-8", getAssets().open(path.substring(1)));
                } catch (IOException error) {
                    return null;
                }
            }
        });
        setContentView(game);
        game.loadUrl("https://" + ASSET_HOST + "/index.html");
    }

    @Override public void onBackPressed() {
        if (game.canGoBack()) game.goBack();
        else super.onBackPressed();
    }
}
