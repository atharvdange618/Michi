import { describe, it, expect, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as ts from "typescript";
import { generateRouteTree, writeRouteTreeFile } from "./codegen";

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "michi-codegen-"));
}

function writeFixture(dir: string, name: string, content: string): void {
  fs.writeFileSync(path.join(dir, name), content, "utf-8");
}

function mkdirFixture(dir: string, name: string): string {
  const full = path.join(dir, name);
  fs.mkdirSync(full, { recursive: true });
  return full;
}

describe("generateRouteTree", () => {
  let tmp: string;

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("throws if __root.tsx is missing", () => {
    tmp = makeTmpDir();
    expect(() => generateRouteTree(tmp)).toThrow("__root");
  });

  it("builds a flat route tree from simple files", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(tmp, "index.tsx", "export default function Home() {}");
    writeFixture(tmp, "about.tsx", "export default function About() {}");

    const root = generateRouteTree(tmp);
    expect(root.routeId).toBe("__root");
    expect(root.isLayout).toBe(true);
    expect(root.children).toHaveLength(2);

    const about = root.children.find((c) => c.routeId === "/about");
    expect(about).toBeDefined();
    expect(about!.isLayout).toBe(false);
    expect(about!.exports.hasDefaultExport).toBe(true);
    expect(about!.exports.hasLoader).toBe(false);
  });

  it("detects loader, validateSearch, and errorComponent exports", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(
      tmp,
      "users.tsx",
      `export default function Users() {}
export const loader = async () => {};
export const validateSearch = (raw: Record<string, string>) => raw;
export const errorComponent = () => null;`,
    );

    const root = generateRouteTree(tmp);
    const users = root.children[0];
    expect(users).toBeDefined();
    expect(users!.exports.hasLoader).toBe(true);
    expect(users!.exports.hasValidateSearch).toBe(true);
    expect(users!.exports.hasErrorComponent).toBe(true);
  });

  it("does not treat non-exported names as exports", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(
      tmp,
      "page.tsx",
      `export default function Page() {}
const loader = async () => {};
const errorComponent = () => null;`,
    );

    const root = generateRouteTree(tmp);
    const page = root.children[0];
    expect(page).toBeDefined();
    expect(page!.exports.hasLoader).toBe(false);
    expect(page!.exports.hasErrorComponent).toBe(false);
  });

  it("handles wildcard $.tsx -> *", () => {
    tmp = makeTmpDir();
    const filesDir = mkdirFixture(tmp, "files");
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(filesDir, "$.tsx", "export default function CatchAll() {}");

    const root = generateRouteTree(tmp);
    const files = root.children.find((c) => c.routeId === "/files/*");
    expect(files).toBeDefined();
  });

  it("nests children under a same-named layout file", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(tmp, "dashboard.tsx", "export default function DashLayout() {}");
    const dashDir = mkdirFixture(tmp, "dashboard");
    writeFixture(dashDir, "index.tsx", "export default function DashHome() {}");
    writeFixture(dashDir, "analytics.tsx", "export default function Analytics() {}");

    const root = generateRouteTree(tmp);
    const dash = root.children.find((c) => c.routeId === "/dashboard");
    expect(dash).toBeDefined();
    expect(dash!.children).toHaveLength(2);
  });

  it("splices bare namespacing folders without a layout wrapper", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    const errDir = mkdirFixture(tmp, "errors");
    writeFixture(errDir, "not-found.tsx", "export default function NotFound() {}");

    const root = generateRouteTree(tmp);
    const notFound = root.children.find((c) => c.routeId === "/errors/not-found");
    expect(notFound).toBeDefined();
    const errorsLayout = root.children.find((c) => c.routeId === "/errors");
    expect(errorsLayout).toBeUndefined();
  });

  it("ignores .test.tsx files", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(tmp, "about.test.tsx", "it('works', () => {})");

    const root = generateRouteTree(tmp);
    expect(root.children).toHaveLength(0);
  });

  it("handles layout routes with _ prefix", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(tmp, "_auth.tsx", "export default function AuthLayout() {}");
    const authDir = mkdirFixture(tmp, "_auth");
    writeFixture(authDir, "dashboard.tsx", "export default function Dash() {}");

    const root = generateRouteTree(tmp);
    const auth = root.children.find((c) => c.routeId === "_auth");
    expect(auth).toBeDefined();
    expect(auth!.isLayout).toBe(true);
    expect(auth!.children).toHaveLength(1);
    expect(auth!.children[0]).toBeDefined();
    expect(auth!.children[0]!.routeId).toBe("/dashboard");
  });

  it("sorts children: static before dynamic before wildcard", () => {
    tmp = makeTmpDir();
    writeFixture(tmp, "__root.tsx", "export default function Root() {}");
    writeFixture(tmp, "dashboard.tsx", "export default function DashLayout() {}");
    const dashDir = mkdirFixture(tmp, "dashboard");
    // create files in an order where $id would sort before analytics alphabetically
    writeFixture(dashDir, "$id.tsx", "export default function DashId() {}");
    writeFixture(dashDir, "analytics.tsx", "export default function Analytics() {}");

    const root = generateRouteTree(tmp);
    const dash = root.children.find((c) => c.routeId === "/dashboard");
    expect(dash).toBeDefined();
    expect(dash!.children).toHaveLength(2);
    expect(dash!.children[0]!.routeId).toBe("/dashboard/analytics");
    expect(dash!.children[1]!.routeId).toBe("/dashboard/$id");
  });
});

