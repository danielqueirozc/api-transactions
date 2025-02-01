// eslint.config.js
export default [
  {
    // Define quais arquivos serão analisados
    files: ["**/*.{js,ts}"],
    languageOptions: {
      // Usamos a versão ECMAScript 2021; ajuste conforme necessário
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      // Exibe um aviso ao usar console
      "no-console": "warn",
      // Exibe um aviso para variáveis não utilizadas
      "no-unused-vars": "warn",
    },
  },
];
