import nextPlugin from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/generated/**',
      'next-env.d.ts',
      'coverage/**',
    ],
  },
  ...nextPlugin,
  prettier,
];

export default eslintConfig;
