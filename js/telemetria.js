// js/telemetria.js

/**
 * Simula el "polling" de datos a los PLCs de campo.
 * @returns {Object} Valores actuales de los sensores
 */
export function leerSensores() {
    return {
        tempGoogle: (42 + Math.random() * 2).toFixed(1),       // Rango: 42.0 a 44.0 °C
        tempAdp: (40.5 + Math.random() * 1.5).toFixed(1),      // Rango: 40.5 a 42.0 °C
        presionPlenum: (Math.random() * 0.3).toFixed(2),       // Rango: 0.00 a 0.30 Pa
        no2: (40 + Math.random() * 8).toFixed(0)               // Rango: 40 a 48 µg/m³
    };
}