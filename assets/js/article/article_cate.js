$(function() {
    // 从 layui 获取 layer 对象
    var layer = layui.layer
    var form = layui.form

    // 调用获取文章列表函数
    getArticleList()

    //1. 获取文章分类列表函数
    function getArticleList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg(' 获取文章分类列表失败!')

                //2. 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)

                // 添加至页面
                $('tbody').html(htmlStr)
            }
        })
    }

    //3. 添加类别功能
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章列表',
            // 使用 script 标签插入内容 
            content: $('#cate-add').html()
        });
    })

    //4. 添加类别功能
    // 使用事件委托 监听表单的提交事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单的默认事件
        e.preventDefault()

        //发起 ajax 请求 
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)

                // 调用分类列表的函数
                getArticleList()
                layer.msg(res.message)

                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 5.编辑功能
    // 使用委托代理 完成表单编辑的点击事件
    var indexEdit = null
    $('body').on('click', '#btn-edit', function(e) {
        // 阻止表单的默认事件
        e.preventDefault()

        // 弹出编辑框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章列表',
            // 使用 script 标签插入内容 
            content: $('#cate-edit').html()
        });

        // 点击获取索引

        var id = $(this).attr('data-id')

        // 发起 ajax 请求 获取数据
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })


    // 使用委托代理 完成表单编辑的提交事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault()
            // console.log($('#form-edit [name=Id]').val());
            // 快速获取表单数据
        var data = $(this).serialize()

        // 发起 ajax 请求
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: data,
            success: function(res) {
                // 判断
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)

                // 重新渲染页面
                getArticleList()

                // 关闭弹窗
                layer.close(indexEdit)
            }
        })
    })

    // 删除按钮的功能
    // 通过事件委托  给表单添加点击事件
    $('body').on('click', '#btn-del', function(e) {
        e.preventDefault()

        // 获取点击的索引
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起 ajax 请求
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)

                    // 渲染页面
                    getArticleList()
                }
            })
            layer.close(index);
        });
    })
})