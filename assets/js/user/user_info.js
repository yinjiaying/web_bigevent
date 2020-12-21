$(function() {


    // 从layui 中 获得 form对象
    var form = layui.form
    var layer = layui.layer

    // 自定义表单验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1~6个之间！'
            }
        }
    })

    // 调用初始化用户信息
    initUserInfo()

    // 初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                // 判断是否获取到信息
                if (res.status !== 0) return layer.msg(res.message)

                // 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮操作事件
    $('#btnReset').on('click', function(e) {
        // 阻止重置按钮的默认事件
        e.preventDefault()

        // 调用初始化用户信息
        initUserInfo()
    })

    // 提交修改事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认事件
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // 判断是否修改信息成功
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)

                // 调用父页面中的方法 重新渲染用户的头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})