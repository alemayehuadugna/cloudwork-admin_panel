module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/essential",
        "@vue/standard",
        "@vue/typescript/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        indent: "off",
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-tabs": 0,
		"comma-dangle": "off",
		"space-before-function-paren": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-types": "off",
		"no-useless-constructor": "off",
		"lines-between-class-members": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-extra-semi": "off",
		"no-use-before-define": "off",
		"eol-last": "off",
		"no-unused-expressions": "off"
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
                jest: true,
            },
        },
    ],
};
