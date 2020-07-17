module.exports = {
  extends: ["plugin:react/recommended", "../../.eslintrc.js"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};
