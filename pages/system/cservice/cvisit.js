var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    reslut:'',
    show:false,
    dictList:[],//客户
    curpage:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.cvisitPage,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          current:_this.data.curpage
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              let app = getApp();
              let db =  app.filter(res.data.data.records);
              let arr1 = [];
              res.data.data.current == 0 ? "" : arr1 = _this.data.list;
              arr1 = arr1.concat(db);
              _this.setData({
                curpage:res.data.data.current,
                allData:arr1,
                list:arr1,
                dictList:app.dict
            })
            }else{
              toast.fail(res.data.msg);
            }
        }
      })
  },
  showPopup:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
  },
  closeRecord:function(e){
      let _this = this;
      if(_this.data.reslut == ""){
        toast.fail('内容不能为空');
        return 
      }
      wx.request({
        url: config.service.vClose,    
        method:"POST",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          remarks:_this.data.reslut,
          id:_this.data.details.id
        },    
        success:function(res){ 
            console.log(res) 
            if(res.data.code == 0){
              toast.success('关闭成功');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            }
        }
      })
    },
    //组件传递的值
    onReceive:function(e){
      e.detail.textData
      this.setData({
          reslut:e.detail.textData,
      })
    },
    onReachBottom: function () { //下拉刷新
      if (this.data.last) {
        return;
      }
      this.setData({
        curpage:this.data.curpage+1
      })
      this.onLoad();
    }
    
})