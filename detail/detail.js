// pages/detail/detail.js
const app=getApp()
const db = wx.cloud.database()
const goods_col =db.collection('goods')
Page({

  data: {
    id:'',
    detail : {},
    user : {},
    my :{},
    count :0,
    addcount:0,
    delta:'2' ,
    collect:false,
  },

  onLoad(options){
    this.data.id=options.id
    this.data.addcount=options.addcount
    console.log('id',this.data.id)
    this.loadDetailDate()
  }, 
  //加载详情页数据
  async  loadDetailDate(){
    let id =this.data.id
    let res = await goods_col.doc(id).get()
    console.log('商品信息',res)
    this.setData({
      detail : res.data,
      count : res.data.count+1
    })
    console.log(this.data.count)
    console.log(this.data.count)
    if(this.data.addcount==1){
      await goods_col.doc(id).update({
        data: {
          count: this.data.count
        },
        success(){
          console.log('修改成功')
        }
      })
    }
    //加载用户数据
    const users_col =db.collection('userData')
    let openid = this.data.detail.owner
    let msg = await users_col.where({
      _openid :app.globalData.openid
    }).get()
    this.setData({
      my : msg.data,
    })
    let ret = await users_col.where({
      _openid :openid
    }).get()
    console.log('用户信息',ret)
    this.setData({
      user : ret.data,
    })
    console.log('用户信息',this.data.user)
    //判断是否收藏
    console.log(this.data.detail._id)
    db.collection('collects').where(db.command.and([
      {
        collector:app.globalData.openid
      },
      {
        good_id:this.data.detail._id
      }
    ])).get().then(ress =>{
      console.log('ress',ress.data[0])
      if(ress.data.length != 0){
        this.setData({
          collect:true
        })
      }
    })
  },
  handlecollect(e){
    let collect=this.data.collect
    if(this.data.detail.owner==app.globalData.openid){
      wx.showToast({
        title: '自己的商品',
        icon:'error',
        duration: 2000
      })
    }else if(!collect){
      db.collection('collects').add({
        data:{
          good_id:this.data.detail._id,
          collector:app.globalData.openid,
          good:this.data.detail
        },
        success: res => {
          this.setData({
            collect:true
          })
          wx.showToast({
            title: '商品收藏成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '商品收藏失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }else if(collect){
      db.collection('collects').where(db.command.and([
        {
          collector:app.globalData.openid
        },
        {
          good_id:this.data.detail._id
        }
      ])).remove({
        success:res => {
          this.setData({
            collect:false
          })
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success',
            duration: 2000
          })

        },
        fail:err => {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    }

  },
  addCart(e){
    let item = this.data.detail
      if(item.owner==app.globalData.openid){
        wx.showToast({
          title: '自己的商品',
          icon:'error',
          duration: 2000
        })
      }else{
    wx.navigateTo({
      url: '/pages/buy/buy?item='+JSON.stringify(item)
    })
  }
  },
  chat(e){
    var that=this
    if(app.globalData.openid==that.data.detail.owner){
      wx.showToast({
        title: '不能和自己聊天',
        icon:'error',
        duration: 2000
      })
      return
    }
    let tag=app.globalData.openid+'&'+that.data.detail.owner
     db.collection('messages').where({
      tag:tag
    }).get().then(ret=>{
      if(ret.data.length==0){
        let rand=(Math.round(Math.random() * 1000000)).toString()
    console.log('rand',rand)
        db.collection('messages').add({
          data:{
            tag:tag,
            roomname:rand,
            user1:this.data.user[0],
            user2:this.data.my[0]
          }
        })
        console.log('roomname',rand)
        wx.cloud.callFunction({
          name: 'createCollection',
          data: {
            name: rand
          },
          success: res => {
            console.log(res);
          },
          fail: err => {
            console.error('[云函数] [createCollection] 调用失败', err);
          }
        })
        console.log(rand)
        wx.navigateTo({
          url: '/pages/chat/chat?roomname='+rand
        })
      }else{
        console.log(ret.data[0].roomname)
        wx.navigateTo({
          url: '/pages/chat/chat?roomname='+ret.data[0].roomname
        })
      }
    })
    
  }

})
