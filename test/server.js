/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Server, { Route } from '@jalik/rest-server';
import bodyParser from 'body-parser';
import {
  DELETE,
  GET,
  HEAD,
  OPTIONS,
  PATCH,
  POST,
  PUT,
} from '../src/RestClient';

const server = new Server({
  port: 3000,
});

export const API_KEY_HEADER = 'x-api-key';
export const API_KEY = 'helloWorld42!';

// Middlewares

server.addMiddleware(bodyParser.json());

server.addMiddleware((req, resp, next) => {
  // console.log(req.method, req.path);
  if (req.method !== 'OPTIONS' && /^\/private/.test(req.path)) {
    if (typeof req.headers[API_KEY_HEADER] !== 'string') {
      resp.status(401).end(JSON.stringify({
        error: `Missing header ${API_KEY_HEADER}`,
      }));
    } else if (req.headers[API_KEY_HEADER] !== API_KEY) {
      resp.status(403).end(JSON.stringify({
        error: `Invalid header ${API_KEY_HEADER}`,
      }));
    } else {
      next();
    }
  } else {
    next();
  }
});

// Private routes

server.addRoute(new Route({
  cors: true,
  method: GET,
  path: '/private',
  handler(req, resp) {
    resp.status(200).end(JSON.stringify({
      private: true,
    }));
  },
}));

// Public routes

server.addRoute(new Route({
  cors: true,
  method: DELETE,
  path: '/delete/:id',
  handler(req, resp) {
    resp.status(204).end(JSON.stringify({
      ...req.params,
    }));
  },
}));

server.addRoute(new Route({
  cors: true,
  method: GET,
  path: '/get/:id',
  handler(req, resp) {
    resp.status(200).end(JSON.stringify({
      ...req.params,
    }));
  },
}));

server.addRoute(new Route({
  cors: true,
  method: HEAD,
  path: '/head/:id',
  handler(req, resp) {
    resp.status(204)
      .set('success', 'true')
      .end();
  },
}));

server.addRoute(new Route({
  cors: true,
  method: OPTIONS,
  path: '/options',
  handler(req, resp) {
    resp.status(204)
      .set('success', 'true')
      .end();
  },
}));

server.addRoute(new Route({
  cors: true,
  method: PATCH,
  path: '/patch/:id',
  handler(req, resp) {
    resp.status(200).end(JSON.stringify({
      ...req.params,
      ...req.body,
    }));
  },
}));

server.addRoute(new Route({
  cors: true,
  method: POST,
  path: '/post/:id',
  handler(req, resp) {
    resp.status(201).end(JSON.stringify({
      ...req.params,
      ...req.body,
    }));
  },
}));

server.addRoute(new Route({
  cors: true,
  method: PUT,
  path: '/put/:id',
  handler(req, resp) {
    resp.status(200).end(JSON.stringify({
      ...req.params,
      ...req.body,
    }));
  },
}));

export default server;
