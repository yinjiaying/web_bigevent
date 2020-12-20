// 注意 :每次调用 $.ajax() 或 $.get() 或 $.post() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以拿到我们给 ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起 ajax 请求之前 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的·用户  添加请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 不论成功还是失败都会调用 complete 函数
    options.complete = function(res) {
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