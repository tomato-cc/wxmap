// 引入SDK核心类
var amapFile = require('../../resources/map/amap-wx.js');
var app=getApp();
var config=app.getConfig();
Page({
  data: {
    navigationBarTitleText: "步行路径指导",
    CustomBar: app.globalData.CustomBar,
    admgtop: app.globalData.CustomBar+55,
    tabNames:['步行','驾车','骑行'],
    TabCur: 0,
    scrollLeft: 0,
    param:{},
    steps: {},
    config:{}
  },
  onLoad: function (option) {
    var param = JSON.parse(option.param);
    this.setData({ param: param, config: config});
    this.doWalk();
  
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    });

    switch (this.data.TabCur){
        case 0:
          this.doWalk();
        break;
        case 1:
          this.doDrive();
        break;
        case 2:
          this.doRiding();
        break;
    }
  },
  doDrive:function(){
    wx.showLoading({ title: "别急，稍等!" });
    this.setData({ navigationBarTitleText: "驾车路径指导"});
    var that = this;
    var param=that.data.param;
    var amapInstance = new amapFile.AMapWX({ key: config.amapKey });
    //进行路径规划查询
    amapInstance.getDrivingRoute({
      origin: param.origin,
      destination: param.destination,
      success: function (data) {
        wx.hideLoading();
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          that.setData({
            steps: data.paths[0].steps
          });
        }
      },
      fail: function (info) {
        wx.hideLoading();
      }
    })
  },doWalk:function(){
    wx.showLoading({ title: "别急，稍等!" });
    this.setData({ navigationBarTitleText: "步行路径指导" });
    var that = this;
    var param = that.data.param;
    var amapInstance = new amapFile.AMapWX({ key: config.amapKey });
    //进行路径规划查询
    amapInstance.getWalkingRoute({
      origin: param.origin,
      destination: param.destination,
      success: function (data) {
        wx.hideLoading();
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          that.setData({
            steps: data.paths[0].steps
          });
        }
      },
      fail: function (info) {
        wx.hideLoading();
      }
    })
  }, doRiding: function () {
    wx.showLoading({ title: "别急，稍等!" });
    this.setData({ navigationBarTitleText: "骑行路径指导" });
    var that = this;
    var param = that.data.param;
    var amapInstance = new amapFile.AMapWX({ key: config.amapKey});
    //进行路径规划查询
    amapInstance.getRidingRoute({
      origin: param.origin,
      destination: param.destination,
      success: function (data) {
        wx.hideLoading();
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          that.setData({
            steps: data.paths[0].steps
          });
        }
      },
      fail: function (info) {
        wx.hideLoading();
      }
    })
  }, onShareAppMessage: function (res) {

    return config.shareInfo;
  }
})