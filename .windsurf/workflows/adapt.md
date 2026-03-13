---
name: adapt
description: Adapta diseños para que funcionen en diferentes tamaños de pantalla, dispositivos, contextos o plataformas. Garantiza una experiencia consistente en entornos variados.
user-invokable: true
args:
  - name: target
    description: La funcionalidad o componente a adaptar (opcional)
    required: false
  - name: context
    description: Para qué adaptar (móvil, tablet, escritorio, impresión, email, etc.)
    required: false
---

Adapta diseños existentes para que funcionen de forma efectiva en distintos contextos: diferentes tamaños de pantalla, dispositivos, plataformas o casos de uso.

## Evaluar el reto de adaptación

Entiende qué necesita adaptación y por qué:

1. **Identifica el contexto de origen**:
   - ¿Para qué se diseñó originalmente? (¿Web de escritorio? ¿App móvil?)
   - ¿Qué supuestos se hicieron? (¿Pantalla grande? ¿Ratón? ¿Conexión rápida?)
   - ¿Qué funciona bien en el contexto actual?

2. **Entiende el contexto objetivo**:
   - **Dispositivo**: ¿móvil, tablet, escritorio, TV, reloj, impresión?
   - **Método de entrada**: ¿táctil, ratón, teclado, voz, mando?
   - **Restricciones de pantalla**: tamaño, resolución, orientación.
   - **Conexión**: wifi rápido, 3G lento, offline.
   - **Contexto de uso**: en movimiento vs escritorio, vistazo rápido vs lectura enfocada.
   - **Expectativas del usuario**: ¿qué esperan los usuarios en esta plataforma?

3. **Identifica desafíos de adaptación**:
   - ¿Qué no va a caber? (contenido, navegación, funcionalidades)
   - ¿Qué no va a funcionar? (hover en táctil, objetivos táctiles pequeños)
   - ¿Qué es inapropiado? (patrones de escritorio en móvil, patrones móviles en escritorio)

**CRÍTICO**: Adaptar no es solo escalar; es repensar la experiencia para el nuevo contexto.

## Planificar la estrategia de adaptación

Crea una estrategia apropiada al contexto:

### Adaptación a móvil (Escritorio → Móvil)

**Estrategia de layout**:
- Columna única en lugar de múltiples columnas
- Apilado vertical en lugar de lado a lado
- Componentes a ancho completo en lugar de anchos fijos
- Navegación inferior en lugar de navegación superior/lateral

**Estrategia de interacción**:
- Objetivos táctiles mínimo 44x44px (sin depender de hover)
- Gestos de deslizamiento cuando tenga sentido (listas, carruseles)
- Hojas inferiores (bottom sheets) en lugar de desplegables
- Diseño “thumb-first” (controles al alcance del pulgar)
- Áreas de toque más grandes con más separación

**Estrategia de contenido**:
- Divulgación progresiva (no mostrarlo todo a la vez)
- Priorizar contenido principal (secundario en tabs/accordions)
- Texto más corto (más conciso)
- Texto más grande (mínimo 16px)

**Estrategia de navegación**:
- Menú hamburguesa o navegación inferior
- Reducir complejidad de navegación
- Encabezados “sticky” para mantener contexto
- Botón “atrás” en el flujo de navegación

### Adaptación a tablet (enfoque híbrido)

**Estrategia de layout**:
- Layouts de dos columnas (ni una ni tres)
- Paneles laterales para contenido secundario
- Vistas maestro-detalle (lista + detalle)
- Adaptación según orientación (vertical vs horizontal)

**Estrategia de interacción**:
- Soportar táctil y puntero
- Objetivos táctiles 44x44px, permitiendo layouts más densos que en móvil
- Cajones laterales de navegación
- Formularios multi-columna cuando proceda

### Adaptación a escritorio (Móvil → Escritorio)

**Estrategia de layout**:
- Layouts multi-columna (aprovechar el espacio horizontal)
- Navegación lateral siempre visible
- Múltiples paneles de información a la vez
- Anchos fijos con max-width (no estirar hasta 4K)

