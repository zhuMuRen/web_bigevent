$(function () {
  //显示和隐藏注册登录页面
  $('#link_reg').click(function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  $('#link_login').click(function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  //自己表单验证
  // $('.login-box #user-name').blur(function () {
  //   let value = $(this).val();
  //   let reg = /^[a-z0-9_-]{3,16}$/;
  //   regExp(reg, value)
  // });

  // $('.login-box #pwd').blur(function () {
  //   let value = $(this).val();
  //   let reg = /^[a-z0-9_-]{6,18}$/;
  //   regExp(reg, value)
  // });

  // $('.reg-box #reg-name').blur(function () {
  //   let value = $(this).val();
  //   let reg = /^[a-z0-9_-]{3,16}$/;
  //   regExp(reg, value)
  // });

  // $('.reg-box #reg-pwd').blur(function () {
  //   let value = $(this).val();
  //   let reg = /^[a-z0-9_-]{6,18}$/;
  //   regExp(reg, value)
  // });

  // $('.reg-box #reg-repwd').blur(function () {
  //   let value = $(this).val();
  //   let pwd = $('.reg-box #reg-pwd').val();
  //   let reg = /^[a-z0-9_-]{6,18}$/;
  //   regExp(reg, value)
  //   if (value != pwd) {
  //     console.log("两次输入的密码格式不正确,请重新输入!");
  //   }
  // });

  //封装正则函数
  // function regExp(reg, value) {
  //   if (reg.test(value)) {
  //     return console.log('输入正确');
  //   }
  //   console.log('输入的格式有误,请重新输入!');
  // };


  // 自定义表单验证
  let form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须是6到12位,且不能有空格!'],
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '输入的两次密码不一致!';
      }
    }
  });
  let layer = layui.layer;

  // 监听注册表单的提交事件
  $('#form_reg').on("submit", function (e) {
    e.preventDefault();
    console.log($('#form_reg [name=username]').val());
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    };
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: data,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.massage);
        }
        layer.msg('注册成功,请登录');
        $('#link_login').click();
      }
    });
  });

  //监听 登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    let data = {
      username: $('#form_login [name=username]').val(),
      password: $('#form_login [name=password]').val()
    }
    $.post('/api/login', data, function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('欢迎进入黑色玫瑰!');
      localStorage.setItem('token', res.token);
      location.href = './index.html';
    })
  })








  //这是末尾
})