// js/pid_control.js

/**
 * Simulación de Lazo PID para modulación de Variadores de Frecuencia (VFD)
 * @param {number} setpoint - Temperatura objetivo
 * @param {number} temperaturaActual - Lectura del sensor
 * @returns {number} - Porcentaje de velocidad de la bomba (0 a 100%)
 */
export function calcularSalidaPID(setpoint, temperaturaActual) {
    const error = setpoint - temperaturaActual;
    const gananciaProporcional = 3.5; 
    
    // Ecuación simplificada del cálculo PID
    let salidaVFD = 50 + (error * gananciaProporcional); 

    // Limitadores de seguridad del motor
    if (salidaVFD > 100) salidaVFD = 100;
    if (salidaVFD < 0) salidaVFD = 0;

    return salidaVFD.toFixed(1);
}