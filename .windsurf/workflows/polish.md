---
name: polish
description: Pase final de calidad antes de lanzar. Corrige alineación, espaciado, consistencia y detalles que separan lo bueno de lo excelente.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o área a pulir (opcional)
    required: false
---

**Primero**: usa la skill frontend-design para principios y anti-patrones.

Realiza un pase final meticuloso para detectar detalles pequeños que separan un buen trabajo de un trabajo excelente.

## Evaluación previa

1. **Revisar completitud**:
   - ¿Está completo funcionalmente?
   - ¿Hay issues conocidos que preservar (marcar con TODOs)?
   - ¿Cuál es el listón de calidad? (MVP vs flagship)
   - ¿Cuándo se entrega?

2. **Identificar áreas**:
   - Inconsistencias visuales
   - Espaciado y alineación
   - Estados de interacción faltantes
   - Inconsistencias de copy
   - Edge cases y errores
   - Loading y transiciones

**CRÍTICO**: Pulir es el último paso, no el primero.

## Pulir sistemáticamente

### Alineación y espaciado
- Alineación pixel-perfect
- Espaciado consistente con escala/tokens
- Alineación óptica
- Consistencia responsive
- Adherencia a grid/baseline

### Tipografía
- Jerarquía consistente
- Longitud de línea 45-75 caracteres
- Line-height apropiado
- Evitar viudas/huérfanas
- Hifenación
- Kerning/letter-spacing en titulares
- Carga de fuentes (sin FOUT/FOIT)

### Color y contraste
- Contraste WCAG
- Tokens consistentes (sin hard-coded)
- Consistencia de temas
- Significado de color consistente
- Focus accesible
- Neutros tintados (evitar gris/negro puros)
- Evitar gris sobre fondos de color

### Estados de interacción

Todo interactivo debe tener:
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error
- Success

### Micro-interacciones y transiciones
- Transiciones suaves (150-300ms)
- Easing consistente (ease-out-quart/quint/expo)
- 60fps (solo transform/opacity)
- Reduced motion

### Contenido y copy
- Terminología consistente
- Capitalización consistente
- Ortografía
- Longitud apropiada
- Puntuación consistente

### Iconos e imágenes
- Estilo consistente
- Tamaño consistente
- Alineación óptica con texto
- Alt text
- Sin CLS (aspect ratios)
- Soporte retina

### Formularios
- Labels correctos
- Required indicators
- Errores útiles
- Tab order lógico
- Autofocus con criterio
- Timing de validación consistente

### Edge cases
- Loading
- Vacíos
- Errores con recuperación
- Éxitos
- Contenido largo
- Datos faltantes
- Offline (si aplica)

### Responsive
- Mobile/tablet/desktop
- Touch targets 44x44px
- Texto mínimo 14px en móvil
- Sin scroll horizontal
- Reflow lógico

### Performance
- Carga inicial rápida
- Sin CLS
- Interacciones sin lag
- Imágenes optimizadas
- Lazy loading off-screen

### Calidad de código
- Sin console logs
- Sin código comentado muerto
- Imports sin uso fuera
- Naming consistente
- Type safety (evitar `any`)
- A11y (ARIA + semántica)

## Checklist

- [ ] Alineación perfecta
- [ ] Espaciado con tokens
- [ ] Jerarquía tipográfica consistente
- [ ] Estados interactivos completos
- [ ] Transiciones suaves
- [ ] Copy pulido
- [ ] Iconos consistentes
- [ ] Formularios accesibles
- [ ] Errores útiles
- [ ] Loading claro
- [ ] Vacíos acogedores
- [ ] Touch targets 44x44
- [ ] Contraste WCAG AA
- [ ] Teclado ok
- [ ] Focus visible
- [ ] Sin errores en consola
- [ ] Sin CLS
- [ ] Compatible en navegadores soportados
- [ ] Respeta reduced motion
- [ ] Código limpio

**IMPORTANTE**: Pulir es detalle. Úsalo tú. Haz zoom. Entorna los ojos.

**NUNCA**:
- Pulir antes de estar completo
- Invertir horas si sale en 30 minutos (triage)
- Introducir bugs al pulir
- Ignorar problemas sistémicos
- Perfeccionar una parte dejando otras mal

## Verificación final

- Usarlo de verdad
- Probar en dispositivos reales
- Review de otra persona
- Comparar con diseño
- Probar todos los estados

Recuerda: el detalle importa. Pulir hasta que se sienta sin esfuerzo.
