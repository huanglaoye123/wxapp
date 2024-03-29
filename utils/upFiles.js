var config = require('.././config')
var chooseImage = (t, count) =>{
    wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            console.log(res)
            var imgArr = t.data.upImgArr || [];
            let arr = res.tempFiles;
            // console.log(res)
            arr.map(function(v,i){
                v['progress'] = 0;
                imgArr.push(v)
            })
            t.setData({
                upImgArr: imgArr
            })

            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count-1) {
                let imgArr = t.data.upImgArr;
                let newimgArr = imgArr.slice(0, count)
                t.setData({
                    upFilesBtn: false,
                    upImgArr: newimgArr
                })
            }
        },
    });
}
var chooseVideo = (t,count) => {
    wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        compressed:true,
        camera: 'back',
        success: function (res) {
            let videoArr = t.data.upVideoArr || [];
            let videoInfo = {};
            videoInfo['tempFilePath'] = res.tempFilePath;
            videoInfo['size'] = res.size;
            videoInfo['height'] = res.height;
            videoInfo['width'] = res.width;
            videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
            videoInfo['progress'] = 0;
            videoArr.push(videoInfo)
            t.setData({
                upVideoArr: videoArr
            })
            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count - 1) {
                t.setData({
                    upFilesBtn: false,
                })
            }
            // console.log(res)
        }
    })
}

// 获取 图片数组 和 视频数组 以及合并数组
var getPathArr = t => {
    let imgarr = t.data.upImgArr || [];
    let upVideoArr = t.data.upVideoArr || [];
    let imgPathArr = [];
    let videoPathArr = [];
    imgarr.map(function (v, i) {
        imgPathArr.push(v.path)
    })
    upVideoArr.map(function (v, i) {
        videoPathArr.push(v.tempFilePath)
    })
    let filesPathsArr = imgPathArr.concat(videoPathArr);
    return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   上传路径 (必传)
 *    filesPathsArr  ******  文件路径数组
 *    name           ******  wx.uploadFile name
 *    formData     ******    其他上传的参数
 *    startIndex     ******  开始上传位置 0
 *    successNumber  ******     成功个数
 *    failNumber     ******     失败个数
 *    completeNumber  ******    完成个数
 * }
 * progress:上传进度
 * success：上传完成之后
 */
let formData;
var upFilesFun = (t, data, progress, success) =>{
    let _this = t;
    let url = config.service;
    let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
    let name = data.name || 'file';
    data.formData ? formData = data.formData : '';
    let startIndex = data.startIndex ? data.startIndex : 0;
    let successNumber = data.successNumber ? data.successNumber : 0;
    let failNumber = data.failNumber ? data.failNumber : 0;
    if (filesPath.length == 0) {
      success([]);
      return;
    }
    
    console.log(formData)
    const uploadTask = wx.uploadFile({
        url: url.upFiles,
        filePath: filesPath[startIndex],
        name: name,
        formData: formData,
        header:{
            "Content-Type":"application/x-www-from-urlencoded",
            'Authorization': 'Bearer '+config.service.token,
        },
        success: function (res) {
            wx.hideLoading(); // 關閉加載提示
            //var data = res.data
            if (startIndex == filesPath.length - 1 ){
                // console.log('completeNumber', startIndex)
                // console.log('over',res)
                let sucPathArr = t.data.uploadedPathArr;
                success(sucPathArr);
                t.setData({
                    uploadedPathArr: []
                })
            }else{
                startIndex++;
                // console.log(startIndex)
                let db = {};
                db.startIndex = startIndex;
                db.successNumber = successNumber;
                db.failNumber = failNumber;
                upFilesFun(t, db, progress, success);
            }
        },
        fail: function(res){
            failNumber++;
        },
        complete: function(res){
            // if (startIndex == filesPath.length - 1 ){
            //     let sucPathArr = t.data.uploadedPathArr;
            //     success(sucPathArr);
            //     t.setData({
            //         uploadedPathArr: []
            //     })
            //     console.log('成功：' + successNumber + " 失败：" + failNumber)
            // }else{
            //     startIndex++;
            //     // console.log(startIndex)
            //     data.startIndex = startIndex;
            //     data.successNumber = successNumber;
            //     data.failNumber = failNumber;
            //     upFilesFun(t, data, progress, success);
            // }
        }
    })

    uploadTask.onProgressUpdate((res) => {
        wx.showLoading({
            title: "上传中...",
            mask:true
          })
        res['index'] = startIndex;
        // console.log(typeof (progress));
        if (typeof (progress) == 'function') {
            progress(res);
        }
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

}
module.exports = { chooseImage, chooseVideo, upFilesFun, getPathArr}