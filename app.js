'use strict';

/*
 * Runner's Passport preview storefront.
 * No orders, payments or customer photo uploads are made to a server.
 * Order/cart interactions are local demos until a payment provider and backend are connected.
 */
const RACES = [
  {id:'gnr', code:'RP-001',title:'Great North Run',place:'Newcastle upon Tyne',year:2026,distance:'13.1 miles',category:'half',image:'/assets/art-gnr.webp',label:'THE ORIGINAL'},
  {id:'london',code:'RP-002',title:'London Marathon',place:'London',year:2026,distance:'26.2 miles',category:'marathon',image:'/assets/art-london.webp',label:'ICONIC RACES'},
  {id:'brighton',code:'RP-003',title:'Brighton Marathon',place:'Brighton',year:2026,distance:'26.2 miles',category:'marathon',image:'/assets/art-brighton.webp',label:''},
  {id:'edinburgh',code:'RP-004',title:'Edinburgh Marathon',place:'Edinburgh',year:2026,distance:'26.2 miles',category:'marathon',image:'/assets/art-edinburgh.webp',label:''}
];
const CARD_PRICE = 4.99, ALBUM_PRICE = 34.99;
const $ = (id) => document.getElementById(id);
const state = {race:RACES[0],side:'front',fileURL:null,uploadedFile:null,cart:[],filter:'all',query:'',toastTimeout:null};
const money=(n)=>'£'+n.toFixed(2);
function text(node,str){ if(node) node.textContent = str; }
function safeGetCart(){try {const parsed=JSON.parse(localStorage.getItem('rp_preview_basket') || '[]');return Array.isArray(parsed)?parsed.filter(x=>x&&['card','album'].includes(x.type)&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<100):[]}catch{return []}}
function saveCart(){try{localStorage.setItem('rp_preview_basket',JSON.stringify(state.cart))}catch{/* storage optional */}}
function toast(msg){const el=$('toast');text(el,msg);el.classList.add('show');clearTimeout(state.toastTimeout);state.toastTimeout=setTimeout(()=>el.classList.remove('show'),3400)}
function syncLock(){const open=['editor-modal','basket-drawer','notice-modal'].some(id=>id==='notice-modal'?!$(id).hidden:$(id).classList.contains('open'));document.body.classList.toggle('locked',open)}
function showBackdrop(id){$(id).hidden=false}
function hideBackdrop(id){$(id).hidden=true}
function hideMobileMenu(){const menu=$('mobile-menu');menu.hidden=true;$('mobile-toggle').setAttribute('aria-expanded','false')}
function renderRaceGrid(){const grid=$('race-grid');grid.replaceChildren();for(const race of RACES.filter(r=>(state.filter==='all'||r.category===state.filter) && (`${r.title} ${r.place}`.toLowerCase().includes(state.query)))){
  const el=document.createElement('article');el.className='race-item';
  el.innerHTML=`<div class="card-product"><div class="product-badge">${race.label||'2026 EDITION'}</div><div class="card-surface"><div class="surface-cap">RUNNER'S PASSPORT <small>${race.code}</small></div><div class="surface-art"><img src="${race.image}" loading="lazy" alt="Illustrated ${race.title} collectible card artwork"></div><div class="surface-bottom"><strong>${race.title.toUpperCase()}</strong><span>${race.place.toUpperCase()} · ${race.year}</span><small>${race.distance.toUpperCase()}</small><i>RP</i></div></div></div><div class="race-item-bottom"><div><h3>${race.title}</h3><p>${race.place} · ${race.distance}</p></div><strong>${money(CARD_PRICE)}</strong></div><button class="race-item-action" type="button" data-race="${race.id}">PERSONALISE THIS CARD <span>↗</span></button>`;
  grid.append(el);
} if(!grid.children.length){const empty=document.createElement('div');empty.className='no-results';empty.textContent='No races match yet — try another search.';grid.append(empty)}
}
function renderFormOptions(){const s=$('event-select');for(const race of RACES){const opt=document.createElement('option');opt.value=race.id;opt.textContent=race.title;s.append(opt)}}
function formatDate(v){if(!v)return 'Your race date';const parts=v.split('-');if(parts.length!==3)return v;const d=Number(parts[2]),m=Number(parts[1])-1,y=Number(parts[0]);const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m>=0&&m<12?`${d} ${months[m]} ${y}`:v}
function updatePreview(){const r=state.race;const y=($('race-date').value||'').slice(0,4)||String(r.year);text($('preview-id'),r.code);$('preview-art').src=r.image;text($('preview-race-title'),r.title.toUpperCase());text($('preview-location'),`${r.place.toUpperCase()} · ${y}`);text($('preview-distance'),r.distance.toUpperCase());text($('preview-back-event'),r.title);text($('preview-back-date'),formatDate($('race-date').value));text($('preview-back-distance'),r.distance);text($('preview-back-time'),$('race-time').value.trim()||'—');text($('preview-back-name'),$('runner-name').value.trim()||'Your name');text($('preview-caption'),$('race-caption').value.trim()||'A day to remember ♡');$('preview-photo').src=state.fileURL||'/assets/card-back-photo.webp'}
function setRace(id){const r=RACES.find(r=>r.id===id);if(!r)return;if(state.race&&state.race.id!==id){$('race-date').value='';$('race-time').value='';$('race-caption').value=''}state.race=r;$('event-select').value=id;updatePreview()}
function showSide(side){state.side=side;document.querySelectorAll('[data-side]').forEach(btn=>{const on=btn.dataset.side===side;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on)});document.querySelector('.front-content').hidden=side!=='front';document.querySelector('.back-content').hidden=side!=='back'}
function openEditor(id){closeBasket();closeNotice();hideMobileMenu();if(id)setRace(id);showSide('front');showBackdrop('editor-backdrop');$('editor-modal').classList.add('open');$('editor-modal').setAttribute('aria-hidden','false');syncLock();setTimeout(()=>$('editor-close').focus(),200)}
function closeEditor(){hideBackdrop('editor-backdrop');$('editor-modal').classList.remove('open');$('editor-modal').setAttribute('aria-hidden','true');syncLock()}
function openBasket(){closeEditor();closeNotice();renderCart();showBackdrop('drawer-backdrop');$('basket-drawer').classList.add('open');$('basket-drawer').setAttribute('aria-hidden','false');syncLock();setTimeout(()=>$('cart-close').focus(),280)}
function closeBasket(){hideBackdrop('drawer-backdrop');$('basket-drawer').classList.remove('open');$('basket-drawer').setAttribute('aria-hidden','true');syncLock()}
function openNotice(title,message){closeEditor();closeBasket();text($('notice-title'),title);text($('notice-message'),message);$('notice-modal').hidden=false;$('notice-modal').setAttribute('aria-hidden','false');showBackdrop('modal-backdrop');syncLock();$('notice-close').focus()}
function closeNotice(){$('notice-modal').hidden=true;$('notice-modal').setAttribute('aria-hidden','true');hideBackdrop('modal-backdrop');syncLock()}
function cartAdd(item){const existing=state.cart.find(x=>x.key===item.key);if(existing)existing.quantity++;else state.cart.push({...item,quantity:1});saveCart();renderCart();toast(item.type==='album'?'Album added to your preview basket':'Card added to your preview basket')}
function renderCart(){const count=state.cart.reduce((s,x)=>s+x.quantity,0),cardCount=state.cart.reduce((s,x)=>s+(x.type==='card'?x.quantity:0),0),hasAlbum=state.cart.some(x=>x.type==='album');text($('cart-count'),String(count));$('cart-count').hidden=!count;text($('basket-header-count'),`(${count})`);const list=$('basket-items');list.replaceChildren();if(!count){list.innerHTML='<div class="basket-empty"><span>✳</span><h3>Your story starts here.</h3><p>Your basket is waiting for its first keepsake.</p></div>'}
  for(const item of state.cart){const row=document.createElement('div');row.className='basket-row';const img=document.createElement('img');img.src=item.image;img.alt='';row.append(img);const middle=document.createElement('div');const title=document.createElement('h3');text(title,item.title);middle.append(title);const subtitle=document.createElement('p');text(subtitle,item.type==='card'?'Personalised race card · preview':'Premium linen album · preview');middle.append(subtitle);const qty=document.createElement('div');qty.className='quantity-ctrl';const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label',`Reduce ${item.title} quantity`);minus.addEventListener('click',()=>changeQty(item.key,-1));const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label',`Increase ${item.title} quantity`);plus.addEventListener('click',()=>changeQty(item.key,1));const num=document.createElement('span');text(num,String(item.quantity));qty.append(minus,num,plus);middle.append(qty);const remove=document.createElement('button');remove.className='basket-remove';remove.type='button';remove.textContent='Remove';remove.addEventListener('click',()=>removeItem(item.key));middle.append(remove);row.append(middle);const price=document.createElement('strong');text(price,money((item.type==='album'?ALBUM_PRICE:CARD_PRICE)*item.quantity));row.append(price);list.append(row)}
  const sub=state.cart.reduce((s,x)=>s+(x.type==='album'?ALBUM_PRICE:CARD_PRICE)*x.quantity,0);let shipLabel='—',ship=0;if(count){if(hasAlbum){shipLabel='TBC for album orders'}else if(cardCount===1){shipLabel=money(.99);ship=.99}else{shipLabel='FREE'}}text($('cart-subtotal'),money(sub));text($('cart-shipping'),shipLabel);text($('cart-total'),hasAlbum?money(sub)+' + delivery':money(sub+ship));$('checkout-button').disabled=!count}
