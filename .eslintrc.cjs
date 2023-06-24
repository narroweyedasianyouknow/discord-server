module.exports = {
     parser: '@typescript-eslint/parser',
     parserOptions: {
          project: './tsconfig.json',
          ecmaVersion: 'latest',
          sourceType: 'module',
     },
     settings: {
          'import/resolver': {
               node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
               },
               typescript: './tsconfig.json',
          },
     },
     plugins: ['@typescript-eslint', 'import-helpers'],
     extends: [
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/eslint-recommended',
          'plugin:prettier/recommended',
          'eslint:recommended',
          'plugin:import/recommended',
          'plugin:import/typescript',
     ],
     root: true,
     env: {
          node: true,
          jest: true,
     },
     globals: {
          Express: 'readonly',
          RTCSessionDescriptionInit: 'readonly',
          RTCIceCandidateInit: 'readonly',
          CookieValue: 'readonly',
          CookieProfile: 'readonly',
     },
     ignorePatterns: ['.eslintrc'],
     rules: {
          '@typescript-eslint/interface-name-prefix': 'off',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-explicit-any': 'off',

          '@typescript-eslint/no-unused-vars': [
               'error',
               {
                    ignoreRestSiblings: true,
                    caughtErrorsIgnorePattern: '^ignore',
                    vars: 'all',
                    args: 'none',
               },
          ],
          'no-unused-vars': 'off',
          'prettier/prettier': [
               'error',
               {
                    endOfLine: 'auto',
                    tabWidth: 5,
               },
          ],
          'import/namespace': 'off',
          'no-undef': 'off',
          'import-helpers/order-imports': [
               'error',
               {
                    newlinesBetween: 'always',
                    groups: [
                         '/^@app/',
                         '/^@shared/',
                         '/^@modules/',
                         '/^@utils/',
                         'module',
                         ['parent', 'sibling', 'index'],
                         ['/^@\\//'],
                    ],
                    alphabetize: {
                         order: 'asc',
                         ignoreCase: true,
                    },
               },
          ],
     },
};
