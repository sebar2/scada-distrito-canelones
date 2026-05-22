// Importamos los módulos externos (Lógica matemática y sensores)
import { leerSensores } from './telemetria.js';
import { calcularSalidaPID } from './pid_control.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Selectores Nativos para máximo rendimiento (Manipulación directa del DOM)
    const tempGoogle = document.querySelector('#temp-google');
    const tempAdp = document.querySelector('#temp-adp');
    const presionPlenum = document.querySelector('#presion-plenum');
    const no2Nivel = document.querySelector('#no2-nivel');
    
    const btnBomba = document.querySelector('#btn-bomba');
    const estadoBomba = document.querySelector('#estado-bomba');
    
    const btnFailsafe = document.querySelector('#btn-failsafe');
    const estadoValvula = document.querySelector('#estado-valvula');
    const dotStatus = document.querySelector('.dot');

    // Variables de estado del sistema
    let sistemaActivo = true;
    let valvulaAbierta = true;
    const setpointTemperatura = 40.0; // Temperatura objetivo ideal para los invernaderos

    // Bucle de actualización (Simulación de lectura de PLC por Modbus TCP)
    setInterval(() => {
        if (sistemaActivo && valvulaAbierta) {
            // 1. Leemos los datos del módulo de telemetría
            const sensores = leerSensores();
            
            // 2. Calculamos a qué velocidad debe ir la bomba usando el PID
            const salidaVFD = calcularSalidaPID(setpointTemperatura, sensores.tempAdp);

            // 3. Pintamos los datos en el HTML
            tempGoogle.textContent = sensores.tempGoogle + ' °C';
            tempAdp.textContent = sensores.tempAdp + ' °C';
            presionPlenum.textContent = sensores.presionPlenum + ' Pa';
            no2Nivel.textContent = sensores.no2 + ' µg/m³';
            
            // Actualizamos la interfaz de la bomba con el cálculo matemático
            estadoBomba.textContent = `Estado: Activo (${salidaVFD}%)`;
        }
    }, 1500); // Se actualiza cada 1.5 segundos

    // Módulo de Control manual de la Bomba (VFD)
    btnBomba.addEventListener('click', () => {
        if (!valvulaAbierta) return; // Seguridad: no arranca si la válvula está cerrada
        
        sistemaActivo = !sistemaActivo;
        
        if (sistemaActivo) {
            btnBomba.textContent = 'Detener Bombeo';
            btnBomba.style.backgroundColor = '#1976d2';
        } else {
            estadoBomba.textContent = 'Estado: Detenido';
            btnBomba.textContent = 'Iniciar Bombeo';
            btnBomba.style.backgroundColor = '#424242';
            
            // Reseteo visual al detener
            tempGoogle.textContent = '15.0 °C';
            tempAdp.textContent = '15.0 °C';
            presionPlenum.textContent = '0.00 Pa';
        }
    });

    // Módulo de Actuación Fail-Safe (Aislamiento de Emergencia < 500ms)
    btnFailsafe.addEventListener('click', () => {
        valvulaAbierta = !valvulaAbierta;
        
        // Seleccionamos todas las tarjetas para aplicarles el CSS de "aislado"
        const tarjetas = document.querySelectorAll('.sensor-card');
        
        if (!valvulaAbierta) {
            estadoValvula.textContent = 'Válvula de Aislamiento: CERRADA';
            estadoValvula.style.color = '#ff1744';
            btnFailsafe.textContent = 'RESTABLECER SISTEMA';
            btnFailsafe.style.backgroundColor = '#1976d2';
            
            dotStatus.classList.remove('online');
            dotStatus.classList.add('offline');
            
            sistemaActivo = false;
            estadoBomba.textContent = 'Estado: Bloqueo de Seguridad';
            btnBomba.style.backgroundColor = '#424242';
            btnBomba.textContent = 'Bloqueado';
            
            // Opacamos los sensores porque el flujo está cortado
            tarjetas.forEach(card => card.classList.add('aislado'));
            
            tempGoogle.textContent = 'AISLADO';
            tempAdp.textContent = 'AISLADO';
            presionPlenum.textContent = '0.00 Pa';
        } else {
            estadoValvula.textContent = 'Válvula de Aislamiento: ABIERTA';
            estadoValvula.style.color = '#ffffff';
            btnFailsafe.textContent = 'ACTIVAR AISLAMIENTO';
            btnFailsafe.style.backgroundColor = '#d32f2f';
            
            dotStatus.classList.remove('offline');
            dotStatus.classList.add('online');
            
            tarjetas.forEach(card => card.classList.remove('aislado'));
            
            btnBomba.textContent = 'Iniciar Bombeo';
        }
    });
});