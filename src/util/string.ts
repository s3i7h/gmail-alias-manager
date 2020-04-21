/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PlainComponent {
  type: "plain";
  char: string;
}

export interface PropComponent {
  type: "prop";
  prop: string | number;
  char: (binding: any) => string;
}

export type FormatComponent = PlainComponent | PropComponent;

export const parseFormat: <T>(
  formatString: string
) => FormatComponent[] = formatString => {
  const components: FormatComponent[] = [];
  let expression = false;
  let propBuffer: string | number = "";
  for (let charIndex = 0; charIndex < formatString.length; charIndex++) {
    const char = formatString[charIndex];
    if (expression) {
      if (char === "}") {
        propBuffer = isNaN(Number(propBuffer))
          ? propBuffer
          : Number(propBuffer);
        const prop = propBuffer;
        components.push({
          type: "prop",
          prop: prop,
          char: (binding: any) => binding[prop]
        });
        propBuffer = "";
        expression = false;
      } else {
        propBuffer += char;
      }
    } else {
      if (char === "\\" && charIndex != formatString.length - 1) {
        components.push({
          type: "plain",
          char: formatString[charIndex + 1]
        });
        charIndex++;
        continue;
      }
      if (char === "{") expression = true;
      else
        components.push({
          type: "plain",
          char: char
        });
    }
  }
  return components;
};

export const formatCompiler = <T>(formatComponents: FormatComponent[]) => <T>(
  binding: T
) =>
  formatComponents
    .map(component =>
      component.type === "prop" ? component.char(binding) : component.char
    )
    .join("");

export const format = <T>(formatString: string, binding: T) =>
  formatCompiler(parseFormat(formatString))(binding);
