/**
 * Archivo principal - main.js
 * 
 * Este archivo inicializa la aplicación y maneja todos los event listeners
 * y la coordinación entre los diferentes componentes del sistema.
 */

// Variable global para la instancia principal de la aplicación
let app;

/**
 * Inicialización de la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('[INIT] Iniciando Sistema de Gestión de Tareas...');
    
    try {
        // Crear instancia principal de la aplicación
        app = new ListaTareas();
        
        // Inicializar la aplicación
        await app.inicializar();
        
        // Configurar event listeners
        configurarEventListeners();
        
        console.log('[SUCCESS] Sistema de Gestión de Tareas iniciado correctamente');
        
        // Mostrar mensaje de bienvenida
        mostrarMensajeBienvenida();
        
    } catch (error) {
        console.error('[ERROR] Error crítico al iniciar la aplicación:', error);
        mostrarErrorCritico(error);
    }
});

/**
 * Configura todos los event listeners de la aplicación
 */
function configurarEventListeners() {
    console.log('[CONFIG] Configurando event listeners...');
    
    // Event listener para el formulario de agregar tareas
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', manejarSubmitTarea);
    }
    
    // Event listener para el botón de refrescar
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', manejarRefrescar);
    }
    
    // Event listeners para el panel de debug
    configurarPanelDebug();
    
    // Event listeners para atajos de teclado
    configurarAtajosTeclado();
    
    console.log('[SUCCESS] Event listeners configurados correctamente');
}

/**
 * Maneja el submit del formulario de tareas
 * @param {Event} event - Evento de submit
 */
async function manejarSubmitTarea(event) {
    event.preventDefault();
    
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    
    if (!titleInput || !descriptionInput) {
        console.error('Elementos del formulario no encontrados');
        return;
    }
    
    const titulo = titleInput.value.trim();
    const descripcion = descriptionInput.value.trim();
    
    if (!titulo) {
        app.mostrarError('El título de la tarea es obligatorio');
        titleInput.focus();
        return;
    }
    
    try {
        // Agregar la tarea
        const success = await app.agregarTarea(titulo, descripcion);
        
        if (success) {
            // Limpiar formulario
            titleInput.value = '';
            descriptionInput.value = '';
            titleInput.focus();
        }
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        app.mostrarError('Error al agregar la tarea');
    }
}

/**
 * Maneja el click del botón refrescar
 */
async function manejarRefrescar() {
    console.log('[REFRESH] Refrescando aplicación...');
    
    try {
        await app.refrescarTareas();
    } catch (error) {
        console.error('Error al refrescar:', error);
        app.mostrarError('Error al refrescar las tareas');
    }
}

/**
 * Configura el panel de debug con sus event listeners
 */
function configurarPanelDebug() {
    // Mostrar LocalStorage
    const showLocalStorageBtn = document.getElementById('showLocalStorageBtn');
    if (showLocalStorageBtn) {
        showLocalStorageBtn.addEventListener('click', () => {
            const info = app.obtenerInfoDebug();
            app.mostrarEnDebug(info);
            console.log('[STORAGE] Info de LocalStorage:', info.localStorageInfo);
        });
    }
    
    // Limpiar LocalStorage
    const clearLocalStorageBtn = document.getElementById('clearLocalStorageBtn');
    if (clearLocalStorageBtn) {
        clearLocalStorageBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres limpiar todos los datos locales?')) {
                app.persistence.limpiarTodasLasTareas();
                app.tareas = [];
                app.renderizarTareas();
                app.actualizarEstadisticas();
                app.mostrarMensaje('LocalStorage limpiado correctamente', 'warning');
                console.log('[CLEANUP] LocalStorage limpiado');
            }
        });
    }
    
    // Probar API
    const testApiBtn = document.getElementById('testApiBtn');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', async () => {
            try {
                app.mostrarCargando(true);
                const resultado = await app.apiService.probarConexion();
                app.mostrarEnDebug(resultado);
                
                if (resultado.success) {
                    app.mostrarMensaje('Conexión con la API exitosa', 'success');
                    console.log('[SUCCESS] Prueba de API exitosa:', resultado);
                } else {
                    app.mostrarMensaje('Error de conexión con la API', 'error');
                    console.error('[ERROR] Falla en prueba de API:', resultado);
                }
            } catch (error) {
                console.error('Error en prueba de API:', error);
                app.mostrarError('Error al probar la API');
            } finally {
                app.mostrarCargando(false);
            }
        });
    }
    
    // Cargar datos de ejemplo
    const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    if (loadSampleDataBtn) {
        loadSampleDataBtn.addEventListener('click', async () => {
            try {
                if (confirm('¿Quieres cargar nuevas tareas de ejemplo desde la API?')) {
                    await app.cargarTareasDeEjemplo();
                    app.mostrarMensaje('Datos de ejemplo cargados', 'info');
                }
            } catch (error) {
                console.error('Error al cargar datos de ejemplo:', error);
                app.mostrarError('Error al cargar datos de ejemplo');
            }
        });
    }
}

/**
 * Configura atajos de teclado para la aplicación
 */
function configurarAtajosTeclado() {
    document.addEventListener('keydown', (event) => {
        // Ctrl + N: Nueva tarea
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            const titleInput = document.getElementById('taskTitle');
            if (titleInput) {
                titleInput.focus();
            }
        }
        
        // Ctrl + R: Refrescar (sin recargar página)
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            manejarRefrescar();
        }
        
        // F5: Refrescar tareas
        if (event.key === 'F5') {
            event.preventDefault();
            manejarRefrescar();
        }
    });
}

/**
 * Muestra un mensaje de bienvenida al usuario
 */