function changeQty(key,delta){const item=state.cart.find(x=>x.key===key);if(!item)return;item.quantity+=delta;if(item.quantity<1)state.cart=state.cart.filter(x=>x.key!==key);if(item.quantity>20)item.quantity=20;saveCart();renderCart()}
function removeItem(key){state.cart=state.cart.filter(x=>x.key!==key);saveCart();renderCart()}
function loadImage(url){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url})}
function fillWrapped(ctx,value,x,y,maxWidth,lineHeight,maxLines){const words=String(value).split(/\s+/);let line='',n=0;for(const w of words){const candidate=line?line+' '+w:w;if(ctx.measureText(candidate).width>maxWidth&&line){ctx.fillText(line,x,y+n*lineHeight);n++;line=w;if(n>=maxLines)return}else{line=candidate}}if(line&&n<maxLines)ctx.fillText(line,x,y+n*lineHeight)}
async function downloadPreview(){const side=state.side,r=state.race;const c=document.createElement('canvas');c.width=750;c.height=1050;const ctx=c.getContext('2d');ctx.fillStyle='#f8f1e3';ctx.fillRect(0,0,750,1050);ctx.strokeStyle='#cbb995';ctx.lineWidth=3;ctx.strokeRect(21,21,708,1008);ctx.strokeStyle='#d3c4a7';ctx.beginPath();ctx.moveTo(45,98);ctx.lineTo(705,98);ctx.stroke();ctx.fillStyle='#34443a';ctx.textAlign='center';ctx.font='36px Georgia';ctx.fillText("RUNNER'S PASSPORT",375,73);ctx.textAlign='right';ctx.font='18px Arial';ctx.fillText(r.code,695,92);
if(side==='front'){
  const img=await loadImage(r.image);drawCover(ctx,img,39,115,672,748);ctx.strokeStyle='#ad956e';ctx.strokeRect(39,115,672,748);ctx.fillStyle='#263a30';ctx.font='bold 53px Georgia';ctx.textAlign='left';let fs=53;while(ctx.measureText(r.title.toUpperCase()).width>660&&fs>29){fs-=2;ctx.font=`bold ${fs}px Georgia`};ctx.fillText(r.title.toUpperCase(),50,927);ctx.font='21px Arial';ctx.fillText(`${r.place.toUpperCase()} · ${($('race-date').value||'').slice(0,4)||r.year}`,52,966);ctx.fillText(r.distance.toUpperCase(),52,998);ctx.beginPath();ctx.arc(659,970,34,0,Math.PI*2);ctx.strokeStyle='#c0ad8e';ctx.lineWidth=5;ctx.stroke();ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillStyle='#a89778';ctx.fillText('RP',659,979)
}else{
 const photo=await loadImage(state.fileURL||'/assets/card-back-photo.webp');ctx.fillStyle='#fffefa';ctx.fillRect(53,123,644,486);drawCover(ctx,photo,69,137,612,390);ctx.textAlign='center';ctx.fillStyle='#2c4135';ctx.font='italic 26px Georgia';fillWrapped(ctx,$('race-caption').value||'A day to remember ♡',375,568,578,27,1);ctx.font='22px Georgia';ctx.textAlign='left';const rows=[['EVENT',r.title],['DATE',formatDate($('race-date').value)],['DISTANCE',r.distance],['TIME',$('race-time').value||'—'],['RUNNER',$('runner-name').value||'Your name']];rows.forEach((row,i)=>{const y=671+i*50;ctx.fillStyle='#556152';ctx.font='bold 16px Arial';ctx.fillText(row[0],60,y);ctx.fillStyle='#2c4032';ctx.font='25px Georgia';ctx.fillText(row[1].slice(0,36),238,y);ctx.strokeStyle='#dbd3c4';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(60,y+16);ctx.lineTo(691,y+16);ctx.stroke()});ctx.font='19px Georgia';ctx.textAlign='center';ctx.fillStyle='#6e806e';ctx.fillText('THE JOURNEY IS THE REWARD',375,980)
}
const link=document.createElement('a');link.href=c.toDataURL('image/png');link.download=`runners-passport-${r.id}-${side}-preview.png`;document.body.append(link);link.click();link.remove();toast('Your sample card preview has been downloaded')}
function drawCover(ctx,img,x,y,w,h){const ratio=Math.max(w/img.width,h/img.height),dw=img.width*ratio,dh=img.height*ratio;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);ctx.restore()}

