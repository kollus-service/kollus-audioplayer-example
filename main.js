function player_loaded() {
  var controller;
  try {
    controller = new Kollus.VideogatewayController({
      target_window: getElement('player').contentWindow
    });

    /**
     * Controller regsister event handler
     **/

    controller.on('progress', function(percent, position, duration) {
      function MyTimeString(val) {
        sec = val;
        var s = "";
        var v = parseInt(val / 3600);

        s += v;
        s += ":";

        v = parseInt((val % 3600) / 60);
        s += (v < 10 ? "0" : "") + v;
        s += ":";

        v = parseInt(val % 60);
        s += (v < 10 ? "0" : "") + v;
        s += "";

        return s;
      }
      var pos = parseInt(position);
      var dur = parseInt(duration);

      $('#seconds').html(MyTimeString(pos));
      $('#duration').html(MyTimeString(dur));


      $('progress').attr('max', controller.get_progress().duration);
      $('progress').attr('value', controller.get_progress().position);
    }).on('screenchange', function(screen) {}).on('volumechange', function(volume) {}).on('muted', function(muted) {}).on('play', function() {
      $('.play').html('<span class="icon is-small"><i class="fas fa-pause"></i></span>');
      $('.play').addClass('pause');
      $('.play').removeClass('play');
    }).on('pause', function() {
      $('.pause').html('<span class="icon is-small"><i class="fas fa-play"></i></span>');
      $('.pause').addClass('play');
      $('.pause').removeClass('pause');
    }).on('done', function() {

      //곡 재생 완료시 다음 동작 설정
      if($('input:checkbox[id="replay"]').is(':checked')){
        //한곡 재생 반복
        controller.play(0);
      }
      else{
      if ($('input:checkbox[id="autoplay"]').is(':checked')) {
        //전곡 재생 반복
        var idx = $('.music-item.active').data('idx');
        var length = $('.music-item').length;
        if (length - 1 == idx) {
          $($('.music-item')[0]).click();
        } else {
          $($('.music-item')[idx + 1]).click();
        }
      }
    }
    }).on('ready', function() {
      controller.play();
      $('progress').attr('max', controller.get_progress().duration);
      $('progress').attr('value', controller.get_progress().position);
      $('#playrate').html(parseFloat(controller.get_speed()));
      var log = $('textarea').val();
      $('textarea').val(log + $('#player').attr('src') + ' Player Ready \r\n');
      $('.volume').val(controller.get_volume());
    }).on('loaded', function() {}).on('jumpstepchange', function(jumpstep) {}).on('scalemode', function(scalemode) {}).on('speedchange', function(speed) {
      $('#playrate').html(parseFloat(controller.get_speed()));
    }).on('topmost', function(topmost) {}).on('error', function(error_code) {}).on('videosettingchange', function(videosetting) {}).on('html5_video_supported', function(is_supported) {});
    /**
     * Controller UI event handler
     **/
    $('.fsb').on('click', function() {
      var idx = $('.music-item.active').data('idx');
      var length = $('.music-item').length;
      if (0 == idx) {
        $($('.music-item')[length - 1]).click();
      } else {
        $($('.music-item')[idx - 1]).click();
      }
    });
    $('.fb').on('click', function() {
      controller.rw();
    });
    $(document).on('click', '.play', function() {
      var idx = $('.music-item.active').data('idx');
      if (idx == undefined) {
        $($('.music-item')[0]).click();
      }
      controller.play();
    });
    $(document).on('click', '.pause', function() {
      controller.pause();
    });
    $('.ff').on('click', function() {
      controller.ff();
    });
    $('.fsf').on('click', function() {
      var idx = $('.music-item.active').data('idx');
      var length = $('.music-item').length;
      if (length - 1 == idx) {
        $($('.music-item')[0]).click();
      } else {
        $($('.music-item')[idx + 1]).click();
      }
    });

    $(document).on('click', '.repeat1', function() {
      controller.set_repeat_start(controller.get_progress().position);
      $('.repeat1').html('<span style="color:red;">A</span><span>-B</span>');
      $('.repeat1').addClass('repeat2');
      $('.repeat1').removeClass('repeat1');

    });
    $(document).on('click', '.repeat2', function() {
      controller.set_repeat_end(controller.get_progress().position);
      $('.repeat2').html('<span style="color:red;">A-B<span>');
      $('.repeat2').addClass('repeat3');
      $('.repeat2').removeClass('repeat2');
    });
    $(document).on('click', '.repeat3', function() {
      controller.unset_repeat();
      $('.repeat3').html('<span>A-B<span>');
      $('.repeat3').addClass('repeat1');
      $('.repeat3').removeClass('repeat3');
    });

    $('.m-sp').on('click', function() {
      var speed = parseFloat(controller.get_speed()) - 0.1;
      if (speed > 0.0) {
        controller.set_speed(speed);
      } else {
        controller.set_speed(0.0);
      }
    });
    $('.p-sp').on('click', function() {
      var speed = parseFloat(controller.get_speed()) + 0.1;
      if (speed < 4.0 && speed > 0.0) {
        controller.set_speed(speed);
      } else {
        controller.set_speed(1.0);
      }
    });

    $('.sound').on('click', function() {
      controller.mute();
      $('.sound').html('<span class="icon is-small"><i class="fas fa-volume-off"></i></span>');
      $('.sound').addClass('mute');
      $('.sound').removeClass('sound');
    });
    $(document).on('click', '.mute', function() {
      controller.mute();
      $('.mute').html('<span class="icon is-small"><i class="fas fa-volume-up"></i></span>');
      $('.mute').addClass('sound');
      $('.mute').removeClass('mute');
    });

    $('.volume').on('change', function() {
      controller.set_volume($(this).val())
    });



  } catch (ex) {
    console.log(ex);
    controller = undefined;
  }
}

function evt_click_music_item(evt) {

  var item = $(this);
  var items = $('.music-item');
  items.css('background', 'rgba(255,255,255,1)');
  items.removeClass('active')
  item.css('background', 'rgba(200,200,200, 0.7)');
  item.addClass('active');
  var mck = item.data('mck');

  var jwt = new JWT();

  var payload = jwt.payload(30, 'test', mck);
  var token = jwt.create(payload, 'hdyang2');
  var url = jwt.url('s', token, '5c5b5d50d74a56ea08b17ea5d765b45b6ce1bd86bb6d02fd0a88faec7a02447d');
  var player = getElement('player');
  player.setAttribute('src', url);
  delete jwt;

}
$(document).ready(function() {
  // api access token , channel_key
  var media = new MEDIA('7ge80tfvz51x2606', '7zllh4b5');
  var list = media.list();
  if (list.count != 0) {
    var itemList = makeItem(list);
    var panel = $('.panel');

    for (var idx = 0; idx < itemList.length; idx++) {
      panel.append(itemList[idx]);
    }
    var loader = document.querySelector('.loader_container');
    loader.className = 'loader_container hide';
  } else {
    document.getElementbyId('errMessage').innerHTML = list.msg;
  }
  $('.music-item').on('click', evt_click_music_item);
  var player = $('#player');
  player.on('load', player_loaded);
  $(document).on('click', '.play', function() {
    var idx = $('.music-item.active').data('idx');
    if (idx == undefined) {
      $($('.music-item')[0]).click();
    }
  });
});
