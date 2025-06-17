module.exports = {
    // No usamos extends porque modificamos el formato estándar
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'config', 'docs']],
        'scope-enum': [
            0, // 0 = desactivado, permite cualquier scope
            'always',
            [
                'auth',
                'ui',
                'api',
                'db',
                'config',
                'components',
                'services',
                'utils',
                'calendar',
                'roles',
            ],
        ],
        // Formato personalizado: [tipo] descripción
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-max-length': [2, 'always', 100],
        'subject-min-length': [2, 'always', 5],
        // Desactivamos reglas que no siguen nuestro formato
        'subject-case': [0],
        'type-case': [2, 'always', 'lower-case'],
        'header-max-length': [2, 'always', 120],
    },
    // Configuración personalizada para parsear el formato [tipo] descripción
    parserPreset: {
        parserOpts: {
            headerPattern: /^\[(?<type>[a-z]+)\]\s(?<subject>.+)/,
            headerCorrespondence: ['type', 'subject'],
        },
    },
};
