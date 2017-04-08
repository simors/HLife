import {
  requireNativeComponent,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';


const _module = NativeModules.BaiduPoiSearchModule;

export default {
  searchNearbyProcess(keyword, centerLat, centerLng, radius, pageNum) {
    return new Promise((resolve, reject) => {
      try {
        _module.searchNearbyProcess(keyword, centerLat, centerLng, radius, pageNum);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetPoiResult', resp => {
        resolve(resp);
      });
    });
  },

  searchInCityProcess(city, keyword, pageNum=1) {
    return new Promise((resolve, reject) => {
      try {
        _module.searchInCityProcess(city, keyword, pageNum);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetPoiResult', resp => {
        resolve(resp);
      });
    });
  },

  requestSuggestion(city, keyword, withLocation=false, latitude=0.0, longitude=0.0, citilimit=false) {
    return new Promise((resolve, reject) => {
      try {
        // console.log('requestSuggestion===city=', city)
        // console.log('requestSuggestion===keyword=', keyword)
        // console.log('requestSuggestion===citilimit=', citilimit)
        // console.log('requestSuggestion===withLocation=', withLocation)
        // console.log('requestSuggestion===latitude=', latitude)
        // console.log('requestSuggestion===longitude=', longitude)
        _module.requestSuggestion(city, keyword, citilimit, withLocation, latitude, longitude);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetSuggestionResult', resp => {
        resolve(resp);
      });
    });
  }

};