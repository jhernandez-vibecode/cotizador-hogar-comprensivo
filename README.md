# Cotizador Hogar Comprensivo · Seguros Digitales SDI

App web de un solo archivo (`index.html`) para cotizar el seguro **Hogar Comprensivo del INS** bajo la marca **Seguros Digitales SDI**. Hermana de los cotizadores de Autos, Vital 360, INS Medical y Plenisalud.

## Qué hace
1. El agente **carga el PDF** de la cotización del INS (el "Informe de Estimación Provisional de Primas").
2. La app **extrae** los datos: cliente, propiedad, sumas aseguradas, coberturas con sus primas, deducibles y las formas de pago.
3. **Formas de pago con toggles:** el agente enciende/apaga cada forma de pago (Anual, Semestral, Cuatrimestral, Trimestral, Bimestral, Mensual, Deducción Mensual). Por defecto quedan visibles **Anual, Semestral y Trimestral**. Las que se apagan se **eliminan del PDF**: la tabla "Primas Según Formas de Pago" de la página 2 se **redibuja limpia y contigua** con solo las visibles (pdf-lib: borra el cuerpo y reescribe las filas, sin huecos).
4. Presenta un **resumen amigable** del seguro + **deducibles por cobertura**.
5. Arma una **plantilla de correo HTML** (solo texto + colores, sin imágenes). Tras las formas de pago incluye un bloque de **requisitos** (los 5 documentos) con el mensaje «si está de acuerdo, complete los documentos adjuntos», y los **adjunta** (carpeta `requisitos/`). El saludo usa el **nombre de pila** (editable).
6. **Envía por Gmail** la cotización limpia + los 5 requisitos (6 adjuntos, ~5 MB).
7. **Control de lo cotizado (📊):** módulo de estadísticas replicado del Cotizador Autos. Cada envío se guarda (localStorage) con su ciclo de vida **Pendiente → Agendada (con fecha de cita) → Concretada / Desechada**. Incluye KPIs (Enviadas / Agendadas / Concretadas / Desechadas / **Conversión %**), desglose por mes, búsqueda (cliente/cédula/consecutivo), filtros (**Todas / ⭐ Alto valor ≥₡100M / ⏳ Para seguir +3 d**), seguimiento por **WhatsApp** y por **correo** (un solo seguimiento), badge con la cantidad pendiente de seguir, y borrado de registros. Datos privados, solo en ese navegador.

## Módulo `/poliza/` — Envío de Póliza Activa

Segunda plataforma del repo (sub-página `poliza/index.html`, gemela del `/polizas-activas/` del Cotizador Autos), para pólizas Hogar **ya emitidas** (no cotizaciones). Se llega con el botón **📨** del header del cotizador.

1. El agente **carga las Condiciones Particulares** de la póliza emitida (forma `081_81B`) + opcionalmente **condiciones especiales** (gas/solar/VE/desocupado) y el **comprobante de pago** — todo se adjunta.
2. La app **extrae** con pdf.js: N° de póliza, cliente, cédula, ubicación, vigencia, forma de pago, suma asegurada y **coberturas** (con o sin cobertura S de Multiasistencia Extendida). Soporta los **dos layouts** del formato 081_81B: el viejo (tabla con % + prima) y el nuevo de jul-2026 (tabla "Coberturas y sumas aseguradas", solo suma). El formato nuevo trae el correo del cliente → se autocompleta.
3. Se adjuntan **2 documentos fijos genéricos** (carpeta `emision/`): **Condiciones Generales V17** + **Condiciones de Multiasistencia**. Base = 3 adjuntos.
4. Arma un **correo de "póliza activa"** (solo texto + color, sin imágenes): confirmación de póliza vigente + **resumen de coberturas** + **Multiasistencia destacada** (6 servicios básico / 9 extendido según cobertura S) + documentación adjunta + firma del agente.
5. **Envía por Gmail** (mismo Client ID; `/poliza/` es mismo origen que el cotizador → no requiere cambios en Google Cloud).

> **Privacidad:** el `.gitignore` excluye `Documentos emision/` y `_localtest/` (pólizas de muestra con datos de clientes reales). En este repo público solo van los 2 documentos genéricos de `emision/` y datos de demo ficticios.

## Stack
- HTML/CSS/JS vanilla, un solo archivo por página. Sin build.
- CDN: Tailwind, Google Fonts (Sora + Inter), **pdf.js** (extracción), **pdf-lib** (limpieza, solo el cotizador), **Google Identity Services** (envío Gmail).
- Sin backend. El envío usa Gmail API directo desde el navegador (mismo Client ID compartido con los otros cotizadores SDI).

## Despliegue (Netlify)
1. Push a este repo → Netlify publica `index.html` en la raíz (sin build).
2. **Importante:** en Google Cloud Console, agregar el dominio de producción (y `http://localhost:PORT` para pruebas) a *Authorized JavaScript origins* del Client ID OAuth. Sin esto, el botón "Enviar por correo" fallará al pedir el token.
3. El correo del agente en Configuración (⚙️) debe coincidir con la cuenta de Gmail que autoriza el envío.

## Notas de calibración
- La extracción está calibrada contra el PDF real "Hogar Comprensivo - Intermediarios" (consecutivo `CT-TMP-AAAA-NNNNNNNN`, página 1 datos + coberturas + deducibles, página 2 formas de pago).
- El PDF **no trae correo ni teléfono** del cliente: el agente los escribe a mano.
- La limpieza con coordenadas (pdf-lib) está afinada para autos; para Hogar es defensiva (este formato no trae filas a quitar). Si aparece un PDF con 7 formas, recalibrar `buildCleanPDF()`.

## Configuración del agente
Botón ⚙️ (arriba a la derecha): nombre, correo, licencia SUGESE, WhatsApp y web. Se guarda en `localStorage`. Por defecto: Juan Carlos Hernández · Lic. SUGESE 08-1318 · jhernandez@segurosdelins.com · WhatsApp 8822-1348.
