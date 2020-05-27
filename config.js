//项目全局配置
const config={
  appTitle:"快点查查",//首页标题
  footerInfo:"",//页面底部信息
  shareInfo:{//分享定制样式
    title: '快点查查-出门必备',
    path: '/pages/home/home',
    imageUrl: 'cloud://wchat-3629g.7763-wchat-3629g-1302214208/wc/images/sh.PNG'
  },
  aboutInfo:{//关于页面
    version:"v 1.0.4",//版本号
    logo:'cloud://wchat-3629g.7763-wchat-3629g-1302214208/wc/images/cesuo.jpg',//logo
    title:"快点查查-出门必备",//logo下方标题
    listData:[//下方列表信息数据
      { icon: 'weixin', text: "作者微信", url: "15838306751(点击复制)", copyInfo:"15838306751",action: 'copyIt'}
    ]
  },
  keyword:"厕所",//只要搜索关键词
  pageSize:20,
  qqmapKey:"",//qq map key
  amapKey:"",//高德 map key
  key:"",//和风天气 key
}

module.exports={
  config:config
}