import path from "node:path";

const HEADER_MARKER = "setting up ";

function createHeader(filename) {
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  })
    .formatToParts(new Date())
    .reduce((parts, part) => ({ ...parts, [part.type]: part.value }), {});
  const date = `${dateParts.day} ${dateParts.month}, ${dateParts.year}`;

  return `/*\n|-----------------------------------------\n| setting up ${filename} for the App\n| @author: Toufiquer Rahman<toufiquer.0@gmail.com>\n| @copyright: Toufiquer, ${date}\n|-----------------------------------------\n*/\n\n`;
}

export default {
  rules: {
    "required-header": {
      meta: {
        type: "suggestion",
        docs: { description: "Add the project ownership header to source files." },
        fixable: "code",
        schema: [],
      },
      create(context) {
        return {
          Program(node) {
            const source = context.sourceCode.text;
            if (source.slice(0, 600).includes(HEADER_MARKER)) return;

            const filename = path.basename(context.filename);
            context.report({
              node,
              message: "Add the required project file header.",
              fix(fixer) {
                return fixer.insertTextBeforeRange([0, 0], createHeader(filename));
              },
            });
          },
        };
      },
    },
  },
};
