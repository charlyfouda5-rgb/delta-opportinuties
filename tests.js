const mk=()=>{const m={};return{getItem:k=>k in m?m[k]:null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}};
globalThis.localStorage=mk();globalThis.sessionStorage=mk();
const S=require('./core.js');
const r=S.selfTest();r.forEach(x=>console.log(x.ok?'OK  ':'FAIL',x.n,'|',x.d));
const raw=localStorage.getItem('do_demo_v1');const d=JSON.parse(raw);
console.log(raw.length,'bytes',d.users.length,'users',d.opps.length,'opps',d.apps.length,'apps',d.trainings.length,'trainings',d.evals.length,'evals');
const c={};d.opps.forEach(o=>c[o.type]=(c[o.type]||0)+1);console.log(c);
