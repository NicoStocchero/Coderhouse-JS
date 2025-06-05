export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn", // Marca variables no usadas
      "no-unused-labels": "warn", // Marca etiquetas no usadas
      "no-undef": "error", // Marca variables no definidas
      eqeqeq: "warn", // Recomienda usar === en vez de ==
      "no-console": "warn", // Advierte si quedan console.log
      semi: ["warn", "always"], // Recomienda punto y coma
      quotes: ["warn", "double"], // Recomienda comillas dobles
    },
  },
];
