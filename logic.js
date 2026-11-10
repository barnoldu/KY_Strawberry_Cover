export function datesBefore(end,n){const d=new Date(end+'T12:00:00Z');return Array.from({length:n},(_,i)=>{const v=new Date(d);v.setUTCDate(v.getUTCDate()-n+1+i);return v.toISOString().slice(0,10)})}
export function extract(b,date){const idx=b?.dayIndex?.[date],vi=b?.varIndex?.TAIR;const row=idx==null||vi==null?null:b.rows[idx+vi];const get=k=>row?.[b.columns.indexOf(k)]??null;const f=v=>typeof v==='number'&&Number.isFinite(v)?v*1.8+32:null;const coverage=get('Coverage_Ratio');return{date,low:f(get('Min_Val')),high:f(get('Max_Val')),mean:f(get('Avg_Val')),coverage,valid:get('Is_Valid')===1&&coverage>=.9}}
export function analyze(data,method){let streak=0;return data.map((r,i)=>{const val=d=>!d.valid?null:method==='mid'?(d.low!=null&&d.high!=null?(d.low+d.high)/2:null):d.mean;const value=val(r);streak=value!=null&&value<=50?streak+1:0;const seven=data.slice(Math.max(0,i-6),i+1);const expected=datesBefore(r.date,7);const good=seven.length===7&&seven.every((d,j)=>d.date===expected[j]&&val(d)!=null);return{...r,value,streak,week:good?seven.reduce((s,d)=>s+val(d),0)/7:null}})}

export function seasonHistory(block,year,cutoff,method='mean'){
 const start=year+'-09-01',finish=year+'-12-31',end=cutoff<finish?cutoff:finish;
 if(end<start)return {year,status:'Fall not started',validDays:0,expectedDays:0,firstWeek:null,firstStreak:null,min:null,max:null,eligible:false};
 const n=Math.round((Date.parse(end)-Date.parse(start))/86400000)+1;
 const rows=analyze(datesBefore(end,n).map(date=>extract(block,date)),method),valid=rows.filter(r=>r.value!=null);
 const complete=end===finish&&valid.length===122,ongoing=end<finish;
 return {year,status:ongoing?'Ongoing':complete?'Complete':'Partial / gaps',validDays:valid.length,expectedDays:n,firstWeek:rows.find(r=>r.week!=null&&r.week<50)?.date||null,firstStreak:rows.find(r=>r.streak>=7)?.date||null,min:valid.length?Math.min(...valid.map(r=>r.value)):null,max:valid.length?Math.max(...valid.map(r=>r.value)):null,eligible:complete};
}
export function dateSummary(rows,key){const vals=rows.map(r=>r[key]).filter(Boolean).map(s=>Date.parse('2000-'+s.slice(5)));if(!vals.length)return{n:0};const fmt=t=>new Date(t).toISOString().slice(5,10);return{n:vals.length,average:fmt(Math.round(vals.reduce((a,b)=>a+b,0)/vals.length/86400000)*86400000),earliest:fmt(Math.min(...vals)),latest:fmt(Math.max(...vals))}}

export function planningProjection(rows,end){const year=Number(end.slice(0,4)),qualifying=rows.filter(r=>r.eligible&&r.year<year&&r.firstWeek),dates=qualifying.map(r=>r.firstWeek.slice(5)).sort();if(dates.length<3)return null;const times=dates.map(d=>Date.parse('2000-'+d)),mid=Math.floor(times.length/2),median=times.length%2?times[mid]:(times[mid-1]+times[mid])/2;const md=new Date(Math.round(median/86400000)*86400000).toISOString().slice(5,10);return{date:year+'-'+md,earliest:dates[0],latest:dates.at(-1),n:dates.length}}

export function forecastProjection(observed,future,method='mean',shift=0){const start=future[0]?.date;if(!start)return{rows:[],crossing:null};const past=observed.filter(r=>r.date<start),adjusted=future.map(r=>({...r,mean:r.mean==null?null:r.mean+shift,low:r.low==null?null:r.low+shift,high:r.high==null?null:r.high+shift}));const rows=analyze([...past,...adjusted],method).filter(r=>r.date>=start);return{rows,crossing:rows.find(r=>r.week!=null&&r.week<50)||null}}