**Estrategia de interacción**:
- Estados hover para información adicional
- Atajos de teclado
- Menús contextuales con clic derecho
- Arrastrar y soltar cuando sea útil
- Selección múltiple con Shift/Cmd

**Estrategia de contenido**:
- Mostrar más información de entrada (menos divulgación progresiva)
- Tablas con muchas columnas
- Visualizaciones más ricas
- Descripciones más detalladas

### Adaptación a impresión (Pantalla → Impresión)

**Estrategia de layout**:
- Saltos de página en puntos lógicos
- Eliminar navegación, footer, e interacciones
- Blanco y negro (o color limitado)
- Márgenes apropiados para encuadernación

**Estrategia de contenido**:
- Expandir contenido abreviado (URLs completas, secciones ocultas)
- Añadir números de página, cabeceras y pies
- Incluir metadatos (fecha de impresión, título)
- Convertir gráficas a versiones aptas para impresión

### Adaptación a email (Web → Email)

**Estrategia de layout**:
- Ancho estrecho (máximo 600px)
- Solo una columna
- CSS inline (sin hojas externas)
- Layouts basados en tablas (compatibilidad con clientes de correo)

**Estrategia de interacción**:
- CTAs grandes y evidentes (botones, no enlaces de texto)
- Sin hover (no es fiable)
- Deep links a la app web para interacciones complejas

## Implementar adaptaciones

Aplica cambios de forma sistemática:

### Breakpoints responsivos

Elige breakpoints apropiados:
- Móvil: 320px-767px
- Tablet: 768px-1023px
- Escritorio: 1024px+
- O breakpoints guiados por el contenido (donde el diseño se rompe)

### Técnicas de adaptación de layout

- **CSS Grid/Flexbox**: refluye layouts automáticamente
- **Container Queries**: adapta según el contenedor, no el viewport
- **`clamp()`**: tamaños fluidos entre mínimo y máximo
- **Media queries**: estilos distintos para contextos distintos
- **Propiedades display**: mostrar/ocultar elementos por contexto

### Adaptación a táctil

- Aumentar objetivos táctiles (mínimo 44x44px)
- Añadir más separación entre elementos interactivos
- Eliminar interacciones que dependan de hover
- Añadir feedback táctil (resaltados, estados activos)
- Considerar zonas del pulgar (abajo suele ser más alcanzable que arriba)

### Adaptación de contenido

- Usar `display: none` con moderación (aún se descarga)
- Mejora progresiva (contenido core primero, mejoras en pantallas grandes)
- Lazy loading para contenido fuera de pantalla
- Imágenes responsivas (`srcset`, `picture`)

### Adaptación de navegación

- Transformar navegación compleja en hamburguesa/cajón en móvil
- Barra inferior para apps móviles
- Navegación lateral persistente en escritorio
- Migas de pan en pantallas pequeñas para contexto

**IMPORTANTE**: Prueba en dispositivos reales, no solo en DevTools. La emulación ayuda, pero no es perfecta.

**NUNCA**:
- Ocultar funcionalidad core en móvil (si importa, haz que funcione)
- Asumir que escritorio = dispositivo potente (considera accesibilidad, equipos antiguos)
- Usar arquitecturas de información distintas según contexto (confunde)
- Romper expectativas de plataforma (móvil espera patrones móviles)
- Olvidar la orientación horizontal en móvil/tablet
- Usar breakpoints genéricos “a ciegas” (usa breakpoints guiados por el contenido)
- Ignorar táctil en escritorio (muchos equipos tienen pantallas táctiles)

## Verificar adaptaciones

Prueba a fondo en diferentes contextos:

- **Dispositivos reales**: teléfonos, tablets, escritorios
- **Orientaciones**: vertical y horizontal
- **Navegadores**: Safari, Chrome, Firefox, Edge
- **Sistemas operativos**: iOS, Android, Windows, macOS
- **Métodos de entrada**: táctil, ratón, teclado
- **Casos límite**: pantallas muy pequeñas (320px) y muy grandes (4K)
- **Conexiones lentas**: prueba con red limitada

Recuerda: eres un experto en diseño multiplataforma. Crea experiencias que se sientan nativas en cada contexto manteniendo consistencia de marca y funcionalidad. Adapta con intención y prueba con rigor.
