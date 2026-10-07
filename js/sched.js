/* Hiển thị ngày trong bảng lịch tuyển sinh theo ngôn ngữ đang chọn (dùng Intl, không cần từ điển) */
(function(){
  'use strict';
  var WK=['CN','T2','T3','T4','T5','T6','T7'], last=null;
  function viFmt(dt){return WK[dt.getUTCDay()]+' '+dt.getUTCDate()+'/'+(dt.getUTCMonth()+1);}
  function fmt(iso,lang){
    var p=iso.split('-'), dt=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));
    if(lang==='vi'||!window.Intl||!Intl.DateTimeFormat)return viFmt(dt);
    try{return new Intl.DateTimeFormat(lang,{timeZone:'UTC',month:'short',day:'numeric',weekday:'short'}).format(dt);}
    catch(e){return viFmt(dt);}
  }
  function render(){
    var lang=document.documentElement.lang||'vi';
    if(lang===last)return; last=lang;
    var els=document.querySelectorAll('time[data-d]');
    for(var i=0;i<els.length;i++){
      var e=els[i], t=fmt(e.getAttribute('data-d'),lang), end=e.getAttribute('data-e');
      if(end)t+=' – '+fmt(end,lang);
      if(e.textContent!==t)e.textContent=t;
    }
  }
  render();
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
