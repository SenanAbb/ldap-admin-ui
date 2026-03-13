---
name: critique
description: Evalúa la efectividad del diseño desde una perspectiva UX. Analiza jerarquía visual, arquitectura de información, resonancia emocional y calidad general con feedback accionable.
user-invokable: true
args:
  - name: area
    description: La funcionalidad o área a criticar (opcional)
    required: false
---

Realiza una crítica de diseño holística, evaluando si la interfaz funciona como experiencia diseñada (no solo técnicamente). Piensa como un director/a de diseño dando feedback.

**Primero**: usa la skill frontend-design para principios y anti-patrones.

## Crítica de diseño

Evalúa la interfaz en estas dimensiones:

### 1. Detección de “AI slop” (CRÍTICO)

**Es el chequeo más importante.** ¿Se ve como cualquier otra interfaz generada por IA 2024-2025?

Compara contra TODOS los **NO** de frontend-design: paleta de color IA, texto con gradiente, modo oscuro con acentos brillantes, glassmorphism, layouts tipo “hero metrics”, grids de cards idénticas, fuentes genéricas y el resto de señales.

**Test**: si enseñas esto a alguien y dices “lo hizo una IA”, ¿lo creería al instante? Si sí, ese es el problema.

### 2. Jerarquía visual
- ¿El ojo va primero a lo más importante?
- ¿Hay una acción primaria clara (en 2s)?
- ¿Tamaño/color/posición comunican importancia correctamente?
- ¿Hay competencia visual indebida?

### 3. Arquitectura de información
- ¿La estructura es intuitiva?
- ¿Contenido relacionado está agrupado lógicamente?
- ¿Demasiadas opciones a la vez (sobrecarga cognitiva)?
- ¿La navegación es clara y predecible?

### 4. Resonancia emocional
- ¿Qué emoción evoca? ¿Es intencional?
- ¿Encaja con personalidad de marca?
- ¿Se siente confiable, cercana, premium, etc.?
- ¿El usuario objetivo pensaría “esto es para mí”?

### 5. Descubribilidad y affordance
- ¿Lo interactivo parece interactivo?
- ¿Se entiende qué hacer sin instrucciones?
- ¿Hover/focus dan feedback útil?
- ¿Hay features ocultas que deberían ser visibles?

### 6. Composición y balance
- ¿Se siente balanceado o incómodo?
- ¿El whitespace es intencional?
- ¿Hay ritmo visual?
- ¿La asimetría parece diseñada o accidental?

### 7. Tipografía como comunicación
- ¿La jerarquía tipográfica guía lectura?
- ¿El cuerpo es cómodo (longitud de línea, tamaño, espaciado)?
- ¿La fuente refuerza marca/tono?
- ¿Contraste suficiente entre niveles?

### 8. Color con propósito
- ¿Color comunica, no solo decora?
- ¿La paleta es cohesiva?
- ¿Los acentos llaman atención a lo correcto?
- ¿Funciona para daltónicos (en significado, no solo en contraste)?

### 9. Estados y edge cases
- Vacíos: ¿guían o solo dicen “nada aquí”?
- Carga: ¿reduce espera percibida?
- Errores: ¿útiles y sin culpar?
- Éxito: ¿confirma y guía próximos pasos?

### 10. Microcopy y voz
- ¿Es claro y conciso?
- ¿Suena humano (y el humano correcto para la marca)?
- ¿Labels/botones sin ambigüedad?
- ¿Errores ayudan a resolver?

## Informe de crítica

### Veredicto de anti-patrones
**Empieza aquí.** Aprobado/suspenso: ¿parece generado por IA? Lista señales específicas.

### Impresión general
Reacción breve: qué funciona, qué no, y la oportunidad principal.

### Qué funciona
2-3 cosas bien hechas con por qué.

### Issues prioritarios
3-5 problemas más impactantes (ordenados):

Para cada issue:
- **Qué**: problema
- **Por qué importa**: impacto
- **Fix**: solución concreta
- **Comando**: /adapt, /animate, /audit, /bolder, /clarify, /colorize, /critique, /delight, /distill, /extract, /harden, /normalize, /onboard, /optimize, /polish, /quieter (u otros existentes)

### Observaciones menores
Notas rápidas de issues pequeños.

### Preguntas para considerar
Preguntas provocadoras para desbloquear mejores soluciones.

**Recuerda**:
- Feedback directo
- Específico
- Explica qué está mal y por qué importa
- Sugerencias concretas
- Prioriza sin piedad
- No suavices la crítica: se necesita honestidad
