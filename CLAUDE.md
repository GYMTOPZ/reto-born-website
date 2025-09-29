# Reto Born Website - Documentación de Cambios

## Resumen del Proyecto
Website para Reto Born con animaciones únicas para cada sección.
- Repositorio: GYMTOPZ/reto-born-website
- URL Vercel: https://reto-born-website-pi.vercel.app/

## Cambios Realizados

### 1. Animación de Impacto "Reto Born" (Hero)
- Efecto de partículas de humo y escombros cuando las palabras impactan
- Partículas aparecen detrás del texto (z-index: 1)
- Ajustes especiales para móvil (Y offset: -50px)
- Efectos más lentos y suaves para mejor visualización

### 2. Sección "Rutinas que evolucionan"
- Animación de colores en gradiente continuo
- Ciclo de 10 segundos con transiciones suaves
- Clase CSS: `evolving-title`
- Texto actualizado: "Videos explicativos paso a paso"

### 3. Sección "Emilio siempre contigo" - Typewriter
- Efecto máquina de escribir con frases de conversación
- Frases actuales:
  1. "Emilio siempre contigo" (sin comillas)
  2. "Hola Emilio! necesito ayuda con..." (con comillas)
  3. "La rutina de hoy estuvo brutal 🔥" (con comillas)
  4. "Emilio ya se me están marcando los abs!" (con comillas)
- Cursor: barra delgada de 2px que parpadea
- Texto centrado con wrap correcto para múltiples líneas
- Responsive para móvil con:
  - Altura fija de 120px para evitar que subtítulo se mueva
  - Contenedor wrapper para mantener cursor dentro del texto
  - Font-size: 36px en móvil
  - Overflow hidden para contener el cursor

### 4. Botón CTA del Hero
- Aparece sutilmente cuando el usuario hace scroll back al hero
- Usa IntersectionObserver para detectar cuando vuelve a la sección

### 5. Colores y Estilos
- Color del subtítulo cambiado de gris (#86868B) a negro (#000000)
- Todos los textos principales en color Apple Blue (#0071E3)

## Estructura de Archivos Principales

- `index.html` - Estructura principal
- `styles.css` - Estilos y animaciones
- `script.js` - Lógica del typewriter y scroll
- `falling-animation.js` - Animación de partículas para "Reto Born"
- `supabase-config.js` - Configuración de Supabase para waitlist

### 6. Sección "Nutrición inteligente" - Animación o → manzana
- La letra "ó" de "Nutrición" se transforma en manzana
- Animación de 4 segundos con rotación 3D
- Detalles:
  - La "o" es un círculo azul con borde (0.54em)
  - Se transforma en manzana roja con gradiente
  - El acento se convierte en hoja verde
  - Acento inclinado de izquierda a derecha (-20°)
  - Altura fija en top: 30% (sin movimiento vertical)
  - Solo cambia color y forma, no posición
- Ciclo: 1s letra → 0.6s transformación → 1.4s manzana → 0.6s transformación → 0.4s letra

## Notas Técnicas
- Todas las animaciones usan CSS @keyframes para mejor performance
- JavaScript mínimo, principalmente para typewriter e IntersectionObserver
- Canvas para efectos de partículas
- Mobile-first responsive design