const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    footerMsg:'天青色等烟雨，而我在等你(页面下拉我会变哦)',
    searchKeyword:"",
    iconList: [{
      icon: 'send',
      color: 'blue',
      //badge: 120,
      name: '公厕',
      keyword: '公厕'
    }, 
    {
      icon: 'taxi',
      color: 'blue',
      //badge: 120,
      name: '出租车',
      keyword: '出租车'
    }, 
    {
      icon: 'location',
      color: 'blue',
      //badge: 120,
      name: '公交站',
      keyword: '公交站'
    }, 
    {
      icon: 'ticket',
      color: 'blue',
      //badge: 120,
      name: '地铁站',
      keyword: '地铁站'
    }, 
    {
      icon: 'cascades',
      color: 'blue',
      //badge: 120,
      name: '加油站',
      keyword: '加油站'
    }, 
    {
      icon: 'roundright',
      color: 'blue',
      //badge: 120,
      name: '美食',
      keyword: '美食'
    },
    {
      icon: 'shop',
      color: 'blue',
      //badge: 120,
      name: '商场',
      keyword: '商场'
    },
    {
      icon: 'refund',
      color: 'blue',
      //badge: 120,
      name: '银行',
      keyword: '银行'
    },
    {
      icon: 'footprint',
      color: 'blue',
      //badge: 120,
      name: '景点',
      keyword: '景点'
    },
    {
      icon: 'home',
      color: 'blue',
      //badge: 120,
      name: '医院',
      keyword: '医院'
    },
    {
      icon: 'activity',
      color: 'blue',
      //badge: 120,
      name: '大学',
      keyword: '大学'
    }, 
   
    {
      icon: 'goods',
      color: 'blue',
      //badge: 120,
      name: '球场',
      keyword:'球场',
    }, 
    {
      icon: 'game',
      color: 'blue',
      //badge: 120,
      name: '网吧',
      keyword: '网吧',
    },
    {
      icon: 'explore',
      color: 'blue',
      //badge: 120,
      name: '健身房',
      keyword: '健身房',
    },
    {
      icon: 'loading',
      color: 'red',
      //badge: 120,
      name: 'AED',
      keyword: 'AED',
    }],
    gridCol:3,
    skin: false
  },
  // 开始下拉刷新
  onPullDownRefresh (res) {
    this.reloadPage()
    wx.stopPullDownRefresh();
  },
  reloadPage () {
    this.getYiYanInfo()
  },
   // 获取一言返回数据
   getYiYanInfo() {
    var myThis = this;
    wx.request({
      url: 'https://v1.hitokoto.cn/?c=i&encode=text', 
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' 
      },
      success (res) {
        myThis.setData({
          footerMsg : res.data
        })
      }
    })
  },
  searchKeyword: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  search:function (e) {
    getApp().getConfig().keyword = e.currentTarget.dataset['keyword'];
    wx.switchTab({
      url: '../index/index',
    })
  },
  select: function(e) {
    getApp().getConfig().keyword = this.data.searchKeyword;
    wx.switchTab({
      url: '../index/index',
    })
  },
  onShareAppMessage: function (res) {

    return config.shareInfo;
  }
})