---
name: especialista-cotizador-hogar-comprensivo
description: ESPECIALISTA COTIZADOR HOGAR COMPRENSIVO — Cotizador del seguro Hogar Comprensivo del INS (incendio/hogar integral, registro SUGESE G06-44-A01-142), bajo marca Seguros del INS (Seguros Digitales SDI, propiedad de Juan Carlos Hernández). Single-file HTML/CSS/JS vanilla en Netlify desde repo jhernandez-vibecode/cotizador-hogar-comprensivo. EN PROD en hogarcomprensivo.appsegurosdigitales.com. A diferencia de los otros cotizadores, el agente CARGA el PDF de la cotización del INS ("Informe de Estimación Provisional de Primas", paquete Intermediarios) y la app lo procesa: extrae datos con pdf.js (cliente, ubicación, coberturas con primas, deducibles, formas de pago), permite elegir con toggles qué formas de pago mostrar (por defecto Anual/Semestral/Trimestral; oculta Cuatrimestral/Bimestral/Mensual/Deducción Mensual) y REDIBUJA con pdf-lib la tabla de pagos limpia y contigua en el PDF, presenta un resumen del seguro (coberturas + deducibles por cobertura + sección adaptable de Multiasistencia Hogar 800-800-8001) y arma un correo HTML (solo texto+color, sin imágenes) con el saludo por nombre, los requisitos y 5 documentos adjuntos, que se envía por Gmail API (mismo Client ID que Cotizador Autos/Vital/INS Medical). Multi-agente vía ⚙️ Settings en localStorage (cada agente personaliza remitente, firma, licencia y WhatsApp). Módulo de Estadísticas/control de lo cotizado (localStorage) con ciclo de vida Pendiente→Agendada→Concretada/Desechada, KPIs, conversión, filtros, búsqueda y seguimiento por WhatsApp/correo. El repo incluye además el módulo /poliza/ (Envío de Póliza Activa, EN PROD desde 20 jul 2026): gemelo del /polizas-activas/ de autos, para pólizas Hogar YA EMITIDAS — el agente carga las Condiciones Particulares (forma 081_81B, DOS layouts: viejo con % y prima, nuevo jul-2026 solo suma), extrae con pdf.js (detecta cobertura S de Multiasistencia Extendida), adjunta 2 documentos fijos genéricos (Condiciones Generales V17 + Multiasistencia en /emision/) + condiciones especiales/comprobante que cargue el agente, y envía un correo de póliza activa con resumen de coberturas + Multiasistencia destacada (6 básico / 9 extendido). Datos de clientes reales fuera de git (.gitignore). Usar este skill cuando JC pida cualquier cambio, bug o mejora al Cotizador Hogar Comprensivo O al módulo de envío de póliza (/poliza/): extracción del PDF (cotización o póliza emitida), limpieza/toggles de formas de pago, coberturas, deducibles, beneficios de asistencia, plantilla de correo, requisitos/documentos adjuntos, documentos fijos de emisión, módulo de estadísticas, multi-agente o branding del encabezado.
---

# Especialista Cotizador Hogar Comprensivo

Contexto completo del proyecto para retomar sin perder contexto. Leer COMPLETO antes de tocar código. SIEMPRE entregar el código modificado completo en la conversación para que JC lo copie/pegue, o usar el flujo de commit directo (`gh` ya autenticado como jhernandez-vibecode).

## Qué es

Cotizador del **seguro Hogar Comprensivo del INS** (incendio/hogar integral), operado por JC bajo la marca **Seguros del INS** (segurosdelins.com / Seguros Digitales SDI). Registro **SUGESE G06-44-A01-142** (V16/V17 según versión del PDF). Hermano de los cotizadores de Autos, Vital 360, INS Medical y Plenisalud, pero con una diferencia clave:

**El agente NO cotiza adentro de la app: COTIZA en el portal del INS, descarga el PDF y lo CARGA acá.** La app extrae los datos, limpia las formas de pago, explica el seguro y arma el correo al cliente con la cotización + los requisitos adjuntos.

Flujo: **Cargar PDF → extraer → revisar y elegir formas de pago → resumen (coberturas/deducibles/asistencia) → correo → enviar por Gmail → control de lo cotizado (📊)**.

## Estado actual (20 jul 2026)

