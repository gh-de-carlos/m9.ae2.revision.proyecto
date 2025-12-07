/**
 * Clase ListaTareas - Controlador principal para la gestión de tareas
 *
 * Esta clase actúa como controlador en el patrón MVC, coordinando entre
 * el modelo (Tarea), la persistencia (LocalStoragePersistence),
 * el servicio (TodoApiService) y la vista (DOM).
 */
class ListaTareas {
    /**
     * Constructor de la clase ListaTareas
     */
    constructor() {
        // Inicializar dependencias
        this.persistence = new LocalStoragePersistence('lucifertodos');
        this.apiService = new TodoApiService();
        this.tareas = [];

        // Referencias a elementos del DOM
        this.elementos = {
            taskContainer: document.getElementById('taskContainer'),
            emptyState: document.getElementById('emptyState'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            totalTasks: document.getElementById('totalTasks'),
            completedTasks: document.getElementById('completedTasks'),
            pendingTasks: document.getElementById('pendingTasks'),
            debugOutput: document.getElementById('debugOutput')
        };

        // Estado de la aplicación
        this.estado = {
            cargando: false,
            ultimaActualizacion: null
        };

        console.log('[SUCCESS] ListaTareas inicializada correctamente');
    }

    /**
     * Inicializa la aplicación
     */
    async inicializar() {
        try {
            console.log('[INIT] Inicializando aplicación...');

            // Verificar disponibilidad de LocalStorage
            if (!LocalStoragePersistence.esLocalStorageDisponible()) {
                throw new Error('LocalStorage no está disponible en este navegador');
            }

            // Cargar tareas desde LocalStorage
            await this.cargarTareasDesdeLocalStorage();

            // Si no hay tareas locales, cargar algunas de la API para demostración
            if (this.tareas.length === 0) {
                await this.cargarTareasDeEjemplo();
            }

            // Renderizar interfaz inicial
            this.renderizarTareas();
            this.actualizarEstadisticas();

            console.log('[SUCCESS] Aplicación inicializada correctamente');
        } catch (error) {
            console.error('[ERROR] Error al inicializar aplicación:', error);
            this.mostrarError('Error al inicializar la aplicación: ' + error.message);
        }
    }

    /**
     * Carga tareas desde LocalStorage
     */
    async cargarTareasDesdeLocalStorage() {
        try {
            const datosGuardados = this.persistence.obtenerTodasLasTareas();
            this.tareas = datosGuardados.map(data => Tarea.fromJSON(data));
            console.log(`[STORAGE] Cargadas ${this.tareas.length} tareas desde LocalStorage`);
        } catch (error) {
            console.error('Error al cargar tareas desde LocalStorage:', error);
            this.tareas = [];
        }
    }

    /**
     * Carga tareas de ejemplo desde la API
     */
    async cargarTareasDeEjemplo() {
        try {
            this.mostrarCargando(true);
            const tareasApi = await this.apiService.cargarDatosDeEjemplo(5);

            for (const tareaApi of tareasApi) {
                const tarea = Tarea.fromApiResponse(tareaApi);
                this.tareas.push(tarea);
            }

            // Guardar en LocalStorage
            await this.guardarEnLocalStorage();

            console.log(`[NETWORK] Cargadas ${tareasApi.length} tareas de ejemplo desde la API`);
        } catch (error) {
            console.error('Error al cargar tareas de ejemplo:', error);
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Agrega una nueva tarea
     * @param {string} titulo - Título de la tarea
     * @param {string} descripcion - Descripción de la tarea
     * @returns {Promise<boolean>} true si se agregó correctamente
     */
    async agregarTarea(titulo, descripcion = '') {
        try {
            // Validar datos
            Tarea.validar({ titulo, descripcion });

            this.mostrarCargando(true);

            // Obtener siguiente ID disponible
            const nuevoId = this.persistence.obtenerSiguienteId();

            // Crear nueva tarea
            const nuevaTarea = new Tarea(nuevoId, titulo, descripcion, false, 1);

            // Intentar crear en la API primero
            try {
                const respuestaApi = await this.apiService.agregarTarea(nuevaTarea.toJSON());
                console.log('[SUCCESS] Tarea creada en la API:', respuestaApi);
            } catch (apiError) {
                console.warn('[WARNING] No se pudo crear en la API, continuando con almacenamiento local:', apiError);
            }

            // Agregar a la lista local
            this.tareas.push(nuevaTarea);

            // Guardar en LocalStorage
            await this.guardarEnLocalStorage();

            // Actualizar interfaz
            this.renderizarTareas();
            this.actualizarEstadisticas();

            console.log('[SUCCESS] Tarea agregada exitosamente:', nuevaTarea.titulo);
            this.mostrarMensaje('Tarea agregada correctamente', 'success');

            return true;
        } catch (error) {
            console.error('[ERROR] Error al agregar tarea:', error);
            this.mostrarError('Error al agregar la tarea: ' + error.message);
            return false;
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Elimina una tarea por su ID
     * @param {number} id - ID de la tarea a eliminar
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    async eliminarTarea(id) {
        try {
            const tarea = this.obtenerTareaPorId(id);
            if (!tarea) {
                throw new Error(`No se encontró la tarea con ID ${id}`);
            }

            this.mostrarCargando(true);

            // Intentar eliminar de la API
            try {
                await this.apiService.eliminarTarea(id);
                console.log('[SUCCESS] Tarea eliminada de la API');
            } catch (apiError) {
                console.warn('[WARNING] No se pudo eliminar de la API, continuando con eliminación local:', apiError);
            }

            // Eliminar de la lista local
            this.tareas = this.tareas.filter(t => t.id !== id);

            // Actualizar LocalStorage
            await this.guardarEnLocalStorage();

            // Actualizar interfaz
            this.renderizarTareas();
            this.actualizarEstadisticas();

            console.log('[SUCCESS] Tarea eliminada exitosamente:', tarea.titulo);
            this.mostrarMensaje('Tarea eliminada correctamente', 'success');

            return true;
        } catch (error) {
            console.error('[ERROR] Error al eliminar tarea:', error);
            this.mostrarError('Error al eliminar la tarea: ' + error.message);
            return false;
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Marca una tarea como completada por su ID
     * @param {number} id - ID de la tarea
     * @returns {Promise<boolean>} true si se marcó correctamente
     */
    async marcarComoCompletada(id) {
        try {
            const tarea = this.obtenerTareaPorId(id);
            if (!tarea) {
                throw new Error(`No se encontró la tarea con ID ${id}`);
            }

            this.mostrarCargando(true);

            // Intentar actualizar en la API
            try {
                await this.apiService.marcarComoCompletada(id);
                console.log('[SUCCESS] Tarea marcada como completada en la API');
            } catch (apiError) {
                console.warn('[WARNING] No se pudo actualizar en la API, continuando con actualización local:', apiError);
            }

            // Actualizar tarea local
            tarea.marcarComoCompletada();

            // Guardar en LocalStorage
            await this.guardarEnLocalStorage();

            // Actualizar interfaz
            this.renderizarTareas();
            this.actualizarEstadisticas();

            console.log('[SUCCESS] Tarea marcada como completada:', tarea.titulo);
            this.mostrarMensaje('Tarea completada', 'success');

            return true;
        } catch (error) {
            console.error('[ERROR] Error al marcar tarea como completada:', error);
            this.mostrarError('Error al completar la tarea: ' + error.message);
            return false;
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Alterna el estado de completitud de una tarea
     * @param {number} id - ID de la tarea
     * @returns {Promise<boolean>} true si se alteró correctamente
     */
    async alternarEstadoTarea(id) {
        try {
            const tarea = this.obtenerTareaPorId(id);
            if (!tarea) {
                throw new Error(`No se encontró la tarea con ID ${id}`);
            }

            const estadoOriginal = tarea.completada;

            this.mostrarCargando(true);

            // Intentar actualizar en la API
            try {
                await this.apiService.alternarEstadoTarea(id, estadoOriginal);
                console.log('[SUCCESS] Estado de tarea alternado en la API');
            } catch (apiError) {
                console.warn('[WARNING] No se pudo actualizar en la API, continuando con actualización local:', apiError);
            }

            // Alternar estado local
            tarea.alternarEstado();

            // Guardar en LocalStorage
            await this.guardarEnLocalStorage();

            // Actualizar interfaz
            this.renderizarTareas();
            this.actualizarEstadisticas();

            const mensaje = tarea.completada ? 'Tarea completada' : 'Tarea marcada como pendiente';
            this.mostrarMensaje(mensaje, 'success');

            return true;
        } catch (error) {
            console.error('[ERROR] Error al alternar estado de tarea:', error);
            this.mostrarError('Error al cambiar el estado de la tarea: ' + error.message);
            return false;
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Obtiene una tarea por su ID
     * @param {number} id - ID de la tarea
     * @returns {Tarea|null} La tarea encontrada o null
     */
    obtenerTareaPorId(id) {
        return this.tareas.find(tarea => tarea.id === id) || null;
    }

    /**
     * Muestra todas las tareas en consola (para debugging)
     */
    mostrarTareas() {
        console.log('=== LISTA DE TAREAS ===');
        if (this.tareas.length === 0) {
            console.log('No hay tareas disponibles');
        } else {
            this.tareas.forEach((tarea, index) => {
                console.log(`${index + 1}. ${tarea.obtenerResumen()}`);
            });
        }
        console.log(`Total: ${this.tareas.length} tareas`);
        console.log('====================');
    }

    /**
     * Guarda todas las tareas en LocalStorage
     */
    async guardarEnLocalStorage() {
        try {
            const datosParaGuardar = this.tareas.map(tarea => tarea.toJSON());
            this.persistence.guardarTodasLasTareas(datosParaGuardar);
            this.estado.ultimaActualizacion = new Date();
        } catch (error) {
            console.error('Error al guardar en LocalStorage:', error);
            throw error;
        }
    }

    /**
     * Renderiza todas las tareas en el DOM
     */
    renderizarTareas() {
        if (!this.elementos.taskContainer) {
            console.error('Contenedor de tareas no encontrado');
            return;
        }

        // Limpiar contenedor
        this.elementos.taskContainer.innerHTML = '';

        // Mostrar estado vacío si no hay tareas
        if (this.tareas.length === 0) {
            this.elementos.emptyState.style.display = 'block';
            return;
        }

        // Ocultar estado vacío
        this.elementos.emptyState.style.display = 'none';

        // Renderizar cada tarea
        this.tareas.forEach(tarea => {
            const tareaElemento = this.crearElementoTarea(tarea);
            this.elementos.taskContainer.appendChild(tareaElemento);
        });
    }

    /**
     * Crea un elemento DOM para una tarea
     * @param {Tarea} tarea - La tarea a renderizar
     * @returns {HTMLElement} Elemento DOM de la tarea
     */
    crearElementoTarea(tarea) {
        const tareaDiv = document.createElement('div');
        tareaDiv.className = 'card mb-3';
        tareaDiv.id = `task-${tarea.id}`;

        const estadoClass = tarea.completada ? 'task-completed' : '';
        const iconoEstado = tarea.completada ? 'fa-check-circle text-success' : 'fa-circle text-warning';
        const colorBorde = tarea.completada ? 'border-success' : 'border-primary';

        tareaDiv.innerHTML = `
            <div class="card-body border-start border-4 ${colorBorde}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1 ${estadoClass}">
                        <h6 class="card-title mb-2 text-light">
                            <i class="fas ${iconoEstado} me-2"></i>
                            ${this.escapeHtml(tarea.titulo)}
                        </h6>
                        ${tarea.descripcion ? `<p class="card-text text-light mb-2">${this.escapeHtml(tarea.descripcion)}</p>` : ''}
                        <small class="text-light d-block">
                            <i class="fas fa-user me-1"></i>Usuario: ${tarea.userId}
                            <i class="fas fa-calendar ms-3 me-1"></i>Creado: ${new Date(tarea.fechaCreacion).toLocaleDateString()}
                        </small>
                    </div>
                    <div class="d-flex flex-column gap-2 ms-3">
                        <button class="btn btn-sm ${tarea.completada ? 'btn-warning' : 'btn-success'}"
                                onclick="app.alternarEstadoTarea(${tarea.id})"
                                title="${tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}">
                            <i class="fas ${tarea.completada ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info"
                                onclick="app.mostrarDetallesTarea(${tarea.id})"
                                title="Ver detalles">
                            <i class="fas fa-info"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger"
                                onclick="app.confirmarEliminacion(${tarea.id})"
                                title="Eliminar tarea">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return tareaDiv;
    }

    /**
     * Actualiza las estadísticas mostradas en la interfaz
     */
    actualizarEstadisticas() {
        const estadisticas = this.persistence.obtenerEstadisticas();

        if (this.elementos.totalTasks) {
            this.elementos.totalTasks.textContent = estadisticas.total;
        }
        if (this.elementos.completedTasks) {
            this.elementos.completedTasks.textContent = estadisticas.completadas;
        }
        if (this.elementos.pendingTasks) {
            this.elementos.pendingTasks.textContent = estadisticas.pendientes;
        }
    }

    /**
     * Muestra los detalles de una tarea en consola
     * @param {number} id - ID de la tarea
     */
    mostrarDetallesTarea(id) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea) {
            tarea.mostrarDetalles();
            this.mostrarEnDebug('Detalles mostrados en consola para la tarea: ' + tarea.titulo);
        }
    }

    /**
     * Confirma la eliminación de una tarea
     * @param {number} id - ID de la tarea
     */
    confirmarEliminacion(id) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea && confirm(`¿Estás seguro de que quieres eliminar la tarea "${tarea.titulo}"?`)) {
            this.eliminarTarea(id);
        }
    }

    /**
     * Refresca las tareas desde la API
     */
    async refrescarTareas() {
        try {
            this.mostrarCargando(true);
            console.log('[REFRESH] Refrescando tareas...');

            // Cargar algunas tareas nuevas de la API para demostración
            await this.cargarTareasDeEjemplo();

            this.mostrarMensaje('Tareas actualizadas correctamente', 'info');
        } catch (error) {
            console.error('Error al refrescar tareas:', error);
            this.mostrarError('Error al refrescar las tareas');
        } finally {
            this.mostrarCargando(false);
        }
    }

    /**
     * Muestra/oculta el spinner de carga
     * @param {boolean} mostrar - true para mostrar, false para ocultar
     */
    mostrarCargando(mostrar) {
        this.estado.cargando = mostrar;

        if (this.elementos.loadingSpinner) {
            this.elementos.loadingSpinner.style.display = mostrar ? 'block' : 'none';
        }

        // Deshabilitar controles durante la carga
        const controles = document.querySelectorAll('button, input, textarea');
        controles.forEach(control => {
            if (mostrar) {
                control.classList.add('loading');
            } else {
                control.classList.remove('loading');
            }
        });
    }

    /**
     * Muestra un mensaje en la interfaz
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} tipo - Tipo de mensaje (success, error, info, warning)
     */
    mostrarMensaje(mensaje, tipo = 'info') {
        // Crear toast o alert temporal
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo === 'error' ? 'danger' : tipo} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alertDiv.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    /**
     * Muestra un mensaje de error
     * @param {string} mensaje - Mensaje de error
     */
    mostrarError(mensaje) {
        this.mostrarMensaje(mensaje, 'error');
    }

    /**
     * Muestra información en el panel de debug
     * @param {string} info - Información a mostrar
     */
    mostrarEnDebug(info) {
        if (this.elementos.debugOutput) {
            this.elementos.debugOutput.style.display = 'block';
            this.elementos.debugOutput.textContent = JSON.stringify(info, null, 2);
        }
    }

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Obtiene información de debug
     * @returns {Object} Información de debug
     */
    obtenerInfoDebug() {
        return {
            totalTareas: this.tareas.length,
            tareasCompletadas: this.tareas.filter(t => t.completada).length,
            tareasPendientes: this.tareas.filter(t => !t.completada).length,
            ultimaActualizacion: this.estado.ultimaActualizacion,
            localStorageInfo: this.persistence.obtenerInfoAlmacenamiento(),
            apiInfo: this.apiService.getApiInfo(),
            estado: this.estado
        };
    }
}

// Exportar la clase para uso en otros archivos (si se usa en un entorno de módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ListaTareas;
}