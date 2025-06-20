module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Zod schemas in schema files must have names ending with "Schema"',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      requireSchemaSuffix: 'Zod schema variable names must end with "Schema".',
      requireFirstCharLowercase:
        'The first letter of a schema cannot be uppercase',
    },
    schema: [], // no options
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply this rule to files that contain "schema" (case-insensitive)
    if (!/schema/i.test(filename)) {
      return {};
    }

    function isLowerCase(str) {
      return str === str.toLowerCase() && str !== str.toUpperCase();
    }

    return {
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee?.object?.name === 'z'
        ) {
          const variableName = node.id.name;
          if (!variableName.endsWith('Schema')) {
            context.report({
              node: node.id,
              messageId: 'requireSchemaSuffix',
            });
          }

          if (!isLowerCase(variableName[0])) {
            context.report({
              node: node.id,
              messageId: 'requireFirstCharLowercase',
            });
          }
        }
      },
    };
  },
};
