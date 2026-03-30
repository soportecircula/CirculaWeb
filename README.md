# Plataforma REP - Circula Colombia S.A.S.
## 📝 Descripción
Este proyecto consiste en el desarrollo de una solución tecnológica especializada para la Gerencia de Sostenibilidad de Circula Colombia S.A.S.. El objetivo principal es fortalecer la gestión operativa y la Responsabilidad Extendida del Productor (REP), transformando procesos manuales en un sistema digital trazable y escalable.
La plataforma actúa como una infraestructura de gobernanza digital que permite centralizar flujos de información críticos para el cumplimiento de normativas ambientales en el marco de la economía circular.
## 🚀 Características Principales
* Gestión de Materiales: Módulos especializados para el registro y seguimiento de envases, empaques y RAEE.
* Trazabilidad Punta a Punta: Implementación de parámetros de Pasaporte Digital de Producto para determinar la ubicación y propiedades de los materiales.
* Monitoreo en Tiempo Real: Capacidades de análisis de datos para gestionar variaciones en cantidades y calidades de materiales recolectados.
* Reporte Estandarizado: Generación de información bajo estándares internacionales como GRI e IFRS S1/S2.
## 🛠️ Metodología y Tecnologías
El desarrollo se rige bajo estándares rigurosos de ingeniería de sistemas:
* **Marco de Trabajo Ágil:** Implementación de **Scrum** con ciclos de Sprints (máximo un mes), Planificación, Scrums Diarios, Revisiones y Retrospectivas.
* **Calidad de Software:** Procesos de validación basados en el estándar **ISO/IEC/IEEE 29119** para asegurar la integridad de la información ambiental.
## 📅 Plan de Trabajo (Fases)
1. **Inmersión y Diagnóstico:** Entendimiento del modelo REP y levantamiento de procesos.
2. **Análisis Funcional:** Definición de historias de usuario y flujos operativos.
3. **Desarrollo Progresivo:** Construcción iterativa de módulos funcionales.
4. **Validación y Cierre:** Pruebas con usuarios y consolidación de documentación técnica.
## 🛠️ Instalación y Configuración del Entorno
Este proyecto utiliza una arquitectura de microservicios contenedorizada para garantizar la escalabilidad y la integridad de los datos de economía circular.
### Requisitos Previos
* **Docker & Docker Compose:** (Versión 20.10+ recomendada)
* **Python:** 3.10+ (Para desarrollo local del Backend)
* **Node.js & NPM:** v18+ (Para desarrollo local del Frontend)
* **Angular CLI:** v16+
## 🌿 Estructura de Ramas (Workflow)
Para mantener la trazabilidad y calidad exigida, el repositorio sigue esta estructura de ramas:
* **`main`**: Contiene el código en producción, estable y validado por la Gerencia de Sostenibilidad.
* **`develop`**: Rama de integración donde se consolidan las funcionalidades terminadas de cada Sprint.
* **`feature/`**: Ramas temporales para el desarrollo de historias de usuario específicas (ej. `feature/modulo-raee`, `feature/auth-angular`).
* **`hotfix/`**: Ramas para correcciones críticas e inmediatas en el entorno de producción.
* **`release/`**: Ramas de preparación para la entrega final de cada incremento de software.
### Reglas de Contribución
1. Toda nueva funcionalidad debe nacer de `develop`.
2. Se requiere un **Pull Request (PR)** para integrar cambios a `develop`.
3. El código debe pasar las pruebas unitarias antes de ser fusionado.
