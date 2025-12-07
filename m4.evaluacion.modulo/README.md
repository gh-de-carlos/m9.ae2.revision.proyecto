# Evaluación del módulo

## Objetivo general

Desarrollar un sistema de gestión de tareas utilizando programación orientada a objetos (POO) en JavaScript. El sistema debe hacer uso de conceptos de ES6+, manipular el DOM, realizar solicitudes asíncronas utilizando la API fetch, y consumir una API externa para manejar y actualizar tareas. El alumno debe entregar un archivo .js que contenga el código necesario para implementar el sistema.

## Descripción del reto

Construir un sistema de gestión de tareas en el que los usuarios puedan agregar, editar, eliminar y ver tareas. El sistema debe interactuar con una API externa para almacenar y recuperar las tareas. Se debe hacer uso de la programación orientada a objetos, funcionalidades de ES6+, manejo del DOM y programación asíncrona para resolver este problema. El alumno deberá implementar las funciones de interacción con el sistema de tareas usando el objeto fetch o XHR para consumir datos de una API externa de tareas.

## Fases de desarrollo

### Fase 1: Configuración de clases y objetos

- Crear una clase `Tarea` con las siguientes propiedades:
  - `id` (número)
  - `titulo` (string)
  - `descripcion` (string)
  - `completada` (boolean)
- Implementar un método en la clase `Tarea` llamado `mostrarDetalles()`, que imprima por consola los detalles de la tarea.
- Crear una clase `ListaTareas` que contenga un arreglo tareas y métodos como:
  - `agregarTarea(tarea)`: para agregar una nueva tarea a la lista.
  - `eliminarTarea(id)`: para eliminar una tarea por su ID.
  - `marcarComoCompletada(id)`: para marcar una tarea como completada.
  - `mostrarTareas()`: para mostrar todas las tareas en consola.

### Fase 2: Interacción con el DOM y manejo de eventos

- Crear un archivo HTML con los siguientes elementos:
  - Un formulario para agregar tareas con campos `titulo` y `descripcion`.
  - Un contenedor para mostrar las tareas (lista).
  - Botones para eliminar y marcar tareas como completadas.
- Utilizar JavaScript para manipular estos elementos del DOM.
- Agregar event listeners a los botones de la interfaz, para que al hacer clic en ellos, se ejecuten las funciones correspondientes (como agregar, eliminar y marcar tareas).

### Fase 3: Consumo de API externa con `fetch` o `XHR`

- Utilizar la API `fetch` para hacer solicitudes a una API externa que gestione tareas (por ejemplo, la API de JSONPlaceholder o cualquier otra API de tareas disponible).
  - Realizar una solicitud `GET` para obtener las tareas.
  - Realizar una solicitud `POST` para agregar una nueva tarea a la base de datos externa.
  - Realizar una solicitud `PUT` para actualizar el estado de la tarea (marcar como completada).
  - Realizar una solicitud `DELETE` para eliminar una tarea de la base de datos externa.
- Las respuestas de la API deben procesarse de manera asíncrona utilizando `async/await` o `then/catch`.

### Fase 4: Integración y pruebas

- Al cargar la página, las tareas deben cargarse desde la API externa y mostrarse en la interfaz.
- Los usuarios deben poder agregar nuevas tareas mediante el formulario.
- Las tareas deben poder marcarse como completadas y reflejar estos cambios tanto en la interfaz como en la base de datos externa.
- Debe existir la opción de eliminar tareas, y estas deben eliminarse tanto de la interfaz como de la base de datos externa.

### Fase 5: Código limpio y buenas prácticas

- El código debe estar organizado en clases y funciones bien definidas.
- Debe seguirse una estructura coherente y una adecuada separación de responsabilidades.
- El código debe ser comentado para describir las funciones principales y los métodos dentro de las clases.
- Deben evitarse variables globales innecesarias y se deben seguir las convenciones del lenguaje.

## Implementación

Sistema de gestión de tareas implementado con arquitectura orientada a objetos, integración con API externa DummyJSON, persistencia en LocalStorage, y interfaz Bootstrap 5.

### Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y animaciones
- **JavaScript ES6+**: Clases, async/await, arrow functions, destructuring
- **Bootstrap 5.3**: Framework CSS para diseño responsive
- **Font Awesome 6**: Iconografía moderna
- **DummyJSON API**: API REST para gestión de tareas
- **LocalStorage**: Persistencia de datos en el navegador

### Arquitectura Implementada

El proyecto sigue una **arquitectura en capas tipo Java** con separación clara de responsabilidades:

```plaintext
js/
├── models/
│   └── Tarea.js                     # Modelo de datos (Entity)
├── persistence/
│   └── LocalStoragePersistence.js   # Capa de persistencia (DAO)
├── services/
│   └── TodoApiService.js            # Servicios de API (Service)
├── controllers/
│   └── ListaTareas.js               # Controlador principal (Controller)
└── main.js                          # Inicialización y eventos (Main)
```

### Funcionalidades Implementadas

**Requerimientos del Bootcamp:**

