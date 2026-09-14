  // asistencia: la incluida (T básica / S extendida) con sus servicios y límites,
  // y los planes opcionales del INS que el agente puede ofrecer
  const da=document.getElementById('docAsist');
  const inc=asistIncluida();
  const svRow=sv=>`<div>${esc(sv[0])}<span>${asistLim(sv)}</span></div>`;
  da.innerHTML=`<span class="lc-k">Asistencia</span>
    <div class="lc-as"><div class="lc-as-hd"><div><div class="n">${esc(inc.n)}</div>
        <div class="s">${inc.incluida?esc(inc.incluida)+' · ':''}Una llamada al <b>800-800-8001</b>, 24 horas, 365 días</div></div>
      <span class="lc-state">Incluida</span></div>
      <div class="lc-as-sv">${inc.s.map(svRow).join('')}</div>
      ${inc.nota?`<div class="lc-as-note">${esc(inc.nota)}</div>`:''}</div>
    <div class="lc-opts-wrap"><div class="lc-opts-hd"><span class="lc-k lc-k-prod">Planes de asistencia que puede agregar</span><span class="lc-chip">Nuevo · opcionales</span></div>
    <div class="lc-opts">${asistOpcionales().map(p=>`<div class="lc-opt">
        <div class="top"><div class="n">${esc(p.n)}</div><div class="p">${fmtCRC(p.prima)}<small> / año + IVA</small></div></div>
        <div class="d">${esc(p.d)}</div>${p.monto?`<div class="d"><b>${esc(p.monto)}</b></div>`:''}
        <details><summary>Ver los ${p.s.length} servicios</summary><ul>${p.s.map(sv=>`<li>${esc(sv[0])}<span>${asistLim(sv)}</span></li>`).join('')}</ul>${p.nota?`<div class="lc-as-note" style="padding:8px 0 0">${esc(p.nota)}</div>`:''}</details>
      </div>`).join('')}</div>
    <div class="lc-opts-fine">${ASIST_FINE}</div></div>`;
