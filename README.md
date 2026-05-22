# scada-distrito-canelones
Plataforma HMI/SCADA de baja latencia para gestión de recuperación térmica industrial.
Markdown
# Distrito Térmico Canelones - Sistema SCADA (Demo)

Este repositorio contiene el código fuente del frontend para el sistema de control distribuido (SCADA) diseñado para gestionar la transferencia térmica entre la infraestructura de refrigeración corporativa y la planta de agronegocios (ADP).

## 🚀 Arquitectura y Stack Tecnológico

El sistema prioriza la **baja latencia y la mantenibilidad operativa**, eliminando dependencias de librerías de terceros (cero jQuery, cero frameworks pesados).

* **Frontend:** Vanilla JavaScript, utilizando métodos nativos (`querySelector`) para la manipulación directa del DOM y renderizado de alertas críticas en milisegundos.
* **Diseño:** Estructura de archivos estrictamente desacoplada (CSS, JS y HTML aislados) para facilitar auditorías y mantenimiento.
* **Backend Teórico:** Diseñado para interoperar con PostgreSQL (Historian de datos ambientales DINACEA) y PLCs Siemens S7-1200 vía Modbus TCP.

## ⚙️ Características de la Interfaz

* Monitoreo en tiempo real de la temperatura del lazo de glicol.
* Simulación del mecanismo Fail-Safe (< 500ms) para protección de servidores.
* Alertas perimetrales para concentraciones de NO2.

## 🔗 Demostración en Vivo
El dashboard funcional puede visualizarse en el siguiente enlace:https://sebarodriguez.github.io/scada-distrito-canelones
