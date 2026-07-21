import * as ts from "typescript";
import * as fs from "node:fs";
import * as path from "node:path";

// AST inspection
// Walks a route file's source text as an AST, without ever executing it,
// to find out which of the router's known exports are present.

type RouteFileExports = {
  hasDefaultExport: boolean;
  hasLoader: boolean;
  hasValidateSearch: boolean;
  hasErrorComponent: boolean;
};

const NAMED_EXPORTS = new Set(["loader", "validateSearch", "errorComponent"]);

function inspectRouteFile(filePath: string): RouteFileExports {
  const sourceText = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const result: RouteFileExports = {
    hasDefaultExport: false,
    hasLoader: false,
    hasValidateSearch: false,
    hasErrorComponent: false,
  };

  function markNamedExport(name: string): void {
    if (name === "loader") result.hasLoader = true;
    if (name === "validateSearch") result.hasValidateSearch = true;
    if (name === "errorComponent") result.hasErrorComponent = true;
  }

  function isExported(node: ts.Node & { modifiers?: ts.NodeArray<ts.ModifierLike> }): boolean {
    return node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
  }

  function visit(node: ts.Node): void {
    // export default function Page() {} / export default class Page {}
    if (
      (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      result.hasDefaultExport = true;
    }

    // export default SomeIdentifier;
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      result.hasDefaultExport = true;
    }

    // export function loader(...) {}
    if (ts.isFunctionDeclaration(node) && node.name && isExported(node)) {
      if (NAMED_EXPORTS.has(node.name.text)) markNamedExport(node.name.text);
    }

    // export const loader = ... / export const validateSearch = ... / export const errorComponent = ...
    if (ts.isVariableStatement(node) && isExported(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && NAMED_EXPORTS.has(decl.name.text)) {
          markNamedExport(decl.name.text);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

// filename → route path segment

function segmentFromFilename(filename: string): {
  segment: string | null;
  isLayout: boolean;
} {
  const base = filename.replace(/\.tsx$/, "");

  if (base === "__root") return { segment: "__root", isLayout: true };
  // _index is a pathless layout, NOT an index route - matches TanStack Router conventions
  if (base.startsWith("_")) return { segment: base, isLayout: true };
  if (base === "index") return { segment: null, isLayout: false }; // takes parent's own path
  if (base === "$") return { segment: "*", isLayout: false };
  return { segment: base, isLayout: false }; // static segments AND "$id" pass through unchanged
}

function joinPath(parent: string, segment: string): string {
  if (parent === "" || parent === "/") return `/${segment}`;
  return `${parent}/${segment}`;
}

// recursive tree walk

// specificity tier for ordering children: static beats dynamic beats wildcard.
// matchTree uses first-match-wins, so children must be sorted to ensure
// more specific routes appear before less specific ones.
function specificityTier(node: RouteNode): number {
  if (node.isLayout) return 0;
  if (node.routeId.includes("*")) return 3;
  if (node.routeId.includes("$")) return 2;
  return 1;
}

function sortBySpecificity(nodes: RouteNode[]): RouteNode[] {
  return [...nodes].sort((a, b) => {
    const tierDiff = specificityTier(a) - specificityTier(b);
    if (tierDiff !== 0) return tierDiff;
    return a.routeId.localeCompare(b.routeId);
  });
}

type RouteNode = {
  routeId: string;
  isLayout: boolean;
  filePath: string;
  exports: RouteFileExports;
  children: RouteNode[];
};

function buildFromEntries(
  currentDir: string,
  parentPath: string,
  entries: fs.Dirent[],
): RouteNode[] {
  const files = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".tsx") && !e.name.endsWith(".test.tsx"),
  );
  const dirs = entries.filter((e) => e.isDirectory());
  const dirNames = new Set(dirs.map((d) => d.name));
  const consumedDirs = new Set<string>();
  const nodes: RouteNode[] = [];

  for (const file of files) {
    const base = file.name.replace(/\.tsx$/, "");
    const { segment, isLayout } = segmentFromFilename(file.name);
    const filePath = path.join(currentDir, file.name);

    // layout routeIds are literal strings, never combined with the parent
    // path - "_auth" contributes no URL segment, same as matchTree treats it
    const routePath = isLayout
      ? segment!
      : segment === null
        ? parentPath || "/"
        : joinPath(parentPath, segment);

    // a file paired with a same-named directory ("dashboard.tsx" + "dashboard/")
    // acts as a layout for that directory's contents, whether or not the
    // file itself is prefixed with "_" - this mirrors matchTree's own
    // documented behavior: a route with children can be BOTH a layout
    // and a leaf at the same time
    let children: RouteNode[] = [];
    if (dirNames.has(base)) {
      consumedDirs.add(base);
      const childParentPath = isLayout ? parentPath : routePath;
      const childEntries = fs.readdirSync(path.join(currentDir, base), {
        withFileTypes: true,
      });
      children = buildFromEntries(path.join(currentDir, base), childParentPath, childEntries);
    }

    nodes.push({
      routeId: routePath,
      isLayout,
      filePath,
      exports: inspectRouteFile(filePath),
      children,
    });
  }

  // a directory with NO matching layout file ("errors/", "showcase/", "user/")
  // is a pure namespacing folder - its contents get spliced directly into
  // this level's array, contributing only their own path segment, with no
  // extra layout node wrapping them
  for (const dir of dirs) {
    if (consumedDirs.has(dir.name)) continue;
    const childPath = joinPath(parentPath, dir.name);
    const childEntries = fs.readdirSync(path.join(currentDir, dir.name), {
      withFileTypes: true,
    });
    nodes.push(...buildFromEntries(path.join(currentDir, dir.name), childPath, childEntries));
  }

  return sortBySpecificity(nodes);
}

export function generateRouteTree(routesDir: string): RouteNode {
  const rootFile = path.join(routesDir, "__root.tsx");
  if (!fs.existsSync(rootFile)) {
    throw new Error(
      `Expected ${path.relative(process.cwd(), rootFile)} - every app needs exactly one root layout.`,
    );
  }

  // __root.tsx is deliberately excluded from the generic walk and handled
  // as its own singleton wrapper - it's the one node that doesn't need a
  // same-named "__root/" folder convention to own everything beneath it
  const entries = fs
    .readdirSync(routesDir, { withFileTypes: true })
    .filter((e) => !(e.isFile() && e.name === "__root.tsx"));

  return {
    routeId: "__root",
    isLayout: true,
    filePath: rootFile,
    exports: inspectRouteFile(rootFile),
    children: buildFromEntries(routesDir, "", entries),
  };
}

// code generation

function toIdentifier(relativePath: string, fallback: string): string {
  const cleaned = relativePath
    .replace(/\.tsx$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const parts = cleaned.split("_").filter(Boolean);
  if (parts.length === 0) return fallback; // e.g. "$.tsx" alone has nothing to name itself after

  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

type ImportSpec = { name: string; alias: string; from: string };

function collectImportsAndSerialize(
  node: RouteNode,
  routesDir: string,
  outDir: string,
  imports: ImportSpec[],
  indent = 4,
): string {
  const relativeFromRoutes = path.relative(routesDir, node.filePath).replace(/\.tsx$/, "");
  const baseId = toIdentifier(
    relativeFromRoutes,
    `Route_${imports.length}`, // fallback for files like $.tsx with nothing nameable
  );
  const importFrom =
    "./" +
    path
      .relative(outDir, node.filePath)
      .replace(/\.tsx$/, "")
      .replace(/\\/g, "/");

  const componentAlias = baseId;
  imports.push({ name: "default", alias: componentAlias, from: importFrom });

  const extraFields: string[] = [];

  if (node.exports.hasLoader) {
    const alias = `${baseId}Loader`;
    imports.push({ name: "loader", alias, from: importFrom });
    extraFields.push(`loader: ${alias}`);
  }
  if (node.exports.hasValidateSearch) {
    const alias = `${baseId}ValidateSearch`;
    imports.push({ name: "validateSearch", alias, from: importFrom });
    extraFields.push(`validateSearch: ${alias}`);
  }
  if (node.exports.hasErrorComponent) {
    const alias = `${baseId}ErrorComponent`;
    imports.push({ name: "errorComponent", alias, from: importFrom });
    extraFields.push(`errorComponent: ${alias}`);
  }

  const pad = " ".repeat(indent);
  const childPad = " ".repeat(indent + 2);

  const childrenSource =
    node.children.length > 0
      ? `,\n${pad}children: [\n${node.children
          .map(
            (c) => childPad + collectImportsAndSerialize(c, routesDir, outDir, imports, indent + 4),
          )
          .join(",\n")},\n${pad}]`
      : "";

  return `{\n${pad}path: ${JSON.stringify(node.routeId)},\n${pad}component: ${componentAlias}${
    extraFields.length ? ",\n" + pad + extraFields.join(",\n" + pad) : ""
  }${childrenSource}\n${" ".repeat(indent - 2)}}`;
}

export function writeRouteTreeFile(routesDir: string, outFile: string): void {
  const outDir = path.dirname(outFile);
  const root = generateRouteTree(routesDir);
  const imports: ImportSpec[] = [];
  const treeSource = collectImportsAndSerialize(root, routesDir, outDir, imports);

  // detect import alias collisions - two different files producing the same
  // identifier would cause a TypeScript error in the generated file
  const seen = new Map<string, string>();
  for (const imp of imports) {
    const existing = seen.get(imp.alias);
    if (existing && existing !== imp.from) {
      throw new Error(
        `Import alias collision: "${imp.alias}" is used by both ${existing} and ${imp.from}. ` +
          `Rename one of the route files to avoid the conflict.`,
      );
    }
    seen.set(imp.alias, imp.from);
  }

  // group imports by module path so each file gets one import statement
  const importGroups = new Map<string, ImportSpec[]>();
  for (const imp of imports) {
    const group = importGroups.get(imp.from);
    if (group) group.push(imp);
    else importGroups.set(imp.from, [imp]);
  }

  const importLines = [...importGroups.entries()]
    .map(([from, specs]) => {
      const defaultImport = specs.find((s) => s.name === "default");
      const namedImports = specs.filter((s) => s.name !== "default");

      const defaultPart = defaultImport ? defaultImport.alias : "";
      const namedPart =
        namedImports.length > 0
          ? `{ ${namedImports.map((s) => `${s.name} as ${s.alias}`).join(", ")} }`
          : "";

      const specifiers = [defaultPart, namedPart].filter(Boolean).join(", ");
      return `import ${specifiers} from "${from}";`;
    })
    .join("\n");
  const output = `// GENERATED FILE - DO NOT EDIT
// Run \`pnpm codegen\` to regenerate from ${path.relative(process.cwd(), routesDir)}

import type { RouteDefinition } from "michi";
${importLines}

export const routeTree: RouteDefinition[] = [${treeSource}];
`;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, output, "utf-8");
}
