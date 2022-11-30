import type { Request, Response, NextFunction, Router, Express } from 'express';
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import cors from 'cors';
import router from './route';
import db from './mongoDb';
import 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { RequestHandler } from 'express-serve-static-core';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;

const resolve = (p: string) => path.resolve(__dirname, p);

async function createServer(isProd = process.env.NODE_ENV === 'production') {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: isTest ? 'error' : 'info',
  });

  app.use(vite.middlewares);
  const requestHandler = express.static(resolve('assets'));
  app.use(requestHandler);
  app.use('/assets', requestHandler);
  app.use(cors(true));
  app.use(express.urlencoded({ extended: true }) as RequestHandler);
  app.use(express.json() as RequestHandler);
  app.use(cookieParser());
  const routes: Router[] = Object.values(router);
  app.use('/api', routes);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(resolve('../../dist/client'), {
        index: false,
      })
    );
  }

  // const stylesheets = getStyleSheets();
  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await fs.readFile(
        isProd
          ? resolve('../../dist/client/index.html')
          : resolve('../../public/index.html'),
        'utf-8'
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const productionBuildPath = path.join(
        __dirname,
        '../../dist/server/entry-server.mjs'
      );
      const devBuildPath = path.join(
        __dirname,
        '../../src/client/entry-server.tsx'
      );
      const { render } = await vite.ssrLoadModule(
        isProd ? productionBuildPath : devBuildPath
      );

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);
      // const cssAssets = isProd ? "" : await stylesheets;

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--app-html-->`, appHtml);
      // .replace(`<!--head-->`, cssAssets);

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  db.connect();
  const port: number = Number(process.env.EXPRESS_PORT) || 3020;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`VaaS is awake on http://localhost:${port}`);
  });
}

createServer();
