/* Hướng dẫn nộp hồ sơ: chuyển nhóm người nộp, danh sách hồ sơ tick được (lưu trên máy), sao chép địa chỉ, nhảy nhanh tới từng bước */
(function(){
  'use strict';
  var A={
   vi:{prog:'Đã chuẩn bị {n}/{m} mục',all:'Đã đủ hồ sơ bắt buộc! Sang bước đăng ký online nhé.',copy:'Sao chép địa chỉ',copied:'Đã sao chép ✓'},
   en:{prog:'{n}/{m} items ready',all:'All required documents ready! On to the online application.',copy:'Copy address',copied:'Copied ✓'},
   ja:{prog:'{n}/{m} 件 準備済み',all:'必須書類がそろいました。次はオンライン出願です。',copy:'住所をコピー',copied:'コピーしました ✓'},
   zh:{prog:'已准备 {n}/{m} 项',all:'必备材料已齐全！请进行网上报名。',copy:'复制地址',copied:'已复制 ✓'},
   'zh-Hant':{prog:'已準備 {n}/{m} 項',all:'必備文件已齊全！請進行網路報名。',copy:'複製地址',copied:'已複製 ✓'},
   ko:{prog:'{n}/{m}개 준비 완료',all:'필수 서류가 모두 준비되었습니다! 온라인 접수로 넘어가세요.',copy:'주소 복사',copied:'복사됨 ✓'},
   id:{prog:'{n}/{m} berkas siap',all:'Semua berkas wajib sudah siap! Lanjut ke pendaftaran online.',copy:'Salin alamat',copied:'Tersalin ✓'},
   ms:{prog:'{n}/{m} dokumen siap',all:'Semua dokumen wajib sudah siap! Teruskan ke pendaftaran dalam talian.',copy:'Salin alamat',copied:'Disalin ✓'},
   th:{prog:'เตรียมแล้ว {n}/{m} รายการ',all:'เตรียมเอกสารที่จำเป็นครบแล้ว! ไปขั้นตอนสมัครออนไลน์ได้เลย',copy:'คัดลอกที่อยู่',copied:'คัดลอกแล้ว ✓'},
   ne:{prog:'{n}/{m} कागजात तयार',all:'सबै अनिवार्य कागजात तयार छन्! अब अनलाइन आवेदन गर्नुहोस्।',copy:'ठेगाना कपी गर्नुहोस्',copied:'कपी भयो ✓'}
  };
  var DOC='szu-docs', WHO='szu-who', copiedTimer=0;
  function lang(){return document.documentElement.lang||'vi';}
  function T(k){return (A[lang()]||A.vi)[k];}
  function load(k,def){try{var v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){return def;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var state=load(DOC,{});

  function setWho(w,persist){
    if(w!=='intl'&&w!=='hs')w='intl';
    var bs=document.querySelectorAll('[data-who].who-sw button, .who-sw [data-who]');
    for(var i=0;i<bs.length;i++){var on=bs[i].getAttribute('data-who')===w;bs[i].classList.toggle('on',on);bs[i].setAttribute('aria-selected',on);}
    var ps=document.querySelectorAll('[data-wp]');
    for(var j=0;j<ps.length;j++)ps[j].hidden=ps[j].getAttribute('data-wp')!==w;
    if(persist)save(WHO,w);
  }
  function progress(){
    var boxes=document.querySelectorAll('.docs.req-list input, ol.docs input'),n=0,m=0;
    for(var i=0;i<boxes.length;i++){m++;if(boxes[i].checked)n++;}
    var pt=document.querySelector('#docProg .pt'),bar=document.querySelector('#docProg .bar i'),wrap=document.getElementById('docProg');
    if(!pt)return;
    pt.textContent=(n===m&&m>0)?T('all'):T('prog').replace('{n}',n).replace('{m}',m);
    if(bar)bar.style.width=(m?Math.round(n/m*100):0)+'%';
    if(wrap)wrap.classList.toggle('full',n===m&&m>0);
  }
  function restore(){
    var boxes=document.querySelectorAll('input[data-k]');
    for(var i=0;i<boxes.length;i++)boxes[i].checked=!!state[boxes[i].getAttribute('data-k')];
    progress();
  }
  function copyLabel(){var c=document.querySelector('#copyAddr .cl');if(c&&!copiedTimer)c.textContent=T('copy');}

  document.addEventListener('change',function(e){
    var t=e.target;if(!t||!t.getAttribute||!t.getAttribute('data-k'))return;
    state[t.getAttribute('data-k')]=t.checked;save(DOC,state);progress();
  });
  document.addEventListener('click',function(e){
    var w=e.target.closest&&e.target.closest('.who-sw [data-who]');
    if(w){setWho(w.getAttribute('data-who'),true);return;}
    var cp=e.target.closest&&e.target.closest('#copyAddr');
    if(cp){
      var txt=document.getElementById('mailAddr').innerText.replace(/^[^\n]*\n/,'').replace(/\n+/g,' ').trim();
      var done=function(){var c=cp.querySelector('.cl');c.textContent=T('copied');clearTimeout(copiedTimer);copiedTimer=setTimeout(function(){copiedTimer=0;copyLabel();},1800);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){fallback(txt,done);});}else fallback(txt,done);
      return;
    }
    var op=e.target.closest&&e.target.closest('[data-open]');
    if(op){
      e.preventDefault();
      var tab=op.getAttribute('data-open'),who=op.getAttribute('data-who'),to=op.getAttribute('data-to')||(tab==='a4'?'applyGuide':'admTabs');
      var btn=document.querySelector('#admTabs [data-t="'+tab+'"]');
      if(btn&&!btn.classList.contains('active'))btn.click();
      if(who)setWho(who,true);
      var burger=document.getElementById('burger');if(burger&&burger.getAttribute('aria-expanded')==='true')burger.click();
      setTimeout(function(){var el=document.getElementById(to)||document.getElementById('xet-tuyen');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},120);
    }
  });
  function fallback(txt,cb){
    var ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');cb();}catch(x){}document.body.removeChild(ta);
  }
  setWho(load(WHO,'intl'),false);
  restore();copyLabel();
  new MutationObserver(function(){progress();copyLabel();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
