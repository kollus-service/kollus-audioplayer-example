var player;
//자동 반복을 사용여부
var is_replay;
//건너뛰기 값
var step = 10;
//구간반복 플래그
var repeated = 0; //0: 반복 안함 1: 반복 시작점 지정, 2: 반복 끝점 지정 및 반복중
var repeated_start = 0;
//재생 시간 계산 함수
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

function setHide(id) {
  var className = document.getElementById(id).className;
  if (className.indexOf('hide') == -1) {
    document.getElementById(id).className = className + ' hide';
  }
}

function removeHide(id) {
  var className = document.getElementById(id).className;
  document.getElementById(id).className = className.replace(' hide', '');
}

window.onload = function() {
  //player controller initialize
  try {
    player = new Kollus.VideogatewayController({
      target_window: document.getElementById('player').contentWindow
    });
    //player 준비 상태 확인
    player.on('loaded', function() {})
      .on('ready', function() {
        console.log('load');
        player.set_jumpstep(step);
        player.play(0);
        document.getElementById('s_val').innerHTML = player.get_speed().toFixed(1);
        document.getElementById('v_value').style.width = player.get_volume() + '%';
      });
    //player 재생 관련 이벤트
    player.on('play', function() {
        setHide('play');
        removeHide('pause');
      })
      .on('pause', function() {
        setHide('pause');
        removeHide('play');
      })
      .on('progress', function(percent, position, duration) {
        document.getElementById('seconds').innerHTML = MyTimeString(parseInt(position));
        document.getElementById('duration').innerHTML = MyTimeString(parseInt(duration));
        document.getElementById('p_value').style.width = percent + '%';
        if (repeated == 1) {
          document.getElementById('r_value').style.width = (percent - repeated_start) + '%';
        }

      })
      .on('done', function() {
        //자동 반복 플래그 온일때 처음으로 반복 재생
        if (is_replay == 1) {
          player.play(0);
        }
      });
    //player 소리 관련 이벤트
    player.on('volumechange', function(volume) {
        document.getElementById('v_value').style.width = volume + '%';
      })
      .on('muted', function(muted) {
        if (muted) {
          setHide('mute');
          removeHide('sound');
        } else {
          setHide('sound');
          removeHide('mute');
        }
      });
  } catch (ex) {
    console.log(ex);
    if (ex instanceof KollusPostMessageException && e.code == -99) {}
  }
  //Player Controller Event
  //rewind
  var rewind = document.getElementById('rewind');
  rewind.attachEvent('onclick', function(evt) {
    player.rw();
  });
  //play
  var play = document.getElementById('play');
  play.attachEvent('onclick', function(evt) {
    player.play(0);
  });
  //pause
  var pause = document.getElementById('pause');
  pause.attachEvent('onclick', function(evt) {
    player.pause();
  });
  //forward
  var forward = document.getElementById('forward');
  forward.attachEvent('onclick', function(evt) {
    player.ff();
  });
  //repeat
  var repeat1 = document.getElementById('repeat1');
  repeat1.attachEvent('onclick', function(evt) {
    var current = player.get_progress();
    document.getElementById('r_value').style.left = current.percent + '%';
    repeated_start = current.percent;
    repeated = 1;
    player.set_repeat_start(current.position);
    setHide('repeat1');
    setHide('repeat2');
    setHide('repeat3');
    removeHide('repeat2');
  });
  var repeat2 = document.getElementById('repeat2');
  repeat2.attachEvent('onclick', function(evt) {
    var current = player.get_progress();
    repeated = 2;
    player.set_repeat_end(current.position);
    setHide('repeat1');
    setHide('repeat2');
    setHide('repeat3');
    removeHide('repeat3');
  });
  var repeat3 = document.getElementById('repeat3');
  repeat3.attachEvent('onclick', function(evt) {
    document.getElementById('r_value').style.left = 0;
    document.getElementById('r_value').style.width = 0;
    repeated = 0;
    player.unset_repeat();
    setHide('repeat1');
    setHide('repeat2');
    setHide('repeat3');
    removeHide('repeat1');
  });
  //s_down
  var s_down = document.getElementById('s_down');
  s_down.attachEvent('onclick', function(evt) {
    document.getElementById('s_val').innerHTML = player.get_speed() - 0.1 >= 0 ? (player.get_speed() - 0.1).toFixed(1) : '0';
    player.set_speed((player.get_speed() - 0.1).toFixed(1));
  });
  //s_up
  var s_up = document.getElementById('s_up');
  s_up.attachEvent('onclick', function(evt) {
    document.getElementById('s_val').innerHTML = player.get_speed() + 0.1 <= 2 ? (player.get_speed() + 0.1).toFixed(1) : '2.0';
    player.set_speed((player.get_speed() + 0.1).toFixed(1));
  });
  //replay
  var replay = document.getElementById('replay');
  replay.attachEvent('onclick', function(evt) {
    setHide('replay');
    removeHide('no_replay');
    is_replay = 1;
  });
  var no_replay = document.getElementById('no_replay');
  no_replay.attachEvent('onclick', function(evt) {
    setHide('no_replay');
    removeHide('replay');
    is_replay = 0;
  });
  //mute
  var mute = document.getElementById('mute');
  mute.attachEvent('onclick', function(evt) {
    player.mute();
  });
  var sound = document.getElementById('sound');
  sound.attachEvent('onclick', function(evt) {
    player.mute();
  });
  //progress
  var progress = document.getElementById('progress');
  progress.attachEvent('onclick', function(evt) {
    var duration = player.get_progress().duration;
    var position = parseInt(duration * (evt.offsetX / document.getElementById('progress').clientWidth));
    player.play(position);
  });
  //volume
  var volume = document.getElementById('volume');
  volume.attachEvent('onclick', function(evt) {
    player.set_volume(evt.offsetX);
  });
};
