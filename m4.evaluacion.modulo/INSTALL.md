# Guía de Instalación y Uso

## Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge - últimas versiones)
- Conexión a Internet (para CDN de Bootstrap y Font Awesome)
- Opcionalmente: Servidor web local (Live Server, Python HTTP Server, etc.)

## Instalación

### Clonar o descargar el proyecto

```bash
git clone <repository-url>
cd m4.evaluacion.modulo
```

### Abrir el proyecto

- **Opción 1 (Recomendada)**: Usar Live Server en VS Code
  - Instalar extensión "Live Server"
  - Click derecho en `index.html` → "Open with Live Server"

- **Opción 2**: Usar Python HTTP Server

```bash
python -m http.server 8000
# Abrir http://localhost:8000 en el navegador
```

- **Opción 3**: Abrir directamente
  - Doble click en `index.html`
  - Nota: Algunas funcionalidades pueden no funcionar correctamente

## Uso Básico

### Agregar una Tarea

1. Completar el campo "Título" (obligatorio)
2. Opcionalmente agregar una "Descripción"
3. Click en "Agregar Tarea" o presionar Enter

### Gestionar Tareas

- **Completar/Pendiente**: Click en el botón verde/amarillo ✓/↻
- **Ver Detalles**: Click en el botón azul ⓘ (muestra detalles en consola)
- **Eliminar**: Click en el botón rojo 🗑️ (solicita confirmación)

### Atajos de Teclado

- `Ctrl + N`: Enfocar campo de nueva tarea
- `F5`: Refrescar lista de tareas (sin recargar página)

### Panel de Debug

Herramientas educativas para aprender:

- **Ver LocalStorage**: Inspecciona datos almacenados
- **Limpiar LocalStorage**: Elimina todos los datos locales
- **Probar API**: Verifica conectividad con DummyJSON
- **Cargar Datos de Ejemplo**: Importa tareas de demostración

## Funcionalidades Avanzadas

### Consola de Desarrollador

Abrir DevTools (F12) y usar:

```javascript
// Ver información de debug
debugApp.showDebugInfo()

// Ver todas las tareas
debugApp.showAllTasks()

// Exportar datos
debugApp.exportData()

// Agregar tareas de prueba
debugApp.addTestTasks(5)

// Limpiar consola
debugApp.clear()
```

### Inspección de Datos

Todas las operaciones se registran en consola con prefijos:

- `[INIT]`: Inicialización
- `[SUCCESS]`: Operación exitosa
- `[ERROR]`: Errores
- `[WARNING]`: Advertencias
- `[NETWORK]`: Peticiones de red
- `[STORAGE]`: Operaciones de almacenamiento

## Solución de Problemas

### La aplicación no carga

- Verificar conexión a Internet (CDNs)
- Verificar consola de navegador (F12)
- Asegurarse que JavaScript está habilitado

### LocalStorage no funciona

- Verificar que el navegador permite LocalStorage
- Revisar configuración de privacidad/cookies
- Probar en modo incógnito

### API no responde

- Verificar conectividad con: `debugApp.showDebugInfo()`
- La API DummyJSON debe estar accesible
- Las operaciones continúan en modo local si falla la API

### Errores en consola

- Los errores se muestran con prefijo `[ERROR]`
- La mayoría de errores de API no afectan funcionalidad local
- Usar `debugApp.exportData()` para backup antes de limpiar

## Personalización

### Cambiar API

Editar `js/services/TodoApiService.js`:

```javascript
constructor(baseUrl = 'https://tu-api.com') {
    this.baseUrl = baseUrl;
    this.todosEndpoint = `${baseUrl}/todos`;
}
```

### Cambiar clave de LocalStorage

Editar `js/controllers/ListaTareas.js`:

```javascript
constructor() {
    this.persistence = new LocalStoragePersistence('tu-clave-aqui');
    // ...
}
```

### Modificar estilos

Editar `css/styles.css` o variables CSS en `:root`:

```css
:root {
    --primary-gradient: linear-gradient(tu-gradiente);
    --shadow-soft: tu-sombra;
    /* ... */
}
```

## Contribuir

Para contribuir al proyecto:

1. Hacer fork del repositorio
2. Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir un Pull Request

## Recursos Adicionales

- [Documentación Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [DummyJSON API Docs](https://dummyjson.com/docs/todos)
- [MDN JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)

## Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT para fines educativos.
