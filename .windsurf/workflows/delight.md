---
name: delight
description: Añade momentos de alegría, personalidad y detalles inesperados que hacen las interfaces memorables y agradables. Eleva lo funcional a encantador.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o área a la que añadir deleite (opcional)
    required: false
---

Identifica oportunidades para añadir alegría, personalidad y pulido inesperado que transformen interfaces funcionales en experiencias encantadoras.

## PREPARACIÓN OBLIGATORIA

### Recolección de contexto (haz esto primero)

No puedes hacerlo bien sin contexto: audiencia (crítico), casos de uso (crítico), personalidad de marca (juguetona vs profesional vs peculiar vs elegante) y qué es apropiado para el dominio.

Intenta obtenerlo del hilo o codebase.

1. Si no encuentras info *exacta* y debes inferir, debes PARAR y llamar a AskUserQuestionTool.
2. Si no puedes inferirlo o tu confianza es media o menor, PARAR y preguntar.

No continúes sin respuestas. Un deleite fuera de contexto es peor que no tenerlo.

### Usar la skill frontend-design

Usa frontend-design para principios y anti-patrones. No continúes hasta conocer SÍ y NO.

---

## Evaluar oportunidades de deleite

1. **Momentos naturales**:
   - Éxito (guardar, enviar, publicar)
   - Vacíos (primer uso, onboarding)
   - Cargas (esperas)
   - Logros (hitos, rachas)
   - Interacciones (hover, clic, drag)
   - Errores (suavizar frustración)
   - Easter eggs

2. **Entender el contexto**:
   - Personalidad de marca
   - Audiencia
   - Contexto emocional
   - Apropiado para el dominio (banco ≠ gaming)

3. **Definir estrategia**:
   - Sofisticación sutil
   - Personalidad juguetona
   - Sorpresas útiles
   - Riqueza sensorial

Si algo no está claro, para y pregunta.

**CRÍTICO**: El deleite debe mejorar la usabilidad, nunca taparla.

## Principios

### Amplifica, nunca bloquea
- Momentos rápidos (<1s)
- Nunca retrasar funcionalidad core
- Skippable o sutil
- Respeta el tiempo

### Sorpresa y descubrimiento
- Detalles escondidos
- Recompensa curiosidad
- No anunciar todo

### Apropiado al contexto
- Celebra éxitos, empatiza en errores
- No ser juguetón en errores críticos
- Sensibilidad cultural

### Se compone con el tiempo
- Fresco con uso repetido
- Variaciones
- Capas más profundas

## Técnicas

### Micro-interacciones y animación

**Deleite en botones**:
```css
.button {
  transition: transform 0.1s, box-shadow 0.1s;
}
.button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.button:hover {
  transform: translateY(-2px);
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
```

- Loading con personalidad
- Animaciones de éxito (check, confeti para hitos)
- Sorpresas en hover

### Personalidad en el copy

Errores juguetones (si la marca lo permite), vacíos alentadores, labels con personalidad.

**IMPORTANTE**: Ajustar al tono de marca.

### Ilustraciones y personalidad visual
- Ilustraciones para vacíos/errores/carga/éxitos
- Iconos custom consistentes
- Efectos de fondo sutiles (mallas, patrones, parallax)

### Interacciones satisfactorias
- Drag & drop con lift/snap/undo
- Toggles suaves, haptics en móvil
- Progreso y logros
- Formularios con foco/validación animada

### Sonido
- Cues sutiles (si aplica)
- Respetar ajustes del sistema
- Opción de silenciar
- Volumen bajo

### Easter eggs
- Konami code
- Atajos ocultos
- Detalles en hover
- Bromas en alt text
- Mensajes en consola

### Loading y esperas
- Mensajes de carga rotativos
- Tips/fun facts
- Mini-juegos en cargas largas

### Celebración
- Confeti en hitos
- Check animado
- Mensajes personalizados

## Patrones de implementación

- Framer Motion, GSAP, Lottie, canvas-confetti
- Howler.js / use-sound
- React Spring / Popmotion

**IMPORTANTE**: optimiza tamaño y lazy-load.

**NUNCA**:
- Retrasar funcionalidad core
- Forzar el deleite
- Usar deleite para esconder mal UX
- Pasarte (menos es más)
- Ignorar accesibilidad
- Hacer todo “delightful”
- Sacrificar performance
- Ser inapropiado

## Verificar

- ¿Hace sonreír?
- ¿No molesta tras 100 usos?
- ¿No bloquea?
- ¿Es performante?
- ¿Es apropiado?
- ¿Es accesible?

Recuerda: el deleite separa una herramienta de una experiencia. Añade personalidad y sorpresa positiva, siempre respetando la usabilidad.
