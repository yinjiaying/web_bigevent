// 注意 :每次调用 $.ajax() 或 $.get() 或 $.post() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以拿到我们给 ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起 ajax 请求之前 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})