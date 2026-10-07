(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var nav=$('#nav'),burger=$('#burger'),links=$('#links'),prog=$('#progress'),topBtn=$('#top');
  var fmt=function(n){return n.toLocaleString('en-US')};

  /* scroll effects */
  function onScroll(){
    var y=window.scrollY||document.documentElement.scrollTop;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.width=(h>0?y/h*100:0)+'%';
    nav.classList.toggle('scrolled',y>30);
    topBtn.classList.toggle('show',y>600);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  /* mobile menu */
  function closeMenu(){links.classList.remove('open');burger.classList.remove('open');burger.setAttribute('aria-expanded','false')}
  burger.addEventListener('click',function(){
    var o=links.classList.toggle('open');burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);
  });
  $$('a',links).forEach(function(a){a.addEventListener('click',closeMenu)});
  window.addEventListener('resize',function(){if(window.innerWidth>980)closeMenu()});

  /* active link */
  var secs=$$('section[id]'),navA=$$('a',links);
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){navA.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})}});
    },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  /* reveal + counters + bars */
  function count(el){
    var to=+el.dataset.count,f=el.dataset.format,d=1400,t0=null;
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3),v=Math.round(to*e);
      el.textContent=f?fmt(v):v;if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }
  function reveal(el){
    el.classList.add('in');
    $$('[data-count]',el).forEach(function(c){if(!c.done){c.done=1;count(c)}});
    $$('[data-w]',el).forEach(function(b){b.style.width=b.dataset.w*3.4+'%'});
  }
  var els=$$('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e)});
  }else{els.forEach(reveal)}

  /* tabs */
  function tabs(wrapId,prefixClass){
    var wrap=$('#'+wrapId),btns=$$('.tab',wrap);
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        btns.forEach(function(x){x.classList.remove('active')});b.classList.add('active');
        $$(prefixClass).forEach(function(p){p.classList.remove('active')});
        $('#'+b.dataset.t).classList.add('active');
        b.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
      });
    });
  }
  tabs('yearTabs','.panel');tabs('schTabs','.sch-panel');tabs('admTabs','.adm-panel');

  /* calculator */
  var cert=$('#cert'),nb=$('#newbie'),BASE=1370000;
  function calc(){
    var c=+cert.value,n=nb.checked?150000:0;
    $('#rCert').textContent='− '+fmt(c)+'¥';
    $('#rNew').textContent='− '+fmt(n)+'¥';
    $('#rTotal').textContent=fmt(Math.max(BASE-c-n,0))+'¥';
  }
  cert.addEventListener('change',calc);nb.addEventListener('change',calc);calc();
})();
