/* Chuyển ngôn ngữ: giữ nguyên HTML tiếng Việt, thay chữ theo từ điển trong js/lang/*.js */
(function(){
  'use strict';
  var LABEL={vi:'Tiếng Việt',ja:'日本語',zh:'简体中文','zh-Hant':'繁體中文',en:'English',ko:'한국어',ms:'Bahasa Melayu',ne:'नेपाली',th:'ไทย',id:'Bahasa Indonesia'};
  var D=window.I18N||{}, nodes=[], rec=new WeakMap(), cur='vi', busy=false, timer=0;
  var ORIG_TITLE=document.title, desc=document.querySelector('meta[name=description]');
  var norm=function(t){return t.replace(/\s+/g,' ').trim()};

  function collect(root){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentNode;
      if(!p||/^(SCRIPT|STYLE|NOSCRIPT|SELECT|OPTION)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;
      return norm(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    var n;while((n=w.nextNode())){if(!rec.has(n)){rec.set(n,{src:n.nodeValue,out:n.nodeValue});nodes.push(n);}}
  }
  function translate(src,lang){
    var d=D[lang];if(lang==='vi'||!d)return src;
    var k=norm(src);if(!Object.prototype.hasOwnProperty.call(d,k))return src;
    var m=src.match(/^(\s*)[\s\S]*?(\s*)$/);return m[1]+d[k]+m[2];
  }
  function apply(lang){
    cur=lang;busy=true;obs.disconnect();
    collect(document.body);
    nodes=nodes.filter(function(n){return n.isConnected});
    nodes.forEach(function(n){
      var r=rec.get(n);
      if(n.nodeValue!==r.out)r.src=n.nodeValue;      // chữ do script khác cập nhật (vd. máy tính học phí)
      r.out=translate(r.src,lang);
      if(n.nodeValue!==r.out)n.nodeValue=r.out;
    });
    document.documentElement.lang=lang;
    var dd=D[lang]||{};
    document.title=(lang!=='vi'&&dd.__title)||ORIG_TITLE;
    var note=document.getElementById('langNote');
    if(note){var show=lang!=='vi'&&dd.__note;note.hidden=!show;if(show)note.firstElementChild.textContent=dd.__note;}
    var sel=document.getElementById('langSel');if(sel)sel.value=lang;
    try{localStorage.setItem('szu-lang',lang)}catch(e){}
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});busy=false;
  }
  var obs=new MutationObserver(function(){
    if(busy||cur==='vi')return;
    clearTimeout(timer);timer=setTimeout(function(){apply(cur)},60);
  });
  function buildSelect(){
    var box=document.getElementById('lang');if(!box)return;
    var sel=document.createElement('select');sel.id='langSel';sel.setAttribute('aria-label','Language / Ngôn ngữ / 言語');
    ['vi'].concat(Object.keys(D)).forEach(function(c){
      if(!LABEL[c]||!(D[c]&&D[c].__ready))return;var o=document.createElement('option');o.value=c;o.textContent=LABEL[c];sel.appendChild(o);});
    sel.addEventListener('change',function(){apply(sel.value)});
    box.appendChild(sel);
  }
  buildSelect();
  var l='vi';
  try{l=new URLSearchParams(location.search).get('lang')||localStorage.getItem('szu-lang')||'vi'}catch(e){}
  if(l!=='vi'&&D[l])apply(l);else{var s=document.getElementById('langSel');if(s)s.value='vi';}
})();
