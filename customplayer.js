//contents list
var contents = [];
//player setting value
var is_all_replay = true;
var replay_delay_seconds = 5;
var is_one_replay = false;
var allow_fullscreen = false;
var list_current = 0;
var sub_visible = true;
//variable player controller;
var player;


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
function setActiveCard(current){
  var cards = document.querySelectorAll('.center > .card');
  for(var idx = 0; cards.length > idx; idx++){
    var clsName = cards[idx].className;
    cards[idx].className = clsName.replace(' active', '');
  }
  var className = cards[current].className;
  cards[current].className = className + ' active';
  document.getElementById('title').innerHTML = contents[current].title;
}
function setNavigator(){
  if(list_current == 0){
    setHide('prev');
    removeHide('next');
  }else if(list_current == contents.length -1){
    setHide('next');
    removeHide('prev');
  }
  else {
    removeHide('prev')
    removeHide('next')
  }
}
function hideWrapper(){
  setHide('w_top');
  setHide('w_right');
  setHide('w_bottom');
};
function viewWrapper(){
  removeHide('w_top');
  removeHide('w_right');
  removeHide('w_bottom');
};
//컨텐츠 목록 가져오는 함수
var get_contents = function() {
  return [{
      "title": "DRM4",
      "mck": "JP8JKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20171027/05/20171027-er25j56e.jpg"
    },
    {
      "title": "DRM3",
      "mck": "bfjXKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20171027/05/20171027-h2vkx9le.jpg"
    },
    {
      "title": "DRM2",
      "mck": "uZGwKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20171027/05/20171027-5p4yf1us.jpg"
    },
    {
      "title": "DRM1",
      "mck": "1FbxKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20180326/09/20180326-sjpcjw3r.jpg"
    },
    {
      "title": "kakaotalk_video_20180618_1121_27_437	None",
      "mck": "jBjaKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20180625/08/20180625-wjxksnj5.jpg"
    },
    {
      "title": "Detective.in.the.Bar.2013.JAP.DVDRip.x264.AC3-zdzdz",
      "mck": "KN0cKaue",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20180704/13/20180704-v8pv21ez.jpg"
    },
    {
      "title": "[ENG sub] The Call [풀버전] 거미x에일리 ′질투나′ [6_9 음원공개] 180601 EP.5",
      "mck": "DSLQKaud",
      "poster": "https://hdyang2.video.kr.kollus.com/kr/snapshot/hdyang2/20180704/16/20180704-ie4uqipv.jpg"
    }
  ];
};

function isIE () {

	 var word;

	 var agent = navigator.userAgent.toLowerCase();

	 // IE old version ( IE 10 or Lower )
	 if ( navigator.appName == "Microsoft Internet Explorer" ) word = "msie ";

	 // IE 11
	 else if ( agent.search( "trident" ) > -1 ) word = "trident/.*rv:";

	 // Microsoft Edge
	 else if ( agent.search( "edge/" ) > -1 ) word = "edge/";

	 // 그외, IE가 아니라면 ( If it's not IE or Edge )
	 else return -1;

	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );

	 if (  reg.exec( agent ) != null  ) return parseFloat( RegExp.$1 + RegExp.$2 );

	 return -1;
}
//URL 생성 함수
var get_url = function(cuid, mck) {
  var jwt = new JWT();
  var payload = jwt.payload(30, cuid, mck);
  var token = jwt.create(payload, 'hdyang2');
  var url = jwt.url('s', token, '5c5b5d50d74a56ea08b17ea5d765b45b6ce1bd86bb6d02fd0a88faec7a02447d');
  //IE 9 이하 버전은 v2 실행
  return isIE() <= 9 ? url : url + '&player_version=v3';
}

