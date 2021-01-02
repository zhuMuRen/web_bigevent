$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;

  // 定义一个查询的参数对象(根据要返回的参数)---方便修改和维护
  let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  };

  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  initTable();
  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total);
      }
    })
  };

  initCate();
  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败!')
        }
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        //要通过layui重新渲染表单区域的ui结构
        form.render();
      }
    })
  };

  //为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('[name=cate_id]').val();
    let state = $('[name=state]').val();
    // 设置给q中对应的属性
    q.cate_id = cate_id;
    q.state = state;
    initTable()
  });


  //定义渲染分页的方法
  function renderPage(total) {
    //调用layui文档中的laypage.render()方法渲染分页结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2触发的
        // 否则就是方式1触发的
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // initTable() 移动要根据第二个参数来防止出现死循环的调用
        if (!first) {
          initTable()
        }
      }
    })
  };


  //动态元素通过代理的形式来绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    //获取删除按钮的个数
    let len = $('.btn-delete').length;
    // 获取到文章的自定义属性id
    let id = $(this).attr('data-id');
    //询问是否要删除元素 调用layer中confirm方法
    layer.confirm('确认删除?', { icon: 2, title: "提示" }, function (index) {
      // 发起ajax请求重新渲染页面
      $.ajax({
        method: 'GET',
        //这里的url地址携带id
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
        }
      })
      layer.close(index);
    })
  })

  //编辑按钮
  $('tbody').on('click', '.btn-edit', function () {

    // location.href = "../../article/article_pub.html"
  })

})