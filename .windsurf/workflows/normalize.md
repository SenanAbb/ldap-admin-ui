---
name: normalize
description: Normaliza el diseño para que coincida con tu sistema de diseño y garantice consistencia.
user-invokable: true
args:
  - name: feature
    description: La página, ruta o funcionalidad a normalizar (opcional)
    required: false
---

Analiza y rediseña la funcionalidad para que coincida perfectamente con los estándares, la estética y los patrones establecidos del sistema de diseño.

## Plan

Antes de hacer cambios, entiende el contexto a fondo:

1. **Descubrir el sistema de diseño**: busca documentación del sistema de diseño, guías de UI, bibliotecas de componentes o style guides (grep por “design system”, “ui guide”, “style guide”, etc.). Estúdialo hasta entender:
   - Principios core y dirección estética
   - Audiencia objetivo y personas
   - Patrones y convenciones de componentes
   - Tokens de diseño (colores, tipografía, espaciado)

   **CRÍTICO**: si algo no está claro, pregunta. No adivines principios del sistema de diseño.

2. **Analizar la funcionalidad actual**: evalúa qué funciona y qué no:
   - Dónde se desvía de los patrones del sistema
   - Qué inconsistencias son cosméticas vs funcionales
   - Causa raíz: tokens faltantes, implementaciones one-off o desalineación conceptual

3. **Crear plan de normalización**: define cambios específicos para alinear con el sistema:
   - Qué componentes pueden reemplazarse por equivalentes del sistema
   - Qué estilos deben usar tokens en lugar de valores hard-coded
   - Cómo hacer que los patrones UX coincidan con flows existentes

   **IMPORTANTE**: Gran diseño es diseño efectivo. Prioriza consistencia UX y usabilidad por encima de “polish” visual.

## Ejecutar

Aborda inconsistencias sistemáticamente:

- **Tipografía**: usa fuentes/tamaños/pesos/line-height del sistema. Reemplaza hard-coded por tokens o clases.
- **Color y tema**: aplica tokens. Elimina colores one-off fuera de paleta.
- **Espaciado y layout**: usa tokens de espaciado. Alinea con grid y patrones existentes.
- **Componentes**: reemplaza custom por componentes del sistema. Asegura props/variantes alineadas.
- **Movimiento e interacción**: iguala timing, easing y patrones de interacción.
- **Responsive**: breakpoints y patrones coherentes con el sistema.
- **Accesibilidad**: contraste, foco, ARIA coherentes.
- **Divulgación progresiva**: jerarquía informativa y gestión de complejidad coherentes.

**NUNCA**:
- Crear componentes one-off si hay equivalentes en el sistema
- Hard-codear valores que deberían ser tokens
- Introducir patrones nuevos que diverjan del sistema
- Comprometer accesibilidad por consistencia visual

## Limpieza

Tras normalizar:

- Consolidar componentes reutilizables
- Eliminar código huérfano
- Verificar calidad (lint, type-check, tests)
- Evitar duplicación (DRY)

Recuerda: eres un diseñador/a frontend brillante con gusto impecable, fuerte en UX y UI. Ejecuta con precisión.
