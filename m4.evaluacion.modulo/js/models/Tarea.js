/**
 * Clase Tarea - Modelo de datos para una tarea
 *
 * Esta clase representa una tarea individual con sus propiedades y métodos.
 * Sigue el patrón de modelo de datos (Model) en una arquitectura MVC.
 */
class Tarea {
    /**
     * Constructor de la clase Tarea
     * @param {number} id - Identificador único de la tarea
     * @param {string} titulo - Título de la tarea (requerido)
     * @param {string} descripcion - Descripción detallada de la tarea (opcional)
     * @param {boolean} completada - Estado de completitud de la tarea (por defecto false)
     * @param {number} userId - ID del usuario propietario de la tarea (opcional)
     */
    constructor(id, titulo, descripcion = '', completada = false, userId = 1) {
        // Validaciones básicas
        if (id === undefined || id === null) {
            throw new Error('El ID de la tarea es obligatorio');
        }

        if (typeof id !== 'number' || id <= 0) {
            throw new Error('El ID debe ser un número positivo');
        }

        if (!titulo || titulo.trim() === '') {
            throw new Error('El título de la tarea es obligatorio');
        }

        this.id = id;
        this.todo = titulo.trim(); // Usamos 'todo' para coincidir con la API
        this.completed = completada; // Usamos 'completed' para coincidir con la API
        this.userId = userId;

        // Propiedades adicionales para compatibilidad local
        this.titulo = titulo.trim();
        this.descripcion = descripcion ? descripcion.trim() : '';
        this.completada = completada;

        // Metadatos
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = new Date().toISOString();
    }

    /**
     * Método para mostrar los detalles de la tarea en consola
     * Útil para debugging y fines educativos
     */
    mostrarDetalles() {
        console.log('=== Detalles de la Tarea ===');
        console.log(`ID: ${this.id}`);
        console.log(`Título: ${this.titulo}`);
        console.log(`Descripción: ${this.descripcion || 'Sin descripción'}`);
        console.log(`Estado: ${this.completada ? 'Completada' : 'Pendiente'}`);
        console.log(`Usuario ID: ${this.userId}`);
        console.log(`Fecha de creación: ${this.fechaCreacion}`);
        console.log(`Fecha de modificación: ${this.fechaModificacion}`);
        console.log('==========================');
    }

    /**
     * Marca la tarea como completada
     */
    marcarComoCompletada() {
        this.completada = true;
        this.completed = true;
        this.fechaModificacion = new Date().toISOString();
    }

    /**
     * Marca la tarea como pendiente
     */
    marcarComoPendiente() {
        this.completada = false;
        this.completed = false;
        this.fechaModificacion = new Date().toISOString();
    }

    /**
     * Alterna el estado de completitud de la tarea
     */
    alternarEstado() {
        if (this.completada) {
            this.marcarComoPendiente();
        } else {
            this.marcarComoCompletada();
        }
    }

    /**
     * Actualiza el título de la tarea
     * @param {string} nuevoTitulo - Nuevo título para la tarea
     */
    actualizarTitulo(nuevoTitulo) {
        if (!nuevoTitulo || nuevoTitulo.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }

        this.titulo = nuevoTitulo.trim();
        this.todo = nuevoTitulo.trim();
        this.fechaModificacion = new Date().toISOString();
    }

    /**
     * Actualiza la descripción de la tarea
     * @param {string} nuevaDescripcion - Nueva descripción para la tarea
     */
    actualizarDescripcion(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion.trim();
        this.fechaModificacion = new Date().toISOString();
    }

    /**
     * Convierte la tarea a un objeto plano para almacenamiento
     * @returns {Object} Objeto con las propiedades de la tarea
     */
    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            todo: this.todo,
            descripcion: this.descripcion,
            completada: this.completada,
            completed: this.completed,
            userId: this.userId,
            fechaCreacion: this.fechaCreacion,
            fechaModificacion: this.fechaModificacion
        };
    }

    /**
     * Crea una instancia de Tarea desde un objeto plano
     * @param {Object} data - Objeto con los datos de la tarea
     * @returns {Tarea} Nueva instancia de Tarea
     */
    static fromJSON(data) {
        const tarea = new Tarea(
            data.id,
            data.titulo || data.todo,
            data.descripcion || '',
            data.completada || data.completed || false,
            data.userId || 1
        );

        // Preservar metadatos si existen
        if (data.fechaCreacion) {
            tarea.fechaCreacion = data.fechaCreacion;
        }
        if (data.fechaModificacion) {
            tarea.fechaModificacion = data.fechaModificacion;
        }

        return tarea;
    }

    /**
     * Crea una instancia de Tarea desde los datos de la API externa
     * @param {Object} apiData - Datos recibidos de la API
     * @returns {Tarea} Nueva instancia de Tarea
     */
    static fromApiResponse(apiData) {
        return new Tarea(
            apiData.id,
            apiData.todo,
            '', // La API no proporciona descripción
            apiData.completed,
            apiData.userId
        );
    }

    /**
     * Valida si los datos proporcionados son válidos para crear una tarea
     * @param {Object} data - Datos a validar
     * @returns {boolean} true si los datos son válidos
     * @throws {Error} Si los datos no son válidos
     */
    static validar(data) {
        if (!data.titulo && !data.todo) {
            throw new Error('El título de la tarea es obligatorio');
        }

        if (data.titulo && data.titulo.length > 100) {
            throw new Error('El título no puede exceder 100 caracteres');
        }

        if (data.descripcion && data.descripcion.length > 255) {
            throw new Error('La descripción no puede exceder 255 caracteres');
        }

        return true;
    }

    /**
     * Obtiene un resumen de la tarea para mostrar en la interfaz
     * @returns {string} Resumen de la tarea
     */
    obtenerResumen() {
        const estado = this.completada ? '✅' : '⏳';
        return `${estado} ${this.titulo} ${this.descripcion ? `- ${this.descripcion.substring(0, 50)}...` : ''}`;
    }
}

// Exportar la clase para uso en otros archivos (si se usa en un entorno de módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tarea;
}