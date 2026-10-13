
'use strict';
/* Runner's Passport Experience Preview
   This is a demonstration only: no auth, OAuth, payments, remote images or unlocking.
   No raw Strava data is gathered or stored.
*/
(() => {
  const $ = id => document.getElementById(id);
  const stage = $('pack-stage'), slider = $('tear-slider'), btn = $('pack-button');
  const paper = $('pack-paper'), card = $('demo-reveal-card'), hint = $('pack-hint');
  const front = document.querySelector('.reveal-front'), back = document.querySelector('.reveal-back');
  let phase = 'sealed', openTimer = null, frontView = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const label = msg => {if(hint)hint.textContent=msg};
  function resetPack() {
    if(!stage || !slider) return;
    clearTimeout(openTimer);
    phase='sealed';frontView=true;stage.dataset.phase='sealed';slider.value=0;slider.style.setProperty('--progress','0%');
    if(paper)paper.hidden=false;if(card)card.hidden=true;if(front)front.hidden=false;if(back)back.hidden=true;
    btn.textContent='Open sample pack ↗';label('Slide the tab to the right to open the sample pack.');
  }
  function revealPack() {
    if(phase!=='sealed')return;
    phase='opening';stage.dataset.phase='opening';slider.value=100;
    label('The seal is opening…');btn.disabled=true;
    openTimer=setTimeout(()=>{
      phase='revealed';stage.dataset.phase='revealed';if(paper)paper.hidden=true;if(card)card.hidden=false;
      btn.disabled=false;btn.textContent='Turn the card over ↻';label('The sample edition has been revealed. Turn it over to see the memory.');
    },reduced.matches?0:600);
  }
  function flipCard(){
    if(phase!=='revealed')return;
    frontView=!frontView;if(front)front.hidden=!frontView;if(back)back.hidden=frontView;
    if(card){card.classList.remove('flip-appear');void card.offsetWidth;card.classList.add('flip-appear')}
    btn.textContent=frontView?'Turn the card over ↻':'Seal it again ↺';
    label(frontView?'Discover the race artwork on the front.':'Your photograph and story live on the back.');
  }
  if(slider && stage && btn){
    slider.addEventListener('input',()=>{
      if(phase!=='sealed')return;
      const p=Number(slider.value);
      slider.style.setProperty('--progress',p+'%');
      if(p>=97)revealPack();
    });
    slider.addEventListener('change',()=>{
      if(phase==='sealed'&&Number(slider.value)<97)label('Drag all the way to the end to break the seal.');
    });
    btn.addEventListener('click',()=>{
      if(phase==='sealed')revealPack();
      else if(phase==='revealed'&&!frontView)resetPack();
      else if(phase==='revealed')flipCard();
    });
  }
  document.querySelectorAll('#start-passport-nav,.start-passport').forEach(button=>button.addEventListener('click',()=>{
    if(typeof window.openNotice==='function'){
      window.openNotice('Your passport is coming.','This is the design preview. Secure accounts, consent-based running-service verification and checkout are being built. Explore the digital passport concept and the example pack in the meantime.');
    }else{
      const target=$('my-passport');if(target)target.scrollIntoView({behavior:'smooth'});
    }
  }));
  // This catalogue is a product-design fixture. All progress values below are explicitly sample-only.
  // Race/achievement verification will require permitted sources and a rules engine on the server.
  const data=[];
  const add=(group,name,kind,target,tier='Classic',unit='')=>data.push({group,name,kind,target,tier,unit});
  [
    ['Your very first run',1],['First 5 runs',5],['10 runs recorded',10],['25 runs recorded',25],
    ['50 runs recorded',50],['100 runs recorded',100],['250 runs recorded',250],
    ['500 runs recorded',500],['1,000 runs recorded',1000]
  ].forEach(([n,t],i)=>add('firsts',n,'runs',t,i<4?'Classic':i<7?'Signature':'Exceptional','runs'));
  [
    ['First official race',1],['First 5K race',1],['First 10K race',1],['First half marathon',1],
    ['First marathon',1],['First trail race',1],['First parkrun',1],['First ultra marathon',1]
  ].forEach(([n,t],i)=>add('firsts',n,'first'+i,t,i<6?'Classic':i===6?'Classic':'Exceptional','milestone'));
  [
    ['First 10 kilometres',10],['25 kilometre journey',25],['50 kilometre journey',50],
    ['The first hundred',100],['250 kilometres',250],['500 kilometres',500],
    ['1,000 kilometre club',1000],['2,500 kilometre club',2500],['5,000 kilometres',5000],
    ['10,000 kilometre lifetime',10000]
  ].forEach(([n,t],i)=>add('distance',n,'km',t,i<5?'Classic':i<8?'Signature':'Exceptional','km'));
  [
    ['5K under 40 minutes',40],['5K under 35 minutes',35],['5K under 30 minutes',30],
    ['5K under 28 minutes',28],['5K under 27 minutes',27],['5K under 25 minutes',25],
    ['5K under 24 minutes',24],['5K under 23 minutes',23],['5K under 22 minutes',22],
    ['5K under 20 minutes',20],['5K under 18 minutes',18]
  ].forEach(([n,t],i)=>add('speed',n,'5k',t*60,i<5?'Classic':i<9?'Signature':'Exceptional','seconds'));
  [
    ['10K under 80 minutes',80],['10K under 70 minutes',70],['10K under 60 minutes',60],
    ['10K under 55 minutes',55],['10K under 50 minutes',50],['10K under 45 minutes',45],
    ['10K under 40 minutes',40]
  ].forEach(([n,t],i)=>add('speed',n,'10k',t*60,i<4?'Classic':i<6?'Signature':'Exceptional','seconds'));
  [
    ['Half marathon under 3 hours',180],['Half marathon under 2:30',150],
    ['Half marathon under 2:15',135],['Half marathon under 2 hours',120],
    ['Half marathon under 1:45',105],['Half marathon under 1:30',90]
  ].forEach(([n,t],i)=>add('speed',n,'halfPB',t*60,i<3?'Classic':i<5?'Signature':'Exceptional','seconds'));
  [
    ['Marathon under 6 hours',360],['Marathon under 5 hours',300],
    ['Marathon under 4:30',270],['Marathon under 4 hours',240],
    ['Marathon under 3:30',210],['Marathon under 3 hours',180]
  ].forEach(([n,t],i)=>add('speed',n,'marathonPB',t*60,i<3?'Classic':i<5?'Signature':'Exceptional','seconds'));
  [
    ['Three race finishes',3],['Five race finishes',5],['Ten race finishes',10],
    ['Twenty-five races',25],['Fifty race finishes',50],['A hundred race finishes',100]
  ].forEach(([n,t],i)=>add('races',n,'races',t,i<3?'Classic':i<5?'Signature':'Exceptional','races'));
  [
    ['Three parkrun finishes',3],['Ten parkrun finishes',10],['Fifty parkrun finishes',50],
    ['Five half marathons',5],['Ten half marathons',10],
    ['Three marathons',3],['Ten marathons',10]
  ].forEach(([n,t],i)=>add('races',n,i<3?'parkruns':i<5?'halfs':'marathons',t,i<4?'Classic':i<6?'Signature':'Exceptional','races'));
  [
    ['Two consecutive weeks',2],['Four consecutive weeks',4],['Eight consecutive weeks',8],
    ['Twelve consecutive weeks',12],['Six months of running',26],['A year of running',52]
  ].forEach(([n,t],i)=>add('consistency',n,'weeks',t,i<3?'Classic':i<5?'Signature':'Exceptional','weeks'));
  [
    ['Two consecutive months',2],['Three consecutive months',3],['Six consecutive months',6],
    ['Twelve consecutive months',12],['Twenty-four consecutive months',24]
  ].forEach(([n,t],i)=>add('consistency',n,'months',t,i<3?'Classic':i===3?'Signature':'Exceptional','months'));
  [
    ['A thousand metres climbed',1000],['Five thousand metres climbed',5000],['10,000 metres climbed',10000],
    ['Three different race distances',3],['Five different race distances',5],
    ['Three different counties',3],['Ten different counties',10],
    ['The Yorkshire collection',4],['First overseas race',1]
  ].forEach(([n,t],i)=>add('adventure',n,i<3?'elevation':i<5?'types':i<7?'counties':i===7?'yorkshire':'overseas',t,i<4?'Classic':i<7?'Signature':'Exceptional',i<3?'metres':i===7?'races':'milestones'));
  const example={runs:8,km:72,races:2,parkruns:3,halfs:1,marathons:0,weeks:3,months:2,elevation:420,types:2,counties:1,yorkshire:1,overseas:0,'5k':27*60,'10k':64*60,halfPB:2*3600+19*60,marathonPB:0};
  function progress(item){
    const k=item.kind, target=item.target;
    if(k.startsWith('first')){
      const index=Number(k.slice(5));const values=[example.races>0,0,0,example.halfs>0,example.marathons>0,0,example.parkruns>0,0];
      return {percent:values[index]?100:0,copy:values[index]?'Example: achieved':'A first waiting for you'};
    }
    const v=Number(example[k]||0);
    if(['5k','10k','halfPB','marathonPB'].includes(k)){
      if(!v)return {percent:0,copy:'Add a verified result'};
      const delta=v-target;
      return {percent:delta<=0?100:Math.min(95,Math.round(target/v*100)),copy:delta<=0?'Example: achieved':Math.ceil(delta/60)+' min improvement to target'};
    }
    const remain=Math.max(0,target-v),percent=Math.min(100,Math.round(v/target*100));
    let unit=item.unit==='km'?' km':item.unit==='metres'?' m':item.unit==='weeks'?' weeks':item.unit==='months'?' months':item.unit==='runs'?' runs':item.unit==='races'?' races':' more';
    return {percent,copy:remain===0?'Example: achieved':remain.toLocaleString('en-GB')+unit+' to go'};
  }
  const sym={firsts:'✧',distance:'↗',speed:'⌁',races:'◇',consistency:'◌',adventure:'✦'};
  const grid=$('achievement-grid'), counter=$('achievement-count');
  let filter='all',limit=8;
  function render(){
    if(!grid)return;
    const items=data.filter(x=>filter==='all'||x.group===filter);
    grid.replaceChildren();
    items.slice(0,limit).forEach(item=>{
      const p=progress(item),el=document.createElement('article');
      el.className='achievement-card';
      const top=document.createElement('div');top.className='achievement-top';
      const icon=document.createElement('div');icon.className='achievement-symbol';icon.textContent=sym[item.group];
      const tier=document.createElement('span');tier.className='achievement-tier';tier.textContent=item.tier;top.append(icon,tier);
      const h=document.createElement('h3');h.textContent=item.name;
      const para=document.createElement('p');para.textContent=({firsts:'A new chapter begins.',distance:'Every kilometre becomes part of the story.',speed:'A personal best worth remembering.',races:'The finish lines start to add up.',consistency:'The little habits create something extraordinary.',adventure:'New places. New memories.'})[item.group];
      const foot=document.createElement('div');foot.className='achievement-progress';
      const stat=document.createElement('span');stat.textContent=p.copy;
      const bar=document.createElement('div');bar.className='milestone-track';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',item.name+' — example progress');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(p.percent));
      const i=document.createElement('i');i.style.width=p.percent+'%';bar.append(i);foot.append(stat,bar);
      el.append(top,h,para,foot);grid.append(el);
    });
    if(counter)counter.textContent='Showing '+Math.min(items.length,limit)+' of '+items.length+' example milestones';
    const more=$('show-more-achievements');
    if(more){more.hidden=items.length<=limit;more.textContent='Show more milestones ↗';}
  }
  document.querySelectorAll('[data-achievement-filter]').forEach(b=>b.addEventListener('click',()=>{
    filter=b.dataset.achievementFilter;limit=8;
    document.querySelectorAll('[data-achievement-filter]').forEach(x=>x.classList.toggle('active',x===b));render();
  }));
  $('show-more-achievements')?.addEventListener('click',()=>{limit+=12;render();});
  render();
})();
