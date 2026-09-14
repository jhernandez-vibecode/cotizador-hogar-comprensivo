// CORREO "PÓLIZA ACTIVA" · línea clara SDI (14 sep 2026), misma forma que el correo de
// cotización: filete + barra INS en tinta, píldora de estado, titular, tarjeta de
// confirmación, coberturas, asistencia incluida con sus límites, documentación,
// contactos de emergencia aislados, firma y pie SDI. Tablas y estilos en línea, sin
// webfonts. Los PNG viven en el repo raíz (img/), con URL absoluta.
const EMAIL_IMG = 'https://hogarcomprensivo.appsegurosdigitales.com';
const _LC_F = "Arial,Helvetica,sans-serif";
const _LC_M = "'Courier New',Courier,monospace";

function buildEmail(fixedOk){
  const d=S.data||{}, F=_LC_F, M=_LC_M;
  const nombre = saludoName() || 'cliente';
  const nota = ((document.getElementById('mNota')||{}).value||'').trim();
  const ubic = [d.provincia,d.canton].filter(Boolean).join(', ');
  const regla=`<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 10px"><tr><td bgcolor="#0D9488" style="background:#0D9488;width:28px;height:3px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
  const kicker=t=>`<p style="margin:0 0 12px;font-size:12px;font-weight:bold;color:#6B7681;letter-spacing:.02em">${t}</p>`;
  const covList = (d.coberturas||[]).filter(c=>COV[c.code] && c.code!=='T' && c.code!=='S'); // T/S = asistencia, va en su propia sección
  const covRows = covList.map(c=>{ const i=COV[c.code];
    return `<tr><td style="padding:8px 0;border-top:1px solid #EDEFF2;font-size:13px;color:#5A6570;line-height:1.5"><b style="color:#1B1F23">${esc(i.nombre)}</b> — ${esc(i.linea)}</td></tr>`; }).join('')
    || '<tr><td style="font-size:13px;color:#5A6570;padding:6px 0">Ver el detalle de coberturas en las Condiciones Particulares adjuntas.</td></tr>';
  const inc=asistIncluida();
  const svCell=sv=>sv?`<td width="50%" valign="top" style="padding:6px 8px 6px 0;border-top:1px solid #EDEFF2;font-size:12.5px;color:#1B1F23">${esc(sv[0])}<div style="font-family:${M};font-size:11px;color:#6B7681">${asistLim(sv)}</div></td>`:'<td width="50%"></td>';
  let svRows=''; for(let i=0;i<inc.s.length;i+=2){ svRows+='<tr>'+svCell(inc.s[i])+svCell(inc.s[i+1])+'</tr>'; }
  // documentación adjunta (según lo cargado + fijos)
  const bullets=[], _seen=new Set();
  const _lbl={particulares:'Condiciones Particulares de su póliza',comprobante:'Comprobante de pago',especial:'Condiciones especiales aplicables',otro:'Documento adjunto'};
  S.files.forEach(f=>{ const l=_lbl[f.kind]||'Documento adjunto'; if(!_seen.has(l)){ _seen.add(l); bullets.push(l); } });
  if(S.demo && !S.files.length) bullets.push('Condiciones Particulares de su póliza');
  const _fx = fixedOk || FIXED_DOCS.map(fd=>fd.file);
  if(_fx.some(n=>/Generales/i.test(n))) bullets.push('Condiciones Generales Hogar Comprensivo');
  if(_fx.some(n=>/Multiasistencia/i.test(n))) bullets.push('Condiciones de Multiasistencia Hogar');
  const docBullets = bullets.map(b=>`<p style="margin:0 0 4px;font-size:12.5px;color:#1B1F23;padding-left:14px;text-indent:-14px">&ndash;&nbsp; ${esc(b)}</p>`).join('');
  const vig=(d.vigDesde&&d.vigHasta)?(d.vigDesde+' → '+d.vigHasta):'';
  const notaBlock = nota? `<tr><td style="padding:22px 28px 0"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#EEF4F9;border-radius:16px"><tr><td style="padding:14px 18px;font-size:13px;color:#1B1F23;line-height:1.6">${esc(nota).replace(/\n/g,'<br>')}</td></tr></table></td></tr>`:'';
  const web=String(A('web')||'').replace(/^https?:\/\//,'');
  const derecha = d.poliza ? 'P&oacute;liza N.&ordm; '+esc(d.poliza) : 'P&oacute;liza activa';

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(subject())}</title></head>
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
      <td valign="middle" align="right" style="font-family:${M};font-size:11px;color:#6B7681;white-space:nowrap">${derecha}</td>
    </tr></table></td></tr>
  <tr><td style="padding:11px 26px;border-bottom:1px solid #EDEFF2">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td valign="middle" style="font-size:18px;font-weight:bold;color:#1B1F23;letter-spacing:-.02em">Hogar Comprensivo</td>
      <td valign="middle" align="right" style="font-size:12px;color:#6B7681">Seguro integral de hogar &middot; INS Costa Rica</td>
    </tr></table></td></tr>

  <!-- titular -->
  <tr><td align="center" style="padding:36px 34px 28px">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" style="margin:0 auto 18px"><tr>
      <td bgcolor="#E9F5F0" style="background:#E9F5F0;border-radius:999px;padding:7px 15px;font-size:12px;font-weight:bold;color:#037D61;white-space:nowrap">&bull;&nbsp; P&oacute;liza activa</td></tr></table>
    <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:bold;color:#1B1F23;letter-spacing:-.02em">Su p&oacute;liza Hogar Comprensivo ya est&aacute; activa</h1>
    <p style="margin:14px auto 0;font-size:15px;line-height:1.6;color:#5A6570;max-width:440px">${nombre?esc(nombre)+', es':'Es'} un gusto saludarle. Le confirmo que su p&oacute;liza${d.poliza?(' <b style="color:#1B1F23">N.&ordm; '+esc(d.poliza)+'</b>'):''}${ubic?(', que protege su propiedad en <b style="color:#1B1F23">'+esc(titleCase(ubic))+'</b>'):''}, ya se encuentra vigente.</p>
  </td></tr>

  <!-- datos de la póliza -->
  ${(vig||d.suma!=null)?`<tr><td bgcolor="#EEF4F9" style="background:#EEF4F9;padding:22px 28px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#ffffff;border:1px solid #DADCE0;border-radius:20px"><tr>
      ${d.suma!=null?`<td style="padding:18px 22px 16px;vertical-align:top"><p style="margin:0 0 4px;font-size:12px;color:#6B7681">Suma asegurada</p><p style="margin:0;font-family:${M};font-size:24px;font-weight:bold;color:#1B1F23;letter-spacing:-.02em;line-height:1.1">${esc(fmtCRC(d.suma))}</p></td>`:''}
      ${vig?`<td style="padding:18px 22px 16px;vertical-align:top" align="right"><p style="margin:0 0 4px;font-size:12px;color:#6B7681">Vigencia</p><p style="margin:0;font-family:${M};font-size:13px;font-weight:bold;color:#1B1F23;white-space:nowrap">${esc(vig)}</p></td>`:''}
    </tr></table></td></tr>`:''}

  <!-- coberturas -->
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('QU&Eacute; PROTEGE SU P&Oacute;LIZA')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">${covRows}</table></td></tr>

  <!-- asistencia incluida -->
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('ASISTENCIA INCLUIDA')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #DADCE0;border-radius:16px"><tr><td style="padding:14px 16px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="font-size:14px;font-weight:bold;color:#1B1F23">${esc(inc.n)}</td>
        <td align="right"><span style="display:inline-block;background:#E9F5F0;color:#037D61;border-radius:999px;padding:4px 11px;font-size:11px;font-weight:bold;white-space:nowrap">&bull;&nbsp; Incluida</span></td></tr></table>
      <p style="margin:6px 0 10px;font-size:12.5px;color:#5A6570;line-height:1.55">${esc(inc.d)} El INS coordina y paga el servicio; eventos por a&ntilde;o &middot; l&iacute;mite por evento.</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">${svRows}</table>
      <p style="margin:10px 0 0;font-size:11px;color:#6B7681;line-height:1.5">${esc(inc.nota)}</p>
    </td></tr></table></td></tr>

  <!-- documentación -->
  <tr><td style="padding:26px 28px 4px">${regla}${kicker('DOCUMENTACI&Oacute;N ADJUNTA')}${docBullets}</td></tr>

  <!-- emergencias: la única caja de su zona, cifras grandes en tinta -->
  <tr><td style="padding:26px 28px 4px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#EEF4F9;border-radius:20px"><tr><td style="padding:18px 22px 16px">
      <p style="margin:0 0 10px;font-size:14px;font-weight:bold;color:#1B1F23">Ante una emergencia en su hogar</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="vertical-align:top;padding-right:16px"><p style="margin:0;font-size:12px;color:#6B7681">Asistencia Hogar, 24 horas, 365 d&iacute;as</p><p style="margin:2px 0 0;font-family:${M};font-size:22px;font-weight:bold;color:#1B1F23;white-space:nowrap">800-800-8001</p></td>
        <td style="vertical-align:top" align="right"><p style="margin:0;font-size:12px;color:#6B7681">Central INS</p><p style="margin:2px 0 0;font-family:${M};font-size:22px;font-weight:bold;color:#1B1F23;white-space:nowrap">2287-6000</p></td>
      </tr></table>
      <p style="margin:10px 0 0;font-size:11.5px;color:#5A6570">Tambi&eacute;n por la App INS M&oacute;vil y WhatsApp.</p>
    </td></tr></table></td></tr>

  ${notaBlock}

  <!-- firma -->
  <tr><td style="padding:26px 28px 24px">
    <div style="border-top:1px solid #EDEFF2;padding-top:16px;font-size:12.5px;color:#5A6570;line-height:1.65">
      Quedo a su entera disposici&oacute;n para cualquier consulta. Atentamente,<br>
      <b style="color:#1B1F23;font-size:13.5px">${esc(A('name'))}</b><br>
      Agente de seguros exclusivo &middot; Instituto Nacional de Seguros<br>
      <span style="font-family:${M};font-size:11.5px">Lic. SUGESE ${esc(A('lic'))}</span> &nbsp;&middot;&nbsp; WhatsApp ${esc(A('wa'))}<br>
      <a href="mailto:${esc(A('email'))}" style="color:#0369A1;text-decoration:none">${esc(A('email'))}</a>${web?(' &nbsp;&middot;&nbsp; '+esc(web)):''}
    </div></td></tr>

  <!-- pie -->
  <tr><td bgcolor="#EEF4F9" style="background:#EEF4F9;padding:20px 28px;text-align:center;border-radius:0 0 16px 16px">
    <img src="${EMAIL_IMG}/img/sdi-logo-color.png" alt="Seguros Digitales SDI" width="92" height="32" style="display:block;border:0;width:92px;height:32px;margin:0 auto 10px">
    <p style="margin:0;font-size:12px;color:#5A6570">Plataforma de <b style="color:#1B1F23">Seguros Digitales SDI</b> &middot; producto del <b style="color:#1B1F23">INS</b></p>
    <p style="margin:6px 0 0;font-size:10.5px;color:#6B7681">&copy; 2026 &middot; Registro SUGESE G06-44-A01-142</p></td></tr>
</table></td></tr></table></body></html>`;
}

