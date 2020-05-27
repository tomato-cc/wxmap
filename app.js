//app.js
import CFG from "config.js";
App({
  onLaunch: function () {
    //天气start
    wx.cloud.init({
      env: 'cloud env',
      traceUser: true,
    })
     //天气end
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systeminfo = res
        this.globalData.isIPhoneX = /iphonex/gi.test(res.model.replace(/\s+/, ''))
      },
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
     //天气start
    // 是否保持常亮，离开小程序失效
    keepscreenon:false,
    systeminfo: {},
    key :"",//和风天气 key
    weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
    requestUrl: {
      weather: 'https://free-api.heweather.com/s6/weather',
      hourly: 'https://free-api.heweather.com/s6/weather/hourly',
      air: 'https://free-api.heweather.com/s6/air/now',
      yiyan:'https://v1.hitokoto.cn'
    },
    //天气end
    userInfo: null
  },getConfig:function(){
    return CFG.config;
  }
})