- [OK] **Fase 1**: Clases `Tarea` y `ListaTareas` con métodos completos
- [OK] **Fase 2**: DOM manipulation, event listeners, interfaz Bootstrap
- [OK] **Fase 3**: Integración completa con API DummyJSON (GET, POST, PUT, DELETE)
- [OK] **Fase 4**: Carga automática, CRUD completo, sincronización API-LocalStorage
- [OK] **Fase 5**: Código limpio, comentado, organizado por capas

**Características Adicionales:**

- **UI Moderna**: Bootstrap 5.3+ con Font Awesome
- **Persistencia**: LocalStorage con clave `lucifertodos`
- **API Integration**: DummyJSON con manejo de errores
- **Estadísticas**: Contadores en tiempo real
- **Debug Panel**: Herramientas educativas para aprendizaje
- **Atajos de teclado**: Ctrl+N (nueva tarea), F5 (refrescar)
- **Sincronización**: API -> LocalStorage tras cada operación exitosa

### Cómo Ejecutar

1. **Abrir el archivo**: `index.html` en cualquier navegador moderno
2. **¡Listo!** No requiere servidor ni instalación adicional

### Conceptos Educativos Demostrados

- **POO**: Clases, herencia, encapsulamiento, métodos estáticos
- **ES6+**: Arrow functions, async/await, destructuring, template literals
- **Async Programming**: Promises, fetch API, error handling
- **DOM**: Manipulation, event listeners, dynamic content
- **Architecture**: Separación de capas, patrón MVC
- **Storage**: LocalStorage, JSON serialization
- **HTTP**: REST API calls (GET, POST, PUT, DELETE)
- **UI/UX**: Responsive design, loading states, user feedback

### Panel de Debug Educativo

El panel incluye botones para:

- **Ver LocalStorage**: Inspeccionar datos almacenados
- **Limpiar LocalStorage**: Reset completo de datos
- **Probar API**: Verificar conectividad
- **Cargar Datos**: Importar tareas de ejemplo

### Logging y Debug

Todas las operaciones se loguean en consola con:

- Peticiones API
- Operaciones LocalStorage
- Operaciones exitosas
- Errores y warnings
- Funciones de debug disponibles en `debugApp`

Usa `debugApp.showDebugInfo()` en consola para información detallada.

## Testeando los endpoints con cURL

> NOTA: Puedes omitir "| jq" si quieres probarlos en tu terminal y no tienes instalado [`jq`](https://jqlang.org)

### Obtener todas las tareas

```bash
curl -X GET "https://dummyjson.com/todos" | jq
```

### Obtener una tarea específica

```bash
curl -X GET "https://dummyjson.com/todos/1" | jq
```

### Obtener una tarea aleatoria

```bash
curl -X GET "https://dummyjson.com/todos/random" | jq
```

### Obtener tareas con paginación

```bash
curl -X GET "https://dummyjson.com/todos?limit=3&skip=10" | jq
```

### Obtener tareas por usuario

```bash
curl -X GET "https://dummyjson.com/todos/user/5" | jq
```

### Agregar nueva tarea

```bash
curl -X POST "https://dummyjson.com/todos/add" \
  -H "Content-Type: application/json" \
  -d '{
    "todo": "Estudiar JavaScript POO",
    "completed": false,
    "userId": 1
  }' | jq
```

### Actualizar tarea (PUT)

```bash
curl -X PUT "https://dummyjson.com/todos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "todo": "Tarea actualizada",
    "completed": true
  }' | jq
```

### Actualizar tarea parcialmente (PATCH)

```bash
curl -X PATCH "https://dummyjson.com/todos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }' | jq
```

### Eliminar tarea

```bash
curl -X DELETE "https://dummyjson.com/todos/1" | jq
```

## Guía de Estudio para Estudiantes

### Explora el Código

1. **Inicia con `models/Tarea.js`**: Entiende cómo se modela una tarea
2. **Revisa `services/TodoApiService.js`**: Ve cómo se comunica con la API
3. **Estudia `persistence/LocalStoragePersistence.js`**: Aprende sobre almacenamiento
4. **Analiza `controllers/ListaTareas.js`**: Observa cómo se coordinan las capas
5. **Termina con `main.js`**: Ve cómo se inicializa todo

### Experimenta

- Abre DevTools (F12) y observa los logs en consola
- Usa el panel de debug para explorar funcionalidades
- Modifica código y observa los cambios
- Prueba los comandos cURL para entender la API

### Desafíos de Extensión

1. **Agregar filtros**: Por completadas/pendientes
2. **Implementar búsqueda**: Por título o descripción
3. **Añadir fechas límite**: Con notificaciones
4. **Crear categorías**: Organizar tareas por tipo
5. **Modo offline**: Sincronización cuando vuelve la conexión

### Patrones Aprendidos

- **Repository Pattern**: En `LocalStoragePersistence`
- **Service Layer**: En `TodoApiService`
- **MVC Pattern**: Controller (`ListaTareas`), Model (`Tarea`), View (DOM)
- **Facade Pattern**: En `main.js` para simplificar la API pública
- **Observer Pattern**: En event listeners y DOM updates

---

### Mas info

Puedes ver más info en la carpeta [`/docs`](./docs/).
