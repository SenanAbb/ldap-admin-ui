---
name: audit
description: Realiza una auditoría completa de calidad de interfaz en accesibilidad, rendimiento, theming y diseño responsivo. Genera un informe detallado de problemas con severidad y recomendaciones.
user-invokable: true
args:
  - name: area
    description: La funcionalidad o área a auditar (opcional)
    required: false
---

Ejecuta comprobaciones sistemáticas de calidad y genera un informe de auditoría integral con issues priorizados y recomendaciones accionables. No arregles issues: documéntalos para que otros comandos los aborden.

**Primero**: usa la skill frontend-design para principios de diseño y anti-patrones.

## Escaneo diagnóstico

Ejecuta comprobaciones en múltiples dimensiones:

1. **Accesibilidad (A11y)**:
   - **Contraste**: ratios < 4.5:1 (o 7:1 para AAA)
   - **ARIA faltante**: elementos interactivos sin roles, labels o estados
   - **Navegación por teclado**: sin indicadores de foco, orden de tab ilógico, “keyboard traps”
   - **HTML semántico**: jerarquía de headings incorrecta, landmarks ausentes, divs en lugar de botones
   - **Alt text**: descripciones faltantes o malas
   - **Formularios**: inputs sin label, errores poco claros, indicadores de required ausentes

2. **Rendimiento**:
   - **Layout thrashing**: lecturas/escrituras de layout en bucles
   - **Animaciones caras**: animar propiedades de layout en vez de transform/opacity
   - **Falta de optimización**: imágenes sin lazy loading, assets sin optimizar
   - **Tamaño de bundle**: imports innecesarios, dependencias sin uso
   - **Render**: re-renders innecesarios, falta de memoización

3. **Theming**:
   - **Colores hard-coded**: sin tokens
   - **Modo oscuro roto**: sin variantes dark, contraste pobre
   - **Tokens inconsistentes**: tokens incorrectos o mezclados
   - **Problemas de switch de tema**: valores que no cambian con el tema

4. **Diseño responsivo**:
   - **Anchos fijos**: rompen en móvil
   - **Touch targets**: interactivos < 44x44px
   - **Scroll horizontal**: overflow en viewports estrechos
   - **Escalado de texto**: layouts que se rompen al aumentar tamaño
   - **Breakpoints faltantes**: sin variantes móvil/tablet

5. **Anti-patrones (CRÍTICO)**:
   - Contrasta con TODOS los **NO** de frontend-design.
   - Detecta “AI slop” (paleta IA, texto con gradiente, glassmorphism, hero metrics, card grids, fuentes genéricas) y anti-patrones generales (gris sobre color, cards anidadas, easing bounce, copy redundante).

**CRÍTICO**: Esto es una auditoría, no un fix. Documenta los problemas con impacto claro. Usa otros comandos (normalize, optimize, harden, etc.) para arreglar después.

## Generar informe completo

Estructura recomendada:

### Veredicto de anti-patrones
**Empieza aquí.** Aprobado/suspenso: ¿Parece generado por IA? Lista señales concretas.

### Resumen ejecutivo
- Total de issues (por severidad)
- Issues más críticos (top 3-5)
- Score global (si aplica)
- Próximos pasos recomendados

### Hallazgos detallados por severidad

Para cada issue:
- **Ubicación**: componente, archivo, línea
- **Severidad**: Critical / High / Medium / Low
- **Categoría**: Accesibilidad / Rendimiento / Theming / Responsive
- **Descripción**
- **Impacto**
- **WCAG/estándar** (si aplica)
- **Recomendación**
- **Comando sugerido**: /adapt, /animate, /audit, /bolder, /clarify, /colorize, /critique, /delight, /distill, /extract, /harden, /normalize, /onboard, /optimize, /polish, /quieter (u otros existentes)

#### Problemas críticos
[Issues que bloquean funcionalidad o violan WCAG A]

#### Problemas de alta severidad
[Impacto importante, violaciones WCAG AA]

#### Problemas de severidad media
[Calidad, WCAG AAA, rendimiento]

#### Problemas de baja severidad
[Inconsistencias menores, oportunidades de optimización]

### Patrones y problemas sistémicos

Identifica problemas recurrentes:
- “Colores hard-coded en 15+ componentes: usar tokens”
- “Touch targets sistemáticamente pequeños en móvil”
- “Falta de focus indicators en interactivos custom”

### Hallazgos positivos

Qué funciona bien:
- Buenas prácticas a mantener
- Implementaciones ejemplares a replicar

### Recomendaciones por prioridad

Plan accionable:
1. **Inmediato**: bloqueadores críticos
2. **Corto plazo**: alta severidad (este sprint)
3. **Medio plazo**: mejoras de calidad
4. **Largo plazo**: nice-to-haves

### Comandos sugeridos para fixes

Mapea issues a comandos disponibles.

Ejemplos:
- “Usar `/normalize` para alinear con el sistema de diseño (N issues de theming)”
- “Usar `/optimize` para rendimiento (N issues)”
- “Usar `/harden` para robustez (N edge cases)”

**IMPORTANTE**: Sé exhaustivo pero accionable. Evita ruido con demasiados issues de baja prioridad. Prioriza lo que realmente importa.

**NUNCA**:
- Reportar issues sin explicar impacto
- Mezclar severidades de forma inconsistente
- Omitir hallazgos positivos
- Dar recomendaciones genéricas
- Olvidar priorizar
- Reportar falsos positivos sin verificación

Recuerda: eres un auditor con atención excepcional al detalle. Documenta sistemáticamente, prioriza con rigor y da caminos claros para mejorar.