var load_player = function() {
  player = null;
  try {
    player = new Kollus.VideogatewayController({
      target_window: document.getElementById('player').contentWindow
    });


    player.on('progress', function(percent, position, duration) {})
    .on('screenchange', function(screen) {})
    .on('volumechange', function(volume) {})
    .on('muted', function(muted) {})
    .on('play', function() {
      hideWrapper();
    })
    .on('pause', function() {
      viewWrapper();
    })
    .on('done', function() {
      viewWrapper();
      if(is_one_replay){player.play(0);}
      else{
        if(is_all_replay){
          setTimeout(function(){
             list_current = list_current + 1 == contents.length ? 0 : list_current + 1;
             playerIframe.setAttribute('src', get_url('TEST', contents[list_current].mck));
             setNavigator();
             setActiveCard(list_current);
             document.getElementById('title').innerHTML = contents[current].title;
          }, replay_delay_seconds * 1000);
        }
      }
    })
    .on('ready', function() {})
    .on('loaded', function() {
      setNavigator();
      player.play(0);
      setActiveCard(list_current);
      player.set_subtitle_visibility(sub_visible);
    }).on('jumpstepchange', function(jumpstep) {})
    .on('scalemode', function(scalemode) {})
    .on('speedchange', function(speed) {})
    .on('topmost', function(topmost) {})
    .on('error', function(error_code) {})
    .on('videosettingchange', function(videosetting) {})
    .on('html5_video_supported', function(is_supported) {});

  } catch (e) {
    console.error(e);
  }
}
contents = get_contents();
function createContentList(){
  var center = document.getElementById('center');
  for(var idx = 0; idx < contents.length; idx++){
    var card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-idx', idx);
    var img = document.createElement('img');
    img.setAttribute('src', contents[idx].poster);
    card.appendChild(img);
    var span = document.createElement('span');
    span.innerHTML = contents[idx].title;
    card.appendChild(span);
    center.appendChild(card);
  }
}
createContentList();
 if(isIE() > 9 || !isIE()){
  document.addEventListener('DOMContentLoaded', function() {
    var playerIframe = document.getElementById('player');
    playerIframe.addEventListener('load', function() {
      player = undefined;
      if (player == undefined) {
        load_player();
      }
    });
    playerIframe.addEventListener('mouseover', function(){player.set_control_visibility(true);});
    playerIframe.addEventListener('mouseout', function(){player.set_control_visibility(false);});
    playerIframe.setAttribute('src', get_url('TEST', contents[0].mck));
    list_current = 0;
    setActiveCard(list_current);
    setNavigator();
    document.getElementById('title').innerHTML = contents[list_current].title;

    var prev = document.getElementById('prev');
    prev.addEventListener('click', function(evt){
      if(list_current >= 1){
        var current = list_current -1;
        playerIframe.setAttribute('src', get_url('TEST', contents[current].mck));
        list_current = current;
        setNavigator();
        setActiveCard(list_current);
        document.getElementById('title').innerHTML = contents[current].title;
      }
    });
    var next = document.getElementById('next');
    next.addEventListener('click', function(evt){
      if(list_current >= 0 && list_current < contents.length -1){
        var current = list_current +1;
        playerIframe.setAttribute('src', get_url('TEST', contents[current].mck));
        list_current = current;
        setNavigator();
        setActiveCard(list_current);
        document.getElementById('title').innerHTML = contents[current].title;
      }
    });
    var cards=document.querySelectorAll('.center > .card');
    for(var idx = 0; idx < cards.length; idx++){
    cards[idx].addEventListener('click', function(evt){
      var node;

      if(evt.target.tagName.toLowerCase() == 'img' || evt.target.tagName.toLowerCase() == 'span'){
        node = evt.target.parentElement;
      }
      else {node = evt.target;}
      var idx = node.getAttribute('data-idx');
      playerIframe.setAttribute('src', get_url('TEST', contents[idx].mck));
      list_current = idx;
      setNavigator();
      setActiveCard(list_current);
      document.getElementById('title').innerHTML = contents[idx].title;
    });
  }
  var btn_star = document.getElementById('btn_star');
  btn_star.addEventListener('click', function(evt){
    alert(JSON.stringify(contents[list_current])+ ' 즐겨찾기로 등록 하셨습니다.');
  });
  var btn_subtitle = document.getElementById('btn_subtitle');
  btn_subtitle.addEventListener('click', function(evt){
    sub_visible = !sub_visible;
    player.set_subtitle_visibility(sub_visible);
  });
  });

}
else if (isIE() <= 8) {
  window.onload =  function() {
    var playerIframe = document.getElementById('player');
    playerIframe.attachEvent('readystatechange', function() {
      player = undefined;
      if (player == undefined) {
        load_player();
      }
    });
    playerIframe.attachEvent('onmouseover', function(){player.set_control_visibility(true);});
    playerIframe.attachEvent('onmouseout', function(){player.set_control_visibility(false);});
    playerIframe.setAttribute('src', get_url('TEST', contents[0].mck));
    list_current = 0;
    setActiveCard(list_current);
    setNavigator();
    document.getElementById('title').innerHTML = contents[list_current].title;

    var prev = document.getElementById('prev');
    prev.attachEvent('onclick', function(evt){
      if(list_current >= 1){
        var current = list_current -1;
        playerIframe.setAttribute('src', get_url('TEST', contents[current].mck));
        list_current = current;
        setNavigator();
        setActiveCard(list_current);
        document.getElementById('title').innerHTML = contents[current].title;
      }
    });
    var next = document.getElementById('next');
    next.attachEvent('onclick', function(evt){
      if(list_current >= 0 && list_current < contents.length -1){
        var current = list_current +1;
        playerIframe.setAttribute('src', get_url('TEST', contents[current].mck));
        list_current = current;
        setNavigator();
        setActiveCard(list_current);
        document.getElementById('title').innerHTML = contents[current].title;
      }
    });
    var cards=document.querySelectorAll('.center > .card');
    for(var idx = 0; idx < cards.length; idx++){
    cards[idx].attachEvent('onclick', function(evt){
      var node;

      if(evt.target.tagName.toLowerCase() == 'img' || evt.target.tagName.toLowerCase() == 'span'){
        node = evt.target.parentElement;
      }
      else {node = evt.target;}
      var idx = node.getAttribute('data-idx');
      playerIframe.setAttribute('src', get_url('TEST', contents[idx].mck));
      list_current = idx;
      setNavigator();
      setActiveCard(list_current);
      document.getElementById('title').innerHTML = contents[idx].title;
    });
  }
  var btn_star = document.getElementById('btn_star');
  btn_star.attachEvent('onclick', function(evt){
    alert(JSON.stringify(contents[list_current])+ ' 즐겨찾기로 등록 하셨습니다.');
  });
  var btn_subtitle = document.getElementById('btn_subtitle');
  btn_subtitle.attachEvent('onclick', function(evt){
    sub_visible = !sub_visible;
    player.set_subtitle_visibility(sub_visible);
  });
  };
}
