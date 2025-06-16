# Contributing to EduSync / Contribuyendo a EduSync

---

## 🇪🇸 Español

### 1. Licencia y Propósito

- **Fines Educativos**: Este repositorio y todo su contenido están destinados **solo** a usos educativos, de aprendizaje e investigación.
- **Prohibición de Uso Comercial**: Queda estrictamente prohibido utilizar, distribuir o sublicenciar el código y/o recursos con fin de lucro o en productos/servicios comerciales.
- **Derechos de Contribución**: Al enviar una contribución (issue, pull request, sugerencia), aceptas licenciar tu aporte bajo los mismos términos: uso educativo y sin fines comerciales.

### 2. Cómo Reportar Bugs y Solicitar Funcionalidades

1. Abre un **issue** describiendo:

    - El problema o la mejora deseada.
    - Pasos para reproducirlo (en caso de bug).
    - Entorno de desarrollo (SO, versión de Node.js, Next.js, etc.).

2. Usa las etiquetas (`bug`, `enhancement`, `docs`, etc.) para categorizarlo.

### 3. Flujo de Contribución de Código

1. **Fork & Branch**:

    - Haz fork del repositorio.
    - Crea una rama descriptiva: `feature/nombre-descriptivo` o `fix/issue-#`.

2. **Desarrollo**:

    - Sigue convenciones de estilo (ESLint + Prettier).
    - Añade/tests para cubrir tu cambio (Jest, React Testing Library).
    - Asegúrate de que todas las comprobaciones de CI pasen.

3. **Commits**:

    - Usa nuestro formato de commit personalizado, inspirado en Conventional Commits.
    - El formato es: `[tipo] descripción corta en presente`
    - **Tipos permitidos**: `feat`, `fix`, `refactor`, `config`, `docs`.
    - Ejemplo: `[feat] agregar inicio de sesión con redes sociales` o `[fix] corregir constraint de clave foránea`.

4. **Pull Request**:

    - Asocia tu PR al issue correspondiente (ej. `Closes #42`).
    - Describe claramente los cambios y cómo probarlos.

### 4. Revisión y Mantenimiento

- Un mantenedor revisará tu PR y comentará si necesita ajustes.
- **Mantén tu PR actualizado**: Si la rama principal (`main`) ha cambiado, actualiza tu rama usando rebase para mantener un historial limpio.

    ```bash
    # Asegúrate de tener el repositorio original como "upstream"
    # git remote add upstream https://github.com/YOUR_USERNAME/edu-sync.git

    git fetch upstream
    git rebase upstream/main
    ```

- **Limpia tus commits**: Si tienes muchos commits pequeños (ej. "fix typo", "WIP"), únelos en commits más significativos antes de solicitar la revisión final.
    ```bash
    git rebase -i HEAD~5 # Reemplaza 5 con el número de commits a limpiar
    ```
- Responde a los comentarios y actualiza tu rama (con `git push --force-with-lease`) hasta el merge.

### 5. Buenas Prácticas

- **Documentación**: Actualiza `README.md` o `/docs/` según corresponda.
- **Seguridad**: Nunca subas secretos o credenciales al repo.
- **Accesibilidad**: Sigue pautas ARIA y contrastes adecuados.

### 6. Código de Conducta

Este proyecto sigue un [Código de Conducta](CODE_OF_CONDUCT.md). Sé respetuoso y colaborativo.

---

## 🇺🇸 English

### 1. License & Purpose

- **Educational Use Only**: This repository and all its content are intended **exclusively** for educational, learning, and research purposes.
- **No Commercial Use**: It is strictly prohibited to use, distribute, or sublicense the code and/or resources for profit or in commercial products/services.
- **Contribution Rights**: By submitting an issue or pull request, you agree to license your contributions under the same terms: educational use only and no commercial exploitation.

### 2. Reporting Bugs & Requesting Features

1. Open an **issue** and include:

    - A clear description of the bug or requested enhancement.
    - Steps to reproduce (for bugs).
    - Environment details (OS, Node.js version, Next.js version, etc.).

2. Apply appropriate labels (`bug`, `enhancement`, `docs`, etc.).

### 3. Code Contribution Workflow

1. **Fork & Branch**:

    - Fork the repository.
    - Create a descriptive branch: `feature/your-feature` or `fix/issue-#`.

2. **Development**:

    - Adhere to style conventions (ESLint + Prettier).
    - Write tests to cover your changes (Jest, React Testing Library).
    - Ensure all CI checks pass before submitting.

3. **Commits**:

    - Follow our custom commit format, inspired by Conventional Commits.
    - The format is: `[type] short description in present tense`
    - **Allowed types**: `feat`, `fix`, `refactor`, `config`, `docs`.
    - Example: `[feat] add social media login` or `[fix] correct foreign key constraint`.

4. **Pull Request**:

    - Link your PR to the related issue (e.g., `Closes #42`).
    - Provide a clear description of changes and testing instructions.

### 4. Review & Maintenance

- A maintainer will review your PR and request any necessary changes.
- **Keep your PR updated**: If the main branch has changed, rebase your branch to maintain a clean history.

    ```bash
    # Ensure you have the original repository as an "upstream" remote
    # git remote add upstream https://github.com/YOUR_USERNAME/edu-sync.git

    git fetch upstream
    git rebase upstream/main
    ```

- **Clean up your commits**: If you have many small commits (e.g., "fix typo," "WIP"), squash them into more meaningful commits before the final review.
    ```bash
    git rebase -i HEAD~5 # Replace 5 with the number of commits to clean up
    ```
- Respond to feedback and update your branch (using `git push --force-with-lease`) until the PR is merged.

### 5. Best Practices

- **Documentation**: Update `README.md` or add files under `/docs/` as needed.
- **Security**: Do not commit secrets or credentials.
- **Accessibility**: Follow ARIA guidelines and maintain proper contrast.

### 6. Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and collaborative.

---

¡Gracias por contribuir! / Thank you for contributing!
