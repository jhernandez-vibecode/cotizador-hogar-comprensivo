# Aplica la línea clara al módulo /poliza/ (encabezado, hoja, asistencia con límites,
# correo y pie). Ancla sobre texto literal y falla en voz alta si el ancla no está.
import io, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
P = os.path.join(ROOT, 'poliza', 'index.html')
src = io.open(P, encoding='utf-8').read()
def frag(n): return io.open(os.path.join(HERE, n), encoding='utf-8').read()
def once(s, a, b):
    assert s.count(a) == 1, ('ancla no única: %r (%d)' % (a[:60], s.count(a))); return s.replace(a, b)
def cut(s, a, b, repl, keep_b=True):
    i = s.index(a); j = s.index(b, i); return s[:i] + repl + (s[j:] if keep_b else s[j+len(b):])

out = src
out = once(out, '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,400..700&family=Google+Sans+Code:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">')
out = once(out, "  /* Tipografia SDI: Poppins en titulos, Inter en el cuerpo, JetBrains Mono en cifras. */\n  h1,h2,h3,h4,.font-head{font-family:'Poppins',system-ui,sans-serif}",
  "  /* Tipografía SDI v1.3: Google Sans Flex + Google Sans Code; la cara vive en ../linea-clara.css */\n  h1,h2,h3,h4,.font-head{font-family:'Google Sans Flex','Inter',system-ui,sans-serif}")
out = once(out, ".cifra{font-family:'JetBrains Mono',ui-monospace,'SF Mono',monospace;font-weight:700;", ".cifra{font-family:'Google Sans Code',ui-monospace,'SF Mono',monospace;font-weight:500;")
out = once(out, "cursor:pointer;font-family:'Poppins',sans-serif;transition:.15s}", "cursor:pointer;font-family:inherit;transition:.15s}")
out = once(out, '</style>\n</head>', '</style>' + frag('poliza-frag-style.css') + '</head>')
out = cut(out, '<header class="grad-bar text-white">', '</header>', frag('poliza-frag-header.html').rstrip('\n'), keep_b=False)
out = cut(out, 'const ASIST = [', "function asistTitulo(){ return asistPlan()==='S' ? 'Multiasistencia Hogar Extendida — incluida' : 'Multiasistencia Hogar — incluida'; }\n", frag('poliza-frag-asist.js'), keep_b=False)
out = cut(out, 'function buildEmail(fixedOk){', '/* ============================================================\n   GMAIL + MIME', frag('poliza-frag-email.js'))
out = once(out, '</main>\n', '</main>\n' + frag('poliza-frag-footer.html'))
# las líneas de T y S dicen lo que dice el dossier
out = once(out, "T:{icon:'🛠️', nombre:'Multiasistencia Hogar (gratis)', linea:'Plomería, electricidad y cerrajería de emergencia, sin costo adicional.'}",
  "T:{icon:'🛠️', nombre:'Multiasistencia Hogar (plan Hogar Total)', linea:'Fontanería, electricidad, cerrajería, cristales y un traslado, sin costo adicional.'}")
out = once(out, "S:{icon:'✨', nombre:'Multiasistencia Hogar extendida', linea:'Servicios de asistencia ampliados, incluso para mascotas y asistencia médica o de viaje.'}",
  "S:{icon:'✨', nombre:'Multiasistencia Hogar extendida (plan Hogar Extendido)', linea:'Los mismos servicios con el doble de límite, más traslados, portones y destape de cañerías.'}")
# emojis fuera de chips de estado y del encabezado de vista previa
out = once(out, '<span class="chip chip-green">solo texto + color</span>', '<span class="chip chip-green">Vista del cliente</span>')
out = once(out, '<div class="text-[42px] leading-none mb-2">📄</div>', '')
out = once(out, "return '₡'+Number(n).toLocaleString('es-CR'); }", "return '₡'+Number(n).toLocaleString('de-DE'); }")
io.open(P, 'w', encoding='utf-8', newline='\n').write(out)
print('OK ->', P, len(out))
