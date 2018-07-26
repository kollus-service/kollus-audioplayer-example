
var getElement = function(id){
  return document.getElementById(id);
};
var getElementBySelector = function(selector){
  return document.querySelector(selector);
};

var getElementBySelector = function(selector, idx){
  return document.querySelectorAll(selector)[idx];
};
var getElementsBySelector = function(selector){
  return document.querySelectorAll(selector);
};
var getElementsByClassName = function(className){
  return document.getElementsByClassName(className);
}

var createElement = function(tag, id, className, innerHtml) {
  var element = document.createElement(tag);
  if (id != null && id != undefined)
    element.id = id;
  if (className != null && className != undefined)
    element.className = className;
  if (innerHtml != null && innerHtml != undefined)
    element.innerHTML = innerHtml;
  return element;
};

var makeItem = function(list) {
  var result = [];
  for (var idx = 0; idx < list.length; idx++) {
    var item = list[idx];
    var pb = createElement('div', null, 'panel-block music-item');
    pb.setAttribute('data-mck', item.key);
    pb.setAttribute('data-idx', item.idx);
    var media = createElement('article', null, 'media');
    var ml = createElement('figure', null, 'media-left');
    var p_img = createElement('p', null, 'image is-64x64');
    var img = createElement('img');
    item.poster ? img.setAttribute('src', item.poster) : img.setAttribute('src', 'basic.jpeg');
    p_img.appendChild(img);
    ml.appendChild(p_img);
    media.appendChild(ml);
    pb.appendChild(media);
    var mc = createElement('div', null, 'media-content');
    var content = createElement('div', null, 'content', '<p><strong>' + item.title + '</strong></p>');
    var enc = createElement('span', null, 'tag is-info', item.encrypt);
    var duration = createElement('span', null, 'tag is-info', item.duration);
    var type = createElement('span', null, 'tag is-info', item.type);
    var mck = createElement('span', null, 'tag is-danger', item.key);
    content.appendChild(enc);
    content.appendChild(type);
    content.appendChild(duration);
    content.appendChild(mck);
    mc.appendChild(content);
    pb.appendChild(mc);
    result.push(pb);
  }
  return result;
};
