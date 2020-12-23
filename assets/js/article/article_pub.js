$(function() {
    // 从 layui 中获取对象
    var layer = layui.layer
    var form = layui.form

    // 调用文章分类的函数
    getCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义文章分类的函数
    function getCate() {
        // 发起 ajax 请求
        $.ajax({
            type: 'get',
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)

                //调用模板引擎 渲染分类列表下拉菜单 
                var htmlStr = template('tpl-cate', res)

                //添加至页面 
                $('[name=cate_id]').html(htmlStr)

                // 一定要调用form.render()方法
                form.render()
            }
        })
    }

    // 图片裁剪初始化
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面模拟上传文件效果
    $('#btnUpLoad').on('click', function() {
        $('#coverFile').click()
    })

    // 为 coverFile 添加 change 事件 监听
    $('#coverFile').on('change', function(e) {
        // 获取上传的文件
        var files = e.target.files

        // 判断是否选择图片
        if (files.length === 0) return

        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    art_state = '已发布'

    // 为存为草稿添加事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单添加 submit 监听事件
    $('#form-pub').on('submit', function(e) {
        //1 阻止表单的默认事件
        e.preventDefault()

        //2 创建了 一个 formdata 对象 
        var fd = new FormData($(this)[0])

        //3.将文章状态添加到  formdata 对象 中
        fd.append('state', art_state)

        // fd.forEach(function(item, i) {
        //     console.log(i, item);
        // })
        //4 将裁剪后的图片 输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                //5.将文章封面添加到  formdata 对象 中
                fd.append('cover_img', blob)

                // 6.发送 ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意 : 如果向服务器提交的时 formdata格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                // 判断
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)

                // 跳转至文章列表页面
                location.href = '/article/article_list.html'
            }
        })

    }
})