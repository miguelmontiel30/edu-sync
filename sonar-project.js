const scanner = require('sonarqube-scanner');

scanner({
    serverUrl: process.env.SONAR_HOST_URL || 'http://localhost:9000',
    token: process.env.SONAR_TOKEN,
    options: {
        'sonar.projectKey': 'edu-sync',
        'sonar.projectName': 'EduSync',
        'sonar.projectVersion': '0.1.0',
        'sonar.sources': 'src,app',
        'sonar.tests': 'src,app',
        'sonar.test.inclusions': '**/*.test.tsx,**/*.test.ts,**/__tests__/**',
        'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.exclusions':
            '**/node_modules/**,**/*.test.tsx,**/*.test.ts,**/__tests__/**,.next/**,out/**,public/**',
    },
});
