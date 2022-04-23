module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    // added to fix module resolver.
    // https://github.com/kriasoft/react-starter-kit/issues/1180
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    extends: ['airbnb', 'airbnb/hooks'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        // Forbid the import of external modules that are not declared in the package.json's
        // dependencies, devDependencies, optionalDependencies, peerDependencies,
        // or bundledDependencies. The closest parent package.json will be used.
        // If no package.json is found, the rule will not lint anything.
        // This behaviour can be changed with the rule option packageDir.
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true, optionalDependencies: false, peerDependencies: false },
        ],
        // By default, this rule will report paths whose case do not match the underlying filesystem path, if the FS is not case-sensitive.
        // To disable this behavior, set the caseSensitive option to false
        'import/no-unresolved': [2, { caseSensitive: false }],
        // Assignment to variables declared as function parameters can be misleading and lead to confusing behavior,
        // as modifying function parameters will also mutate the arguments object.
        // Often, assignment to function parameters is unintended and indicative of a mistake or programmer error.
        'no-param-reassign': 'off',
        'no-useless-computed-key': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        // implicit-arrow-linebreak disabled because it collides with 80 character
        // line length rule. Also when enabled, one attempted workaround
        // is to add curly braces after a fat arrow declaration, but if
        // the implementation immediately returns a value, then arrow-body-style
        // is raised as an error
        'implicit-arrow-linebreak': 'off',
        // Not needed. We will let client side P4 tooling take care of
        // converting line endings
        'linebreak-style': 'off',
        // Prefer no space before function paren
        'space-before-function-paren': 'off',
        // Hoisting is ok
        'no-use-before-define': 'off',
        'no-console': 'off',
        // TypeScript interfaces / types for props replaces this
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/no-unused-prop-types': 'off',
        // Rule is forcing manual reformatting of stuff - no automated
        // reformat seems to be working
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        /** Too restrictive */
        'react/jsx-props-no-spreading': 'off',
        // This collides with auto-reformatting rule
        'no-confusing-arrow': 'off',
        // Causes a lot of exceptions to be added in code potentially
        // due to 3rd party / data model dependencies
        camelcase: 'off',
        // This collides with auto-reformatting
        'operator-linebreak': 'off',
        // Set min from 4 to 5 to work with auto-reformatting
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {
                    minProperties: 5,
                    multiline: true,
                    consistent: true,
                },
                ObjectPattern: {
                    minProperties: 5,
                    multiline: true,
                    consistent: true,
                },
                ImportDeclaration: {
                    minProperties: 5,
                    multiline: true,
                    consistent: true,
                },
                ExportDeclaration: {
                    minProperties: 5,
                    multiline: true,
                    consistent: true,
                },
            },
        ],
        // This collides with auto-reformatting
        'function-paren-newline': 'off',
        // This collides with auto-reformatting
        'react/jsx-curly-newline': 'off',
        // This collides with auto-reformatting
        'react/jsx-one-expression-per-line': 'off',
        // disable destructuring assignment
        'react/destructuring-assignment': 'off',
        // methods sometimes don't need class variables
        'class-methods-use-this': 'off',
        // cases we need to access hasownproperty for typecast
        'no-prototype-builtins': 'off',
        // modifying max length of code to 120 and comment to 140
        'max-len': ['error', { code: 120, comments: 140 }],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            excludedFiles: 'node/modules/**/*',
            rules: {
                'no-unused-vars': ['off'],
            },
        },
    ],
};
