# Configuración de SonarQube para EduSync

Este documento explica cómo configurar y usar SonarQube para analizar la calidad del código en el proyecto EduSync.

## Instalación local

### Requisitos previos

- Docker y Docker Compose instalados
- Node.js y npm

### Pasos para iniciar SonarQube localmente

1. Inicia SonarQube usando Docker Compose:

    ```bash
    docker-compose up -d
    ```

2. Espera unos minutos hasta que SonarQube esté completamente iniciado.

3. Accede a SonarQube en [http://localhost:9000](http://localhost:9000)

    - Usuario por defecto: `admin`
    - Contraseña por defecto: `admin`
    - Se te pedirá cambiar la contraseña en el primer inicio de sesión.

4. Crea un nuevo proyecto:

    - En la interfaz de SonarQube, ve a "Create new project"
    - Selecciona "Manually"
    - Establece "Project key" como `edu-sync`
    - Establece "Display name" como `EduSync`
    - Selecciona "Locally" como método de análisis
    - Genera un token para el proyecto

5. Copia el token generado a tu archivo `.env`:
    ```
    SONAR_HOST_URL=http://localhost:9000
    SONAR_TOKEN=tu-token-generado
    ```

## Ejecutar análisis local

Para ejecutar un análisis local, usa el siguiente comando:

```bash
npm run sonar
```

## Integración con CI/CD

El proyecto está configurado para ejecutar análisis de SonarQube automáticamente en GitHub Actions cuando:

- Se hace push a las ramas `main` o `develop`
- Se crea un pull request hacia la rama `main`

### Configuración en GitHub

1. En tu repositorio de GitHub, ve a "Settings" > "Secrets and variables" > "Actions"
2. Agrega dos secretos:
    - `SONAR_TOKEN`: Tu token de autenticación de SonarQube
    - `SONAR_HOST_URL`: URL de tu servidor SonarQube (ej: http://sonarqube.tudominio.com)

## Interpretación de resultados

SonarQube proporciona varias métricas:

- **Bugs**: Problemas que podrían causar comportamientos incorrectos
- **Vulnerabilidades**: Problemas de seguridad
- **Code Smells**: Problemas de mantenibilidad
- **Cobertura de código**: Porcentaje de código cubierto por pruebas
- **Duplicación**: Porcentaje de código duplicado

## Personalización

Para personalizar las reglas o la configuración, edita el archivo `sonar-project.js`.
