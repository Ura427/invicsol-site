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
      // Alternate checkouts of this repo (see .gitignore) — linting them lints
      // the whole project a second time from inside the first.
      '.worktrees/**',
    ],
  },
  ...nextPlugin,
  prettier,
];

export default eslintConfig;