function mostrarMensajeBienvenida() {
    const estadisticas = app.persistence.obtenerEstadisticas();
    const mensaje = `¡Bienvenido al Sistema de Gestión de Tareas! 
        Tienes ${estadisticas.total} tareas: ${estadisticas.completadas} completadas y ${estadisticas.pendientes} pendientes.`;
    
    setTimeout(() => {
        app.mostrarMensaje(mensaje, 'info');
    }, 1000);
}

/**
 * Muestra un error crítico cuando la aplicación no puede iniciar
 * @param {Error} error - Error ocurrido
 */
function mostrarErrorCritico(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `
        <h4 class="alert-heading">¡Error Crítico!</h4>
        <p>La aplicación no pudo iniciarse correctamente:</p>
        <hr>
        <p class="mb-0"><strong>Error:</strong> ${error.message}</p>
        <small class="text-muted">Revisa la consola del navegador para más detalles.</small>
    `;
    
    // Insertar al inicio del container principal
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
}

/**
 * Funciones globales para ser llamadas desde el HTML
 * Estas funciones actúan como proxy hacia los métodos de la instancia de la aplicación
 */

/**
 * Alterna el estado de una tarea (llamada desde HTML)
 * @param {number} id - ID de la tarea
 */
window.alternarEstadoTarea = async function(id) {
    if (app) {
        await app.alternarEstadoTarea(id);
    }
};

/**
 * Muestra los detalles de una tarea (llamada desde HTML)
 * @param {number} id - ID de la tarea
 */
window.mostrarDetallesTarea = function(id) {
    if (app) {
        app.mostrarDetallesTarea(id);
    }
};

/**
 * Confirma y elimina una tarea (llamada desde HTML)
 * @param {number} id - ID de la tarea
 */
window.confirmarEliminacion = function(id) {
    if (app) {
        app.confirmarEliminacion(id);
    }
};

/**
 * Manejo de errores globales para debugging
 */
window.addEventListener('error', (event) => {
    console.error('❌ Error global capturado:', event.error);
    if (app) {
        app.mostrarError('Se produjo un error inesperado. Revisa la consola para más detalles.');
    }
});

/**
 * Manejo de promesas rechazadas no capturadas
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('[ERROR] Promise rechazada no manejada:', event.reason);
    if (app) {
        app.mostrarError('Error de operación asíncrona. Revisa la consola para más detalles.');
    }
});

/**
 * Funciones utilitarias globales para debugging (disponibles en consola)
 */
window.debugApp = {
    /**
     * Obtiene la instancia de la aplicación
     */
    getApp: () => app,
    
    /**
     * Muestra información de debug en consola
     */
    showDebugInfo: () => {
        if (app) {
            const info = app.obtenerInfoDebug();
            console.table(info);
            return info;
        }
        return null;
    },
    
    /**
     * Muestra todas las tareas en consola
     */
    showAllTasks: () => {
        if (app) {
            app.mostrarTareas();
            return app.tareas;
        }
        return [];
    },
    
    /**
     * Limpia la consola y muestra el estado actual
     */
    clear: () => {
        console.clear();
        console.log('[DEBUG] Sistema de Gestión de Tareas - Debug Console');
        console.log('Usa debugApp.showDebugInfo() para ver información detallada');
        console.log('Usa debugApp.showAllTasks() para ver todas las tareas');
    },
    
    /**
     * Exporta los datos para backup
     */
    exportData: () => {
        if (app) {
            const data = {
                tareas: app.tareas.map(t => t.toJSON()),
                estadisticas: app.persistence.obtenerEstadisticas(),
                info: app.obtenerInfoDebug(),
                exportDate: new Date().toISOString()
            };
            console.log('📤 Datos exportados:', data);
            return data;
        }
        return null;
    },
    
    /**
     * Simula agregar tareas de prueba
     */
    addTestTasks: async (cantidad = 3) => {
        if (app) {
            for (let i = 1; i <= cantidad; i++) {
                await app.agregarTarea(
                    `Tarea de prueba ${i}`,
                    `Esta es una tarea de prueba número ${i} creada para debugging`
                );
            }
            console.log(`[SUCCESS] Agregadas ${cantidad} tareas de prueba`);
        }
    }
};

// Mostrar información de debug al cargar
console.log('[DEBUG] Funciones de debug disponibles en window.debugApp');
console.log('Ejemplo: debugApp.showDebugInfo()');

/**
 * Mensaje informativo para desarrolladores
 */
console.log(`
🎓 Sistema de Gestión de Tareas - Bootcamp Edition
================================================
📚 Conceptos implementados:
- Programación Orientada a Objetos (POO)
- ES6+ (clases, arrow functions, async/await, destructuring)
- Fetch API para peticiones HTTP
- LocalStorage para persistencia
- Manipulación del DOM
- Event Listeners y manejo de eventos
- Arquitectura en capas (Model-Service-Controller)
- Manejo de errores y logging
- Bootstrap para UI responsiva

🛠️ Estructura del código:
- models/Tarea.js: Modelo de datos
- persistence/LocalStoragePersistence.js: Capa de persistencia
- services/TodoApiService.js: Servicio de API
- controllers/ListaTareas.js: Controlador principal
- main.js: Inicialización y event handling

🔍 Para debugging:
- Abre las DevTools (F12)
- Usa debugApp.showDebugInfo() para información detallada
- Todas las operaciones se loggean en consola
- El panel de debug en la UI permite probar funcionalidades

¡Feliz aprendizaje! [SUCCESS]
`);

// Exportar para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        app,
        debugApp: window.debugApp
    };
}