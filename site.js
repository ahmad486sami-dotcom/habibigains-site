(function(){
  var nav=document.getElementById('nav');
  if(nav){var f=function(){nav.classList.toggle('solid',window.scrollY>20)};f();window.addEventListener('scroll',f,{passive:true});}
  var btn=document.getElementById('lang');
  function apply(l){
    var h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-en]').forEach(function(el){var v=el.getAttribute('data-'+l);if(v!==null)el.textContent=v});
    document.querySelectorAll('[data-en-ph]').forEach(function(el){el.placeholder=el.getAttribute('data-'+l+'-ph')});
    document.querySelectorAll('[data-lang]').forEach(function(el){el.hidden=el.getAttribute('data-lang')!==l});
    if(btn)btn.textContent=l==='ar'?'English':'العربية';
    try{localStorage.setItem('hg-lang',l)}catch(e){}
    document.dispatchEvent(new CustomEvent('hg-lang',{detail:l}));
  }
  var saved=null;try{saved=localStorage.getItem('hg-lang')}catch(e){}
  apply(saved||((navigator.language||'').slice(0,2)==='ar'?'ar':'en'));
  if(btn)btn.addEventListener('click',function(){apply(document.documentElement.lang==='ar'?'en':'ar')});
  window.hgLang=function(){return document.documentElement.lang};

  var g=document.getElementById('ig-grid');
  if(g)fetch('/feed/instagram.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(d){
    if(!d||!d.posts||!d.posts.length)return;
    d.posts.slice(0,9).forEach(function(p){
      var a=document.createElement('a');a.href=p.url;a.target='_blank';a.rel='noopener';
      a.style.backgroundImage='url("'+p.image+'")';a.setAttribute('aria-label',p.caption||'Instagram post');g.appendChild(a);
    });
    g.hidden=false;var e=document.getElementById('ig-empty');if(e)e.hidden=true;
  }).catch(function(){});
})();

/* launch waitlist (same table the old site used) */
window.hgJoin=function(e,form){
  e.preventDefault();
  var ar=document.documentElement.lang==='ar',note=form.querySelector('.wl-note');
  var nm=form.nm.value.trim(),em=form.em.value.trim().toLowerCase();
  note.textContent=ar?'جاري الإرسال…':'Sending…';
  var KEY='sb_publishable_EXuzbg-O8Gc6yGmFSwG73Q_1IKL3HUi';
  fetch('https://ekeybuzzxyzyuwczqnrz.supabase.co/rest/v1/waitlist',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:nm,email:em,source:ar?'website-ar':'website'})})
  .then(function(r){
    if(r.ok||r.status===409){note.textContent=ar?'تم! بنراسلك أول ما ينزل التطبيق.':"You're on the list. We'll email you on launch day.";form.reset();}
    else throw 0;
  }).catch(function(){note.textContent=ar?'ما انرسل، حاول مرة ثانية.':"Couldn't send. Please try again.";});
  return false;
};
/* remove the old site's service worker so visitors get the new pages */
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){var had=rs.length;rs.forEach(function(r){r.unregister()});if(window.caches)caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k)})});try{if(had&&!sessionStorage.getItem('hg-sw')){sessionStorage.setItem('hg-sw','1');location.reload()}}catch(e){}})}
