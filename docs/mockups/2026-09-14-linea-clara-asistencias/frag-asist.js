/* ===== Planes de asistencia individuales del INS — Hogar Comprensivo =====
   Fuente: "Dossier Asistencias Individuales Hogar Comprensivo" del INS (sep 2026).
   Cada servicio es [nombre, eventos por año, límite por evento en colones];
   límite null = "Sin límite"; un solo elemento = servicio sin cifra (funerario).
   Las primas son ANUALES y NO incluyen el IVA (13 %) ni el recargo por
   fraccionamiento (así las publica el INS). Todos los planes nuevos exigen la
   cobertura V y son solo para la persona asegurada; se puede tomar más de uno.
   T (Hogar Total) es gratis con V + D; S (Hogar Extendido) lo incluye y lo
   reemplaza — nunca se suman eventos ni límites. */
const ASIST_PLANES = [
  {k:'T', code:'T', n:'Hogar Total', prima:0, incluida:'Gratis al contratar las coberturas V + D',
   d:'Fontanería, electricidad, cerrajería y rotura de cristales, más un traslado a cita médica o al aeropuerto.',
   nota:'Traslados de hasta 40 km; cada tramo residencia–aeropuerto cuenta como un evento. Límite por evento en colones o su equivalente en dólares según la moneda del contrato.',
   s:[['Fontanería',3,26000],['Electricidad',3,26000],['Cerrajería',3,26000],['Rotura de cristales',3,26000],['Traslado a cita médica o aeropuerto',1,26000]]},
  {k:'S', code:'S', n:'Hogar Extendido', prima:19754,
   d:'Los mismos servicios con el doble de límite, cuatro traslados, reparación de portones y destape de cañerías o instalación de grifería.',
   nota:'Fontanería y electricidad incluyen ₡15.000 adicionales para materiales. Incluye y reemplaza al plan Hogar Total: los eventos y límites no se acumulan.',
   s:[['Fontanería',3,52000],['Electricidad',3,52000],['Cerrajería',3,52000],['Rotura de cristales',3,52000],['Traslado a cita médica o aeropuerto',4,26000],['Reparación de portones',1,30000],['Destape de cañerías o instalación de grifería',2,26000]]},
  {k:'bienestar', n:'Salud Bienestar', prima:18000,
   d:'Orientación médica, psicológica y nutricional, clases en vivo y apoyo para el hogar: fumigación, jardinería y limpieza de canoas.',
   nota:'Las consultas virtuales duran máximo una hora.',
   s:[['Orientación médica telefónica',null,null],['Consulta psicológica virtual',2,30000],['Consulta nutricional virtual',1,15000],['Orientación nutricional telefónica',null,null],['Orientación farmacéutica',null,null],['Conexión con médicos, laboratorios, hospitales y clínicas',null,null],['Clases funcionales en vivo',4,15000],['Diseño de rutinas de ejercicio',1,25000],['Asesoría telefónica de viajes y turismo nacional',null,null],['Referencia de veterinarios',null,null],['Fumigación del hogar',1,35000],['Limpieza de tanque séptico',1,40000],['Limpieza de canoas',1,61000],['Jardinería (corte de césped)',1,20000],['Instalación de lámparas',1,41600],['Recarga de extintores (máx. 1)',1,10000]]},
  {k:'premium', n:'Salud Premium', prima:42000,
   d:'Visita médica a domicilio, especialistas, laboratorio, terapias, ambulancia y traslados, más bienestar y apoyo al hogar.',
   nota:'La orientación médica telefónica dura máximo 15 minutos.',
   s:[['Visita médica a domicilio',2,40000],['Consulta con especialista',1,45000],['Orientación médica telefónica',null,null],['Consulta psicológica presencial',2,30000],['Consulta nutricional presencial',1,25000],['Consulta nutricional telefónica',null,null],['Consulta farmacéutica',null,null],['Consulta y limpieza dental simple',1,30000],['Perfil lipídico',1,25000],['Exámenes de laboratorio generales',1,45000],['Rayos X o electrocardiograma',1,40000],['Terapias respiratorias a domicilio',2,25000],['Terapias físicas',2,25000],['Terapias alternativas avaladas por la OMS',2,25000],['Audiometría',1,15000],['Oftalmología',1,50000],['Traslado en taxi al hogar o centro de salud',2,26000],['Traslado en ambulancia por accidente o enfermedad',1,103500],['Conexión con médicos y clínicas',null,null],['Clases de yoga en vivo',4,15000],['Traslado residencia–aeropuerto',4,26000],['Fumigación del hogar',1,35000],['Recarga de extintores',1,10000],['Limpieza de tanque séptico',1,40000],['Limpieza de canoas',1,61000],['Instalación de lámparas',1,41600],['Jardinería (corte de césped)',1,20000],['Servicio doméstico',1,13500],['Asesoría de viajes y turismo',null,null],['Referencia de veterinarios',null,null]]},
  {k:'funerario', n:'Asistencia Funeraria', prima:10800,
   d:'Servicio funerario completo por fallecimiento de la persona asegurada: féretro, sala de velación, traslados y cremación o sepultura.',
   monto:'Hasta ₡500.000 (o $1.000) · 1 evento por año',
   nota:'Dentro del territorio nacional. Lo solicita el cónyuge o una persona mayor de edad que conviva con la persona asegurada.',
   s:[['Tanatopraxia: preparación del cuerpo para la velación'],['Féretro estándar'],['Sala de velación hasta 24 horas'],['Arreglo floral central y dos arreglos medianos'],['Traslado a la sala o domicilio, templo y cementerio'],['Gastos de cremación o sepultura'],['Café, refrescos y alimentación'],['Alquiler de sillas, altar y base para el féretro']]},
  {k:'vip', n:'VIP', prima:42000,
   d:'Enfermería domiciliar, renta hospitalaria, coach financiero y de ventas, asistencia legal para la empresa y mantenimiento del hogar.',
   s:[['Enfermería domiciliar por enfermedad',1,100000],['Renta diaria hospitalaria',1,67500],['Alquiler de equipo médico duradero',1,100000],['Exámenes médicos de laboratorio generales',1,50000],['Fisioterapia de descarga por deporte',3,43120],['Asistencias en eventos sociales',1,100000],['Guardería diurna de niño o niña',1,12000],['Coach financiero',1,30000],['Coach de ventas',1,70000],['Asistencia legal por robo en la sede de la empresa',2,122000],['Inspección de riesgos de incendio en la empresa',2,41600],['Traslado residencia–aeropuerto',4,26000],['Recarga de extintores del hogar',1,10000],['Limpieza de tanque de agua',1,45000],['Limpieza de tanque séptico',1,40000],['Limpieza de canoas',1,61000],['Instalación de lámparas',2,41600],['Fumigación del hogar',1,35000],['Jardinería',1,20000],['Pulido de focos',1,50000],['Lavado de vehículo',1,10000]]},
  {k:'tecnica', n:'Asistencia Técnica', prima:15000,
   d:'Técnico a domicilio para configurar TV, audio y video, redes y casa inteligente, e instalar o reparar electrodomésticos.',
   s:[['Configuración de TV y monitores',1,25000],['Servicio técnico de audio y video',1,25000],['Configuración de casas inteligentes',1,25000],['Asesoría de red inalámbrica',1,25000],['Instalación de electrodomésticos',1,25000],['Reparación de electrodomésticos',1,25000]]},
  {k:'mascota', n:'Mascota', prima:7200,
   d:'Veterinario de urgencia, vacunación, hotel, grooming, traslado en emergencia y apoyo para buscar a la mascota.',
   nota:'Para animales de compañía que conviven permanentemente en el hogar, sin fines comerciales.',
   s:[['Consulta veterinaria de urgencia',1,25000],['Vacunación y desparasitación',1,20000],['Traslado en emergencia',3,50000],['Grooming a domicilio o en centro',1,15000],['Hotel para mascotas',3,10000],['Paseo de mascotas domésticas',3,10000],['Alojamiento por hospitalización del titular',3,10000],['Cremación de mascota',3,50000],['Impresión de material POP para la búsqueda',3,25000],['Volanteo en la zona cercana al domicilio',1,25000],['Puja en redes sociales por pérdida',3,25000]]}
];
const ASIST_FINE = 'Primas anuales sin IVA (13 %) ni recargo por fraccionamiento. Se contratan junto con la póliza (requieren la cobertura V) y son solo para la persona asegurada; puede elegir más de un plan. Eventos por año · límite por evento; los eventos no usados no se acumulan.';
/* Plan según las coberturas leídas del PDF: 'S' extendida, si no 'T' básica (gratis con V+D) */
function asistPlan(){ const codes=(S.data&&S.data.coberturas||[]).map(c=>c.code); return codes.indexOf('S')>-1?'S':'T'; }
function asistIncluida(){ const k=asistPlan(); return ASIST_PLANES.find(p=>p.k===k); }
function asistOpcionales(){ const k=asistPlan(); return ASIST_PLANES.filter(p=>p.k!=='T' && p.k!==k); }
function asistTitulo(){ return 'Asistencia incluida · '+asistIncluida().n; }
function asistLim(sv){ if(sv.length<2) return ''; return sv[2]==null ? 'Sin límite' : sv[1]+' · '+fmtCRC(sv[2]); }
