/* DELTA OPPORTUNITIES — API unique (Vercel + Neon). Les tables et le super administrateur sont créés automatiquement au premier appel. */
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
const sql = neon(process.env.DATABASE_URL || '');
const q = (t, p = []) => sql.query(t, p);
const E = (code, msg) => Object.assign(new Error(msg), { code });
const TYPES = ['emploi','stage','bourse','formation','concours','entrepreneuriat','financement','appel_projets','appel_offres','recherche','volontariat','freelance','mentorat','echange'];
const MODES = ['presentiel','distance','teletravail','hybride'];
const OC = "o.id,o.org_id,o.type,o.title,o.description,o.country,o.city,o.domain,o.mode,o.level,o.skills,o.conditions,to_char(o.deadline,'YYYY-MM-DD') deadline,o.link,o.pay,o.docs,o.status,o.created_at,u.org_name,u.verified";
const hash = pw => { const s = crypto.randomBytes(16).toString('hex'); return s + ':' + crypto.scryptSync(pw, s, 64).toString('hex'); };
const same = (pw, h) => { const [s, k] = String(h).split(':'); const x = crypto.scryptSync(pw, s, 64); const y = Buffer.from(k || '', 'hex'); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const secret = () => { const s = process.env.SESSION_SECRET || ''; if (s.length < 32) throw E(500, 'SESSION_SECRET (32 caractères minimum) manquant'); return s; };
const sign = p => { const b = Buffer.from(JSON.stringify(p)).toString('base64url'); return b + '.' + crypto.createHmac('sha256', secret()).update(b).digest('base64url'); };
function verify(t) {
  if (!t || t.indexOf('.') < 0) return null; const [b, s] = t.split('.'); const x = crypto.createHmac('sha256', secret()).update(b).digest('base64url');
  if (s.length !== x.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(x))) return null;
  try { const p = JSON.parse(Buffer.from(b, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch (e) { return null; }
}
let ready;
async function init() {
  await q(`create table if not exists users(id serial primary key,email text unique not null,name text not null,role text not null check(role in('super','org','candidate')),pw text not null,status text not null default 'active',org_name text,country text,verified boolean not null default false,created_at timestamptz default now())`);
  await q(`alter table users add column if not exists phone text`);
  await q(`create unique index if not exists users_phone_unique on users(phone) where phone is not null`);
  await q(`create table if not exists account_requests(id bigserial primary key,name text not null,phone text not null,role text not null check(role in('org','candidate')),pw_hash text not null,payment_method text not null check(payment_method in('Orange Money','MTN Mobile Money')),payment_phone text not null,selfie_data text not null,payment_amount int not null default 500,payment_status text not null default 'declared',status text not null default 'pending' check(status in('pending','accepted','rejected')),decision_message text,created_at timestamptz not null default now(),decided_at timestamptz)`);
  await q(`create table if not exists opportunities(id serial primary key,org_id int not null references users(id) on delete cascade,type text not null,title text not null,description text not null,country text,city text,domain text,mode text,level text,skills jsonb not null default '[]',conditions text,deadline date,link text,pay text,docs text,status text not null default 'published',created_at timestamptz default now())`);
  await q(`create table if not exists skills(user_id int references users(id) on delete cascade,name text not null,level int not null check(level between 1 and 4),primary key(user_id,name))`);
  await q(`create table if not exists profiles(user_id int primary key references users(id) on delete cascade,doc jsonb not null default '{}')`);
  await q(`create table if not exists favorites(user_id int references users(id) on delete cascade,opp_id int references opportunities(id) on delete cascade,primary key(user_id,opp_id))`);
  await q(`create table if not exists goals(user_id int references users(id) on delete cascade,opp_id int references opportunities(id) on delete cascade,primary key(user_id,opp_id))`);
  await q(`create table if not exists applications(id serial primary key,user_id int not null references users(id) on delete cascade,opp_id int not null references opportunities(id) on delete cascade,status text not null default 'envoyee',note text,created_at timestamptz default now(),unique(user_id,opp_id))`);
  await q(`create table if not exists notifications(id serial primary key,user_id int not null references users(id) on delete cascade,text text not null,read boolean not null default false,created_at timestamptz default now())`);
  await q(`create table if not exists modules(id serial primary key,skill text not null,level int not null default 1,kind text not null default 'cours',title text not null,body text not null,url text,sol text,created_at timestamptz default now())`);
  await q(`create table if not exists questions(id serial primary key,skill text not null,level int not null default 1,q text not null,choices jsonb not null,answer int not null)`);
  await q(`create table if not exists progress(user_id int references users(id) on delete cascade,module_id int references modules(id) on delete cascade,primary key(user_id,module_id))`);
  await q(`create table if not exists assessments(id serial primary key,user_id int not null references users(id) on delete cascade,skill text not null,score int not null,level int not null,correct int not null,total int not null,created_at timestamptz default now())`);
  await q(`create table if not exists certificates(id serial primary key,user_id int not null references users(id) on delete cascade,skill text not null,score int not null,level int not null,code text unique not null,issued_at timestamptz default now())`);
  await q(`create index if not exists opp_idx on opportunities(status,type,country)`);
  const em = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase(), pw = process.env.SUPER_ADMIN_PASSWORD || '';
  if (!em || pw.length < 8) throw E(500, 'Définissez SUPER_ADMIN_EMAIL et SUPER_ADMIN_PASSWORD (8 caractères min.) dans Vercel');
  await q(`insert into users(email,name,role,pw,verified) values($1,'Super administrateur','super',$2,true) on conflict(email) do nothing`, [em, hash(pw)]);
}

const pub = u => ({ id: u.id, email: u.email, phone: u.phone || null, name: u.name, role: u.role, status: u.status, org_name: u.org_name, country: u.country, verified: u.verified });
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

async function route(a, b, me) {
  if (a === 'ping') return { ok: true };
  if (a === 'paymentInfo') return { amount: 500, orangeNumber: process.env.ORANGE_MONEY_RECEIVER || '', mtnNumber: process.env.MTN_MONEY_RECEIVER || '' };
  if (a === 'requestStatus') { const phone = str(b.phone, 32).replace(/[\s().-]/g, ''); const r = (await q(`select status,decision_message,pw_hash from account_requests where phone=$1 order by created_at desc limit 1`, [phone]))[0]; if (!r || !b.password || !same(String(b.password), r.pw_hash)) throw E(404, 'Demande introuvable : vérifiez le numéro et le mot de passe.'); return { status: r.status, message: r.decision_message || '' }; }
  if (a === 'register') {
    const role = b.role === 'org' ? 'org' : 'candidate', name = str(b.name, 120), phone = str(b.phone, 32).replace(/[\s().-]/g, ''), method = b.paymentMethod === 'MTN Mobile Money' ? 'MTN Mobile Money' : 'Orange Money';
    const photo = String(b.selfie || '');
    if (!name) throw E(400, 'Nom complet obligatoire.');
    if (String(b.password || '').length < 8) throw E(400, 'Mot de passe : 8 caractères minimum.');
    if (b.password !== b.passwordConfirm) throw E(400, 'La confirmation du mot de passe ne correspond pas.');
    if (!/^\+?[0-9]{8,15}$/.test(phone)) throw E(400, 'Numéro Mobile Money invalide.');
    if (!['Orange Money','MTN Mobile Money'].includes(method)) throw E(400, 'Choisissez Orange Money ou MTN Mobile Money.');
    if (!/^data:image\/(jpeg|jpg|png);base64,/.test(photo) || photo.length > 300000) throw E(400, 'Selfie obligatoire (photo JPEG/PNG de taille raisonnable).');
    if (!b.paymentDeclared) throw E(400, 'Cliquez sur « Payer 500 FCFA » puis déclarez le paiement avant de créer le compte.');
    if ((await q(`select 1 from users where phone=$1 limit 1`, [phone])).length) throw E(409, 'Ce numéro possède déjà un compte actif.');
    const pending = await q(`select id from account_requests where phone=$1 and status='pending' limit 1`, [phone]);
    if (pending.length) throw E(409, 'Une demande est déjà en attente pour ce numéro.');
    await q(`insert into account_requests(name,phone,role,pw_hash,payment_method,payment_phone,selfie_data,payment_amount,payment_status,status) values($1,$2,$3,$4,$5,$6,$7,500,'declared','pending')`, [name, phone, role, hash(b.password), method, phone, photo]);
    const sa = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
    if (sa) { const adm = await q(`select id from users where email=$1`, [sa]); if (adm[0]) await q(`insert into notifications(user_id,text) values($1,$2)`, [adm[0].id, 'Nouvelle demande de création de compte de ' + name + ' (' + phone + '). Paiement de 500 FCFA à vérifier.']); }
    return { ok: true, message: 'Demande envoyée au super administrateur. Votre compte restera bloqué jusqu’à sa décision et à la vérification du paiement.' };
  }
  if (a === 'login') {
    const rawIdent = str(b.email || b.phone, 200).toLowerCase(); const ident = rawIdent.includes('@') ? rawIdent : rawIdent.replace(/[\s().-]/g, '');
    const r = await q(`select * from users where lower(email)=$1 or phone=$1 limit 1`, [ident]); const u = r[0];
    if (!u || !same(String(b.password || ''), u.pw)) {
      const rr = await q(`select status,decision_message,pw_hash from account_requests where phone=$1 order by created_at desc limit 1`, [ident]);
      if (rr[0] && b.password && same(String(b.password), rr[0].pw_hash)) {
        const m = rr[0].status === 'pending' ? 'Votre demande est en attente de décision du super administrateur. Votre compte n’est pas encore activé.' : rr[0].status === 'rejected' ? 'Votre demande a été refusée. Vous pouvez recommencer la procédure de création de compte.' : 'Demande introuvable.';
        throw E(403, m + (rr[0].decision_message ? ' Motif : ' + rr[0].decision_message : ''));
      }
      throw E(401, 'Identifiants incorrects.');
    }
    if (u.status === 'pending') throw E(403, 'Votre compte est en attente de validation par le super administrateur.');
    if (u.status === 'suspended') throw E(403, 'Compte suspendu.');
    return { token: sign({ id: u.id, exp: Date.now() + 7 * 864e5 }), user: pub(u) };
  }
  if (a === 'certVerify') { const r = await q(`select c.skill,c.score,c.level,to_char(c.issued_at,'YYYY-MM-DD') issued,u.name from certificates c join users u on u.id=c.user_id where c.code=$1`, [str(b.code, 20).toUpperCase()]); if (!r[0]) throw E(404, 'Aucune attestation avec ce code'); return { cert: r[0] }; }
  if (!me) throw E(401, 'Connexion requise');
  const need = (...roles) => { if (roles.indexOf(me.role) < 0) throw E(403, 'Action non autorisée'); };
  if (a === 'me') return { user: pub(me) };

  if (a === 'list') {
    const w = ["o.status='published'", "(o.deadline is null or o.deadline>=current_date)"], p = [];
    const add = (c, v) => { p.push(v); w.push(c.replace('?', '$' + p.length)); };
    if (TYPES.indexOf(b.type) >= 0) add('o.type=?', b.type);
    if (MODES.indexOf(b.mode) >= 0) add('o.mode=?', b.mode);
    if (str(b.country, 80)) add('lower(o.country)=lower(?)', str(b.country, 80));
    if (str(b.city, 80)) add('lower(o.city)=lower(?)', str(b.city, 80));
    if (str(b.domain, 80)) add("o.domain ilike ?", '%' + str(b.domain, 80) + '%');
    if (/^\d{4}-\d{2}-\d{2}$/.test(str(b.before, 10))) add('o.deadline<=?', b.before);
    if (str(b.text, 80)) add("(o.title||' '||o.description||' '||coalesce(o.domain,'')||' '||o.skills::text) ilike ?", '%' + str(b.text, 80) + '%');
    return { items: await q(`select ${OC} from opportunities o join users u on u.id=o.org_id where ${w.join(' and ')} order by o.created_at desc limit 100`, p) };
  }
  if (a === 'getSkills') return { items: await q(`select name,level from skills where user_id=$1 order by name`, [me.id]) };
  if (a === 'setSkills') {
    need('candidate'); const m = {};
    (Array.isArray(b.items) ? b.items : []).slice(0, 60).forEach(s => { const n = str(s.name, 60), l = parseInt(s.level, 10); if (n && l >= 1 && l <= 4) m[n.toLowerCase()] = [n, l]; });
    const v = Object.values(m); await q(`delete from skills where user_id=$1`, [me.id]);
    if (v.length) await q(`insert into skills(user_id,name,level) select $1,unnest($2::text[]),unnest($3::int[])`, [me.id, v.map(x => x[0]), v.map(x => x[1])]);
    return { ok: true };
  }

  if (a === 'myOpps') { need('org'); return { items: await q(`select ${OC} from opportunities o join users u on u.id=o.org_id where o.org_id=$1 order by o.created_at desc`, [me.id]) }; }
  if (a === 'saveOpp') {
    need('org'); if (me.status !== 'active') throw E(403, 'Votre organisation doit d’abord être validée par DELTA');
    const type = b.type, title = str(b.title, 200), desc = str(b.description, 6000);
    if (TYPES.indexOf(type) < 0) throw E(400, 'Type invalide'); if (!title || !desc) throw E(400, 'Titre et description obligatoires');
    const link = str(b.link, 500); if (link && !/^https?:\/\/\S+$/i.test(link)) throw E(400, 'Le lien doit commencer par http:// ou https://');
    const dl = str(b.deadline, 10) || null; if (dl && !/^\d{4}-\d{2}-\d{2}$/.test(dl)) throw E(400, 'Date limite invalide');
    const sk = (Array.isArray(b.skills) ? b.skills : []).slice(0, 20).map(s => ({ n: str(s.n, 80), l: Math.min(4, Math.max(1, parseInt(s.l, 10) || 1)), k: str(s.k, 80) || undefined })).filter(s => s.n);
    const mode = MODES.indexOf(b.mode) >= 0 ? b.mode : null;
    const f = [type, title, desc, str(b.country, 80), str(b.city, 80), str(b.domain, 80), mode, str(b.level, 120), JSON.stringify(sk), str(b.conditions, 4000), dl, link, str(b.pay, 160), str(b.docs, 1000)];
    if (b.id) { const r = await q(`update opportunities set type=$1,title=$2,description=$3,country=$4,city=$5,domain=$6,mode=$7,level=$8,skills=$9,conditions=$10,deadline=$11,link=$12,pay=$13,docs=$14 where id=$15 and org_id=$16 returning id`, [...f, parseInt(b.id, 10), me.id]); if (!r.length) throw E(404, 'Annonce introuvable'); return { ok: true }; }
    await q(`insert into opportunities(type,title,description,country,city,domain,mode,level,skills,conditions,deadline,link,pay,docs,org_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`, [...f, me.id]); return { ok: true };
  }
  if (a === 'delOpp') { need('org', 'super'); await q(me.role === 'super' ? `delete from opportunities where id=$1` : `delete from opportunities where id=$1 and org_id=${me.id}`, [parseInt(b.id, 10)]); return { ok: true }; }

  if (a === 'users') { need('super'); return { items: await q(`select id,email,name,role,status,org_name,country,verified,created_at from users order by created_at desc limit 500`) }; }
  if (a === 'accountRequests') { need('super'); return { items: await q(`select id,name,phone,role,payment_method,payment_phone,payment_amount,payment_status,status,decision_message,selfie_data,created_at from account_requests where status='pending' order by created_at asc limit 200`) }; }
  if (a === 'decideAccountRequest') {
    need('super'); const id = parseInt(b.id, 10), decision = b.decision === 'accept' ? 'accept' : 'reject';
    const rr = await q(`select * from account_requests where id=$1 and status='pending'`, [id]); const r = rr[0];
    if (!r) throw E(404, 'Demande introuvable ou déjà traitée.');
    const reason = str(b.message, 500);
    if (decision === 'reject') {
      await q(`update account_requests set status='rejected',decision_message=$1,decided_at=now() where id=$2`, [reason || 'Demande refusée par le super administrateur.', id]);
      return { ok: true };
    }
    // L'acceptation confirme que le super administrateur a contrôlé le paiement de 500 FCFA hors plateforme.
    const exists = await q(`select id from users where phone=$1`, [r.phone]);
    if (exists.length) throw E(409, 'Un compte actif utilise déjà ce numéro.');
    const email = r.phone + '@phone.delta.invalid';
    const orgName = r.role === 'org' ? r.name : null;
    await q(`insert into users(email,phone,name,role,pw,status,org_name,country,verified) values($1,$2,$3,$4,$5,'active',$6,$7,$8)`, [email, r.phone, r.name, r.role, r.pw_hash, orgName, null, r.role === 'org']);
    await q(`update account_requests set status='accepted',payment_status='verified',decision_message=$1,decided_at=now() where id=$2`, [reason || 'Paiement contrôlé et demande acceptée.', id]);
    return { ok: true };
  }
  if (a === 'userSet') {
    need('super'); const id = parseInt(b.id, 10); if (id === me.id) throw E(400, 'Action impossible sur votre propre compte');
    if (b.action === 'validate') { await q(`update users set status='active',verified=true where id=$1 and role<>'super'`, [id]); await q(`insert into notifications(user_id,text) values($1,$2)`, [id, 'Votre organisation a été validée par DELTA : vous pouvez publier vos annonces.']); }
    else if (b.action === 'suspend') await q(`update users set status='suspended' where id=$1 and role<>'super'`, [id]);
    else if (b.action === 'restore') await q(`update users set status='active' where id=$1`, [id]); else throw E(400, 'Action inconnue');
    return { ok: true };
  }
  if (a === 'adminOpps') { need('super'); return { items: await q(`select ${OC} from opportunities o join users u on u.id=o.org_id order by o.created_at desc limit 300`) }; }
  if (a === 'oppStatus') { need('super'); await q(`update opportunities set status=$1 where id=$2`, [b.status === 'hidden' ? 'hidden' : 'published', parseInt(b.id, 10)]); return { ok: true }; }
  if (a === 'stats') {
    need('super'); const u = await q(`select role,count(*)::int n from users group by role`), o = await q(`select status,count(*)::int n from opportunities group by status`);
    return { users: u, opps: o };
  }

  const note = (uid, t) => q(`insert into notifications(user_id,text) values($1,$2)`, [uid, t]);
  const LVL = x => x < 40 ? 1 : x < 65 ? 2 : x < 85 ? 3 : 4;
  const oid = () => parseInt(b.id, 10);
  if (a === 'notifs') { const it = await q(`select id,text,read,to_char(created_at,'YYYY-MM-DD HH24:MI') at from notifications where user_id=$1 order by id desc limit 50`, [me.id]); return { items: it, unread: it.filter(x => !x.read).length }; }
  if (a === 'notifRead') { await q(`update notifications set read=true where user_id=$1`, [me.id]); return { ok: true }; }
  if (a === 'modules') return { items: await q(`select id,skill,level,kind,title,body,url,sol from modules order by lower(skill),level,id`) };
  if (a === 'recommend') {
    const names = (Array.isArray(b.skills) ? b.skills : []).slice(0, 10).map(x => str(x, 60)).filter(Boolean), rec = {};
    for (const n of names) rec[n] = { modules: await q(`select id,level,kind,title from modules where lower(skill)=lower($1) order by level,id`, [n]), formations: await q(`select o.id,o.title,o.country,u.org_name from opportunities o join users u on u.id=o.org_id where o.type='formation' and o.status='published' and (o.deadline is null or o.deadline>=current_date) and (o.title||' '||o.description||' '||o.skills::text) ilike $1 order by o.created_at desc limit 3`, ['%' + n + '%']) };
    return { rec };
  }
  if (a === 'profile') {
    need('candidate');
    const r = await Promise.all([
      q(`select doc from profiles where user_id=$1`, [me.id]), q(`select name,level from skills where user_id=$1 order by name`, [me.id]),
      q(`select distinct on (lower(skill)) skill,score,level,to_char(created_at,'YYYY-MM-DD') at from assessments where user_id=$1 order by lower(skill),created_at desc`, [me.id]),
      q(`select id,skill,score,level,code,to_char(issued_at,'YYYY-MM-DD') issued from certificates where user_id=$1 order by issued_at desc`, [me.id]),
      q(`select module_id from progress where user_id=$1`, [me.id]), q(`select opp_id from favorites where user_id=$1`, [me.id]),
      q(`select opp_id,status from applications where user_id=$1`, [me.id]), q(`select opp_id from goals where user_id=$1`, [me.id])]);
    return { profile: (r[0][0] && r[0][0].doc) || {}, skills: r[1], tests: r[2], certs: r[3], done: r[4].map(x => x.module_id), favs: r[5].map(x => x.opp_id), apps: Object.fromEntries(r[6].map(x => [x.opp_id, x.status])), goals: r[7].map(x => x.opp_id) };
  }
  if (a === 'setProfile') {
    need('candidate'); const d = b.profile || {}, arr = (x, n, f) => (Array.isArray(x) ? x : []).slice(0, n).map(f).filter(Boolean);
    const doc = { edu: arr(d.edu, 20, e => str(e.t, 120) && { t: str(e.t, 120), s: str(e.s, 120), y: str(e.y, 20) }), exp: arr(d.exp, 30, e => str(e.t, 120) && { t: str(e.t, 120), o: str(e.o, 120), d: str(e.d, 60) }), lang: arr(d.lang, 15, e => str(e.n, 40) && { n: str(e.n, 40), l: Math.min(4, Math.max(1, parseInt(e.l, 10) || 1)) }), soft: arr(d.soft, 20, e => str(e, 60) || null) };
    await q(`insert into profiles(user_id,doc) values($1,$2) on conflict(user_id) do update set doc=$2`, [me.id, JSON.stringify(doc)]); return { ok: true };
  }
  if (a === 'favToggle' || a === 'goalToggle') {
    need('candidate'); const t = a === 'favToggle' ? 'favorites' : 'goals', r = await q(`delete from ${t} where user_id=$1 and opp_id=$2 returning 1`, [me.id, oid()]);
    if (!r.length) await q(`insert into ${t}(user_id,opp_id) select $1,id from opportunities where id=$2 on conflict do nothing`, [me.id, oid()]); return { on: !r.length };
  }
  if (a === 'favList' || a === 'goalList') { need('candidate'); return { items: await q(`select ${OC} from ${a === 'favList' ? 'favorites' : 'goals'} f join opportunities o on o.id=f.opp_id join users u on u.id=o.org_id where f.user_id=$1 and o.status='published' order by o.created_at desc`, [me.id]) }; }
  if (a === 'apply') {
    need('candidate'); const o = (await q(`select id,org_id,title from opportunities where id=$1 and status='published' and (deadline is null or deadline>=current_date)`, [oid()]))[0];
    if (!o) throw E(404, 'Annonce indisponible ou date limite dépassée');
    try { await q(`insert into applications(user_id,opp_id,note) values($1,$2,$3)`, [me.id, o.id, str(b.note, 6000)]); } catch (e) { if (e.code === '23505') throw E(409, 'Vous avez déjà postulé à cette annonce'); throw e; }
    await note(o.org_id, 'Nouvelle candidature de ' + me.name + ' pour « ' + o.title + ' »'); return { ok: true };
  }
  if (a === 'myApps') { need('candidate'); return { items: await q(`select to_char(a.created_at,'YYYY-MM-DD') applied,a.status app_status,${OC} from applications a join opportunities o on o.id=a.opp_id join users u on u.id=o.org_id where a.user_id=$1 order by a.created_at desc`, [me.id]) }; }
  if (a === 'orgApps') {
    need('org');
    return { items: await q(`select a.id,a.status,a.note,to_char(a.created_at,'YYYY-MM-DD') applied,o.title,o.skills,u.name,u.email,u.country,coalesce(p.doc,'{}') doc,
      (select coalesce(json_agg(json_build_object('name',s.name,'level',s.level)),'[]') from skills s where s.user_id=u.id) sk,
      (select coalesce(json_agg(json_build_object('skill',t.skill,'level',t.level,'score',t.score)),'[]') from (select distinct on (lower(skill)) skill,level,score from assessments where user_id=u.id order by lower(skill),created_at desc) t) ts
      from applications a join opportunities o on o.id=a.opp_id join users u on u.id=a.user_id left join profiles p on p.user_id=u.id where o.org_id=$1 order by a.created_at desc`, [me.id]) };
  }
  if (a === 'appStatus') {
    need('org'); if (['envoyee', 'en_cours', 'entretien', 'retenue', 'refusee'].indexOf(b.status) < 0) throw E(400, 'Statut invalide');
    const r = await q(`update applications a set status=$1 from opportunities o where a.id=$2 and o.id=a.opp_id and o.org_id=$3 returning a.user_id,o.title`, [b.status, oid(), me.id]); if (!r.length) throw E(404, 'Candidature introuvable');
    await note(r[0].user_id, 'Votre candidature pour « ' + r[0].title + ' » a changé de statut.'); return { ok: true };
  }
  if (a === 'modDone') { need('candidate'); await q(`insert into progress(user_id,module_id) select $1,id from modules where id=$2 on conflict do nothing`, [me.id, oid()]); return { ok: true }; }
  if (a === 'testStart') {
    need('candidate'); const r = await q(`select id,level,q,choices from questions where lower(skill)=lower($1) order by random() limit 10`, [str(b.skill, 60)]);
    if (r.length < 5) throw E(400, 'Pas assez de questions pour évaluer cette compétence (minimum 5). Le contenu est ajouté par DELTA.'); return { items: r };
  }
  if (a === 'testSubmit') {
    need('candidate'); const sk = str(b.skill, 60), ans = b.answers || {}, ids = Object.keys(ans).map(Number).filter(Number.isInteger);
    const qs = ids.length >= 5 ? await q(`select id,level,answer from questions where lower(skill)=lower($1) and id=any($2::int[])`, [sk, '{' + ids.join(',') + '}']) : [];
    if (qs.length < 5) throw E(400, 'Test invalide : répondez à toutes les questions');
    let tot = 0, pts = 0, ok = 0; qs.forEach(x => { tot += x.level; if (Number(ans[x.id]) === x.answer) { pts += x.level; ok++; } });
    const score = Math.round(100 * pts / tot), level = LVL(score); let cert = null;
    await q(`insert into assessments(user_id,skill,score,level,correct,total) values($1,$2,$3,$4,$5,$6)`, [me.id, sk, score, level, ok, qs.length]);
    if (level >= 3) cert = (await q(`insert into certificates(user_id,skill,score,level,code) values($1,$2,$3,$4,$5) returning id,code`, [me.id, sk, score, level, crypto.randomBytes(5).toString('hex').toUpperCase()]))[0];
    return { score, level, correct: ok, total: qs.length, cert };
  }

  if (a === 'contentList') { need('super'); return { modules: await q(`select * from modules order by lower(skill),level,id`), questions: await q(`select * from questions order by lower(skill),level,id`) }; }
  if (a === 'modSave') {
    need('super'); const url = str(b.url, 500), lv = Math.min(4, Math.max(1, parseInt(b.level, 10) || 1));
    if (!str(b.skill, 60) || !str(b.title, 160) || !str(b.body, 8000)) throw E(400, 'Compétence, titre et contenu obligatoires'); if (url && !/^https?:\/\/\S+$/i.test(url)) throw E(400, 'Lien invalide');
    await q(`insert into modules(skill,level,kind,title,body,url,sol) values($1,$2,$3,$4,$5,$6,$7)`, [str(b.skill, 60), lv, b.kind === 'exercice' ? 'exercice' : 'cours', str(b.title, 160), str(b.body, 8000), url, str(b.sol, 4000)]); return { ok: true };
  }
  if (a === 'qSave') {
    need('super'); const ch = (Array.isArray(b.choices) ? b.choices : []).map(c => str(c, 200)), an = parseInt(b.answer, 10);
    if (!str(b.skill, 60) || !str(b.q, 500) || ch.filter(Boolean).length < 2 || !(an >= 0 && an < ch.length && ch[an])) throw E(400, 'Question, au moins 2 choix et une bonne réponse valide obligatoires');
    await q(`insert into questions(skill,level,q,choices,answer) values($1,$2,$3,$4,$5)`, [str(b.skill, 60), Math.min(4, Math.max(1, parseInt(b.level, 10) || 1)), str(b.q, 500), JSON.stringify(ch), an]); return { ok: true };
  }
  if (a === 'contentDel') { need('super'); await q(b.kind === 'q' ? `delete from questions where id=$1` : `delete from modules where id=$1`, [oid()]); return { ok: true }; }
  throw E(400, 'Action inconnue');
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST uniquement' });
  try {
    ready = ready || init().catch(e => { ready = null; throw e; }); await ready;
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const tok = verify(((req.headers.authorization || '').replace(/^Bearer\s+/i, '')));
    let me = null; if (tok) { const r = await q(`select * from users where id=$1`, [tok.id]); me = r[0] && r[0].status !== 'suspended' ? r[0] : null; }
    res.status(200).json(await route(b.a, b, me));
  } catch (e) { const c = e.code >= 400 && e.code < 600 ? e.code : 500; if (c === 500) console.error(e); res.status(c).json({ error: c === 500 ? (e.message && /SESSION_SECRET|SUPER_ADMIN/.test(e.message) ? e.message : 'Erreur serveur') : e.message }); }
};
