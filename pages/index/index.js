// 引入SDK核心类
var QQMapWX = require('../../resources/map/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
var app = getApp();
var config=app.getConfig();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    admgtop:58,
    list: [],
    latitude: 0,
    longitude: 0,
    scrollTop: 0,
    size: 0,
    onLine: true,
    noAuth: false,
    yesAuth: true,
    config:{}
  },
  // 页面加载
  onLoad: function () {
    wx.setNavigationBarTitle({
      title:'' ,
    });
    wx.showLoading({ title: "别急，稍等!" });
    this.setData({ config: config});
    // this.setData({ 
    //   config: config,
    //   keyword:config.keyword
   // });
  },
  onPullDownRefresh: function () {
    this.doRefresh();
  },
  // 页面显示
  onShow() {
    this.getData();
  },
  //获取数据
  getData: function () {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.qqmapKey
    });
    //确保人员再次移动进行定位，获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(res.accuracy);
        //设置经纬度值
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        //源码里面查询的是附近一公里的哦
        qqmapsdk.search({
          keyword: config.keyword,
          page_size: config.pageSize,
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //有可能是参数有问题或者是网络
            that.setData({
              onLine: true
            });
            //根据返回的结果marker在地图上面
            var data = res.data;
            that.setList(data);
            //关闭loading
            wx.hideLoading();
          },
          fail: function () {
            //关闭loading
            wx.hideLoading();
            //有可能是参数有问题或者是网络
            that.setData({
              onLine: false,
              noAuth: false,
              yesAuth: true
            });
          }
        });
      },
      fail: function (json) {
        //关闭loading
        wx.hideLoading();
        //没有权限
        that.setData({
          noAuth: true,
          yesAuth: false
        });
      }
    });
  },
  //组装数据信息
  setList: function (data) {
    var that = this;
    var result = [];
    //循环遍历数据， 其实不做这一步也行
    data.forEach(function (item, index) {
      //替换一些不必要的大信息
      var reg = new RegExp(item.ad_info.province + item.ad_info.city + item.ad_info.district);
      var briefAddr = item.address.replace(reg, "");
      //组装数据
      result.push({
        distance: item["_distance"],
        briefAddr: briefAddr,
        address: item.address,
        category: item.category,
        id: item.id,
        latitude: item.location.lat,
        longitude: item.location.lng,
        name: item.title
      });
    });
    //设置data
    that.setData({
      list: result,
      size: result.length,
      noAuth: false,
      yesAuth: true
    });
    wx.stopPullDownRefresh();
  },
  //点击列表显示本地导航信息
  tapItem: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var toilet = that.findMarkerById(id);
    //跳转传输的值
    var param = {
      //基本的信息
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      list: that.data.list,
      //目的地点 基本的信息
      destination: toilet.longitude + "," + toilet.latitude,
      briefAddr: toilet.briefAddr,
      name: toilet.name
    }
    wx.navigateTo({
      url: '/pages/location/location?param=' + JSON.stringify(param)
    })
  },
  //根据marker唯一id查询信息
  findMarkerById: function (id) {
    var that = this,
      result = {};
    var list = that.data.list;
    //查询数据信息
    for (var i = 0; i < list.length; i++) {
      if (id === list[i].id) {
        result = list[i];
        break;
      }
    }
    return result;
  },
  // 数据更新
  doRefresh: function () {
    wx.showLoading({ title: "别急，稍等！" });
    this.getData();
  },
  //再次获取权限
  doAuth: function () {
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.doRefresh();
      }
    })
  },
  // 跳转到地图显示信息界面
  doNavToLocation: function () {
    var that = this;
    //跳转传输的值
    var param = {
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      list: that.data.list,
      //目的地点，默认获取最近一个点
      destination: that.data.list[0]["longitude"] + "," + that.data.list[0]["latitude"],
      briefAddr: that.data.list[0]["briefAddr"],
      name: that.data.list[0]["name"]
    }
    wx.navigateTo({
      url: '/pages/location/location?param=' + JSON.stringify(param)
    })
  },onShareAppMessage: function (res) {
    return config.shareInfo;
  }
})
