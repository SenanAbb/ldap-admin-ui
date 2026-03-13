---
name: bolder
description: Amplifica diseños demasiado “seguros” o aburridos para hacerlos más interesantes y estimulantes. Aumenta el impacto manteniendo la usabilidad.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o componente a hacer más audaz (opcional)
    required: false
---

Aumenta el impacto visual y la personalidad en diseños demasiado seguros, genéricos o poco atractivos, creando experiencias más envolventes y memorables.

## PREPARACIÓN OBLIGATORIA

### Recolección de contexto (haz esto primero)

No puedes hacer un gran trabajo sin contexto (audiencia objetivo, casos de uso, personalidad/tono de marca, etc.).

Intenta obtenerlo del hilo o el codebase.

1. Si no encuentras información *exacta* y debes inferir, debes PARAR y llamar a AskUserQuestionTool para confirmar.
2. Si no puedes inferirlo completamente o tu confianza es media o menor, debes PARAR y llamar a AskUserQuestionTool para preguntar.

No continúes hasta tener respuestas. Adivinar conduce a resultados genéricos.

### Usar la skill frontend-design

Usa frontend-design para principios y anti-patrones. No continúes hasta conocer todos los SÍ y NO.

---

## Evaluar el estado actual

Analiza por qué el diseño se siente demasiado seguro o aburrido:

1. **Identifica fuentes de debilidad**:
   - **Elecciones genéricas**: fuentes del sistema, colores básicos, layouts estándar
   - **Escala tímida**: todo es mediano, sin dramatismo
   - **Bajo contraste**: todo pesa visualmente parecido
   - **Estático**: sin movimiento, sin energía
   - **Predecible**: patrones estándar sin sorpresas
   - **Jerarquía plana**: nada destaca

2. **Entiende el contexto**:
   - Personalidad de marca (¿cuánto podemos empujar?)
   - Propósito (marketing puede ser más audaz que un dashboard financiero)
   - Audiencia (¿qué resonará?)
   - Restricciones (guías, accesibilidad, rendimiento)

Si algo no es claro, para y llama a AskUserQuestionTool.

**CRÍTICO**: “Más audaz” no significa caótico o estridente. Significa distintivo, memorable y confiado. Drama intencional, no ruido aleatorio.

**ADVERTENCIA - TRAMPA AI SLOP**: Al intentar “más audaz”, la IA suele caer en trucos gastados: gradientes cian/morado, glassmorphism, neones en fondos oscuros, texto con gradiente. Eso no es audaz: es genérico. Revisa TODOS los NO de frontend-design antes de continuar.

## Plan de amplificación

Estrategia para aumentar impacto manteniendo coherencia:

- **Punto focal**: ¿cuál es el momento hero? (elige UNO)
- **Dirección de personalidad**: caos maximalista, drama elegante, energía juguetona, oscuro y “moody”… elige un carril
- **Presupuesto de riesgo**: cuánto experimentar dentro de restricciones
- **Amplificar jerarquía**: grandes más grandes, pequeños más pequeños

**IMPORTANTE**: Un diseño audaz debe seguir siendo usable.

## Amplificar el diseño

Incrementa impacto sistemáticamente:

### Tipografía
- Reemplaza fuentes genéricas por elecciones distintivas
- Saltos de escala dramáticos (3x-5x, no 1.5x)
- Contraste de peso (900 con 200)
- Elecciones inesperadas (variable fonts, display, widths)

### Color
- Más saturación (sin neón)
- Paleta audaz (evita gradiente morado-azul genérico)
- Un color dominante (60% del diseño)
- Acentos de alto contraste
- Neutros teñidos hacia la marca
- Gradientes ricos multi-stop (no genéricos)

### Espacio
- Saltos de escala extremos
- Romper la grilla intencionalmente
- Layouts asimétricos
- Espacios generosos (100-200px, no 20-40px)
- Solapes con intención

### Efectos visuales
- Sombras dramáticas (pero no “drop shadow genérico en rectángulo redondeado”)
- Tratamientos de fondo: mallas, ruido, patrones
- Texturas (grain, halftone, duotone), NO glassmorphism
- Bordes/marcos: gruesos o decorativos
- Elementos custom: ilustraciones, iconos, detalles de marca

### Movimiento
- Coreografía de entrada (stagger 50-100ms)
- Efectos de scroll
- Micro-interacciones
- Transiciones con ease-out-quart/quint/expo (no bounce/elastic)

### Composición
- Momentos hero con tratamiento claro
- Flujos diagonales
- Elementos full-bleed
- Proporciones inesperadas (70/30, 80/20)

**NUNCA**:
- Añadir efectos sin propósito
- Sacrificar legibilidad
- Hacer todo “audaz” (sin contraste, nada destaca)
- Ignorar accesibilidad
- Abrumar con movimiento
- Copiar tendencias sin criterio

## Verificar calidad

- **No parece AI slop**: si se ve como “lo típico”, reinicia
- **Sigue siendo funcional**
- **Coherente e intencional**
- **Memorable**
- **Performante**
- **Accesible**

**Test**: si alguien creería inmediatamente “una IA lo hizo más audaz”, has fallado. Audaz es distintivo, no “más efectos”.

Recuerda: el diseño audaz es diseño confiado. Toma riesgos, hace declaraciones y crea experiencias memorables, pero siempre con estrategia.
