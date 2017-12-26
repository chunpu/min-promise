// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    // sourceType: 'module',
    ecmaVersion: 3 // 支持IE6
  },
  env: {
    browser: true,
  },
  env: {
      browser: true, // 浏览器环境
      mocha: true,
      commonjs: true, // commonjs 环境
      jquery: true
  },
  // globals
  globals: {
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // 可解决 start
    'semi-spacing': 0,
    'semi': 0,
    'space-before-function-paren': 0,
    'comma-spacing': 0,
    'eqeqeq': 0,
    'spaced-comment': 0,
    'no-useless-escape': 0,
    'no-control-regex': 0,
    'indent': 0,
    'quotes': 0,
    'key-spacing': 0,
    'one-var': 0,
    'padded-blocks': 0,
    'space-before-blocks': 0,
    'operator-linebreak': 0,
    'space-infix-ops': 0,
    'padded-blocks': 0,
    'operator-linebreak': 0,
    'space-in-parens': 0,
    'keyword-spacing': 0,
    'no-multiple-empty-lines': 0,
    'camelcase': 0,
    'no-multi-spaces': 0,
    'new-parens': 0,
    'block-spacing': 0,
    'handle-callback-err': 0,
    // 可解决 end
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
