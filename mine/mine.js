// pages/mine/mine.js
// 获取数据库
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    root :false,
    userId: '',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if(app.globalData.openid=='oljdk5WRi4Xuw6YUz7lvOtGQ7So4'){
      this.setData({
        root :true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log('msg',res.userInfo)
        //判断数据库中是否有该用户
        db.collection('userData').where({
          openid:app.globalData.openid
        }).get().then(ress =>{
          console.log('ress',ress.data[0])
          if(ress.data.length == 0){
          //增加用户数据
          db.collection('userData').add({
  //数据赋值操作，微信小程序中“：”的意思就是赋值
  data: {
    openid: app.globalData.openid,
    name: this.data.userInfo.nickName,
    avatarUrl: this.data.userInfo.avatarUrl,
    gender: this.data.userInfo.gender,
    money: 0,
  },
  success: res => {
    // 在返回结果中会包含新创建的记录的 _id
    this.setData({
      userId: res._id,
    })
    console.log('上传成功！id',userId)
    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  },
  fail: err => {
    console.error('[数据库] [新增记录] 失败：', err)
    }
        })
      }
      else{
        console.log('hello')
        db.collection('userData').where({
          openid:app.globalData.openid
        }).update({
          data: {
            openid: app.globalData.openid,
            name: this.data.userInfo.nickName,
            avatarUrl: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender,
          },
          success(){
            console.log('修改成功')
          }
        })
      }
    })
  },
})

          }
        })

   





