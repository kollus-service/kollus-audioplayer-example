var MEDIA = function(access_key, channel_key) {

  this._access_key = access_key;
  this._channel_key = channel_key;
  this.list = function() {
    var url = 'https://api.kr.kollus.com/0/media/channel/media_content?access_token=' + this._access_key + '&channel_key=' + this._channel_key;
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    var res = JSON.parse(request.responseText);
    if(res.error != 0){
      return {count:0, msg: res.message};
    }
    else {
      var count = res.result.count;
      if(count <= 0){
        return {count:0, msg:'채널내에 컨텐츠가 없습니다.'};
      }
      else {
        var items= res.result.items.item;
        var result = [];
        for(var idx = 0; idx < count; idx++){
          var item = {};
          item.idx = idx;
          item.type = items[idx].kind_name;
          item.encrypt = items[idx].use_encryption == 0 ? 'NonDRM' : 'DRM';
          item.title = items[idx].title;
          item.key = items[idx].media_content_key;
          item.duration=items[idx].duration;
          result.push(item);
        }
        return result;
      }
    }
  };
};
