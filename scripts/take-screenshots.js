const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const { chromium } = require("playwright");
const dotenv = require(require.resolve("dotenv", { paths: [path.join(__dirname, "..", "server")] }));

const rootDir = path.resolve(__dirname, "..");
const serverDir = path.join(rootDir, "server");
const clientDir = path.join(rootDir, "client");
const screenshotsDir = path.join(rootDir, "docs", "screenshots");
const apiUrl = "http://127.0.0.1:4000";
const clientUrl = "http://127.0.0.1:5173";
const demoAccount = {
  name: "Demo User",
  email: "demo@jobtracker.local",
  password: "Demo12345"
};
const children = [];

const assertLocalDatabase = () => {
  dotenv.config({ path: path.join(serverDir, ".env") });
  if (!process.env.DATABASE_URL) {
    throw new Error("Set DATABASE_URL in server/.env before generating screenshots.");
  }
  let hostname;
  try {
    hostname = new URL(process.env.DATABASE_URL).hostname;
  } catch {
    throw new Error("DATABASE_URL in server/.env must be a valid PostgreSQL URL.");
  }
  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    throw new Error("Screenshot generation is restricted to a local PostgreSQL database.");
  }
};

const assertPortAvailable = (port) =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () => reject(new Error(`Port ${port} is already in use.`)));
    server.listen(port, "127.0.0.1", () => server.close(resolve));
  });

const seedDemoData = () => {
  const result = spawnSync(
    process.execPath,
    [path.join(serverDir, "node_modules", "tsx", "dist", "cli.mjs"), "prisma/seed.ts"],
    {
      cwd: serverDir,
      env: {
        ...process.env,
        SEED_NAME: demoAccount.name,
        SEED_EMAIL: demoAccount.email,
        SEED_PASSWORD: demoAccount.password
      },
      stdio: "inherit"
    }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("Demo data seeding failed.");
};

const startProcess = (command, args, options) => {
  const child = spawn(command, args, {
    ...options,
    stdio: "inherit",
    windowsHide: true
  });
  children.push(child);
  child.once("error", (error) => {
    child.spawnError = error;
  });
  return child;
};

const waitForUrl = async (url, child, label) => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.spawnError) {
      throw new Error(`${label} could not start: ${child.spawnError.message}`);
    }
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(
        `${label} exited before becoming ready (code ${child.exitCode}, signal ${child.signalCode}).`
      );
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The service may not have opened its port yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${label} did not become ready at ${url}.`);
};

const stopProcesses = async () => {
  await Promise.all(
    children.map(
      (child) =>
        new Promise((resolve) => {
          if (child.exitCode !== null || child.signalCode !== null) {
            resolve();
            return;
          }
          child.once("exit", resolve);
          child.kill();
          setTimeout(resolve, 3_000).unref();
        })
    )
  );
};

const main = async () => {
  assertLocalDatabase();
  await Promise.all([assertPortAvailable(4000), assertPortAvailable(5173)]);
  seedDemoData();

  let browser;
  try {
    const server = startProcess(
      process.execPath,
      [path.join(serverDir, "node_modules", "tsx", "dist", "cli.mjs"), "watch", "src/index.ts"],
      {
        cwd: serverDir,
        env: { ...process.env, PORT: "4000", CLIENT_URL: clientUrl }
      }
    );
    const client = startProcess(
      process.execPath,
      [
        path.join(clientDir, "node_modules", "vite", "bin", "vite.js"),
        "--host",
        "127.0.0.1",
        "--strictPort"
      ],
      {
        cwd: clientDir,
        env: { ...process.env, VITE_API_URL: `${apiUrl}/api` }
      }
    );

    await Promise.all([
      waitForUrl(`${apiUrl}/api/health`, server, "API"),
      waitForUrl(clientUrl, client, "Client")
    ]);

    fs.mkdirSync(screenshotsDir, { recursive: true });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    await page.goto(`${clientUrl}/login`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(screenshotsDir, "login.png"),
      fullPage: true
    });

    await page.getByLabel("Email address").fill(demoAccount.email);
    await page.getByLabel("Password").fill(demoAccount.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("heading", { name: "Application board" }).waitFor();
    await page.getByText("Northstar Labs").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(screenshotsDir, "board.png"),
      fullPage: true
    });

    await page.goto(`${clientUrl}/dashboard`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Search insights" }).waitFor();
    await page.locator(".recharts-surface").first().waitFor();
    await page.waitForTimeout(2_000);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(screenshotsDir, "dashboard.png"),
      fullPage: true
    });

    console.log(`Screenshots saved to ${path.relative(rootDir, screenshotsDir)}.`);
  } finally {
    if (browser) await browser.close();
    await stopProcesses();
  }
};

main().catch((error) => {
  console.error("Screenshot capture failed:", error.message);
  process.exitCode = 1;
});
