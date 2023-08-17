package com.example;

import android.app.Application;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.common.logging.FLog;
import com.facebook.common.logging.LoggingDelegate;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactMarker;
import com.facebook.react.bridge.ReactMarkerConstants;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, LoggingDelegate {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FLog.setLoggingDelegate(this);
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  @Override
  public void setMinimumLoggingLevel(int level) {
    // noop
  }

  @Override
  public int getMinimumLoggingLevel() {
      return 0;
  }

  @Override
  public boolean isLoggable(int level) {
    return true;
  }

  @Override
  public void v(String tag, String msg) {
    Log.v("RNFLog", tag + " - " + msg);
  }

  @Override
  public void v(String tag, String msg, Throwable tr) {
    Log.v("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void d(String tag, String msg) {
    Log.d("RNFLog", tag + " - " + msg);
  }

  @Override
  public void d(String tag, String msg, Throwable tr) {
    Log.d("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void i(String tag, String msg) {
    Log.i("RNFLog", tag + " - " + msg);
  }

  @Override
  public void i(String tag, String msg, Throwable tr) {
    Log.i("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void w(String tag, String msg) {
    Log.w("RNFLog", tag + " - " + msg);
  }

  @Override
  public void w(String tag, String msg, Throwable tr) {
    Log.w("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void e(String tag, String msg) {
    Log.e("RNFLog", tag + " - " + msg);
  }

  @Override
  public void e(String tag, String msg, Throwable tr) {
    Log.e("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void wtf(String tag, String msg) {
    Log.wtf("RNFLog", tag + " - " + msg);
  }

  @Override
  public void wtf(String tag, String msg, Throwable tr) {
    Log.wtf("RNFLog", tag + " - " + msg + " : " + tr.getMessage());
  }

  @Override
  public void log(int priority, String tag, String msg) {
    Log.i("RNFLog", tag + " - " + msg);
  }

  private class MarkerListener implements ReactMarker.MarkerListener {
    @Override
    public void logMarker(ReactMarkerConstants name, @Nullable String tag, int instanceKey) {
      Log.i("ReactMarker", name.toString() + ": " + tag);
    }
  }
}
