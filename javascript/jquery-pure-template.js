/*
 * jQuery Pure Template plugin v 0.9.02
 * Copyright 2010, Michal Papis <mpapis@niczsoft.com>
 * Licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function($){

  var pt = {debug:true};

  pt.logO = function(){
    if (!pt.debug) return;
    var opts = [];
    for (var i = 0; i < arguments.length; i++) opts.push(arguments[i]);
    console.log(opts);
  }

  pt.uniq_id = 1;
  pt.uniq = function() {return '_pt_key'+pt.uniq_id++ + '_';}

  //fill element with data
  pt.render = function(root,data,map,attr) {
    pt.logO('root:',root,'map:',map,'selector:',root.selector,'data:',data,'attr:',attr);
    var newElem;
    if (attr){
      root.attr(attr,data);
    } else if (data instanceof Array) {
      var uniq = pt.uniq();
      for (var id in data){
        newElem = root.clone();
        if (data[id]['id']) {
          var obj_id = data[id]['id'];
          delete data[id]['id'];
          newElem.attr('id',obj_id)
          newElem.selector=root.selector+'#'+obj_id;
        } else {
          newElem.addClass(uniq+id);
          newElem.selector=root.selector+'.'+uniq+id+':first';
        }
        root.before(newElem);
        pt.render(newElem,data[id],map);
      }
      root.remove();
    } else if (data instanceof String || typeof(data) === 'string') {
      root.html(data);
    } else if (data instanceof Number || typeof(data) === 'number') {
      root.html(''+data);
    } else {
      for (var key in data) {
        var val = data[key];
        if (map && (map[key] || map[key]==="")) {
          key = map[key];
          if (key instanceof Array) {
            map = key[1];
            key = key[0];
          }
        }
        var arr = key.split('@');
        attr = arr[1];
        key = arr[0];
        newElem = ($.trim(key)==='') ? root : root.find(key);
        pt.render(newElem, val, map, attr);
      }
    }
  };

  $.fn.render = function(data,map){
    pt.render(this,data,map);
  }
})(jQuery)

