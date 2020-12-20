$(function() {
    // 登录和注册切换
    // 点击 去注册 链接
    $('#reg-box').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 去登录 链接
    $('#login-box').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从 layui 中获取 form对象
    var form = layui.form
    var layer = layui.layer

    // 通过  form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 psd 校验规则的
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 校验俩次密码是否一致
        repsd: function(value) {
            // 通过形参获取拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败 就return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()

            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })

    // 注册表单提交事件
    $('#form-reg').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()
            // 提交的数据
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val(),
        }

        // 发起 ajax post 请求
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg('注册成功，请登录');

            // 登录成功跳转页面
            $('#login-box').click()
        })
    })

    // 表单登录提交事件
    $('#form-login').on('submit', function(e) {
        // 阻止表单的默认事件
        e.preventDefault()

        // 使用 ajax 发送 post 请求
        $.ajax({
            type: 'post',
            url: '/api/login',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                // 判断登录是否成功 弹出消息
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)

                // 登录成功的token  保存到本地存储中  用于权限
                localStorage.setItem('token', res.token)

                // 登录成功后跳转页面
                location.href = '/index.html'
            }
        })
    })

})