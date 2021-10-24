const defaultConfig = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
  },
};

const tsOverrides = {
  files: ['**/*.ts'],
  extends: [...defaultConfig.extends, 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [...defaultConfig.plugins, '@typescript-eslint'],
  rules: defaultConfig.rules,
};

module.exports = {
  ...defaultConfig,
  overrides: [tsOverrides],
};
