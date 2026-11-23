/* DELTA OPPORTUNITIES — extension V4 « Espace professionnel permanent ».
   S'ajoute à la V3 sans rien remplacer : onglets supplémentaires par espace, données dans une clé séparée (do_growth_v1).
   Aucune donnée n'est envoyée sur Internet. Les catalogues d'événements/groupes sont FICTIFS (étiquetés). */
(function () {
  const K = 'do_growth_v1'; let G;
  const ld = () => { if (G) return G; try { G = JSON.parse(localStorage.getItem(K)); } catch (e) { } return G = G && G.v == 1 ? G : { v: 1, c: {}, days: {} }; };
  const sv = () => { try { localStorage.setItem(K, JSON.stringify(ld())); } catch (e) { } };
  const bi = s => { const p = String(s).split('|'); return (st.lang == 'en' ? p[1] : p[0]) || p[0]; };
  const col = (u, k) => { const c = ld().c; c[u.id] = c[u.id] || {}; return c[u.id][k] = c[u.id][k] || []; };
  const td = () => new Date().toISOString().slice(0, 10), nid = () => Math.random().toString(36).slice(2, 9);
  const PS = ['À contacter|To contact', 'En discussion|In talks', 'Accord signé|Agreed', 'Actif|Active'];
  const TS = ['À faire|To do', 'En cours|In progress', 'Terminé|Done'];
  const f = (n, l, t, o) => [n, l, t, o];
  const SEC = {
    career: [
      { k: 'goals', t: 'Objectifs de carrière|Career goals', note: 'Fixez vos étapes : après un emploi, une bourse ou une formation, la suivante commence ici.|Set your next steps: after a job, scholarship or course, the next one starts here.', s: TS, f: [f('n', 'Objectif|Goal'), f('h', 'Horizon|Horizon', 's', ['3 mois|3 months', '1 an|1 year', '3 ans|3 years', '5 ans|5 years']), f('d', 'Échéance|Deadline', 'date')] },
      { k: 'jobs', t: 'Mon parcours|My path', f: [f('n', 'Poste, stage ou formation|Role, internship or course'), f('o', 'Organisation|Organisation'), f('y', 'Période|Period'), f('x', 'Résultats clés|Key results', 'a')] },
      { k: 'skills', t: 'Plan de compétences|Skills plan', s: TS, f: [f('n', 'Compétence à développer|Skill to develop'), f('h', 'Niveau visé|Target level', 's', S.LVL), f('d', 'Échéance|Deadline', 'date')] },
      { k: 'wins', t: 'Réalisations|Achievements', f: [f('n', 'Réalisation|Achievement'), f('d', 'Date|Date', 'date'), f('x', 'Détails|Details', 'a')] },
      { k: 'review', t: 'Bilans|Reviews', f: [f('n', 'Période (ex. 2026)|Period (e.g. 2026)'), f('x', 'Réussites et axes d’amélioration|Wins and improvements', 'a')] }],
    network: [
      { k: 'contacts', t: 'Réseau professionnel|Professional network', note: 'Gardez vos contacts vivants : la date de suivi alimente vos rappels.|Keep contacts alive: the follow-up date feeds your reminders.', s: ['À relancer|To follow up', 'En contact|In touch', 'Collaboration|Collaboration'], f: [f('n', 'Nom|Name'), f('o', 'Organisation|Organisation'), f('r', 'Relation|Relation', 's', ['Mentor|Mentor', 'Recruteur|Recruiter', 'Collègue|Colleague', 'Pair|Peer', 'Client|Client']), f('d', 'Prochain suivi|Next follow-up', 'date'), f('x', 'Notes|Notes', 'a')] },
      { k: 'refs', t: 'Recommandations|References', f: [f('n', 'Personne|Person'), f('o', 'Organisation|Organisation'), f('x', 'Ce qu’elle peut attester|What they can vouch for', 'a')] }],
    watch: [
      { k: 'alerts', t: 'Alertes d’opportunités|Opportunity alerts', live: 1, note: 'Chaque alerte compte en direct les offres actuelles qui correspondent.|Each alert counts matching current listings live.', f: [f('q', 'Mots-clés|Keywords'), f('ty', 'Type|Type', 's', 'TY'), f('c', 'Pays|Country')] }],
    orgdev: [
      { k: 'obj', t: 'Objectifs (OKR)|Objectives (OKR)', pct: 1, f: [f('n', 'Objectif|Objective'), f('x', 'Résultat clé mesurable|Measurable key result'), f('d', 'Échéance|Deadline', 'date')] },
      { k: 'part', t: 'Partenaires|Partners', s: PS, f: [f('n', 'Partenaire|Partner'), f('o', 'Type|Type', 's', ['Entreprise|Company', 'ONG|NGO', 'Institution|Institution', 'École|School']), f('d', 'Prochaine action|Next action', 'date')] },
      { k: 'sup', t: 'Fournisseurs|Suppliers', s: ['Prospecté|Sourced', 'Qualifié|Qualified', 'Sous contrat|Under contract'], f: [f('n', 'Fournisseur|Supplier'), f('o', 'Catégorie|Category'), f('c', 'Pays|Country')] },
      { k: 'tend', t: 'Appels d’offres|Tenders', s: ['Brouillon|Draft', 'Ouvert|Open', 'Attribué|Awarded'], f: [f('n', 'Besoin|Need'), f('b', 'Budget (FCFA)|Budget (FCFA)', 'num'), f('d', 'Date limite|Deadline', 'date')] },
      { k: 'fund', t: 'Financements et subventions|Funding & grants', s: ['Identifié|Identified', 'Dossier en cours|Drafting', 'Déposé|Submitted', 'Obtenu|Awarded'], f: [f('n', 'Source|Source'), f('b', 'Montant visé (FCFA)|Target (FCFA)', 'num'), f('d', 'Date limite|Deadline', 'date')] },
      { k: 'cli', t: 'Clients et prospects|Clients & prospects', s: ['Prospect|Prospect', 'Devis|Quote', 'Client|Client', 'Fidélisé|Loyal'], f: [f('n', 'Nom|Name'), f('o', 'Secteur|Sector'), f('d', 'Prochain contact|Next contact', 'date')] },
      { k: 'team', t: 'Équipe et intégration|Team & onboarding', note: 'Après un recrutement : suivez l’intégration de chaque collaborateur.|After hiring: track each new member’s onboarding.', ck: ['Contrat signé|Contract signed', 'Accès et matériel|Access & equipment', 'Accueil / présentation équipe|Welcome / team intro', 'Objectifs à 30 jours|30-day goals', 'Formation initiale|Initial training', 'Point à 90 jours|90-day review'], f: [f('n', 'Collaborateur|Team member'), f('o', 'Poste|Role'), f('d', 'Arrivée|Start date', 'date')] },
      { k: 'form', t: 'Plan de formation interne|Internal training plan', s: TS, f: [f('n', 'Collaborateur|Team member'), f('o', 'Compétence|Skill'), f('d', 'Échéance|Deadline', 'date')] },
      { k: 'vis', t: 'Visibilité et publications|Visibility & posts', s: ['Idée|Idea', 'Rédigé|Written', 'Publié|Published'], f: [f('n', 'Titre|Title'), f('o', 'Canal|Channel', 's', ['Site|Website', 'Réseaux sociaux|Social media', 'Presse|Press', 'Newsletter|Newsletter']), f('d', 'Date|Date', 'date')] }],
    events: [
      { k: 'ev', t: 'Événements|Events', cat: [['e1', 'Webinaire : réussir son premier mois en poste|Webinar: succeeding in your first month', 'En ligne · mensuel|Online · monthly'], ['e2', 'Atelier CV et entretien|CV & interview workshop', 'En ligne · mensuel|Online · monthly'], ['e3', 'Rencontre entreprises et talents|Companies & talent meetup', 'Trimestriel|Quarterly'], ['e4', 'Forum financements et partenariats|Funding & partnerships forum', 'Trimestriel|Quarterly']] },
      { k: 'grp', t: 'Communautés|Communities', cat: [['g1', 'Logistique et transport|Logistics & transport', 'Échanges entre pairs|Peer exchange'], ['g2', 'Numérique et IA|Digital & AI', 'Échanges entre pairs|Peer exchange'], ['g3', 'Entrepreneuriat et startups|Entrepreneurship & startups', 'Échanges entre pairs|Peer exchange'], ['g4', 'Bourses et études à l’étranger|Scholarships & study abroad', 'Échanges entre pairs|Peer exchange']] }]
  };
  const GT = { candidat: ['career', 'network', 'watch', 'value', 'events'], apprenant: ['career', 'network', 'watch', 'value', 'events'], entreprise: ['orgdev', 'value', 'events'], organisme: ['orgdev', 'value', 'events'], partenaire: ['orgdev', 'value', 'events'], recruteur: ['value', 'events'], formateur: ['network', 'value', 'events'], mentor: ['network', 'value', 'events'] };
  Object.assign(TN, { career: ['Ma carrière', 'My career'], network: ['Réseau', 'Network'], watch: ['Veille et alertes', 'Watch & alerts'], orgdev: ['Développement de l’organisation', 'Organisation development'], value: ['Mon espace de valeur', 'My value hub'], events: ['Événements et communauté', 'Events & community'] });
  Object.assign(TI, { career: 'target', network: 'users', watch: 'bell', orgdev: 'rocket', value: 'award', events: 'globe' });
  Object.keys(GT).forEach(r => { const n = NAV[r], t = GT[r].slice(), first = t.shift(); n.splice(n.indexOf('dash') + 1, 0, first); n.splice(n.indexOf('notifs') < 0 ? n.length : n.indexOf('notifs'), 0, ...t); });

  const nextS = (sc, it) => sc.s ? Math.min(sc.s.length - 1, it.s + 1) : 0;
  const mark = u => { const d = ld().days, a = d[u.id] = d[u.id] || []; if (!a.includes(td())) { a.push(td()); sv(); } };
  const tabs = r => GT[r] || [];
  const due = u => { const lim = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), o = [];
    tabs(u.role).forEach(t => (SEC[t] || []).forEach(sc => col(u, sc.k).forEach(it => { if (it.d && it.d <= lim && !(sc.s && it.s >= sc.s.length - 1)) o.push({ t, sc, it }); }))); return o.sort((a, b) => a.it.d < b.it.d ? -1 : 1); };
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

  function secHtml(t, u, sc) {
    const it = col(u, sc.k); let h = `<div class="card"><h3>${esc(bi(sc.t))}</h3>${sc.note ? `<p class="mu">${esc(bi(sc.note))}</p>` : ''}`;
    if (sc.cat) return h + sc.cat.map(c => { const on = it.includes(c[0]); return `<div class="gap"><b>${esc(bi(c[1]))}</b> ${tag(L('FICTIF', 'DEMO DATA'), 'warn')}<div class="mu">${esc(bi(c[2]))}</div><button class="${on ? 's' : 'p'}" onclick="A('gcat','${t}','${sc.k}|${c[0]}')">${on ? L('Inscrit ✓ (annuler)', 'Joined ✓ (cancel)') : L('Je participe', 'Join')}</button></div>`; }).join('') + '</div>';
    h += `<div class="row">${sc.f.map(x => { const id = 'g_' + sc.k + '_' + x[0], lab = esc(bi(x[1])); return x[2] == 's' ? `<select id="${id}">${x[3] == 'TY' ? opt(S.TY, '', L('Tous types', 'All types')) : x[3].map(o => `<option>${esc(bi(o))}</option>`).join('')}</select>` : x[2] == 'a' ? `<textarea id="${id}" placeholder="${lab}"></textarea>` : `<input id="${id}" type="${x[2] || 'text'}" placeholder="${lab}" title="${lab}">`; }).join('')}</div><button class="p" onclick="A('gadd','${t}','${sc.k}')">${ic('plus', 15)} ${L('Ajouter', 'Add')}</button>`;
    h += it.map(x => { const sub = sc.f.slice(1).map(y => x[y[0]] ? esc(x[y[0]]) : '').filter(Boolean).join(' · ');
      let live = ''; if (sc.live) { try { live = tag(S.opps({ q: x.q, type: x.ty, country: x.c }, u).length + L(' offre(s) maintenant', ' listing(s) now'), 'ok'); } catch (e) { } }
      return `<div class="gap"><b>${esc(x[sc.f[0][0]] || x.ty || x.c)}</b> ${sc.s ? tag(bi(sc.s[x.s || 0]), x.s >= sc.s.length - 1 ? 'ok' : '') : ''}${live}${x.d && sc.s && x.d < td() && x.s < sc.s.length - 1 ? tag(L('En retard', 'Overdue'), 'warn') : ''}<div class="mu">${sub}</div>` +
        (sc.pct ? `<div class="pb"><i style="width:${x.p || 0}%"></i></div><button class="s" onclick="A('gpct','${t}','${sc.k}|${x.id}|-10')">−10 %</button> <button class="s" onclick="A('gpct','${t}','${sc.k}|${x.id}|10')">+10 %</button> <b>${x.p || 0} %</b> ` : '') +
        (sc.ck ? `<div class="pb"><i style="width:${pct((x.ck || []).length, sc.ck.length)}%"></i></div>` + sc.ck.map((c, i) => `<button class="${(x.ck || []).includes(i) ? 'p' : 's'}" onclick="A('gck','${t}','${sc.k}|${x.id}|${i}')">${(x.ck || []).includes(i) ? '✓ ' : ''}${esc(bi(c))}</button>`).join(' ') + ' ' : '') +
        (sc.s && x.s < sc.s.length - 1 ? `<button class="s" onclick="A('gnext','${t}','${sc.k}|${x.id}')">${L('Étape suivante', 'Next stage')} → ${esc(bi(sc.s[nextS(sc, x)]))}</button> ` : '') + `<button class="d" onclick="A('gdel','${t}','${sc.k}|${x.id}')">${L('Supprimer', 'Delete')}</button></div>`; }).join('') || `<p class="mu">${L('Rien pour l’instant.', 'Nothing yet.')}</p>`;
    return h + '</div>';
  }
  function orgHealth(u) {
    const p = col(u, 'part'), fu = col(u, 'fund'), tm = col(u, 'team'), ob = col(u, 'obj');
    return { data: [{ k: L('Partenariats', 'Partnerships'), pct: pct(p.filter(x => x.s >= 2).length, p.length) }, { k: L('Financements', 'Funding'), pct: pct(fu.filter(x => x.s >= 2).length, fu.length) }, { k: L('Intégration équipe', 'Team onboarding'), pct: tm.length ? Math.round(tm.reduce((s, x) => s + pct((x.ck || []).length, 6), 0) / tm.length) : 0 }, { k: L('Objectifs', 'Objectives'), pct: ob.length ? Math.round(ob.reduce((s, x) => s + (x.p || 0), 0) / ob.length) : 0 }] };
  }
  const LV = [[0, 'Bronze'], [100, 'Argent|Silver'], [300, 'Or|Gold'], [600, 'Platine|Platinum']];
  function stats(u) {
    let n = 0, done = 0, rows = []; tabs(u.role).forEach(t => (SEC[t] || []).filter(sc => !sc.cat).forEach(sc => { const a = col(u, sc.k), d = sc.s ? a.filter(x => x.s >= sc.s.length - 1).length : a.length; n += a.length; done += d; rows.push([bi(sc.t), a.length, d]); }));
    let ap = 0, en = 0; try { ap = S.apps(u).length; } catch (e) { } try { const m = S.myEnrol(u); en = Array.isArray(m) ? m.length : 0; } catch (e) { }
    const days = (ld().days[u.id] || []), pts = n * 10 + ap * 5 + en * 15 + days.length * 2; let li = 0; LV.forEach((l, i) => { if (pts >= l[0]) li = i; });
    let sk = 0, i = days.length - 1, d = new Date(); if (days[i] != td()) d.setDate(d.getDate() - 1); for (; i >= 0 && days[i] == d.toISOString().slice(0, 10); i--, d.setDate(d.getDate() - 1)) sk++;
    return { n, done, rows, ap, en, days: days.length, pts, li, sk, nx: LV[li + 1] };
  }
  function valueHtml(u) {
    const s = stats(u), lv = bi(LV[s.li][1]), nx = s.nx, dd = due(u);
    return `<div class="card"><h3>🏅 ${L('Niveau', 'Level')} ${esc(lv)} · ${s.pts} pts</h3>${nx ? CH.gauge({ pct: pct(s.pts - LV[s.li][0], nx[0] - LV[s.li][0]) }) + `<p class="mu">${L('Prochain niveau', 'Next level')} : ${esc(bi(nx[1]))} (${nx[0]} pts)</p>` : `<p class="okm">${L('Niveau maximum atteint.', 'Top level reached.')}</p>`}<p class="mu">${L('Points = actions menées dans la plateforme (10 par élément suivi, 5 par candidature, 15 par formation, 2 par jour d’activité). Reconnaissance interne uniquement.', 'Points = actions taken in the platform (10 per tracked item, 5 per application, 15 per course, 2 per active day). Internal recognition only.')}</p><span class="tag ok">🔥 ${s.sk} ${L('jour(s) d’affilée', 'day streak')}</span></div>
<div class="grid"><div class="kpi"><b>${s.n}</b><span>${L('éléments suivis', 'items tracked')}</span></div><div class="kpi"><b>${s.done}</b><span>${L('terminés / atteints', 'done / achieved')}</span></div><div class="kpi"><b>${s.ap}</b><span>${L('candidatures', 'applications')}</span></div><div class="kpi"><b>${s.en}</b><span>${L('formations', 'courses')}</span></div><div class="kpi"><b>${s.days}</b><span>${L('jours d’activité', 'active days')}</span></div>${u.monthly ? `<div class="kpi"><b>${s.n + s.ap + s.en ? Math.round(u.monthly / (s.n + s.ap + s.en)).toLocaleString('fr-FR') : '—'}</b><span>${L('FCFA par action (abonnement ÷ actions)', 'FCFA per action (plan ÷ actions)')}</span></div>` : ''}</div>
<div class="card"><h3>⏰ ${L('À faire dans les 7 jours', 'Due within 7 days')}</h3>${dd.map(x => `<div class="gap"><b>${esc(x.it[x.sc.f[0][0]])}</b> ${tag(x.it.d, x.it.d < td() ? 'warn' : '')} <span class="mu">${esc(bi(x.sc.t))}</span> <button class="s" onclick="A('tab','${x.t}')">${L('Ouvrir', 'Open')}</button></div>`).join('') || `<p class="mu">${L('Aucune échéance proche.', 'No upcoming deadlines.')}</p>`}</div>
<div class="card"><h3>${L('Répartition de votre suivi', 'Your tracking breakdown')}</h3>${CH.hbars({ data: s.rows.map(r => ({ k: r[0], v: r[1] })) })}</div><button class="p" onclick="A('gexp')">${ic('download', 15)} ${L('Télécharger mon bilan de valeur', 'Download my value report')}</button>`;
  }
  function view(t, u) {
    mark(u); if (t == 'value') return valueHtml(u);
    const ss = SEC[t], i = Math.min((st.gs || {})[t] || 0, ss.length - 1), sc = ss[i];
    let h = ss.length > 1 ? `<div class="tabs sub">${ss.map((x, j) => `<button class="${j == i ? 'on' : ''}" onclick="A('gsec','${t}','${j}')">${esc(bi(x.t))}</button>`).join('')}</div>` : '';
    if (t == 'orgdev') h = `<div class="card"><h3>${ic('gauge', 17)} ${L('Santé de l’organisation', 'Organisation health')}</h3><p class="mu">${L('Calculée à partir de ce que vous saisissez ci-dessous.', 'Computed from what you enter below.')}</p>${CH.gauges(orgHealth(u))}</div>` + h;
    if (t == 'career') h = `<div class="card"><h3>${L('Poursuivre après un succès', 'Keep going after a win')}</h3><p class="mu">${L('Emploi obtenu ? Visez la prochaine étape : formations, évaluations ou nouvelles offres.', 'Got the job? Aim for the next step: courses, assessments or new listings.')}</p><button class="s" onclick="A('tab','trains')">${L('Formations', 'Courses')}</button> <button class="s" onclick="A('tab','evals')">${L('Évaluations', 'Assessments')}</button> <button class="s" onclick="A('tab','opps')">${L('Opportunités', 'Opportunities')}</button></div>` + h;
    return h + secHtml(t, u, sc);
  }
  Object.keys(TN).filter(t => SEC[t] || t == 'value').forEach(t => { V[t] = u => view(t, u); });
  const d0 = V.dash; V.dash = u => { const dd = tabs(u.role).length ? due(u) : []; return (dd.length ? `<div class="card"><h3>⏰ ${L('À faire cette semaine', 'Due this week')} (${dd.length})</h3>${dd.slice(0, 4).map(x => `<div class="gap"><b>${esc(x.it[x.sc.f[0][0]])}</b> ${tag(x.it.d)} <span class="mu">${esc(bi(x.sc.t))}</span></div>`).join('')}<button class="s" onclick="A('tab','value')">${L('Tout voir', 'See all')}</button></div>` : '') + d0(u); };

  const sec = (t, k) => SEC[t].find(x => x.k == k), find = (u, k, id) => col(u, k).find(x => x.id == id);
  Object.assign(AC, {
    gsec(t, i) { (st.gs = st.gs || {})[t] = +i; },
    gadd(t, k) { const u = U(), sc = sec(t, k), x = { id: nid(), s: 0, p: 0, ck: [], ts: td() }; sc.f.forEach(y => { x[y[0]] = v('g_' + k + '_' + y[0]); }); if (!x[sc.f[0][0]] && !(sc.live && (x.q || x.ty || x.c))) throw new Error(L('Le premier champ est obligatoire.', 'The first field is required.')); col(u, k).unshift(x); sv(); st.msg = L('Ajouté.', 'Added.'); },
    gdel(t, a) { const [k, id] = a.split('|'); const u = U(), c = col(u, k); c.splice(c.findIndex(x => x.id == id), 1); sv(); },
    gnext(t, a) { const [k, id] = a.split('|'), u = U(), x = find(u, k, id); x.s = nextS(sec(t, k), x); sv(); },
    gpct(t, a) { const [k, id, d] = a.split('|'), x = find(U(), k, id); x.p = Math.max(0, Math.min(100, (x.p || 0) + +d)); sv(); },
    gck(t, a) { const [k, id, i] = a.split('|'), x = find(U(), k, id); x.ck = x.ck || []; const j = x.ck.indexOf(+i); j < 0 ? x.ck.push(+i) : x.ck.splice(j, 1); sv(); },
    gcat(t, a) { const [k, id] = a.split('|'), c = col(U(), k), j = c.indexOf(id); j < 0 ? c.push(id) : c.splice(j, 1); sv(); },
    gexp() { const u = U(), s = stats(u); const txt = `DELTA OPPORTUNITIES — ${L('Bilan de valeur', 'Value report')} (${L('données fictives de démonstration', 'demo data')})\n${u.name} · ${S.RN[u.role]} · ${td()}\n${L('Niveau', 'Level')}: ${bi(LV[s.li][1])} (${s.pts} pts)\n${s.rows.map(r => `- ${r[0]}: ${r[1]} (${r[2]} ${L('terminés', 'done')})`).join('\n')}\n${L('Candidatures', 'Applications')}: ${s.ap} · ${L('Formations', 'Courses')}: ${s.en}\n`; const b = new Blob([txt], { type: 'text/plain' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'delta-bilan-de-valeur.txt'; a.click(); }
  });
  const rs = S.reset; S.reset = function () { G = { v: 1, c: {}, days: {}, abo: {} }; sv(); return rs.apply(this, arguments); };
  const ex = S.exportData; S.exportData = function (u) { const r = ex.apply(this, arguments); try { const o = JSON.parse(r); o.developpement = ld().c[u.id] || {}; return JSON.stringify(o, null, 2); } catch (e) { return r; } };
  /* ---------- Échéances d'abonnement : rappels aux utilisateurs + vue super administrateur ---------- */
  const ab = () => ld().abo || (ld().abo = {});
  const addD = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
  const dif = d => Math.round((Date.parse(d) - Date.parse(td())) / 864e5);
  const aboOf = x => { const a = ab(); if (!a[x.id]) { const h = [...String(x.id)].reduce((s, c) => s + c.charCodeAt(0), 0); a[x.id] = { end: x.fromReq ? addD(x.created || td(), 30) : addD(td(), (h % 46) - 6), sim: !x.fromReq, hist: [], rem: [] }; sv(); } return a[x.id]; };
  const stt = d => d < 0 ? ['exp', 'Expiré|Expired', 'warn'] : d <= 1 ? ['crit', 'Dernier jour|Last day', 'warn'] : d <= 7 ? ['urg', 'Moins de 7 jours|Under 7 days', 'warn'] : d <= 30 ? ['soon', 'Moins de 30 jours|Under 30 days', ''] : ['ok', 'Actif|Active', 'ok'];
  const msg = d => d < 0 ? L(`Votre abonnement a expiré depuis ${-d} jour(s). Renouvelez-le pour continuer à utiliser tous les services.`, `Your subscription expired ${-d} day(s) ago. Renew to keep using all services.`) : d == 0 ? L('Votre abonnement se termine aujourd’hui.', 'Your subscription ends today.') : L(`Votre abonnement se termine dans ${d} jour(s).`, `Your subscription ends in ${d} day(s).`);
  const subs = u => S.users(u).filter(x => x.role != 'super' && x.role != 'admin').map(x => { const a = aboOf(x), d = dif(a.end); return { x, a, d, s: stt(d) }; });
  NAV.super.splice(NAV.super.indexOf('subs') + 1, 0, 'abos'); TN.abos = ['Échéances d’abonnement', 'Subscription deadlines']; TI.abos = 'clock';
  V.abos = u => { const all = subs(u).sort((p, q) => p.d - q.d), f = st.af || {}, q = (f.q || '').toLowerCase(), list = all.filter(r => (!f.s || r.s[0] == f.s) && (!q || (r.x.name + r.x.email).toLowerCase().includes(q))), c = k => all.filter(r => r.s[0] == k).length;
    return `<p class="mu">${L('Dates d’échéance de démonstration (simulées) ; en production, elles viendraient des paiements réels.', 'Demo (simulated) deadlines; in production they would come from real payments.')}</p><div class="grid"><div class="kpi"><b>${c('exp')}</b><span>${L('expirés', 'expired')}</span></div><div class="kpi"><b>${c('crit') + c('urg')}</b><span>${L('≤ 7 jours', '≤ 7 days')}</span></div><div class="kpi"><b>${c('soon')}</b><span>${L('≤ 30 jours', '≤ 30 days')}</span></div><div class="kpi"><b>${c('ok')}</b><span>${L('actifs', 'active')}</span></div></div>
<div class="card"><h3>${L('Répartition', 'Breakdown')}</h3>${CH.hbars({ data: ['exp', 'crit', 'urg', 'soon', 'ok'].map(k => ({ k: bi({ exp: 'Expirés|Expired', crit: 'Dernier jour|Last day', urg: '≤ 7 jours|≤ 7 days', soon: '≤ 30 jours|≤ 30 days', ok: 'Actifs|Active' }[k]), v: c(k) })) })}</div>
<div class="row"><input id="afq" placeholder="${L('Rechercher', 'Search')}" value="${esc(f.q || '')}"><select id="afs"><option value="">${L('Tous les états', 'All states')}</option>${[['exp', 'Expirés|Expired'], ['crit', 'Dernier jour|Last day'], ['urg', '≤ 7 jours|≤ 7 days'], ['soon', '≤ 30 jours|≤ 30 days'], ['ok', 'Actifs|Active']].map(o => `<option value="${o[0]}"${f.s == o[0] ? ' selected' : ''}>${esc(bi(o[1]))}</option>`).join('')}</select></div><button class="s" onclick="A('aflt')">${L('Filtrer', 'Filter')}</button> <button class="s" onclick="A('acsv')">${ic('download', 15)} CSV</button> <button class="p" onclick="A('abulk')">${L('Envoyer un rappel à tous les ≤ 7 jours et expirés', 'Remind everyone ≤ 7 days and expired')}</button>` +
      list.slice(0, 80).map(r => `<div class="card"><b>${esc(r.x.name)}</b> ${tag(S.RN[r.x.role])} ${tag(bi(r.s[1]), r.s[2])}<div class="mu">${L('Fin', 'Ends')} : ${r.a.end} (${r.d < 0 ? L('il y a ', '') + -r.d + L(' j', 'd ago') : r.d + L(' j restants', 'd left')})${r.a.sim ? ' · ' + L('date simulée', 'simulated date') : ''}${(r.a.rem || []).length ? ' · ' + L('dernier rappel ', 'last reminder ') + r.a.rem[r.a.rem.length - 1].date : ''}</div><button class="p" onclick="A('arem','${r.x.id}')">${L('Rappeler', 'Remind')}</button> <button class="s" onclick="A('arn','${r.x.id}|30')">+30 ${L('j', 'd')}</button> <button class="s" onclick="A('arn','${r.x.id}|90')">+90 ${L('j', 'd')}</button> <button class="s" onclick="A('arn','${r.x.id}|365')">+1 ${L('an', 'yr')}</button> <input id="ad_${r.x.id}" type="date" style="width:auto"><button class="s" onclick="A('aset','${r.x.id}')">${L('Fixer', 'Set')}</button></div>`).join('') || `<p class="mu">${L('Aucun résultat.', 'No results.')}</p>`; };
  const banner = u => { if (u.role == 'super') { const r = subs(u), n = r.filter(x => x.d <= 7).length; return n ? `<div class="err" style="background:#fff0cf;color:#7a5200">⏰ ${L(`${n} abonnement(s) expiré(s) ou finissant sous 7 jours.`, `${n} subscription(s) expired or ending within 7 days.`)} <button class="s" onclick="A('tab','abos')">${L('Voir', 'View')}</button></div>` : ''; }
    if (u.role == 'admin') return ''; const a = aboOf(u), d = dif(a.end), s = stt(d), un = (a.rem || []).filter(x => !x.read);
    return (d <= 30 ? `<div class="${d <= 7 ? 'err' : 'okm'}">⏰ ${msg(d)} (${a.end}) <button class="p" onclick="A('aself')">${L('Renouveler (simulation)', 'Renew (simulated)')}</button></div>` : '') + un.map(x => `<div class="okm">🔔 ${esc(x.txt)} <span class="mu">${x.date}</span> <button class="s" onclick="A('aread')">${L('Lu', 'Read')}</button></div>`).join(''); };
  const sh0 = shell; shell = function (u) { return sh0(u).replace('<div class="tabs">', banner(u) + '<div class="tabs">'); };
  const nt0 = V.notifs; V.notifs = u => { const a = u.role != 'super' && u.role != 'admin' ? aboOf(u) : null; return (a ? `<div class="card"><h3>⏰ ${L('Mon abonnement', 'My subscription')}</h3><p>${msg(dif(a.end))} (${a.end})</p>${(a.hist || []).slice(-5).reverse().map(h => `<div class="gap mu">${h.date} · ${esc(h.txt)}</div>`).join('')}${(a.rem || []).slice(-5).reverse().map(h => `<div class="gap mu">🔔 ${h.date} · ${esc(h.txt)}</div>`).join('')}</div>` : '') + nt0(u); };
  const sup = () => { const u = U(); if (!u || u.role != 'super') throw new Error(L('Réservé au super administrateur.', 'Super administrator only.')); return u; };
  const renew = (x, n, by) => { const a = aboOf(x); a.end = addD(dif(a.end) < 0 ? td() : a.end, n); a.sim = false; a.hist = (a.hist || []).concat({ date: td(), txt: L(`Prolongé de ${n} jours (${by}) → ${a.end}`, `Extended ${n} days (${by}) → ${a.end}`) }); sv(); };
  const target = id => S.users(sup()).find(x => x.id == id);
  Object.assign(AC, {
    aflt() { st.af = { q: v('afq'), s: v('afs') }; },
    arem(id) { const x = target(id), a = aboOf(x), d = dif(a.end); a.rem = (a.rem || []).concat({ date: td(), txt: msg(d), read: false }); sv(); st.msg = L('Rappel envoyé à ', 'Reminder sent to ') + x.name + '.'; },
    abulk() { let n = 0; subs(sup()).filter(r => r.d <= 7).forEach(r => { r.a.rem = (r.a.rem || []).concat({ date: td(), txt: msg(r.d), read: false }); n++; }); sv(); st.msg = n + L(' rappel(s) envoyé(s).', ' reminder(s) sent.'); },
    arn(a) { const [id, n] = a.split('|'); renew(target(id), +n, L('super administrateur', 'super administrator')); st.msg = L('Abonnement prolongé.', 'Subscription extended.'); },
    aset(id) { const d = v('ad_' + id); if (!/^\d{4}-\d\d-\d\d$/.test(d)) throw new Error(L('Choisissez une date.', 'Pick a date.')); const a = aboOf(target(id)); a.end = d; a.sim = false; a.hist = (a.hist || []).concat({ date: td(), txt: L('Date fixée → ', 'Date set → ') + d }); sv(); st.msg = L('Date enregistrée.', 'Date saved.'); },
    acsv() { const r = subs(sup()).sort((p, q) => p.d - q.d), t = 'nom;role;fin;jours;etat\n' + r.map(x => [x.x.name, x.x.role, x.a.end, x.d, x.s[0]].join(';')).join('\n'), b = new Blob([t], { type: 'text/csv' }), l = document.createElement('a'); l.href = URL.createObjectURL(b); l.download = 'echeances-abonnements.csv'; l.click(); },
    aself() { const u = U(); renew(u, 30, L('renouvellement simulé', 'simulated renewal')); st.msg = L('Abonnement prolongé de 30 jours (simulation, aucun paiement).', 'Extended by 30 days (simulated, no payment).'); },
    aread() { (aboOf(U()).rem || []).forEach(x => x.read = true); sv(); }
  });
  const css = document.createElement('style'); css.textContent = '.pb{height:8px;background:#eef0f7;border-radius:6px;margin:6px 0}.pb i{display:block;height:8px;border-radius:6px;background:linear-gradient(90deg,#1fdcc0,#0a9a86)}'; document.head.appendChild(css);
  render();
})();
