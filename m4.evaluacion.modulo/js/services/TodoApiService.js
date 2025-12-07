/**
 * Clase TodoApiService - Servicio para interactuar con la API de DummyJSON
 *
 * Esta clase maneja todas las interacciones con la API externa de tareas.
 * Implementa el patrón Service para separar la lógica de comunicación con la API.
 */
class TodoApiService {
    /**
     * Constructor del servicio de API
     * @param {string} baseUrl - URL base de la API
     */
    constructor(baseUrl = 'https://dummyjson.com') {
        this.baseUrl = baseUrl;
        this.todosEndpoint = `${baseUrl}/todos`;
    }

    /**
     * Método privado para manejar respuestas HTTP
     * @param {Response} response - Respuesta del fetch
     * @returns {Promise<Object>} Datos de la respuesta en JSON
     */
    async _handleResponse(response) {
        if (!response.ok) {
            const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
            console.error(`[ERROR] ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('[WARNING] La respuesta no es JSON');
        }

        return await response.json();
    }

    /**
     * Método privado para realizar peticiones HTTP con manejo de errores
     * @param {string} url - URL de la petición
     * @param {Object} options - Opciones del fetch
     * @returns {Promise<Object>} Resultado de la petición
     */
    async _makeRequest(url, options = {}) {
        try {
            console.log(`[NETWORK] API Request: ${options.method || 'GET'} ${url}`);

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await this._handleResponse(response);
            console.log(`[SUCCESS] API Response received:`, data);
            return data;
        } catch (error) {
            console.error(`[ERROR] API Error:`, error);
            throw error;
        }
    }

    /**
     * Obtiene todas las tareas con paginación
     * @param {number} limit - Número máximo de tareas a obtener (default: 30)
     * @param {number} skip - Número de tareas a saltar (default: 0)
     * @returns {Promise<Object>} Objeto con las tareas y metadatos de paginación
     */
    async obtenerTodasLasTareas(limit = 30, skip = 0) {
        try {
            const url = `${this.todosEndpoint}?limit=${limit}&skip=${skip}`;
            return await this._makeRequest(url);
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);
            throw new Error('No se pudieron cargar las tareas desde el servidor');
        }
    }

    /**
     * Obtiene una tarea específica por ID
     * @param {number} id - ID de la tarea
     * @returns {Promise<Object>} Datos de la tarea
     */
    async obtenerTareaPorId(id) {
        try {
            const url = `${this.todosEndpoint}/${id}`;
            return await this._makeRequest(url);
        } catch (error) {
            console.error(`Error al obtener tarea con ID ${id}:`, error);
            throw new Error(`No se pudo cargar la tarea con ID ${id}`);
        }
    }

    /**
     * Obtiene una tarea aleatoria
     * @param {number} cantidad - Cantidad de tareas aleatorias (máximo 10)
     * @returns {Promise<Object|Array>} Tarea(s) aleatoria(s)
     */
    async obtenerTareaAleatoria(cantidad = 1) {
        try {
            const url = cantidad === 1
                ? `${this.todosEndpoint}/random`
                : `${this.todosEndpoint}/random/${Math.min(cantidad, 10)}`;
            return await this._makeRequest(url);
        } catch (error) {
            console.error('Error al obtener tarea aleatoria:', error);
            throw new Error('No se pudo cargar una tarea aleatoria');
        }
    }

    /**
     * Obtiene tareas de un usuario específico
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object>} Tareas del usuario
     */
    async obtenerTareasPorUsuario(userId) {
        try {
            const url = `${this.todosEndpoint}/user/${userId}`;
            return await this._makeRequest(url);
        } catch (error) {
            console.error(`Error al obtener tareas del usuario ${userId}:`, error);
            throw new Error(`No se pudieron cargar las tareas del usuario ${userId}`);
        }
    }

    /**
     * Agrega una nueva tarea
     * @param {Object} tarea - Datos de la nueva tarea
     * @returns {Promise<Object>} Tarea creada con ID asignado
     */
    async agregarTarea(tarea) {
        try {
            const tareaParaApi = {
                todo: tarea.titulo || tarea.todo,
                completed: tarea.completada || tarea.completed || false,
                userId: tarea.userId || 1
            };

            const url = `${this.todosEndpoint}/add`;
            const options = {
                method: 'POST',
                body: JSON.stringify(tareaParaApi)
            };

            const result = await this._makeRequest(url, options);

            // La API devuelve la tarea con un nuevo ID
            console.log('[SUCCESS] Tarea agregada exitosamente en la API:', result);
            return result;
        } catch (error) {
            console.error('Error al agregar tarea:', error);
            throw new Error('No se pudo crear la tarea en el servidor');
        }
    }

    /**
     * Actualiza una tarea existente
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} datosActualizados - Nuevos datos de la tarea
     * @returns {Promise<Object>} Tarea actualizada
     */
    async actualizarTarea(id, datosActualizados) {
        try {
            const datosParaApi = {};

            if (datosActualizados.titulo || datosActualizados.todo) {
                datosParaApi.todo = datosActualizados.titulo || datosActualizados.todo;
            }

            if (typeof datosActualizados.completada === 'boolean') {
                datosParaApi.completed = datosActualizados.completada;
            } else if (typeof datosActualizados.completed === 'boolean') {
                datosParaApi.completed = datosActualizados.completed;
            }

            if (datosActualizados.userId) {
                datosParaApi.userId = datosActualizados.userId;
            }

            const url = `${this.todosEndpoint}/${id}`;
            const options = {
                method: 'PUT',
                body: JSON.stringify(datosParaApi)
            };

            const result = await this._makeRequest(url, options);

            console.log('[SUCCESS] Tarea actualizada exitosamente en la API:', result);
            return result;
        } catch (error) {
            console.error(`Error al actualizar tarea con ID ${id}:`, error);
            throw new Error(`No se pudo actualizar la tarea con ID ${id}`);
        }
    }

    /**
     * Actualiza parcialmente una tarea (PATCH)
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} datosActualizados - Datos parciales a actualizar
     * @returns {Promise<Object>} Tarea actualizada
     */
    async actualizarTareaParcial(id, datosActualizados) {
        try {
            const datosParaApi = {};

            if (datosActualizados.titulo || datosActualizados.todo) {
                datosParaApi.todo = datosActualizados.titulo || datosActualizados.todo;
            }

            if (typeof datosActualizados.completada === 'boolean') {
                datosParaApi.completed = datosActualizados.completada;
            } else if (typeof datosActualizados.completed === 'boolean') {
                datosParaApi.completed = datosActualizados.completed;
            }

            const url = `${this.todosEndpoint}/${id}`;
            const options = {
                method: 'PATCH',
                body: JSON.stringify(datosParaApi)
            };

            const result = await this._makeRequest(url, options);

            console.log('[SUCCESS] Tarea actualizada parcialmente en la API:', result);
            return result;
        } catch (error) {
            console.error(`Error al actualizar parcialmente tarea con ID ${id}:`, error);
            throw new Error(`No se pudo actualizar la tarea con ID ${id}`);
        }
    }

    /**
     * Elimina una tarea
     * @param {number} id - ID de la tarea a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async eliminarTarea(id) {
        try {
            const url = `${this.todosEndpoint}/${id}`;
            const options = {
                method: 'DELETE'
            };

            const result = await this._makeRequest(url, options);

            console.log('[SUCCESS] Tarea eliminada exitosamente en la API:', result);
            return result;
        } catch (error) {
            console.error(`Error al eliminar tarea con ID ${id}:`, error);
            throw new Error(`No se pudo eliminar la tarea con ID ${id}`);
        }
    }

    /**
     * Marca una tarea como completada
     * @param {number} id - ID de la tarea
     * @returns {Promise<Object>} Tarea actualizada
     */
    async marcarComoCompletada(id) {
        return await this.actualizarTareaParcial(id, { completed: true });
    }

    /**
     * Marca una tarea como pendiente
     * @param {number} id - ID de la tarea
     * @returns {Promise<Object>} Tarea actualizada
     */
    async marcarComoPendiente(id) {
        return await this.actualizarTareaParcial(id, { completed: false });
    }

    /**
     * Alterna el estado de completitud de una tarea
     * @param {number} id - ID de la tarea
     * @param {boolean} estadoActual - Estado actual de la tarea
     * @returns {Promise<Object>} Tarea actualizada
     */
    async alternarEstadoTarea(id, estadoActual) {
        const nuevoEstado = !estadoActual;
        return await this.actualizarTareaParcial(id, { completed: nuevoEstado });
    }

    /**
     * Método de prueba para verificar la conectividad con la API
     * @returns {Promise<Object>} Resultado de la prueba
     */
    async probarConexion() {
        try {
            console.log('[TEST] Probando conexión con la API...');
            const result = await this.obtenerTareaAleatoria();
            console.log('[SUCCESS] Conexión exitosa con la API');
            return { success: true, data: result };
        } catch (error) {
            console.error('[ERROR] Falla en la conexión con la API:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Carga datos de ejemplo desde la API para inicializar la aplicación
     * @param {number} cantidad - Cantidad de tareas a cargar (default: 10)
     * @returns {Promise<Array>} Array de tareas de ejemplo
     */
    async cargarDatosDeEjemplo(cantidad = 10) {
        try {
            console.log(`[LOADING] Cargando ${cantidad} tareas de ejemplo...`);
            const result = await this.obtenerTodasLasTareas(cantidad, 0);
            const tareas = result.todos || [];
            console.log(`[SUCCESS] Cargadas ${tareas.length} tareas de ejemplo`);
            return tareas;
        } catch (error) {
            console.error('Error al cargar datos de ejemplo:', error);
            throw new Error('No se pudieron cargar los datos de ejemplo');
        }
    }

    /**
     * Obtiene información de estado de la API
     * @returns {Object} Información sobre el estado de la API
     */
    getApiInfo() {
        return {
            baseUrl: this.baseUrl,
            todosEndpoint: this.todosEndpoint,
            name: 'DummyJSON Todos API',
            description: 'API de prueba para gestión de tareas',
            documentation: 'https://dummyjson.com/docs/todos'
        };
    }
}

// Exportar la clase para uso en otros archivos (si se usa en un entorno de módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoApiService;
}