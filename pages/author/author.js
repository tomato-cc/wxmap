//获取应用实例
var app = getApp()
var config=app.getConfig();
Page({
  // 数据
  data: {
    config:{}
  },
  // 页面加载
  onLoad: function () {
    this.setData({ config: config})

  }, copyIt:function(e){
    console.log();
    wx.setClipboardData({
      data: e.currentTarget.dataset.copyinfo,
      success: function () {
        wx.showToast({
          title: '内容已复制',
        });
      }
    })
  }, onShareAppMessage: function (res) {

    return config.shareInfo;
  }
})