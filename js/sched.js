/* Lịch tuyển sinh "thời gian thực" (giờ Tokyo): dải trạng thái + dòng thời gian từng đợt.
   Chữ động nằm trong S bên dưới; chữ cố định (tên hình thức, "Đợt", "Ngày thi"...) lấy từ từ điển i18n. */
(function(){
  'use strict';
  var D=864e5, last=null, selTrack=null, prevHTML={live:'',box:''};
  var S={
   vi:{today:'Hôm nay',tz:'giờ Tokyo',none:'Hiện chưa có đợt nào đang mở',alldone:'Các đợt tuyển sinh năm nay đã kết thúc. Hãy liên hệ trường để biết đợt mới.',next:'Sắp tới',go:'Xem lịch chi tiết',sSoon:'Sắp mở',sOpen:'Đang mở đăng ký',sMail:'Còn nhận hồ sơ bưu điện',sWait:'Chờ thi',sExam:'Hôm nay thi',sRes:'Chờ kết quả',sEnd:'Đã kết thúc',cdLeft:'còn {n} ngày',cdLast:'hôm nay là hạn cuối',cdOpen:'mở sau {n} ngày',cdExam:'thi sau {n} ngày',stMail:'Hồ sơ bưu điện',stRes:'Kết quả',table:'Xem dạng bảng'},
   en:{today:'Today',tz:'Tokyo time',none:'No round is open right now',alldone:"This year's rounds have ended. Please contact the school about the next intake.",next:'Coming up',go:'View full schedule',sSoon:'Opening soon',sOpen:'Open for applications',sMail:'Mail-in still accepted',sWait:'Waiting for exam',sExam:'Exam today',sRes:'Awaiting results',sEnd:'Ended',cdLeft:'{n} days left',cdLast:'last day today',cdOpen:'opens in {n} days',cdExam:'exam in {n} days',stMail:'Mailed documents',stRes:'Results',table:'View as table'},
   ja:{today:'本日',tz:'東京時間',none:'現在受付中の期はありません',alldone:'今年度の募集はすべて終了しました。次回の募集は大学へお問い合わせください。',next:'今後の予定',go:'日程の詳細を見る',sSoon:'まもなく開始',sOpen:'出願受付中',sMail:'郵送書類を受付中',sWait:'試験待ち',sExam:'本日試験',sRes:'合格発表待ち',sEnd:'終了',cdLeft:'残り{n}日',cdLast:'本日が締切',cdOpen:'{n}日後に開始',cdExam:'試験まであと{n}日',stMail:'郵送書類',stRes:'合格発表',table:'表で見る'},
   zh:{today:'今天',tz:'东京时间',none:'目前没有开放报名的批次',alldone:'本年度各批次已结束，请联系学校了解下一次招生。',next:'即将开始',go:'查看详细日程',sSoon:'即将开放',sOpen:'报名进行中',sMail:'仍可邮寄材料',sWait:'等待考试',sExam:'今日考试',sRes:'等待结果',sEnd:'已结束',cdLeft:'还剩{n}天',cdLast:'今天是最后一天',cdOpen:'{n}天后开放',cdExam:'{n}天后考试',stMail:'邮寄材料',stRes:'结果',table:'查看表格'},
   'zh-Hant':{today:'今天',tz:'東京時間',none:'目前沒有開放報名的梯次',alldone:'本年度各梯次已結束，請洽學校了解下一次招生。',next:'即將開始',go:'查看詳細日程',sSoon:'即將開放',sOpen:'報名進行中',sMail:'仍可郵寄文件',sWait:'等待考試',sExam:'今日考試',sRes:'等待結果',sEnd:'已結束',cdLeft:'還剩{n}天',cdLast:'今天是最後一天',cdOpen:'{n}天後開放',cdExam:'{n}天後考試',stMail:'郵寄文件',stRes:'結果',table:'以表格檢視'},
   ko:{today:'오늘',tz:'도쿄 시간',none:'현재 접수 중인 차수가 없습니다',alldone:'올해 모집 차수는 모두 종료되었습니다. 다음 모집은 학교에 문의해 주세요.',next:'다음 일정',go:'상세 일정 보기',sSoon:'곧 시작',sOpen:'접수 중',sMail:'우편 서류 접수 중',sWait:'시험 대기',sExam:'오늘 시험',sRes:'합격 발표 대기',sEnd:'종료',cdLeft:'{n}일 남음',cdLast:'오늘이 마감일',cdOpen:'{n}일 후 시작',cdExam:'시험까지 {n}일',stMail:'우편 서류',stRes:'결과 발표',table:'표로 보기'},
   id:{today:'Hari ini',tz:'waktu Tokyo',none:'Belum ada gelombang yang dibuka saat ini',alldone:'Semua gelombang tahun ini telah berakhir. Hubungi universitas untuk penerimaan berikutnya.',next:'Segera hadir',go:'Lihat jadwal lengkap',sSoon:'Segera dibuka',sOpen:'Pendaftaran dibuka',sMail:'Berkas pos masih diterima',sWait:'Menunggu ujian',sExam:'Ujian hari ini',sRes:'Menunggu hasil',sEnd:'Selesai',cdLeft:'sisa {n} hari',cdLast:'hari ini batas terakhir',cdOpen:'dibuka {n} hari lagi',cdExam:'ujian {n} hari lagi',stMail:'Berkas pos',stRes:'Hasil',table:'Lihat dalam tabel'},
   ms:{today:'Hari ini',tz:'waktu Tokyo',none:'Tiada pusingan yang dibuka sekarang',alldone:'Semua pusingan tahun ini telah tamat. Hubungi universiti untuk pengambilan seterusnya.',next:'Akan datang',go:'Lihat jadual lengkap',sSoon:'Akan dibuka',sOpen:'Pendaftaran dibuka',sMail:'Dokumen pos masih diterima',sWait:'Menunggu peperiksaan',sExam:'Peperiksaan hari ini',sRes:'Menunggu keputusan',sEnd:'Tamat',cdLeft:'tinggal {n} hari',cdLast:'hari ini hari terakhir',cdOpen:'dibuka dalam {n} hari',cdExam:'peperiksaan dalam {n} hari',stMail:'Dokumen pos',stRes:'Keputusan',table:'Lihat dalam jadual'},
   th:{today:'วันนี้',tz:'เวลาโตเกียว',none:'ขณะนี้ยังไม่มีรอบที่เปิดรับสมัคร',alldone:'รอบรับสมัครของปีนี้สิ้นสุดแล้ว โปรดติดต่อมหาวิทยาลัยเพื่อสอบถามรอบถัดไป',next:'เร็วๆ นี้',go:'ดูตารางโดยละเอียด',sSoon:'เปิดเร็วๆ นี้',sOpen:'เปิดรับสมัคร',sMail:'ยังรับเอกสารทางไปรษณีย์',sWait:'รอสอบ',sExam:'สอบวันนี้',sRes:'รอประกาศผล',sEnd:'สิ้นสุดแล้ว',cdLeft:'เหลืออีก {n} วัน',cdLast:'วันนี้เป็นวันสุดท้าย',cdOpen:'เปิดในอีก {n} วัน',cdExam:'สอบในอีก {n} วัน',stMail:'เอกสารทางไปรษณีย์',stRes:'ผลการสอบ',table:'ดูแบบตาราง'},
   ne:{today:'आज',tz:'टोकियो समय',none:'अहिले कुनै चरण खुला छैन',alldone:'यस वर्षका सबै चरण सकिएका छन्। अर्को भर्नाबारे विश्वविद्यालयमा सम्पर्क गर्नुहोस्।',next:'आउँदै',go:'पूरा तालिका हेर्नुहोस्',sSoon:'चाँडै खुल्दै',sOpen:'आवेदन खुला छ',sMail:'हुलाक कागजात अझै स्वीकार्य',sWait:'परीक्षाको प्रतीक्षा',sExam:'आज परीक्षा',sRes:'नतिजाको प्रतीक्षा',sEnd:'सकियो',cdLeft:'{n} दिन बाँकी',cdLast:'आज अन्तिम दिन',cdOpen:'{n} दिनमा खुल्छ',cdExam:'परीक्षा {n} दिनपछि',stMail:'हुलाक कागजात',stRes:'नतिजा',table:'तालिकामा हेर्नुहोस्'}
  };
  var WK=['CN','T2','T3','T4','T5','T6','T7'];
  var TR=[
   {id:'gt',ic:'🌟',name:'Xét tuyển tổng hợp',sub:'Có thể đăng ký song song',q:15,
    sel:[['Chưa học tiếng Trung',['Xét hồ sơ','Viết luận','Phỏng vấn']],['Đã học tiếng Trung',['Xét hồ sơ','Thi viết','Phỏng vấn']]],
    r:[['2026-08-01','2026-09-04','2026-09-07','2026-09-12','2026-09-25'],['2026-09-14','2026-10-09','2026-10-12','2026-10-24','2026-11-06'],['2026-10-26','2026-12-04','2026-12-07','2026-12-12','2026-12-25'],['2026-12-14','2027-01-18','2027-01-19','2027-01-23','2027-02-05'],['2027-01-25','2027-02-05','2027-02-08','2027-02-13','2027-02-19'],['2027-02-15','2027-02-26','2027-03-01','2027-03-06','2027-03-12']]},
   {id:'tc',ic:'🏫',name:'Tiến cử của trường',sub:'(trường chỉ định / công mộ)',q:15,
    sel:[['',['Xét hồ sơ','Phỏng vấn']]],
    r:[['2026-10-26','2026-11-06','2026-11-09','2026-11-14','2026-11-27'],['2026-11-16','2026-12-04','2026-12-07','2026-12-12','2026-12-25']]},
   {id:'th',ic:'✏️',name:'Thi tuyển thông thường',sub:'Có thể đăng ký song song',q:10,
    sel:[['',['Xét hồ sơ','Thi học lực']]],
    r:[['2026-11-01','2026-12-04','2026-12-07','2026-12-12','2026-12-25'],['2026-12-14','2027-01-18','2027-01-19','2027-01-23','2027-02-05'],['2027-01-25','2027-02-05','2027-02-08','2027-02-13','2027-02-19'],['2027-02-15','2027-02-26','2027-03-01','2027-03-06','2027-03-12']]}
  ];
  function lang(){return document.documentElement.lang||'vi';}
  function tt(k){var d=window.I18N&&window.I18N[lang()];return (lang()!=='vi'&&d&&d[k])||k;}
  function st(){return S[lang()]||S.vi;}
  function f(s,n){return s.replace('{n}',n);}
  function nowJ(){return (typeof window.SCHED_NOW==='number')?window.SCHED_NOW:Date.now()+9*36e5;}
  function dn(iso){var p=iso.split('-');return Date.UTC(+p[0],+p[1]-1,+p[2]);}
  function fmt(iso,wd,yr){
    var p=iso.split('-'),dt=new Date(Date.UTC(+p[0],+p[1]-1,+p[2])),l=lang();
    function vi(){return (wd?WK[dt.getUTCDay()]+' ':'')+dt.getUTCDate()+'/'+(dt.getUTCMonth()+1)+(yr?'/'+dt.getUTCFullYear():'');}
    if(l==='vi'||!window.Intl||!Intl.DateTimeFormat)return vi();
    try{var o={timeZone:'UTC',month:'short',day:'numeric'};if(wd)o.weekday='short';if(yr)o.year='numeric';return new Intl.DateTimeFormat(l,o).format(dt);}catch(e){return vi();}
  }
  function range(a,b){return fmt(a)+' – '+fmt(b);}
  function phase(r,now){
    var t=Math.floor(now/D)*D,os=dn(r[0]),oe=dn(r[1]),md=dn(r[2]),ex=dn(r[3]),rs=dn(r[4]);
    if(t<os)return{k:'soon',n:(os-t)/D,i:-1};
    if(t<=oe)return{k:'open',n:(oe-t)/D,i:0};
    if(t<=md)return{k:'mail',n:(md-t)/D,i:1};
    if(t<ex)return{k:'wait',n:(ex-t)/D,i:2};
    if(t===ex)return{k:'exam',n:0,i:2};
    if(t<=rs)return{k:'res',n:(rs-t)/D,i:3};
    return{k:'end',n:0,i:4};
  }
  function roundLabel(n){
    var l=lang(),w=tt('Đợt');
    if(l==='ja')return '第'+n+w; if(l==='zh'||l==='zh-Hant')return '第'+n+w; if(l==='ko')return n+w;
    return w+' '+n;
  }
  function cdText(p){
    var s=st();
    if(p.k==='soon')return f(s.cdOpen,p.n);
    if(p.k==='open'||p.k==='mail')return p.n===0?s.cdLast:f(s.cdLeft,p.n);
    if(p.k==='wait')return f(s.cdExam,p.n);
    return '';
  }
  var BADGE={soon:'sSoon',open:'sOpen',mail:'sMail',wait:'sWait',exam:'sExam',res:'sRes',end:'sEnd'};
  function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

  function compute(){
    var now=nowJ();
    return TR.map(function(t){return{t:t,rs:t.r.map(function(r,i){var p=phase(r,now);return{i:i,r:r,p:p};})};});
  }
  function bannerHTML(data,now){
    var s=st(),items=[],soon=null,anyLeft=false;
    data.forEach(function(d){d.rs.forEach(function(x){
      if(x.p.k!=='end')anyLeft=true;
      if(x.p.k==='open'||x.p.k==='mail'){items.push({d:d,x:x});}
      else if(x.p.k==='soon'&&(!soon||dn(x.r[0])<dn(soon.x.r[0])))soon={d:d,x:x};
    });});
    var today=fmt(new Date(Math.floor(now/D)*D).toISOString().slice(0,10),true,true);
    var chips='';
    function chip(o,cls,label){return '<span class="chip '+cls+'"><b>'+esc(tt(o.d.t.name))+' · '+esc(roundLabel(o.x.i+1))+'</b><em>'+esc(label)+'</em></span>';}
    if(items.length){
      items.forEach(function(o){chips+=chip(o,o.x.p.k==='open'?'c-open':'c-mail',s[o.x.p.k==='open'?'sOpen':'sMail']+' · '+cdText(o.x.p));});
      if(soon)chips+=chip(soon,'c-soon',s.next+' · '+cdText(soon.x.p));
    }else if(soon){
      chips='<span class="chip c-none"><b>'+esc(s.none)+'</b></span>'+chip(soon,'c-soon',s.next+' · '+cdText(soon.x.p));
    }else{
      chips='<span class="chip c-none"><b>'+esc(anyLeft?s.none:s.alldone)+'</b></span>';
    }
    var live=items.length?' is-live':'';
    return '<div class="live-wrap'+live+'"><span class="live-dot"><i></i></span><div class="live-body"><span class="live-date">'+esc(s.today)+' · '+esc(today)+' ('+esc(s.tz)+')</span><div class="live-chips">'+chips+'</div></div><a class="live-go" href="#schedLive" data-go>'+esc(s.go)+' ›</a></div>';
  }
  function boxHTML(data){
    var s=st();
    if(!selTrack||!data.some(function(d){return d.t.id===selTrack;})){
      var pick=null;
      data.forEach(function(d){if(!pick&&d.rs.some(function(x){return x.p.k==='open'||x.p.k==='mail';}))pick=d;});
      data.forEach(function(d){if(!pick&&d.rs.some(function(x){return x.p.k==='soon'||x.p.k==='wait'||x.p.k==='res';}))pick=d;});
      selTrack=(pick||data[0]).t.id;
    }
    var cur=data.filter(function(d){return d.t.id===selTrack;})[0],t=cur.t,h='<div class="trk-tabs" role="tablist">';
    data.forEach(function(d){
      var live=d.rs.some(function(x){return x.p.k==='open';});
      h+='<button type="button" role="tab" class="trk'+(d.t.id===selTrack?' on':'')+'" data-trk="'+d.t.id+'" aria-selected="'+(d.t.id===selTrack)+'"><span class="ti">'+d.t.ic+'</span><span class="tn">'+esc(tt(d.t.name))+'</span>'+(live?'<i class="tdot"></i>':'')+'</button>';
    });
    h+='</div><div class="trk-info"><span class="pill q"><b>'+esc(tt('Chỉ tiêu'))+'</b> '+t.q+'</span><span class="pill">'+esc(tt(t.sub))+'</span>';
    t.sel.forEach(function(g){
      h+='<span class="pill sel">'+(g[0]?'<b>'+esc(tt(g[0]))+'</b> ':'')+g[1].map(function(k){return esc(tt(k));}).join(' → ')+'</span>';
    });
    h+='</div><div class="rounds">';
    cur.rs.forEach(function(x){
      var p=x.p,r=x.r,cd=cdText(p);
      var steps=[[tt('Đăng ký online'),range(r[0],r[1])],[s.stMail,fmt(r[2],true)],[tt('Ngày thi'),fmt(r[3],true)],[s.stRes,'≤ '+fmt(r[4],true)]];
      h+='<article class="rd st-'+p.k+'"><header><span class="rn">'+esc(roundLabel(x.i+1))+'</span><span class="badge b-'+p.k+'"><i></i>'+esc(s[BADGE[p.k]])+'</span></header>'+(cd?'<p class="cd">'+esc(cd)+'</p>':'')+'<ol class="st4">';
      steps.forEach(function(sp,j){
        var cls=j<p.i?'done':(j===p.i?'act':'todo');
        h+='<li class="'+cls+'"><span class="dot"></span><b>'+esc(sp[0])+'</b><span class="dt">'+esc(sp[1])+'</span></li>';
      });
      h+='</ol></article>';
    });
    return h+'</div>';
  }
  function render(force){
    var l=lang();
    if(!force&&l===last)return; last=l;
    var els=document.querySelectorAll('time[data-d]');
    for(var i=0;i<els.length;i++){
      var e=els[i],t=fmt(e.getAttribute('data-d'),true),end=e.getAttribute('data-e');
      if(end)t+=' – '+fmt(end,true);
      if(e.textContent!==t)e.textContent=t;
    }
    var sk=document.querySelectorAll('[data-sk]');
    for(var j=0;j<sk.length;j++){var v=st()[sk[j].getAttribute('data-sk')];if(v&&sk[j].textContent!==v)sk[j].textContent=v;}
    var data=compute(),now=nowJ();
    var lb=document.getElementById('liveBanner'),bx=document.getElementById('schedLive');
    if(lb){var a=bannerHTML(data,now);if(a!==prevHTML.live){lb.innerHTML=a;prevHTML.live=a;}}
    if(bx){var b=boxHTML(data);if(b!==prevHTML.box){bx.innerHTML=b;prevHTML.box=b;}}
  }
  document.addEventListener('click',function(e){
    var tb=e.target.closest&&e.target.closest('[data-trk]');
    if(tb){selTrack=tb.getAttribute('data-trk');render(true);return;}
    var go=e.target.closest&&e.target.closest('[data-go]');
    if(go){
      e.preventDefault();
      var tab=document.querySelector('#admTabs [data-t="a4"]');if(tab)tab.click();
      setTimeout(function(){var el=document.getElementById('schedLive');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},120);
    }
  });
  window.__schedRender=function(){render(true);};
  render(true);
  new MutationObserver(function(){render(false);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  setInterval(function(){render(true);},60000);
})();
