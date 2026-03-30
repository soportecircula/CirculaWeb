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
## 💻 Guía de Comandos Técnicos
### Ciclo de Desarrollo de Funcionalidades
```bash
# 1. Asegurar sincronización con la integración actual
git checkout develop
git pull origin develop

# 2. Crear rama técnica para la Historia de Usuario
git checkout -b feature/diagnostico-procesos-rep

# 3. Commits atómicos con referencia técnica
git add .
git commit -m "feat: implementar esquema de validación"
git push origin feature/diagnostico-procesos-rep
```
### Finalización de Sprint e Incremento (Release)
```bash
# 1. Crear rama de preparación para revisión (Sprint Review)
git checkout develop
git checkout -b release/v1.0.0-sprint1

# 2. Una vez validado por el Product Owner (Gerencia), fusionar a producción
git checkout main
git merge release/v1.0.0-sprint1
git tag -a v1.0.0 -m "Entrega formal: Módulo de Gestión de Envases"
git push origin main --tags

# 3. Sincronizar develop y limpiar
git checkout develop
git merge main
git branch -d release/v1.0.0-sprint1
```
### Gestión de Errores Críticos (Hotfix)
```bash
# 1. Ramificar desde el estado actual de producción
git checkout main
git checkout -b hotfix/error-integridad-datos

# 2. Aplicar parche técnico y fusionar a ambas ramas principales
git commit -am "fix: corrección en el cálculo de metas de recolección"
git checkout main
git merge hotfix/error-integridad-datos
git checkout develop
git merge hotfix/error-integridad-datos
```
## 📂 Estructura del Proyecto

A continuación se detalla la organización de los directorios del repositorio, estructurados para soportar el desarrollo progresivo y la integración continua del sistema:

```text
.
├── 📁 backend/                 # API REST desarrollada en Python
│   ├── 📁 app/                 # Lógica de negocio y rutas
│   ├── 📁 tests/               # Pruebas unitarias e integración (ISO 29119)
│   ├── requirements.txt        # Dependencias de Python
│   └── Dockerfile              # Configuración de imagen para el Backend
├── 📁 frontend/                # Aplicación Web en Angular
│   ├── 📁 src/                 # Componentes, servicios y modelos REP
│   ├── 📁 e2e/                 # Pruebas de extremo a extremo
│   ├── angular.json            # Configuración del Framework
│   └── Dockerfile              # Configuración de imagen para el Frontend
├── 📁 database/                # Persistencia de datos
│   └── 📁 migrations/          # Scripts de esquema para PostgreSQL
├── 📁 docs/                    # Transferencia de conocimiento institucional [cite: 29]
│   ├── 📁 diagnostico/         # Caracterización de procesos operativos [cite: 67]
│   ├── 📁 analisis/            # Historias de usuario y requerimientos [cite: 68]
│   ├── 📁 diseño/              # Arquitectura y diagramas de interacción [cite: 69]
│   └── 📁 entrega/             # Manuales y documentación de validación [cite: 71]
├── .github/                    # Automatización y plantillas (PR Template)
├── .gitignore                  # Exclusión de archivos para Git
├── docker-compose.yml          # Orquestación de servicios (Front, Back, DB)
└── README.md                   # Documentación principal del proyecto
