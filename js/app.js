import { leerSensores } from './telemetria.js';
import { calcularSalidaPID } from './pid_control.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const tempGoogle = document.querySelector('#temp-google');
    const tempAdp = document.querySelector('#temp-adp');
    const presionPlenum = document.querySelector('#presion-plenum');
    const no2Nivel = document.querySelector('#no2-nivel');
    const btnBomba = document.querySelector('#btn-bomba');
    const estadoBomba = document.querySelector('#estado-bomba');
    const btnFailsafe = document.querySelector('#btn-failsafe');
    const estadoValvula = document.querySelector('#estado-valvula');
    const dotStatus = document.querySelector('.dot');
    const terminal = document.querySelector('#terminal-log');

    let sistemaActivo = true;
    let valvulaAbierta = true;
    const setpointTemperatura = 40.0; 

    // --- CONFIGURACIÓN DEL GRÁFICO (Chart.js) ---
    const ctx = document.getElementById('scadaChart').getContext('2d');
    const scadaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Eje X (Tiempo)
            datasets: [
                { label: 'Temp. Google (°C)', borderColor: '#f85149', data: [], borderWidth: 2, tension: 0.4, pointRadius: 0 },
                { label: 'Temp. ADP (°C)', borderColor: '#3fb950', data: [], borderWidth: 2, tension: 0.4, pointRadius: 0 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' }, min: 10, max: 50 },
                x: { grid: { display: false }, ticks: { color: '#8b949e' } }
            },
            plugins: { legend: { labels: { color: '#c9d1d9' } } },
            animation: { duration: 0 }
        }
    });

    // Función para escribir en la consola
    function logEvento(mensaje, tipo = 'sys') {
        const time = new Date().toLocaleTimeString('es-UY', { hour12: false });
        const p = document.createElement('p');
        p.className = `log-line ${tipo}`;
        p.textContent = `[${time}] > ${mensaje}`;
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight; // Auto-scroll
    }

    // Bucle Principal SCADA
    setInterval(() => {
        if (sistemaActivo && valvulaAbierta) {
            const sensores = leerSensores();
            const salidaVFD = calcularSalidaPID(setpointTemperatura, sensores.tempAdp);

            // Pintar textos
            tempGoogle.textContent = sensores.tempGoogle + ' °C';
            tempAdp.textContent = sensores.tempAdp + ' °C';
            presionPlenum.textContent = sensores.presionPlenum + ' Pa';
            no2Nivel.textContent = sensores.no2 + ' µg/m³';
            estadoBomba.textContent = `Estado: Activo (${salidaVFD}%)`;

            // Actualizar Gráfico
            const timeNow = new Date().toLocaleTimeString('es-UY', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            scadaChart.data.labels.push(timeNow);
            scadaChart.data.datasets[0].data.push(sensores.tempGoogle);
            scadaChart.data.datasets[1].data.push(sensores.tempAdp);
            
            // Mantener solo los últimos 15 puntos en el gráfico
            if (scadaChart.data.labels.length > 15) {
                scadaChart.data.labels.shift();
                scadaChart.data.datasets[0].data.shift();
                scadaChart.data.datasets[1].data.shift();
            }
            scadaChart.update();

            // Log de NO2 si sube
            if (sensores.no2 > 46) logEvento(`Pico leve de NO2 detectado: ${sensores.no2} µg/m³`, 'warn');
        }
    }, 1500);

    // Controles manuales
    btnBomba.addEventListener('click', () => {
        if (!valvulaAbierta) return; 
        sistemaActivo = !sistemaActivo;
        if (sistemaActivo) {
            btnBomba.textContent = 'Detener Bombeo';
            btnBomba.style.backgroundColor = '#1f6feb';
            logEvento('Reinicio de bombas de glicol VFD', 'sys');
        } else {
            estadoBomba.textContent = 'Estado: Detenido';
            btnBomba.textContent = 'Iniciar Bombeo';
            btnBomba.style.backgroundColor = '#21262d';
            tempGoogle.textContent = '15.0 °C'; tempAdp.textContent = '15.0 °C'; presionPlenum.textContent = '0.00 Pa';
            logEvento('Parada manual de bombas VFD ejecutada', 'warn');
        }
    });

    btnFailsafe.addEventListener('click', () => {
        valvulaAbierta = !valvulaAbierta;
        const tarjetas = document.querySelectorAll('.sensor-card');
        
        if (!valvulaAbierta) {
            estadoValvula.textContent = 'Válvula de Aislamiento: CERRADA';
            estadoValvula.style.color = '#f85149';
            btnFailsafe.textContent = 'RESTABLECER SISTEMA';
            btnFailsafe.style.backgroundColor = '#1f6feb';
            dotStatus.classList.replace('online', 'offline');
            sistemaActivo = false;
            estadoBomba.textContent = 'Estado: Bloqueo de Seguridad';
            btnBomba.style.backgroundColor = '#21262d';
            btnBomba.textContent = 'Bloqueado';
            tarjetas.forEach(card => card.style.opacity = '0.3');
            tempGoogle.textContent = 'AISLADO'; tempAdp.textContent = 'AISLADO'; presionPlenum.textContent = '0.00 Pa';
            
            logEvento('¡PROTOCOLO FAIL-SAFE ACTIVADO! Aislamiento en < 500ms', 'crit');
            logEvento('Caída térmica controlada. Flujo hacia ADP cortado.', 'crit');
        } else {
            estadoValvula.textContent = 'Válvula de Aislamiento: ABIERTA';
            estadoValvula.style.color = '#ffffff';
            btnFailsafe.textContent = 'ACTIVAR AISLAMIENTO';
            btnFailsafe.style.backgroundColor = '#da3633';
            dotStatus.classList.replace('offline', 'online');
            tarjetas.forEach(card => card.style.opacity = '1');
            btnBomba.textContent = 'Iniciar Bombeo';
            
            logEvento('Sistema de aislamiento restablecido. Presión normal.', 'sys');
        }
    });
});