$(function() {
    // 获取用户信息列表
    getUserInfo()


    // 从 layui 获取到 layer 对象
    var layer = layui.layer

    // 退出按钮的功能
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储
            localStorage.removeItem('token')

            // 跳转页面
            location.href = '/login.html'
            layer.close(index);
        });

    })
})




// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // headers 请示请求头的配置信息
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function(res) {
            if (res.status !== 0) return layui.layer.msg(res.message)

            // 调用 renderAvatar 渲染用户信息
            renderAvatar(res.data)
        },
        // 不论成功还是失败都会调用 complete 函数
        complete: function(res) {
            // console.log('我是complete 回调函数');
            // console.log(res);
            // 在complete 回调函数中 可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空 token
                localStorage.removeItem('token')

                // 强制跳转回登录页
                location.href = '/login.html'
            }
        }
    })
}

// 渲染用户的信息（头像和名称）
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username

    //2. 设置欢迎的文本
    $('.welcome').html('欢迎&nbsp&nbsp' + name)
    console.log(user);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var frist = name[0].toUpperCase()
        $('.text-avatar').html(frist).show()
    }
}