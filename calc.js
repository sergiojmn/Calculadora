const $=id=>document.getElementById(id);
const eur=n=>n.toLocaleString('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2});
const pct=n=>(n*100).toLocaleString('es-ES',{maximumFractionDigits:2})+' %';
const v=id=>parseFloat($(id).value)||0;
const box=(l,x,c)=>`<div class="${c||''}"><small>${l}</small><b>${x}</b></div>`;
function hip(){
  const P=v('h1')*(1-v('h2')/100),r=v('h3')/1200,n=Math.round(v('h4')*12);
  if(P<=0||n<=0){$('hr').innerHTML='';$('ht').innerHTML='';return}
  const c=r?P*r/(1-Math.pow(1+r,-n)):P/n,tot=c*n;
  $('hr').innerHTML=box('Cuota mensual',eur(c),'big')+box('Importe a financiar',eur(P))+box('Intereses totales',eur(tot-P))+box('Total a pagar',eur(tot))+box('Coste del interés',pct((tot-P)/P));
  let bal=P,rows='<tr><th>Año</th><th>Intereses</th><th>Capital</th><th>Pendiente</th></tr>';
  for(let y=1;y<=Math.ceil(n/12);y++){let it=0,ca=0;
    for(let m=0;m<12&&(y-1)*12+m<n;m++){const i=bal*r,k=c-i;it+=i;ca+=k;bal-=k}
    rows+=`<tr><td>${y}</td><td>${eur(it)}</td><td>${eur(ca)}</td><td>${eur(Math.max(bal,0))}</td></tr>`}
  $('ht').innerHTML=rows;
}
const T=[[12450,.19],[20200,.24],[35200,.30],[60000,.37],[300000,.45],[Infinity,.47]];
function scale(b){let prev=0,tax=0,rows=[];for(const[l,t]of T){if(b>prev){const s=Math.min(b,l)-prev;tax+=s*t;rows.push([prev,l,t,s,s*t])}prev=l}return{tax,rows}}
function calc(g,temp,kids,old){
  const ss=Math.min(g,5101.2*12)*(.047+.001+.0015+(temp?.016:.0155));
  const r=Math.max(0,g-ss-2000);let red=0;
  if(r<=14852)red=7302;else if(r<=17673.52)red=7302-1.75*(r-14852);else if(r<=19747.5)red=2364.34-1.14*(r-17673.52);
  const base=Math.max(0,r-Math.max(red,0)),ch=[2400,2700,4000,4500];let mf=5550+(old?1150:0);
  for(let i=0;i<kids;i++)mf+=ch[Math.min(i,3)];
  const s=scale(base),cuota=Math.max(0,s.tax-scale(mf).tax);
  return{ss,base,mf,cuota,rows:s.rows,marg:T.find(x=>base<=x[0])[1],ret:g?cuota/g:0};
}
const kids=id=>Math.max(0,Math.floor(v(id)));
function nom(){
  const g=v('n1'),p=+$('n2').value,x=calc(g,+$('n3').value,kids('n4'),+$('n5').value),net=g-x.ss-x.cuota;
  $('nr').innerHTML=box('Sueldo neto por paga',eur(net/p),'big')+box('Neto anual',eur(net))+box('Retención IRPF',pct(x.ret))+box('Seguridad Social al año',eur(x.ss))+box('IRPF al año',eur(x.cuota));
}
function irpf(){
  const g=v('i1'),x=calc(g,+$('i3').value,kids('i4'),+$('i5').value);
  $('ir').innerHTML=box('IRPF anual estimado',eur(x.cuota),'big')+box('Tipo efectivo',pct(x.ret))+box('Tipo marginal',pct(x.marg))+box('Base sujeta a escala',eur(x.base))+box('Mínimo personal y familiar',eur(x.mf));
  let rows='<tr><th>Tramo</th><th>Tipo</th><th>Base</th><th>Cuota</th></tr>';
  x.rows.forEach(a=>rows+=`<tr><td>${eur(a[0])} – ${a[1]===Infinity?'más':eur(a[1])}</td><td>${pct(a[2])}</td><td>${eur(a[3])}</td><td>${eur(a[4])}</td></tr>`);
  $('it').innerHTML=rows;
}
[['hr',hip],['nr',nom],['ir',irpf]].forEach(([id,f])=>{const r=$(id);if(r){r.closest('section').querySelectorAll('input,select').forEach(e=>e.addEventListener('input',f));f()}});
