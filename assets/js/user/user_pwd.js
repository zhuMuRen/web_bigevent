$(function () {

  let layer = layui.layer;
  let form = layui.form;
  //表单验证
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'],
    retpwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '修改密码不能为原密码!'
      }
    },
    supwd: function (value) {
      if (value !== $('[name=newPwd]').val()) { 
        return '输入的两次密码不一致!'
      }
    }
  })


  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改失败!');
        }
        layer.msg(res.message);
      }
    })


  })


})