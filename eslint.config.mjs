import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            // Variables y constantes sin usar
            'no-unused-vars': 'off', // Desactivamos la regla base
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // Imports sin usar
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // Otras reglas útiles
            'no-unused-expressions': 'warn',
            'no-console': ['warn', { allow: ['error'] }], // Permitir console.error, advertir sobre otros
            'prefer-const': 'warn', // Preferir const cuando sea posible
            'no-var': 'error', // No usar var
            'no-duplicate-imports': 'warn', // No imports duplicados

            // Reglas específicas de React/Next.js
            'react/jsx-no-unused-vars': 'off', // Manejado por unused-imports
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
];

export default eslintConfig;