- **EN PROD:** [hogarcomprensivo.appsegurosdigitales.com](https://hogarcomprensivo.appsegurosdigitales.com) (auto-deploy Netlify desde `main`)
- **Repo:** [jhernandez-vibecode/cotizador-hogar-comprensivo](https://github.com/jhernandez-vibecode/cotizador-hogar-comprensivo) (PÚBLICO)
- **Repo local:** `C:/Users/segur/cotizador-hogar-comprensivo` (es git repo con remote `origin`; `gh` autenticado)
- **Docs fuente del producto:** `C:/Users/segur/Cotizador Hogar Comprensivo/` (Condiciones Generales 76pp, Condiciones Multiasistencia 9pp, solicitud, tarifas xlsx, 4 condiciones especiales INC-02/03/04/06, 5 PDF de requisitos, y la carpeta `mockups/` con los 3 mockups + mockup-asistencia)
- **PDFs de cotización de ejemplo (para calibrar):** `C:/Users/segur/Downloads/COTIZACIÓN SEGURO HOGAR COMPRENSIVO (1).pdf` (3 formas, cliente KOMAILIZADEH — apellido primero) y `InformeCotización (1).pdf` (7 formas, MARIA PAULA BECERRA — nombre primero)
- **Preview local:** entrada `hogar-comprensivo` en `~/.claude/launch.json` → `npx serve C:/Users/segur/cotizador-hogar-comprensivo -p 9020`. Sirve el repo COMPLETO, así que funcionan los adjuntos de `requisitos/`, los docs fijos de `emision/` y el módulo `/poliza/` sin copiar nada. (La vieja entrada `hogar-mockups` en `C:/tmp/hogar-mockups` puerto 8990 es solo para los mockups.)
- **Diseño (decisión 22 jun):** de los 3 mockups en `mockups/` JC eligió **B · Espacio de trabajo** — split-screen (columna izquierda 420px + panel 902px) con vista previa en vivo de "Documento limpio" y "Correo al cliente", coberturas en bento. A (wizard) y C (documento editorial) descartados. Botón **"Ver con datos de ejemplo"** (`loadDemo`) para previsualizar la app sin subir PDF.

## Módulo `/poliza/` — Envío de Póliza Activa (20 jul 2026, EN PROD — commits `0aa2764` feat, `ee06add` fix, `c898590` docs)

Segundo módulo del repo, **gemelo del `/polizas-activas/` del cotizador de autos**, pero para pólizas Hogar YA EMITIDAS (no cotizaciones). URL: `hogarcomprensivo.appsegurosdigitales.com/poliza/`. Acceso desde el header del cotizador (botón **📨** que agregué en `index.html` raíz).

- **Single-file:** `poliza/index.html` (autónomo; Hogar no tiene `js/` compartido como autos, así que reutilicé VERBATIM las funciones del cotizador raíz: `getToken/gmailSend/buildMIMEMulti/u8ToB64/wrap76/b64url/enc2047/encFrom`, `COV`, `ASIST`/`asistPlan`, `esc/parseAmount/fmtCRC`, perfil de agente `A()`/`agent()` leyendo el MISMO `hogar_agent` de localStorage — mismo dominio = perfil compartido). Sin pdf-lib (no redibuja nada), sin módulo de estadísticas.
- **Flujo (4 pasos):** Cargar Condiciones Particulares (+ condiciones especiales/comprobante opcionales) → Revisar datos → Redactar correo → Enviado.
- **Documentos:** el agente CARGA por póliza las **Condiciones Particulares** (fuente de extracción) + cualquier **condición especial** (gas/solar/VE/desocupado) + **comprobante de pago** — todos se adjuntan. Son **FIJOS** (siempre, genéricos) 2 docs en `/emision/`: `condiciones-generales-v17.pdf` + `condiciones-multiasistencia.pdf`. Base = 3 adjuntos.
- **Saludo:** mismo criterio que el cotizador (3 set 2026) — `fSaludo` (paso 2) y `mSaludo` (paso 3) arrancan con el **nombre completo** y el agente recorta; vacío cae al nombre completo del cliente. `firstName()` ELIMINADA de este archivo también. **`esSociedad()` sigue vigente**: las sociedades van sin nombre ("Estimado(a) cliente"). El aviso de la etiqueta usa `hidden sm:inline` porque el campo vive en una fila de dos columnas y en celular descuadraba los inputs.
- **Correo "póliza activa":** confirmación (VIGENTE + vigencia + suma) → **resumen de coberturas** → **Multiasistencia destacada** (6 básico / 9 extendido según cobertura S) → documentación adjunta → 800-800-8001 → firma + pie SDI. Solo texto+color, sin imágenes.
- **Extracción — OJO, formato DISTINTO de la cotización:** calibrada a las **"Condiciones Particulares" forma 081_81B**. `pageLines` agrupa por Y; `extractFromRows` con regex validados contra PDF real. `CUR='[¢₡]'` literal (funciona en navegador UTF-8; NO probar en heredoc de bash, corrompe los glifos → usar archivo con Write). `titleCase` es Unicode-aware (`\p{L}`, no `\b` ASCII) para no romper acentos. Códigos válidos: V,Y,X,D,H,K,M,P,T,S.
- **⚠️ HAY DOS LAYOUTS 081_81B (el INS los mezcla por fecha de emisión):**
  - **Viejo (feb 2026, ej. ANIRO):** tabla "Detalle de Coberturas" con **% de participación + Suma + Prima**; fila `V: D.D Bienes Inmuebles 0.00000% ¢145 000 000 ¢70 398`; tomador `Nombre del Tomador:`; `Estado de la póliza:`; NO trae correo del cliente; rubro `01- Residencia ¢… N Reposición`.
  - **Nuevo (jul 2026, ej. BARRANTES):** tabla "**Coberturas y sumas aseguradas**" con **SOLO Suma (sin % ni prima)**; fila `V: D.D Bienes Inmuebles ¢95 000 000` y `S: Multiasistencia Hogar Ext. ¢0.00`; tomador `Asegurado:` + `N° de Identificación:` (con "de"); `Distrito:` y `Tipo de Ocupación:` en filas separadas; SÍ trae correo del cliente (`Correo electrónico:`) → autocompletado. NO trae "Forma de pago" (ese campo no existe en este layout).
  - **Regla de oro:** detectar coberturas por CÓDIGO exigiendo solo un monto `¢/₡` (NO exigir `%`). Con `%`: prima=último ₡, suma=penúltimo. Sin `%`: el ₡ es la suma, prima=null. **Bug histórico (20 jul):** exigir `%` perdía la fila S del formato nuevo → mostraba asistencia básica en pólizas con extendida. Las tarjetas de coberturas del correo excluyen T/S (van en la sección de asistencia). También tolera el "Duplicado de Póliza" (códigos `8VV-V:`/`81D-D:`/`81X-S:`).
- **Privacidad (repo PÚBLICO):** `.gitignore` excluye `Documentos emision/` (carpeta de trabajo de JC con Duplicados y condiciones especiales que llevan datos de clientes reales) y `_localtest/`. El `loadDemo()` usa datos FICTICIOS (nunca clientes reales). NUNCA commitear PDFs con datos de clientes ni hardcodear su PII.
- **Hardening post-revisión adversarial (workflow, 20 jul):** reset de `S.files/S.data/S.sent` en recarga de paso 1 (anti-duplicados); `removeFile` limpia `S.data` si se quita la fuente; `doSend` exige un `kind==='particulares'`; paso 4 gateado por `S.sent`; lista de adjuntos del correo refleja lo realmente enviado (incluye `otro`, respeta docs fijos que fallen); `buildMIMEMulti` sanea CRLF en headers `From`/`To` (anti-inyección).
- **OAuth:** `/poliza/` es MISMO origen que el cotizador → el origin ya está registrado, no hay que tocar Google Cloud.
- **Muestras reales para calibrar (NO en el repo):** `C:/Users/segur/Downloads/0101IMR000492402_081_81B_Cond_Part_Incendio_Hogar_Comprensivo_Col_20260202_145936.pdf` (ANIRO, layout VIEJO) y `C:/Users/segur/OneDrive/…/Barrantes…/0101IMR003078800_081_81B_…pdf` (BARRANTES, layout NUEVO; también hay `Documentos emision/0101IMR003078800_Duplicado_…pdf`). Mockup: `Cotizador Hogar Comprensivo/mockups/mockup-envio-poliza.html`.

## Stack

- **HTML + CSS + JS vanilla single-file** (`index.html`). Sin frameworks, sin build, sin Node, sin npm.
- CDN: **Tailwind**, Google Fonts **Sora** (títulos) + **Inter** (cuerpo), **pdf.js** 3.11.174 (extracción), **pdf-lib** 1.17.1 (limpieza/redibujo del PDF), **Google Identity Services** (envío Gmail).
- **Client ID OAuth compartido** con Autos/Vital/INS Medical: `255791314248-apgnrs0tiii72ogau5dpsjm2eie6d2hu.apps.googleusercontent.com` (proyecto Google Cloud "Cotizador Autos SDI"). Scope `gmail.send`.
- **localStorage:** `hogar_agent` (perfil del agente), `hogar_hist_v2` (historial/estadísticas).
- **Paleta:** navy `#0c2340` · blue `#0369a1` · green `#16a34a` / `#10b981` · teal `#0e7490`. Vars CSS `--navy/--blue/--green/--green-2/--line/--muted/--ink`. Clase `.grad-bar` (navy→blue→verde).
- **Favicon:** `favicon.png` (512) + `favicon.ico` + apple-touch-icon — escudo con llama (navy/verde/naranja). theme-color `#0c2340`.

## El PDF de cotización del INS (fuente de extracción)

Título: **"INFORME DE ESTIMACIÓN PROVISIONAL DE PRIMAS"**, paquete **"Hogar Comprensivo- Intermediarios"**, 2 páginas (595×842).

- **Página 1:** "Estimado (a)" + NOMBRE en mayúsculas (NOMBRE primero, ej. "MARIA PAULA BECERRA GONZALEZ"); `Consecutivo: CT-TMP-AAAA-NNNNNNNN`; Fecha de Estimación; Identificación (cédula); Tipo de Vigencia; Paquete; Vigencia Desde/Hasta; `Intermediario: 1101130 HERNANDEZ VARGAS JUAN CARLOS` (código INS de JC); Ubicación (Provincia/Cantón/Distrito); Moneda/Ocupación/Tipo Tarifa; tabla **Montos Asegurados** (Rubro/Suma/Coaseguro/Base Valoración); tabla **Detalle de Coberturas** (código + Participación% + Suma + Prima); **Detalle de Deducibles** (bloques de texto por cobertura).
- **Página 2:** Extensión de cobertura (sublímites), Protección contra la inflación, **Primas Según Formas de Pago**, registro SUGESE.
- **NO trae correo ni teléfono del cliente** → el agente los escribe a mano en la app.
- Montos: separador de miles con ESPACIO y glifo `¢` (a veces `₡`). `parseAmount()` quita todo lo no-dígito.
- Etiquetas de pago reales: ANUAL, SEMESTRAL, **CUATRIMESTRAL**, TRIMESTRAL, **BIMESTRAL** (¡no "Bimensual"!), MENSUAL, **DEDUCCION MENSUAL** (sin tilde). El regex acepta BIMESTRAL|BIMENSUAL y DEDUCCI[OÓ]N.
- Las coberturas VARÍAN por cotización (un ejemplo trae V/X/D/S; otro V/D/S). Hay filas "Recargo Fraccionamiento Prima" e "I.V.A." que NO son coberturas (se excluyen por no tener formato `^[A-Z]:`).
- **Cifras de control del PDF de 3 formas (KOMAILIZADEH), para verificar que no se rompió la extracción:** coberturas V 109 238 · X 4 855 · D 373 086 · S 19 754; I.V.A. 65 901; pagos Anual 572 834 · Semestral 309 332 · Trimestral 158 962; `rowsToRemove=[]` (ese PDF ya viene solo con las 3 formas, así que la limpieza no quita nada).

### 🔴 SON DOS FORMATOS: el compacto de set 2026 (arreglado el 3 set 2026)

El INS reimprimió el informe **más compacto** (letra **7,8 pt** en vez de 9,6 pt, paso de fila 12,19 pt en vez de 15,01, párrafo de venta "Hogar Comprensivo: una protección flexible…" al inicio y encabezado de color en la página 2). Muestra: `_localtest/nuevo-sep.pdf` (BELLAVITA HERRERA, `CT-TMP-2026-16917822`, intermediario 1101290 Fernando). Tres trampas, las tres ya contempladas en el código:

1. **La tabla de formas de pago se PARTE entre páginas:** la fila **ANUAL** queda al pie de la página 1 (y=57,3) y SEMESTRAL…DEDUCCION MENSUAL arrancan en la 2. El código viejo leía solo la página 2 → **la anual no se extraía** (síntoma que reportó el agente). Hoy `extractHogar` recorre TODAS las páginas y guarda `d.payRows[k] = {page, y, size, labTxt, amtTxt, labX/labR/labCX, amtX/amtR/amtCX}`.
2. **Las filas de asistencia usan PUNTO:** `T. Multiasistencia Hogar` y `S. Multiasistencia Extendida` (las otras siguen con `V:` / `D:`). Con el regex viejo `^([A-Z]):` se perdía la **S** → el correo mandaba la asistencia básica (6 servicios) a un cliente que paga la extendida (¢19 754, 9 servicios). Mismo bug que el de `/poliza/` en jul 2026. Hoy el regex acepta `[:.]` y exige que la fila traiga un monto.
3. **El corte de deducibles:** en este formato la página 1 sigue con "Recargos y Descuentos", "Extensión de cobertura", "Otras condiciones" y hasta la tabla de pagos, y todo eso se pegaba al deducible de V. Hoy el bloque corta al ver cualquiera de esos títulos.

Además, cuando vienen **T y S juntas** se muestra solo la S (`covsToShow()`): el Plan Extendido incluye el básico y si no el correo repite la asistencia dos veces.

Cifras de control del formato nuevo: Anual **153 508** · Semestral 82 895 · Cuatrimestral 56 281 · Trimestral 42 599 · Bimensual 28 643 · Mensual 14 449 · Deducción 12 787; coberturas T ¢0 · V 27 188 · D 88 906 · S 19 754; I.V.A. 17 660; suma ¢56 000 000.

## Funciones clave en index.html

**Extracción** — `extractHogar(arrayBuffer)`:
- `pageLines(page, tol)` agrupa items por Y (transform[5]) → filas con `.text`.
- Campos por regex sobre el texto unido. OJO: las filas de DOS columnas (Paquete, Ocupación, Distrito, Intermediario, Tipo Tarifa) se colapsan a una línea con espacios simples → usar `[^\n]+` como borde, NO `\s{2,}`.
- Coberturas: filas que matchean `^([A-Z]):\s` → `{code, suma, prima}`.
- Deducibles: bloques de texto por código (`^([A-Z])\s*-\s*`).
- Pagos pág 2: guarda `d.payments[k]=monto` y `d.payY[k]=Y` (bottom-up) por cada forma presente.

**Toggles de pago + limpieza del PDF:**
- `PAY_ORDER`, `PAY_DEFAULT_ON=['anual','semestral','trimestral']`, `S.payToggles`.
- `keptPayments()` = presentes con toggle ON; `computeRowsToRemove()` = presentes con toggle OFF.
- `buildCleanPDF()`: si hay filas ocultas, **redibuja** la tabla con pdf-lib — borra el cuerpo (rectángulo blanco) y reescribe SOLO las visibles, contiguas (Helvetica, etiqueta centrada x≈185, monto alineado derecha x≈444, pitch 15pt, `topY=max(payY)`). Si no hay nada que ocultar, devuelve el PDF sin tocar. Evita huecos cuando se oculta una fila intermedia (ej. Cuatrimestral).

**Coberturas / deducibles:** dict `COV` (V/Y/X/D/H/K/M/P/T/S → icono+nombre+línea). `renderDoc()` arma el resumen; `renderCoverages()` el bento.

**Asistencia (adaptable):** const `ASIST` (9 servicios, `ext:true` = solo Plan Extendido S). `asistPlan()` lee coberturas: 'S' → 9 servicios (extendida), si no 'T' → 6 (básica gratis). `asistList()`/`asistTitulo()`. Línea **800-800-8001** 24/7. Se muestra en el resumen (`#docAsist`) y en el correo (`asistBlock`) como **tarjeta con header degradado + grilla de 2 columnas** (ícono+nombre+descripción; en el correo se arma con tablas anidadas para Gmail). **Orden (correo y resumen): coberturas → ASISTENCIA → formas de pago → deducibles.**

**Correo** — `buildEmailHTML()`: HTML email-friendly (tablas anidadas, estilos inline, SIN imágenes). Saludo = `fSaludo` (editable) o `firstName()` (PRIMER token, porque el INS pone el nombre primero). Bloques: header, saludo, "¿Qué protege?", formas de pago (solo visibles), **requisitos** (`reqBlock`, checkbox `fIncReq` default ON), asistencia, deducibles, nota, CTA WhatsApp (`wa.me`), firma del agente, pie "Seguros Digitales SDI · producto del INS".
- `REQUISITOS` (5 docs en `requisitos/`) + `fetchRequisitos()` + `buildMIMEMulti()` → adjunta cotización limpia + 5 PDF = **6 adjuntos** (~5MB de MIME, cómodo bajo el tope de 25MB de Gmail).
- **Documentos personalizados por agente (15 jul 2026):** los slots `key:'deber'` (#2 Deber de Información) y `key:'previa'` (#3 Información Previa) de `REQUISITOS` se pueden **sobrescribir por agente**. En ⚙️ Settings hay 2 casillas de carga (`DOCS_PERSONALIZABLES`); el PDF se guarda base64 en `hogar_agent.docs[key]={name,size,b64}` (tope `DOC_MAX_BYTES`=1.5MB, solo PDF, con try/catch de cuota en `saveSettings`). `fetchRequisitos()` usa `agentDoc(key)` si existe (helper `b64ToU8`), si no cae al genérico del repo → siguen siendo **6 adjuntos, mismo filename**. Staging `DOCS_STAGE` + `onDocPick/clearDoc/renderDocSlot`. El chip de adjuntos muestra "· N personalizado(s)" vía `personalizedCount()`. El genérico del repo se queda como fallback (agente nuevo que no sube nada manda el blanco).
- Envío: `getToken()` (GIS) → `gmailSend(raw)`.

**Multi-agente:** `A(k)` lee `hogar_agent` de localStorage con fallback a `CFG.DEFAULTS` (JC). `openSettings()/saveSettings()` (⚙️). `#agentNudge` = banner de bienvenida si no hay perfil. TODO sale personalizado: remitente, firma, licencia, WhatsApp, pie del documento, historial.

**Estadísticas (📊):** `hogar_hist_v2` (el botón 📊 del header reemplazó al viejo 🕘). `saveHistorySend()` registra cada envío. Campos de la entrada: `id/date/client/email/cedula/consec/suma/anual/estado/citaFecha/confirmed/followUpAt/followUpDismissed/waCliente/agentName`. Ciclo de vida `histEstado` (pendiente/agendada/concretada/desechada). `computeHistStats` (Enviadas/Agendadas/Concretadas/Desechadas/Conversión%). `groupHistByMonth`, búsqueda (`histMatches`: cliente/cédula/consecutivo/email, tolerante sin tildes), filtros (Todas/⭐Alto valor≥₡100M sobre suma asegurada/⏳Para seguir +3d), orden embudo. Seguimiento: `buildWaFollowHogar()` (WhatsApp, **web.whatsapp.com/send** no wa.me) + `sendFollowUpHogar()` (correo, `buildFollowHogarEmail` + `buildMIMEMulti` sin adjuntos). Badge `#statsBadge` = #seguimientos pendientes.

**Respaldo del historial (16 jul 2026, EN PROD, commit `1dfb536`):** botones **⬇ Respaldar / ⬆ Importar** (JSON) en el pie del modal de Estadísticas + aviso ámbar. La importación **deduplica por `id`**, ordena por `date` descendente y **respeta `HIST_MAX`=100 avisando cuántas quedan fuera** en vez de truncar en silencio. Nació porque CCleaner le borró `hogar_hist_v2` a JC junto con el localStorage de todos los proyectos SDI: **el localStorage NO es fuente de la verdad, hay que respaldar.**

## Coberturas Hogar Comprensivo (referencia)

Básicas: **V** Daño Directo Bienes Inmuebles (estructura), **Y** Contenido c/robo, **X** Contenido s/robo (Y y X excluyentes). Adicionales: **D** Convulsiones de la Naturaleza (participación 0/10/20%), **H** Pérdida de Rentas, **K** Responsabilidad Civil, **M** Riesgos del Trabajo Hogar (solo colones), **P** Accidentes Personales. Servicios: **T** Multiasistencia Hogar (gratis con V+D), **S** Multiasistencia Hogar Extendida (prima adicional). Valuación: Reposición o Real Efectivo. Aseguramiento: 100% o Coaseguro 80%.

## Beneficios de Multiasistencia (del contrato)

Básicos (Plan Hogar Total, Cobertura T gratis): Fontanería, Cerrajería, Electricidad, Rotura de cristales, Traslado a cita médica, Traslado al aeropuerto. Extendido (Cobertura S, suma): Destape de cañerías, Reparación de portones eléctricos, Instalación de grifería + materiales menores en Fontanería/Electricidad (₡15.000/evento) + más eventos. Acceso 24/7 al **800-800-8001** (365 días), App INS Móvil, WhatsApp.

## Branding (decisión 8 ago 2026 — REEMPLAZA la del 22 jun)

🔴 **La decisión del 22 jun ("el encabezado dice Seguros del INS") quedó SIN EFECTO.** El 8 ago, con las dos opciones a la vista en un mockup, JC eligió la del kit: **en las herramientas del agente manda Seguros Digitales SDI y las dos marcas no compiten en el mismo bloque.**

- **Encabezado del cotizador y de `/poliza/`:** **logotipo SDI oficial** (kit v1.2, variante `08-header`: wordmark blanco + barra en los 4 colores, INLINE y vectorizado) + separador + título + bajada ("Cotización y envío al cliente" / "Hogar Comprensivo"), y **filete de marca** de 4 px abajo (`.filete-sdi`, proporción 60/25/10/5 — lo único que trae el dorado). Ya **no** aparece "Seguros del INS" en el encabezado ni en el `<title>`.
- **El INS sigue nombrado** en el cuerpo de la app ("el seguro integral de hogar del INS") y sobre todo en el **correo al cliente**, que conserva intacto su pie "Seguros Digitales SDI · producto del INS". Esa es la cara que ve quien paga.
- **Tipografía (tanda 2 del `PLAN-TIPOGRAFIA.md` del kit):** **Poppins** en títulos (`h1..h4`, `.font-head`, `.btn` de poliza), **Inter** en el cuerpo, **JetBrains Mono** en las cifras (clase `.cifra` + `.stats-kpi-num`): primas, suma asegurada y consecutivo. Sora salió del repo por completo. En el **correo** el único cambio fue el nombre de la familia declarada (`'Sora'` → `'Poppins'`): Gmail no carga webfonts, el cliente ve **siempre** el fallback Arial, y se renombró para que la vista previa dentro de la app siga mostrando la letra de marca.
- **`.grad-text` ELIMINADO** de los dos archivos: el título del encabezado usaba `background-clip:text` sobre un degradado, un truco que en algunos navegadores deja **el texto invisible**. Ahora va en blanco sólido (aprobado por JC en el mismo mockup). No reintroducirlo.
- **Favicon:** se queda el escudo con la llama. Cada app de JC lleva el suyo para distinguirlas entre pestañas; el favicon del kit es para avatares y redes de la empresa.
- Nunca inventar escudos INS/SDI — usar los 8 archivos oficiales de `C:\Users\segur\SDI-BRAND-KIT`.

### 🔴 El encabezado en celular — no volver a romperlo

Este header lleva **muchos elementos en una sola fila** (logo, texto, stepper, 3 botones, datos del agente, avatar), así que en 375 px el espacio no alcanza para todos. Estado medido:

| | Original (casita) | Con `whitespace-nowrap` | Solución adoptada |
|---|---|---|---|
| Alto | 94 px (título en **3 líneas**) | 64 px | **64 px** |
| Desborde | no | **el avatar 148 px fuera de pantalla** | no |

La salida fue poner el bloque de texto en **`hidden sm:block`**, la misma convención que este header ya usaba para el stepper (`hidden lg:flex`) y los datos del agente (`hidden md:block`): en celular quedan logo + botones + avatar, y desde 640 px vuelve el texto en una línea. **Lección: una solución de layout NO se copia de otra app sin volver a medirla** — el `whitespace-nowrap` que arregló el encabezado de Asistencia Viajero rompió este, porque acá comparten fila muchos más elementos.

## Reglas y decisiones operativas

1. **Limpieza de pagos = REDIBUJO**, no tapar filas sueltas (deja la tabla contigua y profesional).
2. **Defaults de pago:** Anual/Semestral/Trimestral ON; el resto OFF. El agente puede cambiar cualquiera con los toggles.
3. **Correo solo texto + color, SIN imágenes** (Gmail bloquea imágenes de dominios nuevos — regla SDI).
4. **Saludo con el NOMBRE COMPLETO** (decision de JC, 3 set 2026): el INS no manda un orden fijo — a veces nombre primero (MARIA PAULA BECERRA) y a veces apellidos primero (BELLAVITA HERRERA CARLOS ENRIQUE, KOMAILIZADEH), asi que adivinar el primer token saludaba por el apellido. El campo `fSaludo` se precarga completo y el agente recorta; si queda vacio, el correo cae al campo Cliente. `firstName()` fue ELIMINADA: no reintroducirla. El saludo aprobado se guarda en el historial (`saludo`) y lo reusan los seguimientos por correo y WhatsApp (`histSaludo()`; los registros viejos caen al nombre completo).
5. **WhatsApp:** CTA del correo usa `wa.me`; el SEGUIMIENTO usa `web.whatsapp.com/send` (mensajes con emojis — wa.me los corrompe).
6. **OAuth Client compartido.** Para cada dominio nuevo, agregar a *Orígenes autorizados de JavaScript* del Client ID en Google Cloud (Google Auth Platform → Clientes): `https://<sub>.appsegurosdigitales.com` (sin barra final). Ya están los de Autos/Vital/INS Medical/Hogar. NO tocar "URIs de redireccionamiento" (el flujo token no los usa). La pantalla de consentimiento ya sirve al equipo.
7. **No commitear a `main` sin verificar local primero** (cargar un PDF de ejemplo y revisar extracción/correo/estadísticas).
8. **No inventar datos del producto** — leer las Condiciones (Generales/Multiasistencia) en la carpeta de docs.

## Errores comunes a evitar

- **Regex de campos en columna doble:** usar `[^\n]+`, no `\s{2,}` (el texto se colapsa a espacios simples). Bug ya corregido en paquete/ocupacion/distrito/intermediario/tipoTarifa.
- **Etiqueta "BIMESTRAL"** (no "Bimensual") y **"DEDUCCION MENSUAL"** sin tilde — el regex debe aceptar ambas variantes.
- **`buildCleanPDF` ya NO tiene coordenadas fijas** (desde 3 set 2026): mide del PDF el paso entre filas, el tamaño de letra, el centro de cada columna y el ancho de la tabla, y trabaja **página por página** (la tabla puede estar partida). Reglas que valen para los dos formatos: borde superior de la celda = `baseline + 1,125 × size`; alto de fila = `pitch + 0,0625 × size`; el INS **siempre dibuja las 7 filas** de la plantilla aunque la cotización traiga menos (las vacías se borran al final). Si mañana cambia el formato otra vez, revisar esas tres constantes antes que nada.
- **La tabla se reescribe en Helvetica pero el INS usa Tahoma condensada (~73%):** por eso `drawFitText` aplica el operador `Tz` (`PDFLib.setCharacterSqueeze`) para que la fila movida conserve el ancho original. Sin eso la fila reescrita se ve más grande que las que no se movieron.
- **Verificación visual del PDF limpio sin abrirlo a mano:** levantar un sink HTTP local (POST → archivo) en el scratchpad, hacer `fetch(...,{method:'POST',body:bytes})` desde la app y rasterizar con PyMuPDF. Renderizar el PDF en un canvas dentro del panel **se cuelga** cuando el Browser pane está oculto.
- **No agregar barra `/` final** al registrar orígenes OAuth.
- **Preview:** el servidor `hogar-comprensivo` (puerto 9020) sirve el repo real, así que basta con guardar `index.html` y recargar. NO copiar a `C:/tmp` — esa era la forma vieja y se termina probando una versión atrasada.
- **`CUR='[¢₡]'` literal:** NUNCA escribirlo con heredoc de bash (corrompe los glifos). Usar la herramienta Write.
- **localStorage se puede perder:** un limpiador de disco borra `hogar_agent` y `hogar_hist_v2`. Antes de tocar el historial, recordarle a JC usar ⬇ Respaldar.

## Historial de releases

- **22 jun 2026 — v1 y puesta en producción.** App construida y verificada contra los 2 PDF reales; origen OAuth del dominio agregado por JC y **envío real por Gmail PROBADO con éxito** (cotización + 6 adjuntos llegan al cliente). Mismo día: toggles de formas de pago + redibujo de la tabla, saludo por primer nombre, requisitos adjuntos, favicon, encabezado "Seguros del INS", sección Multiasistencia adaptable y módulo de Estadísticas.
- **15 jul 2026 —** documentos personalizables por agente (slots `deber` / `previa` en ⚙️ Settings).
- **16 jul 2026 (`1dfb536`) —** respaldo/importación JSON del historial de estadísticas.
- **20 jul 2026 (`0aa2764`, `ee06add`, `c898590`) —** módulo `/poliza/` (Envío de Póliza Activa) + fix del layout nuevo 081_81B + hardening.
- **3 set 2026 —** soporte del **informe compacto de set 2026** (ver "SON DOS FORMATOS"): formas de pago leídas en todas las páginas (la ANUAL venía al pie de la página 1 y no se extraía), coberturas con código separado por punto (`T.`/`S.` → volvió a detectarse la Multiasistencia Extendida), corte del bloque de deducibles y `buildCleanPDF` reescrito con geometría medida + `Tz`. Verificado contra los 3 PDF de muestra (nuevo, viejo y KOMAILIZADEH) sin mover ninguna cifra de control; **smoke real de JC en prod OK el mismo dia** (carga del informe nuevo + envio del correo).
- **8 ago 2026 (`c3f5abf`) —** identidad SDI en el cotizador y en `/poliza/`: logotipo + filete de marca, Poppins/Inter/JetBrains Mono, título del encabezado en blanco sólido y "Seguros del INS" fuera del encabezado (ver "Branding"). Sin tocar extracción, redibujo del PDF, historial ni el correo al cliente.

## Pendientes / TODO

- Considerar acceso directo al cotizador desde segurosdelins.com.
- El umbral de "alto valor" en estadísticas es ₡100M (`STATS_HIGH`) — ajustable si JC lo pide.
- Si aparece un formato de PDF del INS distinto (no Intermediarios) recalibrar extracción/limpieza.

---

> **Ubicaciones canon (desde el 6 sep 2026, decisión 10-C):** `jhernandez-vibecode/cotizador-hogar-comprensivo` → `.claude/skills/especialista-cotizador-hogar-comprensivo/SKILL.md` y `C:\Users\segur\.claude\skills\especialista-cotizador-hogar-comprensivo\SKILL.md`, byte-idénticas. Se edita en el repo, se commitea y se copia al user-level (o al revés, pero siempre las dos en el mismo día).
