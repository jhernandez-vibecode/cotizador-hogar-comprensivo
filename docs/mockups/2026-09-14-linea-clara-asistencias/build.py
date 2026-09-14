# Ensambla el mockup (y luego, con --prod, el index.html real) a partir del
# index.html vigente + los fragmentos de esta carpeta. Cada paso ancla sobre
# texto literal del archivo y falla en voz alta si el ancla no está.
import sys, io, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
PROD = '--prod' in sys.argv
src = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
def frag(name): return io.open(os.path.join(HERE, name), encoding='utf-8').read()
def cut(s, a, b, repl, keep_b=True):
    i = s.index(a); j = s.index(b, i)
    return s[:i] + repl + (s[j:] if keep_b else s[j+len(b):])
def once(s, a, repl):
    assert s.count(a) == 1, ('ancla no única: %r (%d)' % (a[:60], s.count(a)))
    return s.replace(a, repl)

out = src
# 1 · tipografía v1.3
out = once(out, '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,400..700&family=Google+Sans+Code:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">')
# 2 · hoja de sobreescritura al FINAL del <head>
css_href = 'linea-clara.css' if PROD else '/docs/mockups/2026-09-14-linea-clara-asistencias/linea-clara.css'
out = once(out, '</style>\n</head>', '</style>\n<!-- LÍNEA CLARA SDI (14 sep 2026): hoja de sobreescritura, de última para ganar por orden -->\n<link rel="stylesheet" href="%s">\n</head>' % css_href)
if not PROD:
    out = out.replace('<head>', '<head>\n<base href="/">', 1)   # el primero es el de la página; los otros son de los correos
# 3 · encabezado en dos niveles
out = cut(out, '<!-- ===================== TOP BAR =====================', '</header>', frag('frag-header.html').rstrip('\n'), keep_b=False)
# 4 · el documento (Resumen del seguro)
out = cut(out, '            <div class="mx-auto bg-white rounded-xl border border-[var(--line)] soft overflow-hidden" style="max-width:660px">',
              '            <div class="mt-4 flex items-center justify-center gap-2 text-[12px] text-slate-500">', frag('frag-docpanel.html'))
# 5 · catálogo de asistencias
out = cut(out, '/* Beneficios de Multiasistencia Hogar (del contrato).', "function asistTitulo(){ return asistPlan()==='S' ? 'Multiasistencia Hogar Extendida — incluida' : 'Multiasistencia Hogar — incluida'; }\n",
              frag('frag-asist.js'), keep_b=False)
# 6 · asistencia en renderDoc
out = cut(out, '  // asistencia (adaptable: T básica / S extendida)', 'function emailSubject(){', frag('frag-renderdoc-asist.js') + '}\n\n')
# 7 · correo
out = cut(out, 'function buildEmailHTML(){', 'function renderMail(){', frag('frag-email.js'))
if not PROD:
    out = once(out, "const EMAIL_IMG = 'https://hogarcomprensivo.appsegurosdigitales.com';", "const EMAIL_IMG = '';  // MOCKUP: imágenes relativas al servidor local")
# 8 · casilla para los planes opcionales en el correo
out = once(out, 'Conozca a su Cliente) y listarlos en el correo.</span>\n              </label>',
  'Conozca a su Cliente) y listarlos en el correo.</span>\n              </label>\n'
  '              <label class="flex items-start gap-2 mt-2 rounded-xl bg-[#f0fdf6] border border-[#bbf7d0] px-3 py-2.5 cursor-pointer">\n'
  '                <input id="fIncAsist" type="checkbox" checked onchange="renderMail()" class="w-4 h-4 mt-[2px] accent-[var(--green)]">\n'
  '                <span class="text-[12px] text-[#15803d] leading-snug">Ofrecer en el correo los <b>planes de asistencia opcionales</b> del INS (nombre, una línea y prima anual). La asistencia incluida va siempre.</span>\n'
  '              </label>')
# 9 · cifras con punto de miles (regla 8 de la línea clara; es-CR separa con espacio)
out = once(out, "return '₡'+Number(n).toLocaleString('es-CR'); }", "return '₡'+Number(n).toLocaleString('de-DE'); }")
# 10 · pie de la cara de agente con registro de cambios
out = once(out, '</main>\n', '</main>\n' + frag('frag-footer.html'))
# 11 · emojis fuera de las pestañas y del chip de listo (R4)
out = once(out, '📄 Resumen del seguro', 'Resumen del seguro')
out = once(out, '✉️ Correo al cliente', 'Correo al cliente')
out = once(out, '<span class="chip chip-green">✓ Listo</span>', '<span class="chip chip-green">Listo</span>')
out = once(out, '<span class="chip chip-green ml-1">✓ Extraído</span>', '<span class="chip chip-green ml-1">Extraído</span>')
# 11b · las líneas de T y S dicen lo que dice el dossier del INS (sep 2026), no más
out = once(out, "T:{icon:'🛠️', nombre:'Multiasistencia Hogar (gratis)', linea:'Plomería, electricidad y cerrajería de emergencia, sin costo adicional.'}",
  "T:{icon:'🛠️', nombre:'Multiasistencia Hogar (plan Hogar Total)', linea:'Fontanería, electricidad, cerrajería, cristales y un traslado, sin costo adicional.'}")
out = once(out, "S:{icon:'✨', nombre:'Multiasistencia Hogar extendida', linea:'Servicios de asistencia ampliados, incluso para mascotas y asistencia médica o de viaje.'}",
  "S:{icon:'✨', nombre:'Multiasistencia Hogar extendida (plan Hogar Extendido)', linea:'Los mismos servicios con el doble de límite, más traslados, portones y destape de cañerías.'}")
# 12 · arranque con datos de ejemplo para las capturas (?demo / ?demo&mail)
if not PROD:
    k = out.rindex('</body>'); out = out[:k] + ('<script>if(location.search.indexOf("demo")>-1){window.addEventListener("load",function(){loadDemo();if(location.search.indexOf("mail")>-1)switchTab("mail");});}</script>\n') + out[k:]

dst = os.path.join(ROOT, 'index.html') if PROD else os.path.join(HERE, 'mockup-consola.html')
io.open(dst, 'w', encoding='utf-8', newline='\n').write(out)
print('OK ->', dst, len(out))
