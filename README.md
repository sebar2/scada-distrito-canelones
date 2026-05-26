# 🏭 SCADA - Distrito Térmico Canelones (UTU-Inversor)

Este repositorio contiene la arquitectura de la Interfaz Hombre-Máquina (HMI) del sistema de control distribuido para la recuperación térmica industrial entre el Data Center corporativo y la planta de inversor.

## 📐 Arquitectura de Red y Sistemas Proyectada

El sistema está diseñado bajo una topología de misión crítica, segregando la capa de control de hardware de la capa de visualización corporativa.

* **Nivel 1 (Campo):** Autómatas Programables (ej. PLC Siemens S7-1200) y actuadores neumáticos con retorno por resorte (Fail-Safe < 500ms).
* **Nivel 2 (Transporte):** Enlace de Fibra Óptica Monomodo (1km) utilizando protocolo Modbus TCP/IP sobre una VLAN industrial aislada.
* **Nivel 3 (Backend & Data Historian):** Servidor Linux alojando base de datos PostgreSQL para el registro inmutable de telemetría y variables ambientales (Auditorías DINACEA).
* **Nivel 4 (Frontend HMI - *Código en este repositorio*):** Cliente de visualización de muy baja latencia.

## ⚡ Decisiones de Ingeniería de Software (Frontend)

El cliente HMI fue desarrollado íntegramente en **Vanilla JavaScript** (cero dependencias de librerías de terceros) con manipulación directa del DOM mediante selectores nativos (`querySelector`). 

**¿Por qué Vanilla JS?**
1.  **Seguridad:** Eliminación de vulnerabilidades heredadas por dependencias de paquetes (NPM) de terceros.
2.  **Rendimiento:** Carga instantánea en terminales de bajo consumo energético dentro del Centro de Operaciones de Red (NOC).
3.  **Mantenibilidad:** Estructura modular estricta que facilita las auditorías de código por parte de entidades reguladoras.

🔴 **Ver la demostración en vivo (Simulación Cliente)::https://sebarodriguez.github.io/scada-distrito-canelones
