export const eslintConfig = `
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
  "rules": {
    "prefer-arrow-callback": ["error"],
    "prefer-template": ["error"]
  }
}
`.trim();
