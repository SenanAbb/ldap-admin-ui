---
name: optimize
description: Mejora el rendimiento de la interfaz en carga, renderizado, animaciones, imágenes y tamaño de bundle. Hace las experiencias más rápidas y fluidas.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o área a optimizar (opcional)
    required: false
---

Identifica y corrige problemas de rendimiento para crear experiencias de usuario más rápidas y suaves.

## Evaluar problemas de rendimiento

Entiende el estado actual e identifica problemas:

1. **Medir el estado actual**:
   - **Core Web Vitals**: LCP, FID/INP, CLS
   - **Tiempo de carga**: TTI, FCP
   - **Tamaño de bundle**: JS, CSS, imágenes
   - **Rendimiento en runtime**: FPS, memoria, CPU
   - **Red**: nº de requests, tamaños, waterfall

2. **Identificar cuellos de botella**:
   - ¿Qué va lento? (carga inicial, interacciones, animaciones)
   - ¿Qué lo causa? (imágenes grandes, JS caro, layout thrashing)
   - ¿Qué tan grave es? (perceptible, molesto, bloqueante)
   - ¿Quién se ve afectado? (todos, solo móvil, conexiones lentas)

**CRÍTICO**: Mide antes y después. Optimizar sin medir es perder tiempo.

## Estrategia de optimización

### Rendimiento de carga

**Optimizar imágenes**:
- Formatos modernos (WebP, AVIF)
- Tamaño correcto (no cargar 3000px para mostrar 300px)
- Lazy load debajo del fold
- Imágenes responsivas (`srcset`, `picture`)
- Compresión (80-85% suele ser imperceptible)
- CDN

```html
<img 
  src="hero.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  loading="lazy"
  alt="Imagen principal"
/>
```

**Reducir bundle JavaScript**:
- Code splitting (por ruta, por componente)
- Tree shaking
- Eliminar dependencias sin uso
- Lazy load de código no crítico
- Imports dinámicos para componentes grandes

```js
const HeavyChart = lazy(() => import('./HeavyChart'));
```

**Optimizar CSS**:
- Eliminar CSS sin uso
- CSS crítico inline, resto async
- Minimizar archivos CSS
- `contain` para regiones independientes

**Optimizar fuentes**:
- `font-display: swap`/`optional`
- Subset de caracteres
- Preload de fuentes críticas
- Fuentes de sistema cuando aplique
- Limitar pesos

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0020-007F;
}
```

**Estrategia de carga**:
- Recursos críticos primero
- Preload de assets críticos
- Prefetch de siguientes páginas probables
- Service worker para cache/offline
- HTTP/2 o HTTP/3

### Rendimiento de renderizado

**Evitar layout thrashing**:
```js
// ❌ Mal
elements.forEach(el => {
  const h = el.offsetHeight;
  el.style.height = h * 2;
});

// ✅ Bien
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2;
});
```

**Optimizar render**:
- `contain`
- Minimizar profundidad y tamaño de DOM
- `content-visibility: auto` para listas largas
- Virtualización (react-window, react-virtualized)

**Reducir paint/composite**:
- Animar solo `transform` y `opacity`
- Evitar width/height/top/left
- `will-change` con moderación
- Minimizar áreas de paint

### Rendimiento de animaciones

```css
/* ✅ Rápido */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Lento */
.animated {
  left: 100px;
  width: 300px;
}
```

- Objetivo 60fps (16ms/frame)
- `requestAnimationFrame` para animaciones JS
- Debounce/throttle de scroll
- CSS cuando sea posible

**Intersection Observer**:
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Lazy load o animar
    }
  });
});
```

### Optimización React/framework

- `memo()` en componentes caros
- `useMemo()`/`useCallback()` cuando aplique
- Virtualizar listas
- Code split por rutas
- Evitar crear funciones inline en render
- Profiler de React

### Red

- Reducir requests
- Sprites SVG
- Inline de assets críticos pequeños
- Quitar scripts third-party innecesarios

APIs:
- Paginación
- Compresión gzip/brotli
- Headers de caché
- CDN

Conexiones lentas:
- Carga adaptativa (`navigator.connection`)
- UI optimista
- Priorización
- Mejora progresiva

## Optimización de Core Web Vitals

### LCP (<2.5s)
- Optimizar hero images
- CSS crítico inline
- Preload
- CDN
- SSR

### FID/INP (<200ms)
- Dividir tareas largas
- Defer JS no crítico
- Web workers
- Reducir tiempo de ejecución JS

### CLS (<0.1)
- Dimensiones en imágenes/vídeos
- No inyectar contenido arriba
- `aspect-ratio`
- Reservar espacio para embeds
- Evitar animaciones que cambian layout

```css
.image-container { aspect-ratio: 16 / 9; }
```

## Monitorización

Herramientas:
- Lighthouse, Performance panel
- WebPageTest
- Chrome UX Report
- Bundle analyzers
- RUM (Sentry, DataDog, New Relic)

Métricas:
- LCP, FID/INP, CLS
- TTI, FCP, TBT
- Bundle size
- nº de requests

**IMPORTANTE**: mide en dispositivos reales y redes reales.

**NUNCA**:
- Optimizar sin medir
- Sacrificar accesibilidad
- Romper funcionalidad
- `will-change` por todas partes
- Lazy load de contenido above-the-fold
- Micro-optimizaciones ignorando el mayor cuello de botella
- Olvidar móvil

## Verificar mejoras

- Métricas antes/después
- RUM
- Diferentes dispositivos
- 3G
- Sin regresiones
- Percepción: ¿se siente más rápido?

Recuerda: el rendimiento es una funcionalidad. Optimiza con método, mide con rigor y prioriza lo que el usuario percibe.
