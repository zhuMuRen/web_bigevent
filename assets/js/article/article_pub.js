$(function () {
  let layer = layui.layer;
  let form = layui.form;

  //初始化富文本
  initEditor();

  initCate();
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取数据失败!')
        }
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      }
    })
  }


  //初始化图片裁剪器
  let $image = $('#image');

  //裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  };

  //初始化裁剪区域
  $image.cropper(options);

  $('#btnChooseImage').click(function () {
    $('#coverFile').click();
  })

  //绑定点击事件文件的选择框
  $('#coverFile').on('change', function (e) {
    //获取到文件的伪数组
    let files = e.target.files;
    //判断是否获取到文件
    if (files.length === 0) {
      return
    }
    //给图片创建url地址
    let newImgURL = URL.createObjectURL(files[0]);

    // 为裁剪区设置图片  运用了cropper插件
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  //定义文章的发布状态
  let art_state = '已发布';

  //为草稿按钮绑定点击事件
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  });

  // 监听表单的提交事件
  $('#form-pub').submit(function (e) {
    e.preventDefault();
    //基于form表单创建formdata对象
    let fd = new FormData($(this)[0]);
    //将文章的发布状态添加到fd中
    fd.append('state', art_state)
    //剪裁好的图片,输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        //发起数据的请求
        publishArticle(fd);
      })
  });

  // 定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 提交formdata格式的数据必须设置以下两个属性
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！');
        }
        layer.msg('发布文章成功！');
        // 发布文章成功后，跳转到文章列表页面
        location.href = '../../article/article_list.html';
      }
    })
  }

})