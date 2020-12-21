$(function() {

    // 从 layui 中 获取 form 对象
    var form = layui.form

    // 自定义校验规则
    form.verify({
        // 所有密码的验证
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码与原密码验证
        somepsd: function(value) {
            if (value === $('[name=oldPwd]').val())
                return '新旧密码不能相同'
        },
        repsd: function(value) {
            if (value !== $('[name=newPwd]').val())
                return '两次密码不一致'
        }
    })


    // 立即修改按钮功能
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认事件
        e.preventDefault()

        // 发起 ajax 请求
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // 判断是否成功修改密码
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg(res.message)

                // 重置密码
                $('.layui-form')[0].reset()
            }
        })

    })
})