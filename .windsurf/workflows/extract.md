---
name: extract
description: Extrae y consolida componentes reutilizables, tokens de diseño y patrones en tu sistema de diseño. Identifica oportunidades de reutilización sistemática y enriquece tu biblioteca de componentes.
user-invokable: true
args:
  - name: target
    description: La funcionalidad, componente o área de la cual extraer (opcional)
    required: false
---

Identifica patrones reutilizables, componentes y tokens de diseño, y luego extráelos y consolídalos en el sistema de diseño para reutilización sistemática.

## Descubrir

Analiza el área objetivo para identificar oportunidades de extracción:

1. **Encuentra el sistema de diseño**: Localiza tu sistema de diseño, biblioteca de componentes o directorio de UI compartida (busca “design system”, “ui”, “components”, etc.). Entiende su estructura:
   - Organización de componentes y convenciones de nombre
   - Estructura de tokens de diseño (si existe)
   - Patrones de documentación
   - Convenciones de import/export

   **CRÍTICO**: Si no existe un sistema de diseño, pregunta antes de crear uno. Primero entiende la ubicación y estructura preferidas.

2. **Identifica patrones**: busca:
   - **Componentes repetidos**: patrones UI similares usados múltiples veces (botones, cards, inputs, etc.)
   - **Valores hard-coded**: colores, espaciado, tipografía, sombras que deberían ser tokens
   - **Variaciones inconsistentes**: múltiples implementaciones del mismo concepto (3 estilos de botón distintos)
   - **Patrones reutilizables**: patrones de layout, composición e interacción que valga la pena sistematizar

3. **Evalúa el valor**: no todo debe extraerse. Considera:
   - ¿Se usa 3+ veces o probablemente se reutilizará?
   - ¿Sistematizar mejora consistencia?
   - ¿Es patrón general o específico del contexto?
   - Coste de mantenimiento vs beneficio

## Plan de extracción

Crea un plan sistemático:

- **Componentes a extraer**: qué elementos UI pasan a ser componentes reutilizables
- **Tokens a crear**: qué valores hard-coded pasan a tokens
- **Variantes a soportar**: qué variaciones necesita cada componente
- **Convenciones de naming**: nombres de componentes/tokens/props alineados con patrones existentes
- **Ruta de migración**: cómo refactorizar usos existentes para consumir las versiones compartidas

**IMPORTANTE**: Los sistemas de diseño crecen de forma incremental. Extrae lo claramente reutilizable ahora, no todo lo que quizá se reutilice algún día.

## Extraer y enriquecer

Construye versiones mejoradas y reutilizables:

- **Componentes**: crea componentes bien diseñados con:
  - API de props clara con defaults razonables
  - Variantes adecuadas
  - Accesibilidad incorporada (ARIA, teclado, foco)
  - Documentación y ejemplos de uso

- **Tokens de diseño**: crea tokens con:
  - Naming claro (primitivos vs semánticos)
  - Jerarquía y organización
  - Documentación de cuándo usar cada token

- **Patrones**: documenta patrones con:
  - Cuándo usar el patrón
  - Ejemplos de código
  - Variaciones y combinaciones

**NUNCA**:
- Extraer implementaciones one-off sin generalizarlas
- Crear componentes tan genéricos que no sirvan
- Extraer sin respetar convenciones del sistema de diseño existente
- Omitir tipados TypeScript o documentación de props
- Crear tokens para cada valor individual (los tokens deben tener significado)

## Migrar

Reemplaza usos existentes por las versiones compartidas:

- Encontrar todas las instancias
- Reemplazar sistemáticamente
- Probar a fondo
- Borrar código muerto

## Documentar

Actualiza documentación del sistema de diseño:

- Añadir nuevos componentes a la biblioteca
- Documentar uso/valores de tokens
- Añadir ejemplos y guías
- Actualizar Storybook o catálogo de componentes

Recuerda: un buen sistema de diseño es un sistema vivo. Extrae patrones cuando aparezcan, enriquécelos con criterio y mantén consistencia.
