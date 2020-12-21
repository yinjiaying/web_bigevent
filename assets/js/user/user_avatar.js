$(function() {
    // 从 layui 中 获取 layer对象
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮的实现
    $('#btnUpLoad').on('click', function() {
        // 模拟上传按钮的实现
        $('#file').click()
    })

    // 文件选择框的  change 事件
    $('#file').on('change', function(e) {
        // 拿到用户选择的文件
        var file = e.target.files
        if (file.length === 0) {
            return layer.msg('未选择图片')
        }
        // 1. 拿到用户选择的图片
        var file = e.target.files[0]

        // 2. 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)

        // 3. 重新渲染裁剪区域 
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 确定按钮的上传功能
    $('#btnSure').on('click', function() {
        // 获取用户上传图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //发起ajax请求 
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                // 判断是否切换图片成功
                if (res.status !== 0) return layer.msg('更换头像失败!')
                layer.msg('更换头像成功!')

                // 调用父页面方法
                window.parent.getUserInfo()
            }
        })
    })

})