module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint' ],
  extends: [ 'plugin:@typescript-eslint/recommended' ],
  rules: {
    'no-undef': 'off',
    'comma-dangle': [ 'error', 'never' ],
    'operator-linebreak': [ 'error', 'before' ],
    'multiline-ternary': [ 'error', 'never' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always', {
      'singleValue': true,
      'objectsInArrays': true,
      'arraysInArrays': true
    } ],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // typescript rules
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [ 'error', {
      functions: false, // safe since function declarations are hoisted
      typedefs: false
    } ],
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/member-delimiter-style': [ 'error', {
      multiline: {
        delimiter: 'none',
        requireLast: false
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false
      }
    } ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/array-type': [ 'error', { default: 'array-simple' } ],
    // enabled below for ts files only on mixed codebase, see :
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md#configuring-in-a-mixed-jsts-codebase
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-unused-vars': [ 'error', {
      varsIgnorePattern: 'jsx',
      args: 'none'
    } ],
    'no-unused-vars': [ 'error', {
      varsIgnorePattern: 'jsx',
      args: 'none'
    } ],
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off', // this syntax is already a warning !
    // No-useless-constructor bugs with typescript constructor overload
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    // Allow single and backquotes
    'quotes': 'off',
    '@typescript-eslint/quotes': [ 'error', 'single', { avoidEscape: true, allowTemplateLiterals: true } ],
    'quote-props': [ 'error', 'as-needed', { unnecessary: false } ],
    'dot-notation': 'off',
    'no-restricted-syntax': [
      'error',
      {
        'selector': 'TSEnumDeclaration',
        'message': "Don't use enums"
      }
    ],
    'semi': [ 'error', 'never' ]
  }
}
