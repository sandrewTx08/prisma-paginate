import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
	...tseslint.configs.recommended,

	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: "latest",
		},
		rules: {
			"no-console": "error",
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
]);
