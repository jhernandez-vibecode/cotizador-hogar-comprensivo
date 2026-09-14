/* Planes de asistencia INCLUIDOS con la póliza (dossier de asistencias del INS, sep 2026).
   Cada servicio es [nombre, eventos por año, límite por evento en colones]. T (Hogar Total)
   es gratis con V + D; S (Hogar Extendido) lo incluye y lo reemplaza. Copia literal del
   catálogo del cotizador raíz, solo los dos planes que puede traer una póliza. */
const ASIST_PLANES = [
  {k:'T', n:'Hogar Total', incluida:'Gratis al contratar las coberturas V + D',
   d:'Fontanería, electricidad, cerrajería y rotura de cristales, más un traslado a cita médica o al aeropuerto.',
   nota:'Traslados de hasta 40 km; cada tramo residencia–aeropuerto cuenta como un evento. Límite por evento en colones o su equivalente en dólares según la moneda del contrato.',
   s:[['Fontanería',3,26000],['Electricidad',3,26000],['Cerrajería',3,26000],['Rotura de cristales',3,26000],['Traslado a cita médica o aeropuerto',1,26000]]},
  {k:'S', n:'Hogar Extendido',
   d:'Los mismos servicios con el doble de límite, cuatro traslados, reparación de portones y destape de cañerías o instalación de grifería.',
   nota:'Fontanería y electricidad incluyen ₡15.000 adicionales para materiales. Incluye y reemplaza al plan Hogar Total: los eventos y límites no se acumulan.',
   s:[['Fontanería',3,52000],['Electricidad',3,52000],['Cerrajería',3,52000],['Rotura de cristales',3,52000],['Traslado a cita médica o aeropuerto',4,26000],['Reparación de portones',1,30000],['Destape de cañerías o instalación de grifería',2,26000]]}
];
function asistPlan(){ const codes=(S.data&&S.data.coberturas||[]).map(c=>c.code); return codes.indexOf('S')>-1?'S':'T'; }
function asistIncluida(){ const k=asistPlan(); return ASIST_PLANES.find(p=>p.k===k); }
function asistTitulo(){ return 'Asistencia incluida · '+asistIncluida().n; }
function asistLim(sv){ return sv[2]==null ? 'Sin límite' : sv[1]+' · '+fmtCRC(sv[2]); }
