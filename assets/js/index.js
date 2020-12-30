$(function () {
  //调用函数获取用户的基本信息
  getuserInfo()
  let layer = layui.layer;

  //点击按钮,实现退出功能
  $('#btnLogout').click(function () {
    //提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token')
      // 2. 重新跳转到登录页面
      location.href = '/login.html'
      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})

// 封装获取用户信息的函数
function getuserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败!')
      };
      renderAvatar(res.data);
    }
  })

  //渲染头像的函数
  function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
      $('.layui-nav-img').attr('src', user.user_pic).show();
      $('.text-avatar').hide()
    } else {
      $('.layui-nav-img').hide();
      //截取字符串的第一个并转换成大写的
      let first = name[0].toUpperCase();
      $('.text-avatar').html(first).show();
    }
  }

}