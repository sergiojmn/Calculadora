(()=>{
const AD='ca-pub-XXXXXXXXXXXXXXXX',K='consent';
const get=()=>{try{return localStorage.getItem(K)}catch(e){return null}};
const set=x=>{try{localStorage.setItem(K,x)}catch(e){}};
function ads(){
  if(AD.includes('X'))return;
  const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+AD;
  document.head.appendChild(s);
  document.querySelectorAll('.ad').forEach(d=>{
    const i=document.createElement('ins');i.className='adsbygoogle';i.style.display='block';
    i.dataset.adClient=AD;i.dataset.adSlot=d.dataset.slot;i.dataset.adFormat='auto';i.dataset.fullWidthResponsive='true';
    d.appendChild(i);(window.adsbygoogle=window.adsbygoogle||[]).push({});
  });
}
function show(){
  if(document.querySelector('.banner'))return;
  const b=document.createElement('div');b.className='banner';b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookies');
  b.innerHTML='<div>Usamos cookies de terceros (Google) para mostrar publicidad. Puedes aceptarlas o rechazarlas; la web funciona igual. Más información en la <a href="cookies.html">política de cookies</a>.<br><button id="ck-y">Aceptar</button><button id="ck-n">Rechazar</button></div>';
  document.body.appendChild(b);
  b.querySelector('#ck-y').onclick=()=>{set('yes');b.remove();ads()};
  b.querySelector('#ck-n').onclick=()=>{const was=get()==='yes';set('no');b.remove();if(was)location.reload()};
}
const c=get();
if(c==='yes')ads();else if(!c)show();
const cc=document.getElementById('cc');
if(cc)cc.onclick=e=>{e.preventDefault();show()};
})();
