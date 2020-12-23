$(function() {
    // 从 layui 中 获取 layer对象
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 3 定义一个美化事件的过滤器函数
    template.defaults.imports.dataFormat = function(data) {
        var dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个补零函数
    function padZero(d) {
        return d < 10 ? '0' + d : d
    }


    // 1 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认在第一页
        pagesize: 2, // 每页显示多少条数据 默认为2 条数据
        cate_id: '', //	文章分类的 Id
        state: '' //	文章的状态
    }

    getTavleList()

    // 2.获取文章列表数据函数
    function getTavleList() {
        // 发起 ajax 请求
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // 判断
                if (res.status !== 0) return layer.msg(res.message)

                // 调用模板引擎
                var htmlStr = template('tpl-table', res)

                // 添加到页面
                $('tbody').html(htmlStr)

                // 渲染分页
                renderPage(res.total)
            }
        })
    }


    // 4.所有分类功能

    initCate()

    // 获取所有分类函数
    function initCate() {
        // 发起 ajax 请求
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // 判断
                if (res.status !== 0) return layer.msg(res.message)

                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通知layui 重新渲染页面UI结构
                form.render()
            }
        })
    }

    // 5.筛选按钮功能
    // 为表单添加 submit 监听事件
    $('#form-search').on('submit', function(e) {
        // 阻止表单的默认的事件
        e.preventDefault()

        // 获取分类参数
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 重新定义查询参数
        q.cate_id = cate_id
        q.state = state

        // 重新渲染文章列表数据
        getTavleList()
    })

    // 6. 渲染分页
    function renderPage(data) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器 id
            count: data, // 总数据数据
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2, 3, 5, 8, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit
                    //根据最新的页码值 渲染文章列表数据
                if (!first) {
                    getTavleList()
                }
            }
        })
    }


    // 7.删除功能
    // 使用事件委托  添加监听事件
    $('body').on('click', '.btn-del', function() {
        // 用来判断当前页面是否还有数据
        var len = $('.btn-del').length
        console.log(len);

        // 获取文章的id
        var id = $(this).attr('data-id')


        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起ajax请求
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)

                    // 当数据删除完成后，需要判断当前这一页中 是否还有剩余的数据
                    // 如果没有剩余的数据，则让页码值 -1 之后
                    // 在重新调用 initTable 方法

                    // 重新渲染文章列表数据
                    if (len === 1) {
                        // 证明当前页面没有数据了
                        // 页码最小值为1
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }

                    getTavleList()
                }
            })

            layer.close(index);
        });

    })
})