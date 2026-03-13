---
name: distill
description: Reduce diseños a su esencia eliminando complejidad innecesaria. El gran diseño es simple, potente y limpio.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o componente a destilar (opcional)
    required: false
---

Elimina complejidad innecesaria, revelando lo esencial y creando claridad mediante simplificación sin concesiones.

## PREPARACIÓN OBLIGATORIA

### Recolección de contexto (haz esto primero)

Necesitas contexto: audiencia objetivo (crítico), casos de uso (crítico) y qué es esencial vs “nice-to-have” en este producto.

1. Si no hay información *exacta* y debes inferir, PARAR y llamar a AskUserQuestionTool.
2. Si no puedes inferirlo completamente o tu confianza es media o menor, PARAR y preguntar.

No continúes sin respuestas. Simplificar lo equivocado destruye usabilidad.

### Usar la skill frontend-design

Usa frontend-design para principios y anti-patrones. No continúes hasta conocer SÍ y NO.

---

## Evaluar el estado actual

1. **Fuentes de complejidad**:
   - Demasiados elementos (botones compitiendo, redundancias)
   - Variación excesiva (colores, fuentes, tamaños sin propósito)
   - Sobrecarga de información
   - Ruido visual (bordes, sombras, decoraciones innecesarias)
   - Jerarquía confusa
   - Feature creep

2. **Encontrar la esencia**:
   - ¿Cuál es el objetivo principal del usuario? (debería ser UNO)
   - ¿Qué es necesario vs prescindible?
   - ¿Qué se puede eliminar/ocultar/combinar?
   - ¿Cuál es el 20% que aporta 80%?

Si algo no está claro, para y pregunta.

**CRÍTICO**: La simplicidad no es “menos features”, es menos obstáculos.

## Plan de simplificación

- Propósito core
- Elementos esenciales
- Divulgación progresiva
- Oportunidades de consolidación

**IMPORTANTE**: Simplificar es difícil. Requiere decir no a buenas ideas para ejecutar genial.

## Simplificar el diseño

### Arquitectura de información
- Reducir scope
- Divulgación progresiva
- Combinar acciones
- Jerarquía clara (UNA acción primaria)
- Eliminar redundancia

### Simplificación visual
- Reducir paleta (1-2 colores + neutros)
- Limitar tipografía (1 familia, 3-4 tamaños, 2-3 pesos)
- Quitar decoraciones sin función
- Aplanar estructura (no anidar cards)
- Eliminar cards innecesarias
- Espaciado consistente

### Layout
- Flujo lineal cuando sea posible
- Quitar sidebars
- Usar ancho disponible
- Alineación consistente
- Más whitespace

### Interacción
- Reducir opciones
- Defaults inteligentes
- Acciones inline
- Reducir pasos
- CTAs claras

### Contenido
- Copy más corto
- Voz activa
- Sin jerga
- Estructura escaneable
- Solo información esencial
- Sin copy redundante

### Código
- Eliminar código muerto
- Reducir profundidad de árboles
- Consolidar estilos
- Reducir variantes

**NUNCA**:
- Eliminar funcionalidad necesaria
- Sacrificar accesibilidad
- Simplificar hasta volverlo ambiguo
- Quitar info necesaria para decidir
- Eliminar jerarquía
- Sobre-simplificar dominios complejos

## Verificar

- Tareas más rápidas
- Menos carga cognitiva
- Sigue completo
- Jerarquía más clara
- Mejor performance

## Documentar complejidad removida

Si se eliminan features/opciones:
- Documenta por qué
- Considera accesos alternativos
- Monitorea feedback

Recuerda: simplificar es un acto de confianza y buen criterio.
"La perfección se alcanza no cuando no hay nada más que añadir, sino cuando no queda nada por quitar." — Antoine de Saint-Exupéry
