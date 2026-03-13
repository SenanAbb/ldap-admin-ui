---
name: teach-impeccable
description: Configuración única que recopila contexto de diseño de tu proyecto y lo guarda en tu archivo de configuración de IA. Ejecútalo una vez para establecer guías persistentes.
user-invokable: true
---

Recopila contexto de diseño para este proyecto y luego persístelo para futuras sesiones.

## Paso 1: Explorar el codebase

Antes de preguntar, escanea el proyecto para descubrir lo que puedas:

- **README y docs**: propósito, audiencia objetivo, objetivos declarados
- **Package.json / configs**: stack, dependencias, librerías de diseño
- **Componentes existentes**: patrones actuales, espaciado, tipografía
- **Activos de marca**: logos, favicons, valores de color
- **Tokens / variables CSS**: paletas, stacks de fuentes, escalas de espaciado
- **Guías de estilo o documentación de marca**

Anota qué aprendiste y qué sigue sin estar claro.

## Paso 2: Preguntas centradas en UX

PARA y llama a AskUserQuestionTool para aclarar solo lo que no pudiste inferir del codebase:

### Usuarios y propósito
- ¿Quién usa esto y en qué contexto?
- ¿Qué trabajo intentan completar?
- ¿Qué emociones debería evocar la interfaz? (confianza, calma, urgencia, etc.)

### Marca y personalidad
- Describe la personalidad de marca en 3 palabras
- Sitios/apps de referencia que capturen el “feel” correcto (y qué específicamente)
- Qué NO debería parecer (anti-referencias)

### Preferencias estéticas
- Preferencias fuertes de dirección visual (minimal, bold, elegante, etc.)
- ¿Modo claro, oscuro o ambos?
- ¿Colores que deben usarse o evitarse?

### Accesibilidad e inclusión
- Requisitos específicos (nivel WCAG, necesidades conocidas)
- Consideraciones de reduced motion, daltonismo u otras acomodaciones

Sáltate preguntas cuya respuesta ya sea clara por la exploración.

## Paso 3: Escribir el contexto de diseño

Sintetiza hallazgos + respuestas del usuario en una sección `## Design Context`:

```markdown
## Design Context

### Users
[Quiénes son, contexto, trabajo a realizar]

### Brand Personality
[Voz/tono, personalidad en 3 palabras, objetivos emocionales]

### Aesthetic Direction
[Tono visual, referencias, anti-referencias, tema]

### Design Principles
[3-5 principios derivados que guíen decisiones]
```

Escribe esta sección en `CLAUDE.md` en la raíz del proyecto. Si el archivo ya existe, añade o actualiza la sección.

Confirma la finalización y resume los principios clave que guiarán el trabajo futuro.
