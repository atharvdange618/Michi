type CompiledPattern = {
  regex: RegExp;
  paramNames: string[];
};

function compile(pattern: string): CompiledPattern {
  const paramNames: string[] = [];

  const regexString = pattern
    .split("/")
    .map((segment) => {
      if (segment.startsWith("$")) {
        paramNames.push(segment.slice(1));
        return "([^/]+)"; // match anything except a slash
      }

      if (segment === "*") {
        paramNames.push("*");
        return "(.*)"; // match everything including slashes
      }

      // static segment, escape regex special chars
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");

  return {
    regex: new RegExp(`^${regexString}$`),
    paramNames,
  };
}

export function matchRoute(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const { regex, paramNames } = compile(pattern);
  const match = path.match(regex);

  if (!match) return null;

  const params: Record<string, string> = {};

  // match[0] is the full string, params start at match[1]
  paramNames.forEach((name, i) => {
    params[name] = decodeURIComponent(match[i + 1]);
  });

  return params;
}
