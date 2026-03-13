---
name: harden
description: Mejora la resiliencia de la interfaz con mejor manejo de errores, soporte i18n, manejo de overflow de texto y gestión de edge cases. Hace la interfaz robusta y lista para producción.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o área a endurecer (opcional)
    required: false
---

Fortalece interfaces contra edge cases, errores, problemas de internacionalización y escenarios de uso reales que rompen diseños idealizados.

## Evaluar necesidades de hardening

Identifica debilidades y casos límite:

1. **Probar con inputs extremos**:
   - Texto muy largo (nombres, descripciones, títulos)
   - Texto muy corto (vacío, un carácter)
   - Caracteres especiales (emoji, RTL, acentos)
   - Números grandes (millones, billones)
   - Muchos ítems (1000+ en listas, 50+ opciones)
   - Sin datos (estados vacíos)

2. **Probar escenarios de error**:
   - Fallos de red (offline, lento, timeout)
   - Errores API (400, 401, 403, 404, 500)
   - Errores de validación
   - Errores de permisos
   - Rate limiting
   - Operaciones concurrentes

3. **Probar internacionalización**:
   - Traducciones largas (alemán suele ser 30% más largo)
   - Idiomas RTL (árabe, hebreo)
   - Sets de caracteres (CJK, emoji)
   - Formatos de fecha/hora
   - Formatos numéricos (1,000 vs 1.000)
   - Símbolos de moneda

**CRÍTICO**: Diseños que solo funcionan con datos perfectos no están listos para producción.

## Dimensiones de hardening

### Overflow y wrapping de texto

**Manejo de texto largo**:
```css
/* Una línea con ellipsis */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-línea con clamp */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Permitir wrapping */
.wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
```

**Overflow en Flex/Grid**:
```css
.flex-item {
  min-width: 0;
  overflow: hidden;
}

.grid-item {
  min-width: 0;
  min-height: 0;
}
```

**Texto responsivo**:
- `clamp()` para tipografía fluida
- Mínimos legibles (14px en móvil)
- Probar zoom 200%
- Contenedores que crezcan con el texto

### Internacionalización (i18n)

**Expansión de texto**:
- Presupuesto 30-40%
- Flex/grid adaptables
- Probar idioma más largo
- Evitar anchos fijos

```jsx
// ❌ Mal
<button className="w-24">Enviar</button>

// ✅ Bien
<button className="px-4 py-2">Enviar</button>
```

**RTL**:
```css
margin-inline-start: 1rem;
padding-inline: 1rem;
border-inline-end: 1px solid;

[dir="rtl"] .arrow { transform: scaleX(-1); }
```

**Set de caracteres**:
- UTF-8 en todo
- Probar CJK
- Probar emoji
- Soportar scripts variados

**Formato de fecha/hora y números**:
```js
new Intl.DateTimeFormat('en-US').format(date);
new Intl.DateTimeFormat('de-DE').format(date);

new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.56);
```

**Pluralización**:
```js
// ❌ Mal
`${count} item${count !== 1 ? 's' : ''}`

// ✅ Bien
t('items', { count })
```

### Manejo de errores

**Errores de red**:
- Mensajes claros
- Botón reintentar
- Explicar qué pasó
- Modo offline si aplica
- Timeouts

```jsx
{error && (
  <ErrorMessage>
    <p>No se pudo cargar. {error.message}</p>
    <button onClick={retry}>Reintentar</button>
  </ErrorMessage>
)}
```

**Validación de formularios**:
- Errores inline
- Mensajes específicos
- Sugerir corrección
- No bloquear innecesariamente
- Preservar input

**Errores API**:
- 400: validación
- 401: login
- 403: permisos
- 404: no encontrado
- 429: rate limit
- 500: genérico + soporte

**Degradación elegante**:
- Funciona sin JS (cuando sea posible)
- Alt text
- Mejora progresiva
- Fallbacks

### Edge cases y límites

**Vacíos**: listas sin ítems, sin resultados, sin notificaciones, etc.

**Loading**: inicial, paginación, refresh. Explicar qué carga.

**Datasets grandes**: paginación/virtualización, búsqueda/filtros.

**Concurrencia**: evitar doble submit, race conditions, optimistic con rollback.

**Permisos**: vista/edición, modo read-only, explicar por qué.

**Compatibilidad**: polyfills/fallbacks, feature detection, tests.

### Validación y sanitización

- Validación cliente
- Validación servidor (siempre)
- Sanitizar inputs
- Rate limiting

```html
<input type="text" maxlength="100" pattern="[A-Za-z0-9]+" required aria-describedby="username-hint" />
<small id="username-hint">Solo letras y números, hasta 100 caracteres</small>
```

### Resiliencia de accesibilidad

- Navegación por teclado
- Soporte lector de pantalla
- Reduced motion
- High contrast mode

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Resiliencia de rendimiento

- Conexiones lentas
- Memory leaks
- Throttle/debounce

```js
const debouncedSearch = debounce(handleSearch, 300);
const throttledScroll = throttle(handleScroll, 100);
```

## Estrategias de testing

Manual:
- Datos extremos
- Idiomas
- Offline
- 3G
- Screen reader
- Solo teclado
- Navegadores antiguos

Automatizado:
- Unit tests
- Integration
- E2E
- Visual regression
- A11y (axe)

**NUNCA**:
- Asumir input perfecto
- Ignorar i18n
- Errores genéricos
- Olvidar offline
- Confiar solo en validación cliente
- Anchos fijos para texto
- Asumir texto “longitud inglés”
- Bloquear toda la UI por un error local

## Verificar hardening

Prueba:
- Texto largo
- Emoji
- RTL
- CJK
- Fallos de red
- Datasets grandes
- Acciones concurrentes
- Errores API
- Estados vacíos

Recuerda: estás endureciendo para la realidad de producción, no para una demo.
