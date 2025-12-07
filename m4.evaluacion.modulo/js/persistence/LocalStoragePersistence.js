/**
 * Clase LocalStoragePersistence - Capa de persistencia usando LocalStorage
 * 
 * Esta clase maneja la persistencia de datos en el navegador usando LocalStorage.
 * Implementa el patrón Repository para separar la lógica de persistencia.
 */
class LocalStoragePersistence {
    /**
     * Constructor de la clase de persistencia
     * @param {string} storageKey - Clave para almacenar los datos en LocalStorage
     */
    constructor(storageKey = 'lucifertodos') {
        this.storageKey = storageKey;
    }

    /**
     * Obtiene todas las tareas del LocalStorage
     * @returns {Array<Object>} Array de objetos de tareas
     */
    obtenerTodasLasTareas() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.log('No hay datos en LocalStorage, retornando array vacío');
                return [];
            }
            
            const parsedData = JSON.parse(data);
            console.log(`Cargadas ${parsedData.length} tareas desde LocalStorage`);
            return parsedData;
        } catch (error) {
            console.error('Error al leer datos de LocalStorage:', error);
            return [];
        }
    }

    /**
     * Guarda todas las tareas en LocalStorage
     * @param {Array<Object>} tareas - Array de objetos de tareas a guardar
     * @returns {boolean} true si se guardó correctamente
     */
    guardarTodasLasTareas(tareas) {
        try {
            const data = JSON.stringify(tareas);
            localStorage.setItem(this.storageKey, data);
            console.log(`Guardadas ${tareas.length} tareas en LocalStorage`);
            return true;
        } catch (error) {
            console.error('Error al guardar datos en LocalStorage:', error);
            return false;
        }
    }

    /**
     * Agrega una nueva tarea al LocalStorage
     * @param {Object} tarea - Objeto de la tarea a agregar
     * @returns {boolean} true si se agregó correctamente
     */
    agregarTarea(tarea) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            
            // Verificar si ya existe una tarea con el mismo ID
            const existeTarea = tareas.some(t => t.id === tarea.id);
            if (existeTarea) {
                console.warn(`Ya existe una tarea con ID ${tarea.id}, actualizando...`);
                return this.actualizarTarea(tarea);
            }
            
            tareas.push(tarea);
            return this.guardarTodasLasTareas(tareas);
        } catch (error) {
            console.error('Error al agregar tarea:', error);
            return false;
        }
    }

    /**
     * Obtiene una tarea específica por su ID
     * @param {number} id - ID de la tarea a buscar
     * @returns {Object|null} Objeto de la tarea o null si no se encuentra
     */
    obtenerTareaPorId(id) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            const tarea = tareas.find(t => t.id === id);
            return tarea || null;
        } catch (error) {
            console.error('Error al obtener tarea por ID:', error);
            return null;
        }
    }

    /**
     * Actualiza una tarea existente
     * @param {Object} tareaActualizada - Objeto de la tarea actualizada
     * @returns {boolean} true si se actualizó correctamente
     */
    actualizarTarea(tareaActualizada) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            const index = tareas.findIndex(t => t.id === tareaActualizada.id);
            
            if (index === -1) {
                console.warn(`No se encontró tarea con ID ${tareaActualizada.id} para actualizar`);
                return false;
            }
            
            tareas[index] = { ...tareaActualizada };
            return this.guardarTodasLasTareas(tareas);
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            return false;
        }
    }

    /**
     * Elimina una tarea por su ID
     * @param {number} id - ID de la tarea a eliminar
     * @returns {boolean} true si se eliminó correctamente
     */
    eliminarTarea(id) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            const tareasFiltered = tareas.filter(t => t.id !== id);
            
            if (tareas.length === tareasFiltered.length) {
                console.warn(`No se encontró tarea con ID ${id} para eliminar`);
                return false;
            }
            
            console.log(`Eliminando tarea con ID ${id}`);
            return this.guardarTodasLasTareas(tareasFiltered);
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            return false;
        }
    }

    /**
     * Obtiene tareas filtradas por estado de completitud
     * @param {boolean} completada - true para tareas completadas, false para pendientes
     * @returns {Array<Object>} Array de tareas filtradas
     */
    obtenerTareasPorEstado(completada) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            return tareas.filter(t => (t.completada || t.completed) === completada);
        } catch (error) {
            console.error('Error al obtener tareas por estado:', error);
            return [];
        }
    }

    /**
     * Obtiene tareas de un usuario específico
     * @param {number} userId - ID del usuario
     * @returns {Array<Object>} Array de tareas del usuario
     */
    obtenerTareasPorUsuario(userId) {
        try {
            const tareas = this.obtenerTodasLasTareas();
            return tareas.filter(t => t.userId === userId);
        } catch (error) {
            console.error('Error al obtener tareas por usuario:', error);
            return [];
        }
    }

    /**
     * Limpia todas las tareas del LocalStorage
     * @returns {boolean} true si se limpió correctamente
     */
    limpiarTodasLasTareas() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('LocalStorage limpiado correctamente');
            return true;
        } catch (error) {
            console.error('Error al limpiar LocalStorage:', error);
            return false;
        }
    }

    /**
     * Obtiene estadísticas de las tareas
     * @returns {Object} Objeto con estadísticas
     */
    obtenerEstadisticas() {
        try {
            const tareas = this.obtenerTodasLasTareas();
            const total = tareas.length;
            const completadas = tareas.filter(t => t.completada || t.completed).length;
            const pendientes = total - completadas;
            
            return {
                total,
                completadas,
                pendientes,
                porcentajeCompletadas: total > 0 ? Math.round((completadas / total) * 100) : 0
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return { total: 0, completadas: 0, pendientes: 0, porcentajeCompletadas: 0 };
        }
    }

    /**
     * Sincroniza las tareas locales con los datos de la API
     * @param {Array<Object>} tareasApi - Tareas obtenidas de la API
     * @returns {boolean} true si se sincronizó correctamente
     */
    sincronizarConApi(tareasApi) {
        try {
            const tareasLocales = this.obtenerTodasLasTareas();
            const idsLocales = new Set(tareasLocales.map(t => t.id));
            
            // Agregar tareas de la API que no existen localmente
            const nuevasTareas = tareasApi.filter(t => !idsLocales.has(t.id));
            
            if (nuevasTareas.length > 0) {
                const todasLasTareas = [...tareasLocales, ...nuevasTareas];
                this.guardarTodasLasTareas(todasLasTareas);
                console.log(`Sincronizadas ${nuevasTareas.length} tareas nuevas de la API`);
            }
            
            return true;
        } catch (error) {
            console.error('Error al sincronizar con API:', error);
            return false;
        }
    }

    /**
     * Obtiene el siguiente ID disponible para una nueva tarea
     * @returns {number} Siguiente ID disponible
     */
    obtenerSiguienteId() {
        try {
            const tareas = this.obtenerTodasLasTareas();
            if (tareas.length === 0) {
                return 1;
            }
            
            const maxId = Math.max(...tareas.map(t => t.id));
            return maxId + 1;
        } catch (error) {
            console.error('Error al obtener siguiente ID:', error);
            return 1;
        }
    }

    /**
     * Verifica si el LocalStorage está disponible en el navegador
     * @returns {boolean} true si LocalStorage está disponible
     */
    static esLocalStorageDisponible() {
        try {
            const test = 'test_localstorage';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('LocalStorage no está disponible:', error);
            return false;
        }
    }

    /**
     * Obtiene información sobre el uso del LocalStorage
     * @returns {Object} Información sobre el uso del storage
     */
    obtenerInfoAlmacenamiento() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const size = data ? new Blob([data]).size : 0;
            const tareas = this.obtenerTodasLasTareas();
            
            return {
                clave: this.storageKey,
                tamaño: size,
                tamañoLegible: this.formatearTamaño(size),
                cantidadTareas: tareas.length,
                ultimaModificacion: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error al obtener info de almacenamiento:', error);
            return null;
        }
    }

    /**
     * Formatea el tamaño en bytes a una representación legible
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} Tamaño formateado
     */
    formatearTamaño(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Exportar la clase para uso en otros archivos (si se usa en un entorno de módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalStoragePersistence;
}