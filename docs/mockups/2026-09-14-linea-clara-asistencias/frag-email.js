// =====================================================================
// CORREO AL CLIENTE · línea clara SDI (14 sep 2026), transcrito de la
// plantilla de INS Medical / Vital 360: filete SDI + barra en dos niveles
// (logo del INS en tinta, porque el correo es la cara del cliente), píldora
// de estado, titular centrado, la prima protagonista en banda pálida, las
// coberturas, la asistencia incluida y los planes opcionales resumidos
// (nombre, una línea y prima), requisitos, deducibles, píldora de WhatsApp.
// Un correo no es una página: tablas y estilos en línea, sin webfonts (Gmail
// cae a Arial / Courier New), sin flex ni SVG. Los dos logos son PNG con URL
// absoluta y viven en ESTE repo (img/): sin img/ salen rotos.
// =====================================================================
const EMAIL_IMG = 'https://hogarcomprensivo.appsegurosdigitales.com';
const _LC_F = "Arial,Helvetica,sans-serif";
const _LC_M = "'Courier New',Courier,monospace";

function buildEmailHTML(){
  const d=S.data, F=_LC_F, M=_LC_M;
  const nombre=(document.getElementById('fSaludo').value||'').trim() || (document.getElementById('fCliente').value||'').trim() || 'Estimado(a)';
  const incReq=document.getElementById('fIncReq').checked;
  const incAsist=document.getElementById('fIncAsist').checked;
  const nota=(document.getElementById('fNota').value||'').trim();
  const regla=`<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 10px"><tr><td bgcolor="#0D9488" style="background:#0D9488;width:28px;height:3px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
  const kicker=t=>`<p style="margin:0 0 12px;font-size:12px;font-weight:bold;color:#6B7681;letter-spacing:.02em">${t}</p>`;

  // --- prima protagonista + demás formas de pago visibles ---
  const pays=keptPayments();
  const lead=pays.find(p=>p.k==='anual')||pays[0];
  const otros=pays.filter(p=>p!==lead);
  const payRows=otros.map(p=>`<tr><td style="padding:9px 0;border-top:1px solid #EDEFF2;font-size:13px;color:#1B1F23">${PAY_LABEL[p.k]} <span style="color:#6B7681;font-size:11.5px">· ${PAY_HINT[p.k]}</span></td><td align="right" style="padding:9px 0;border-top:1px solid #EDEFF2;font-family:${M};font-size:13px;font-weight:bold;color:#1B1F23;white-space:nowrap">${fmtCRC(p.amt)}</td></tr>`).join('');
  const primaBlock=lead?`
  <tr><td bgcolor="#EEF4F9" style="background:#EEF4F9;padding:26px 28px 22px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border:1px solid #DADCE0;border-radius:20px"><tr><td style="padding:20px 22px 16px">
      <p style="margin:0 0 4px;font-size:12px;color:#6B7681">Prima del año, con IVA · pago ${PAY_LABEL[lead.k].toLowerCase()}</p>
      <p style="margin:0;font-family:${M};font-size:30px;font-weight:bold;color:#1B1F23;letter-spacing:-.02em;line-height:1.1">${fmtCRC(lead.amt)}</p>
      ${otros.length?`<p style="margin:14px 0 2px;font-size:12px;color:#6B7681">Otras formas de pago</p><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">${payRows}</table>`:''}
    </td></tr></table>
    <p style="margin:10px 0 0;font-size:11.5px;color:#6B7681;line-height:1.6">Cotización válida 15 días hábiles. El informe oficial del INS va adjunto con el detalle completo.</p>
  </td></tr>`:'';

  // --- coberturas ---
  const covList=visibleCoverages();
  const covRows=covList.map(c=>{ const info=COV[c.code];
    return `<tr><td style="padding:8px 0;border-top:1px solid #EDEFF2;font-size:13px;color:#5A6570;line-height:1.5"><b style="color:#1B1F23">${esc(info.nombre)}</b> — ${esc(info.linea)}</td></tr>`; }).join('');

  // --- asistencia: la incluida en una tarjeta y los planes opcionales resumidos ---
  const inc=asistIncluida();
  const optRows=asistOpcionales().map(p=>`<tr>
      <td style="padding:9px 0;border-top:1px solid #D3E8E4;vertical-align:top"><b style="font-size:13px;color:#1B1F23">${esc(p.n)}</b><div style="font-size:11.5px;color:#6B7681;line-height:1.45;margin-top:1px">${esc(p.d)}${p.monto?' '+esc(p.monto)+'.':''}</div></td>
      <td align="right" style="padding:9px 0 9px 12px;border-top:1px solid #D3E8E4;vertical-align:top;white-space:nowrap"><span style="font-family:${M};font-size:13px;font-weight:bold;color:#1B1F23">${fmtCRC(p.prima)}</span><div style="font-size:10.5px;color:#6B7681">al año + IVA</div></td></tr>`).join('');
  const asistBlock=`
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('ASISTENCIA')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #DADCE0;border-radius:16px"><tr><td style="padding:14px 16px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="font-size:14px;font-weight:bold;color:#1B1F23">${esc(inc.n)}</td>
        <td align="right"><span style="display:inline-block;background:#E9F5F0;color:#037D61;border-radius:999px;padding:4px 11px;font-size:11px;font-weight:bold;white-space:nowrap">&bull;&nbsp; Incluida</span></td></tr></table>
      <p style="margin:6px 0 0;font-size:12.5px;color:#5A6570;line-height:1.55">${esc(inc.d)}</p>
      <p style="margin:6px 0 0;font-size:12.5px;color:#1B1F23">Una llamada al <b>800-800-8001</b>, 24 horas, 365 días al año.</p>
    </td></tr></table>
    ${incAsist?`<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:16px;background:#EAF5F3;border-radius:20px"><tr><td style="padding:16px 18px 14px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="font-size:14px;font-weight:bold;color:#0D9488">Planes de asistencia que puede agregar</td>
        <td align="right"><span style="display:inline-block;background:#ffffff;border:1px solid #0D9488;color:#0D9488;border-radius:999px;padding:3px 10px;font-size:11px;font-weight:bold;white-space:nowrap">Nuevo &middot; opcionales</span></td></tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:6px">${optRows}</table>
      <p style="margin:10px 0 0;font-size:11px;color:#5A6570;line-height:1.55">${ASIST_FINE} Si le interesa alguno, dígamelo y lo incluyo en la póliza.</p>
    </td></tr></table>`:''}
  </td></tr>`;

  // --- requisitos ---
  const reqBlock = incReq ? `
  <tr><td style="padding:26px 28px 4px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#EEF4F9;border-radius:20px"><tr><td style="padding:18px 20px 16px">
      <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1B1F23">Si está de acuerdo, estos son los requisitos</p>
      <p style="margin:0 0 10px;font-size:12.5px;color:#5A6570;line-height:1.6">Para avanzar con su póliza, <b style="color:#1B1F23">complete y fírmeme los documentos que le adjunto en este correo</b> y devuélvamelos:</p>
      ${REQUISITOS.map(r=>`<p style="margin:0 0 4px;font-size:12.5px;color:#1B1F23;padding-left:14px;text-indent:-14px">&ndash;&nbsp; ${esc(r.nombre)}</p>`).join('')}
    </td></tr></table></td></tr>` : '';

  // --- deducibles ---
  const dedRows=Object.keys(d.deducibles).map(code=>{ const info=covInfo(code);
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #DADCE0;border-radius:14px;margin-bottom:8px"><tr><td style="padding:11px 14px">
      <p style="margin:0 0 3px;font-size:13px;font-weight:bold;color:#1B1F23">${esc(info.nombre)}</p>
      <p style="margin:0;font-size:12px;color:#5A6570;line-height:1.5;white-space:pre-line">${esc(d.deducibles[code])}</p></td></tr></table>`; }).join('');

  const waLink = waDigits()? ('https://wa.me/506'+waDigits()) : '#';
  const notaBlock = nota? `<tr><td style="padding:22px 28px 0"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#EEF4F9;border-radius:16px"><tr><td style="padding:14px 18px;font-size:13px;color:#1B1F23;line-height:1.6">${esc(nota).replace(/\n/g,'<br>')}</td></tr></table></td></tr>` : '';
  const consecTxt = d.consecutivo ? 'N.&ordm; '+esc(d.consecutivo) : 'Cotizaci&oacute;n';
  const fechaTxt = d.fecha ? ' &middot; '+esc(d.fecha) : '';

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(emailSubject())}</title></head>
<body style="margin:0;padding:0;background:#F4F7FA;font-family:${F};color:#1B1F23;-webkit-text-size-adjust:100%">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#F4F7FA;padding:26px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border:1px solid #DADCE0;border-radius:16px;max-width:600px">

  <!-- filete SDI + barra en dos niveles -->
  <tr><td style="padding:0;border-radius:16px 16px 0 0;overflow:hidden">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td width="25%" bgcolor="#0369A1" style="background:#0369A1;height:4px;font-size:0;line-height:0">&nbsp;</td>
      <td width="25%" bgcolor="#0D9488" style="background:#0D9488;height:4px;font-size:0;line-height:0">&nbsp;</td>
      <td width="25%" bgcolor="#EA580C" style="background:#EA580C;height:4px;font-size:0;line-height:0">&nbsp;</td>
      <td width="25%" bgcolor="#C9A227" style="background:#C9A227;height:4px;font-size:0;line-height:0">&nbsp;</td>
    </tr></table></td></tr>
  <tr><td style="padding:14px 26px;border-bottom:1px solid #EDEFF2">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td valign="middle"><img src="${EMAIL_IMG}/img/ins-logo-tinta.png" alt="Instituto Nacional de Seguros" width="120" height="28" style="display:block;border:0;width:120px;height:28px"></td>
      <td valign="middle" align="right" style="font-family:${M};font-size:11px;color:#6B7681;white-space:nowrap">${consecTxt}${fechaTxt}</td>
    </tr></table></td></tr>
  <tr><td style="padding:11px 26px;border-bottom:1px solid #EDEFF2">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td valign="middle" style="font-size:18px;font-weight:bold;color:#1B1F23;letter-spacing:-.02em">Hogar Comprensivo</td>
      <td valign="middle" align="right" style="font-size:12px;color:#6B7681">Seguro integral de hogar &middot; INS Costa Rica</td>
    </tr></table></td></tr>

  <!-- titular -->
  <tr><td align="center" style="padding:36px 34px 30px">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" style="margin:0 auto 18px"><tr>
      <td bgcolor="#E9F5F0" style="background:#E9F5F0;border-radius:999px;padding:7px 15px;font-size:12px;font-weight:bold;color:#037D61;white-space:nowrap">&bull;&nbsp; Cotizaci&oacute;n vigente 15 d&iacute;as h&aacute;biles</td></tr></table>
    <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:bold;color:#1B1F23;letter-spacing:-.02em">Su cotizaci&oacute;n de Hogar Comprensivo est&aacute; lista</h1>
    <p style="margin:14px auto 0;font-size:15px;line-height:1.6;color:#5A6570;max-width:440px">${esc(nombre)}, con mucho gusto le comparto la cotizaci&oacute;n de su seguro Hogar Comprensivo del INS: protege la estructura de su casa y mucho m&aacute;s, seg&uacute;n las coberturas elegidas.</p>
  </td></tr>

  ${primaBlock}

  <!-- coberturas -->
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('QU&Eacute; PROTEGE SU P&Oacute;LIZA')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">${covRows}</table></td></tr>

  ${asistBlock}
  ${reqBlock}

  <!-- deducibles -->
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('DEDUCIBLES POR COBERTURA')}
    ${dedRows||'<p style="margin:0;font-size:12.5px;color:#6B7681">Ver el detalle de deducibles en el PDF adjunto.</p>'}</td></tr>

  ${notaBlock}

  <!-- llamado a la acción -->
  <tr><td align="center" style="padding:26px 34px 8px">
    <p style="margin:0 0 14px;font-size:14px;color:#1B1F23">&iquest;Lista(o) para asegurar su hogar? Con gusto le explico cualquier detalle.</p>
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" style="margin:0 auto"><tr>
      <td bgcolor="#0369A1" style="background:#0369A1;border-radius:999px"><a href="${waLink}" style="display:inline-block;padding:14px 30px;font-family:${F};font-size:14.5px;font-weight:bold;color:#ffffff;text-decoration:none">Conversemos por WhatsApp &rarr;</a></td></tr></table>
  </td></tr>

  <!-- firma -->
  <tr><td style="padding:22px 28px 24px">
    <div style="border-top:1px solid #EDEFF2;padding-top:16px;font-size:12.5px;color:#5A6570;line-height:1.65">
      <b style="color:#1B1F23;font-size:13.5px">${esc(A('name'))}</b><br>
      Agente de seguros &middot; <span style="font-family:${M};font-size:11.5px">Lic. SUGESE ${esc(A('lic'))}</span><br>
      WhatsApp ${esc(A('wa'))} &nbsp;&middot;&nbsp; <a href="mailto:${esc(A('email'))}" style="color:#0369A1;text-decoration:none">${esc(A('email'))}</a>${A('web')?'<br>'+esc(A('web')):''}
    </div></td></tr>

  <!-- pie -->
  <tr><td bgcolor="#EEF4F9" style="background:#EEF4F9;padding:20px 28px;text-align:center;border-radius:0 0 16px 16px">
    <img src="${EMAIL_IMG}/img/sdi-logo-color.png" alt="Seguros Digitales SDI" width="92" height="32" style="display:block;border:0;width:92px;height:32px;margin:0 auto 10px">
    <p style="margin:0;font-size:12px;color:#5A6570">Cotizaci&oacute;n operada por <b style="color:#1B1F23">Seguros Digitales SDI</b> &middot; producto del <b style="color:#1B1F23">INS</b></p>
    <p style="margin:6px 0 0;font-size:10.5px;color:#6B7681">Esta estimaci&oacute;n provisional de primas no implica la aceptaci&oacute;n del riesgo.</p></td></tr>
</table></td></tr></table></body></html>`;
}