describe("writeRouteTreeFile", () => {
  let tmp: string;

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("generates valid TypeScript with correct imports", () => {
    tmp = makeTmpDir();
    const routesDir = mkdirFixture(tmp, "routes");
    const outDir = mkdirFixture(tmp, "src");
    const outFile = path.join(outDir, "routeTree.gen.ts");

    writeFixture(routesDir, "__root.tsx", "export default function Root() {}");
    writeFixture(routesDir, "index.tsx", "export default function Home() {}");
    writeFixture(
      routesDir,
      "users.tsx",
      `export default function Users() {}
export const loader = async () => ({ users: [] });
export const validateSearch = (raw: Record<string, string>) => raw;`,
    );

    writeRouteTreeFile(routesDir, outFile);

    const output = fs.readFileSync(outFile, "utf-8");
    expect(output).toContain("GENERATED FILE - DO NOT EDIT");
    expect(output).toContain('import Root from "./');
    expect(output).toContain('import Index from "./');
    // users has default + named exports, consolidated into one import statement
    expect(output).toMatch(
      /import Users, \{ loader as UsersLoader, validateSearch as UsersValidateSearch \} from/,
    );
    expect(output).toContain("export const routeTree: RouteDefinition[]");
  });

  it("throws on import alias collision from different files", () => {
    tmp = makeTmpDir();
    const routesDir = mkdirFixture(tmp, "routes");
    const outDir = mkdirFixture(tmp, "src");
    const outFile = path.join(outDir, "routeTree.gen.ts");

    writeFixture(routesDir, "__root.tsx", "export default function Root() {}");
    // both produce the identifier "UserList"
    writeFixture(routesDir, "user-list.tsx", "export default function Page() {}");
    writeFixture(routesDir, "user_list.tsx", "export default function Page() {}");

    expect(() => writeRouteTreeFile(routesDir, outFile)).toThrow("Import alias collision");
  });

  it("produces a valid route tree that can be imported and passed to Router", () => {
    tmp = makeTmpDir();
    const routesDir = mkdirFixture(tmp, "routes");
    const outDir = mkdirFixture(tmp, "src");
    const outFile = path.join(outDir, "routeTree.gen.ts");

    writeFixture(routesDir, "__root.tsx", "export default function Root() {}");
    writeFixture(routesDir, "index.tsx", "export default function Home() {}");
    writeFixture(
      routesDir,
      "users.tsx",
      `export default function Users() {}
export const loader = async () => ({ users: [] });`,
    );

    writeRouteTreeFile(routesDir, outFile);

    // transpile the generated TypeScript to plain JS and evaluate it in a sandbox
    const source = fs.readFileSync(outFile, "utf-8");
    const importNames = new Set<string>();
    for (const line of source.split("\n")) {
      if (!line.startsWith("import ")) continue;
      const defaultMatch = line.match(/^import\s+(\w+)/);
      if (defaultMatch?.[1]) importNames.add(defaultMatch[1]);
      for (const alias of line.matchAll(/\bas\s+(\w+)/g)) {
        if (alias[1]) importNames.add(alias[1]);
      }
    }
    const stubs = [...importNames].map((name) => `var ${name} = function ${name}() {};`).join("\n");
    const stripped = source.replace(/^import\b.*$/gm, "");
    const { outputText } = ts.transpileModule(stripped, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    });
    const jsSource = stubs + "\n" + outputText;

    const sandbox = { exports: {} as Record<string, unknown> };
    const fn = new Function("exports", "require", jsSource);
    fn(sandbox.exports, () => ({}));

    const routeTree = (sandbox.exports as any).routeTree;
    expect(Array.isArray(routeTree)).toBe(true);
    expect(routeTree).toHaveLength(1);

    const root = routeTree[0];
    expect(root.path).toBe("__root");
    expect(typeof root.component).toBe("function");
    expect(root.children).toHaveLength(2);

    const users = root.children.find((c: any) => c.path === "/users");
    expect(users).toBeDefined();
    expect(typeof users.component).toBe("function");
    expect(typeof users.loader).toBe("function");
  });

  it("generates consistent indentation at all nesting levels", () => {
    tmp = makeTmpDir();
    const routesDir = mkdirFixture(tmp, "routes");
    const outDir = mkdirFixture(tmp, "src");
    const outFile = path.join(outDir, "routeTree.gen.ts");

    writeFixture(routesDir, "__root.tsx", "export default function Root() {}");
    writeFixture(routesDir, "about.tsx", "export default function About() {}");
    writeFixture(routesDir, "settings.tsx", "export default function Settings() {}");
    const settingsDir = mkdirFixture(routesDir, "settings");
    writeFixture(settingsDir, "profile.tsx", "export default function Profile() {}");

    writeRouteTreeFile(routesDir, outFile);

    const lines = fs.readFileSync(outFile, "utf-8").split("\n");

    const pathLines = lines
      .map((l: string, i: number) => ({ line: l, idx: i }))
      .filter(({ line }: { line: string }) => line.includes("path:"));

    for (const { line } of pathLines) {
      const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length ?? 0;
      expect(leadingSpaces % 2).toBe(0);
      expect(line).not.toContain("\t");
    }
  });
});
