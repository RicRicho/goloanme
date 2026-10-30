const $=i=>document.getElementById(i),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const dec=s=>JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')))));
const money=n=>'A$'+Number(n).toLocaleString('en-AU',{minimumFractionDigits:0,maximumFractionDigits:2});
function schedule(r){const n=+r.months,total=+r.amount+(+r.extra||0),each=Math.round(total/n*100)/100,out=[];let d=new Date(r.start||Date.now());
 for(let i=1;i<=n;i++){const x=new Date(d.getFullYear(),d.getMonth()+i,1);x.setDate(Math.min(d.getDate(),new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));out.push({no:i,date:x,amt:i<n?each:Math.round((total-each*(n-1))*100)/100})}return out}
function reqHtml(r){return `<p>Hi, it's <b>${esc(r.name)}</b>. I'm asking a few people I trust whether they'd be open to a private loan of <b>${money(r.amount)}</b>.</p>
<p><b>What it's for:</b> ${esc(r.purpose)}</p><p><b>How I'll pay it back:</b> ${money(+r.amount+(+r.extra||0))} in total over ${r.months} monthly repayments of about ${money(schedule(r)[0].amt)}${+r.extra?` (that's ${money(r.extra)} on top as my thanks)`:''}.</p>
<p>No pressure at all, and a "no" is completely fine. If you're open to it, or want to lend part of it, just reply to me directly.</p>`}
function contactLinks(r,msg){const m=encodeURIComponent(msg),out=[];const ph=(r.phone||'').replace(/[^\d+]/g,'');
 if(ph){out.push(`<a class="btn" href="https://wa.me/${ph.replace(/^\+?0/,'61').replace('+','')}?text=${m}">WhatsApp ${esc(r.name)}</a>`);out.push(`<a class="btn alt" href="sms:${ph}?&body=${m}">Text ${esc(r.name)}</a>`)}
 if(r.email)out.push(`<a class="btn alt" href="mailto:${esc(r.email)}?subject=${encodeURIComponent('Your GoLoanMe request')}&body=${m}">Email ${esc(r.name)}</a>`);return out.join('')}
function ics(r,who){const s=schedule(r),p=x=>String(x).padStart(2,'0'),f=d=>`${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}`;
 let t='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//GoLoanMe//EN\r\n';s.forEach(x=>{const e=new Date(x.date);e.setDate(e.getDate()+1);
 t+=`BEGIN:VEVENT\r\nUID:glm-${Date.now()}-${x.no}@goloanme\r\nDTSTAMP:${f(new Date())}T000000Z\r\nDTSTART;VALUE=DATE:${f(x.date)}\r\nDTEND;VALUE=DATE:${f(e)}\r\nSUMMARY:${who==='lender'?`${r.name} repayment ${x.no}/${s.length} due: ${money(x.amt)}`:`Repay ${r.lender||'my lender'} ${money(x.amt)} (${x.no}/${s.length})`}\r\nBEGIN:VALARM\r\nTRIGGER:-P1D\r\nACTION:DISPLAY\r\nDESCRIPTION:GoLoanMe repayment reminder\r\nEND:VALARM\r\nEND:VEVENT\r\n`});
 t+='END:VCALENDAR\r\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download=`goloanme-${who}-reminders.ics`;a.click()}