function bind(){state.cart=safeGetCart();renderRaceGrid();renderFormOptions();setRace('gnr');showSide('front');renderCart();text($('year'),String(new Date().getFullYear()));
 document.querySelectorAll('[data-action="open-editor"]').forEach(el=>el.addEventListener('click',()=>openEditor()));
 $('race-grid').addEventListener('click',(e)=>{const el=e.target.closest('[data-race]');if(el)openEditor(el.dataset.race)});
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{state.filter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});renderRaceGrid()}));
 $('race-search').addEventListener('input',e=>{state.query=e.target.value.trim().toLowerCase();renderRaceGrid()});
 $('mobile-toggle').addEventListener('click',()=>{const menu=$('mobile-menu');menu.hidden=!menu.hidden;$('mobile-toggle').setAttribute('aria-expanded',String(!menu.hidden))});document.querySelectorAll('.mobile-menu a').forEach(el=>el.addEventListener('click',hideMobileMenu));
 $('cart-open').addEventListener('click',openBasket);$('cart-close').addEventListener('click',closeBasket);$('drawer-backdrop').addEventListener('click',closeBasket);$('editor-close').addEventListener('click',closeEditor);$('editor-backdrop').addEventListener('click',closeEditor);
 $('notice-close').addEventListener('click',closeNotice);$('notice-done').addEventListener('click',closeNotice);$('modal-backdrop').addEventListener('click',closeNotice);
 $('add-album').addEventListener('click',()=>{cartAdd({key:'album',type:'album',title:"Runner's Passport album",image:'/assets/album-craft.webp'});openBasket()});
 $('event-select').addEventListener('change',e=>setRace(e.target.value));
 ['race-date','race-time','runner-name','race-caption'].forEach(id=>$(id).addEventListener('input',updatePreview));
 document.querySelectorAll('[data-side]').forEach(b=>b.addEventListener('click',()=>showSide(b.dataset.side)));
 $('photo-input').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){e.target.value='';toast('Please choose a JPG, PNG or WebP photo under 10MB');return}if(state.fileURL)URL.revokeObjectURL(state.fileURL);state.uploadedFile=file;state.fileURL=URL.createObjectURL(file);text($('upload-label'),`✓ ${file.name.length>30?file.name.slice(0,27)+'...':file.name}`);updatePreview();showSide('back')});
 $('personaliser-form').addEventListener('submit',e=>{e.preventDefault();const key=`card-${state.race.id}-${Date.now()}-${Math.round(Math.random()*10000)}`;cartAdd({key,type:'card',title:state.race.title,image:state.race.image});openBasket()});
 $('checkout-button').addEventListener('click',()=>openNotice('The finishing touches.','The collection and personaliser are previews while we perfect printing and delivery. Real checkout will open once everything is ready. No money has been taken.'));
 $('download-preview').addEventListener('click',()=>downloadPreview().catch(()=>toast('Sorry, the preview could not be downloaded.')));
 $('request-race').addEventListener('click',()=>openNotice('More races coming.','We’re preparing more race illustrations. The request form will be enabled with our full website launch.'));
 $('footer-help').addEventListener('click',()=>openNotice('We’re building something special.','The contact inbox and customer support are being set up. Keep an eye on this website for our official launch.'));
 document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){closeEditor();closeBasket();closeNotice();hideMobileMenu()}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();


/* Premium edition interactive sample: front/back reveal and race switching. */
function initialiseCollectorHero() {
 const button=document.getElementById('hero-flip');
 if(!button)return;
 button.addEventListener('click',()=>{
   const flipped=button.classList.toggle('is-flipped');
   button.setAttribute('aria-pressed',String(flipped));
   button.setAttribute('aria-label',flipped?'Show the illustrated front of the sample card':'Flip the sample card to see its personalised back');
 });
 const listing=document.getElementById('race-grid');
 if(listing)listing.addEventListener('click',(event)=>{
   const race=event.target.closest('[data-race]')?.dataset.race;
   if(race)button.classList.remove('is-flipped');
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialiseCollectorHero);
else initialiseCollectorHero();
