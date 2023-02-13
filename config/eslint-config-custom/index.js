/*eslint-disable-next-line no-undef*/
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    }
};