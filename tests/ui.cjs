const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
const url=process.env.TEST_URL||'file://'+process.cwd()+'/index.html';
async function add(p,name,day,start,end){await p.locator('#mk').fill(name);await p.locator('#hari').selectOption(String(day));await p.locator('#mulai').fill(start);await p.locator('#selesai').fill(end);await p.locator('#form button[type=submit]').click();}
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
for(const w of [320,375,414,768,1280]){const p=await b.newPage({viewport:{width:w,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForTimeout(200);
assert.equal(await p.locator('#stat-mk').innerText(),'5');assert.equal(await p.locator('#stat-sks').innerText(),'14');assert.equal(await p.locator('#stat-bentrok').innerText(),'0');
await add(p,'QA Satu',5,'08:00','09:00');
assert.equal(await p.locator('#stat-mk').innerText(),'6');assert.equal(await p.locator('#stat-sks').innerText(),'17');assert.equal(await p.locator('#stat-bentrok').innerText(),'0');
await add(p,'QA Bentrok',5,'08:30','09:30');
assert.equal(await p.locator('#stat-bentrok').innerText(),'1','overlap must be detected');
assert.match(await p.locator('#pesan').innerText(),/bertabrakan/);
await add(p,'QA Salah',5,'11:00','10:00');
assert.match(await p.locator('#pesan').innerText(),/selesai harus setelah/);
await p.reload();await p.waitForTimeout(200);
assert.equal(await p.locator('#stat-mk').innerText(),'7','schedule persists after reload');
await add(p,'QA Dua',2,'16:00','17:00');
const ids=await p.evaluate(()=>JSON.parse(localStorage.getItem('jadwal-kuliah.v1')).kuliah.map(k=>k.id));
assert.equal(new Set(ids).size,ids.length,'ids must stay unique after reload');
const before=Number(await p.locator('#stat-mk').innerText());
await p.locator('[data-hapus]:visible').first().click();
assert.equal(Number(await p.locator('#stat-mk').innerText()),before-1,'one delete removes exactly one entry');
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.equal(errors.length,0);
console.log(w,'PASS totals/overlap/invalid range/persistence/unique ids/delete');await p.close();}
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
