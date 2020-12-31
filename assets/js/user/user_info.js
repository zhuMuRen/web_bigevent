$(function () {
  //判断昵称的长度
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间';
      }
    }
  })

  inituserInfo();
  //初始化信息
  function inituserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败!')
        }
        console.log(res.data);
        //赋值给表单
        form.val('formUserInfo', res.data)
      }
    })
  };

  //点击重置按钮重新获取用户信息
  $('#rest-buttn').click(function (e) {
    e.preventDefault();
    inituserInfo();
  });

  //监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        console.log(res);
      }
    })
  })
})

