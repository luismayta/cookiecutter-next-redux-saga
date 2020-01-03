import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Response } from 'express';
import helmet from 'helmet';
import LRUCache from 'lru-cache';
import logger from 'morgan';
import nextApp from 'next';

dotenv.config();

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1hour
});

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = nextApp({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // give all Nextjs's request to Nextjs before anything else
    server.get('/_next/*', (req, res) => {
      handle(req, res);
    });

    const middlewares = [
      compression({ threshold: 0 }),
      logger(dev ? 'dev' : 'combined'),
      bodyParser.urlencoded({ extended: false }),
      cookieParser(process.env.SESSION_SECRET),
      cookieSession({
        name: 'session',
        keys: [process.env.SESSION_SECRET || '030395VV'],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true,
        httpOnly: true,
      }),
      helmet({
        hsts: {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true,
        },
        frameguard: {
          action: 'deny',
        },
        referrerPolicy: {
          policy: 'same-origin',
        },
        noSniff: true,
        xssFilter: {
          setOnOldIE: true,
        },
        dnsPrefetchControl: {
          allow: true,
        },
      }),
      cors(),
    ];
    server.use(...middlewares);

    // Use the `renderAndCache` utility defined below to serve pages
    server.get('/', (req, res) => {
      renderAndCache(req, res, '/');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(
        `> Ready on http://localhost:${port} in ${process.env.NODE_ENV} mode`,
      );
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req: any) {
  return `${req.url}`;
}

async function renderAndCache(
  req: any,
  res: Response,
  pagePath: string,
  queryParams?: any,
) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key) && !dev) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}
