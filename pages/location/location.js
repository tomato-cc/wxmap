// 引入SDK核心类
var amapFile = require('../../resources/map/amap-wx.js');
var amapInstance;
//获取应用实例
var app = getApp();
var config=app.getConfig();
Page({
  //数据信息
  data: {
    markers: [],
    longitude: 0,
    latitude: 0,
    distance: '',
    cost: '',
    polyline: [],
    origin: null,
    destination: null,
    briefAddr: null,
    toiletName: null,
    navigateImag: "cloud://wchat-3629g.7763-wchat-3629g-1302214208/wc/images/ios7-navigate.png"
  },
  //页面加载事件
  onLoad: function (option) {
    var that = this;
    //初始化地图接口实例
    amapInstance = new amapFile.AMapWX({ key: config.amapKey });
    var param = JSON.parse(option.param);
    var list = param.list,
      //中心点位置
      latitude = param.latitude,
      longitude = param.longitude,
      destination = param.destination,
      briefAddr = param.briefAddr,
      toiletName = param.name;
    var result = [];
    //数据组装
    list.forEach(function (item, index) {
      //为零时显示最近的气泡
      if (!index) {
       
        result.push({
          width: 40,
          height: 40,
          iconPath: "/images/marker.png",
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          briefAddr: item.briefAddr,
          toiletName: item.name,
          callout: {
            content: "最近" + config.keyword,
            color: "#FFFFFF",
            fontSize: 12,
            borderRadius: 15,
            bgColor: "#000000",
            padding: 10,
            display: 'ALWAYS'
          }
        })
      } else {
        result.push({
          
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          briefAddr: item.briefAddr,
          toiletName: item.name
        })
      }
    });
    //赋值
    that.setData({
      markers: result,
      latitude: latitude,
      longitude: longitude,
      briefAddr: briefAddr,
      toiletName: toiletName
    });
    //初始化路径规划
    that.doWalkingRoute(destination);
    //TODO 设置控件定位或者复位控件，计算位置的时候需要使用系统方法，获取屏幕宽度来进行设置
  },
  //点击marker事件
  doMarkertap: function (obj) {
    var that = this;
    //查询marker的详细信息
    var marker = that.getMarkerById(obj.markerId);
    that.doWalkingRoute(marker.longitude + "," + marker.latitude);
    that.setData({
      briefAddr: marker.briefAddr,
      toiletName: marker.toiletName
    });
  },
  //进行路径规划
  doWalkingRoute: function (destination) {
    var that = this;
    //调用高德地图路径规划
    wx.getLocation({
      type: 'gcj02', //适用于微信的位置精度
      success: function (res) {
        //设置详细路径需要的值
        that.setData({
          tlongitude: res.longitude,
          tlatitude: res.latitude,
          origin: res.longitude + "," + res.latitude,
          destination: destination
        });
        //路径规划
        amapInstance.getWalkingRoute({
          origin: res.longitude + "," + res.latitude,
          destination: destination,
          success: function (data) {
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            that.setData({
              polyline: [{
                points: points,
                color: "#0091ff",
                width: 6
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              that.setData({
                distance: data.paths[0].distance + ' 米'
              });
            }
            if (data.paths[0] && data.paths[0].duration) {
              that.setData({
                cost: parseInt(data.paths[0].duration / 60) + ' 分钟'
              });
            }
          },
          fail: function (info) {
          }
        })
      }
    })
  }, goApp:function(){
    var destination = this.data.destination;
    if (destination){
       var po=destination.split(",");
       var long=Number(po[0]);
      var lat =Number(po[1]);
       wx.openLocation({
         latitude: lat,
         longitude: long,
       })
    }
  },
  //根据marker的id获取详情信息
  getMarkerById: function (id) {
    var that = this;
    var markers = that.data.markers;
    var len = markers.length;
    var result;
    for (var i = 0; i < len; i++) {
      if (markers[i]["id"] === id) {
        result = markers[i];
        break;
      }
    }
    return result;
  },
  //详细的路径规划
  goDetail: function () {
    var that = this;
    //跳转传输的值
    var param = {
      origin: that.data.origin,
      destination: that.data.destination,
    }
    //设置点击图片效果
    that.setData({
      navigateImag: "cloud://wchat-3629g.7763-wchat-3629g-1302214208/wc/images/ios7-navigate-click.png"
    });
    //修改点击状态
    setTimeout(function () {
      that.setData({
        navigateImag: "cloud://wchat-3629g.7763-wchat-3629g-1302214208/wc/images/ios7-navigate.png"
      });
      wx.navigateTo({
        url: '../location-detail/location?param=' + JSON.stringify(param)
      })
    }, 200);
  }, onShareAppMessage: function (res) {

    return config.shareInfo;
  }
})
