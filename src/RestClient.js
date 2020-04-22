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

import { fetch } from 'whatwg-fetch';

export const DELETE = 'DELETE';
export const GET = 'GET';
export const HEAD = 'HEAD';
export const OPTIONS = 'OPTIONS';
export const PATCH = 'PATCH';
export const POST = 'POST';
export const PUT = 'PUT';

/**
 * Checks if URL is absolute.
 * @param {string} url
 * @return {boolean}
 */
export function isAbsoluteUrl(url) {
  return typeof url === 'string' && /^[A-Za-z0-9]+:\/\//.test(url);
}

class RestClient {
  /**
   * Creates a REST Client.
   * @param {string} baseUrl
   * @param {any} headers
   */
  constructor({ baseUrl, headers = {} }) {
    if (typeof baseUrl !== 'string' || !isAbsoluteUrl(baseUrl)) {
      throw new Error('baseUrl must be a valid absolute URL');
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.headers = {};

    // Lowercase all header names.
    Object.entries(headers).forEach((entry) => {
      this.setHeader(entry[0], entry[1]);
    });
  }

  /**
   * Executes a DELETE request on a URL.
   * @param {string} url
   * @param {any} options
   * @return {Promise<unknown>}
   */
  delete(url, options = {}) {
    return this.fetch(url, { ...options, method: DELETE });
  }

  /**
   * Fetches resource of an URL.
   * @param {string} url
   * @param {any} options
   * @return {Promise<unknown>}
   */
  fetch(url, options = {}) {
    let requestUrl = url;

    // Complete relative URL.
    if (!isAbsoluteUrl(requestUrl)) {
      if (typeof url === 'string') {
        requestUrl = `${this.baseUrl}${url}`;
      } else {
        requestUrl = `${this.baseUrl}`;
      }
    }

    // Merge options.
    const opts = {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    };

    // todo execute middleware (cache, logger...)

    // Automatic checks to serialize body.
    if (typeof opts.body === 'object' && opts.body !== null) {
      if (opts.headers['content-type'] === 'application/json') {
        opts.body = JSON.stringify(opts.body);
      }
    }
    return fetch(requestUrl, opts);
  }

  /**
   * Executes a GET request on a URL.
   * @param {string} url
   * @param {any} options
   * @return {Promise<unknown>}
   */
  get(url, options = {}) {
    return this.fetch(url, { ...options, method: GET });
  }

  /**
   * Returns a header by name.
   * @param name
   * @return {string}
   */
  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }

  /**
   * Returns all header names.
   * @return {string[]}
   */
  getHeaderNames() {
    return Object.keys(this.headers);
  }

  /**
   * Executes a HEAD request on a URL.
   * @param {string} url
   * @param {any} options
   * @return {Promise<unknown>}
   */
  head(url, options = {}) {
    return this.fetch(url, { ...options, method: HEAD });
  }

  /**
   * Executes a OPTIONS request on a URL.
   * @param {string} url
   * @param {any} options
   * @return {Promise<unknown>}
   */
  options(url, options = {}) {
    return this.fetch(url, { ...options, method: OPTIONS });
  }

  /**
   * Executes a PATCH request on a URL.
   * @param {string} url
   * @param {any} body
   * @param {any} options
   * @return {Promise<unknown>}
   */
  patch(url, body, options = {}) {
    return this.fetch(url, { ...options, body, method: PATCH });
  }

  /**
   * Executes a POST request on a URL.
   * @param {string} url
   * @param {any} body
   * @param {any} options
   * @return {Promise<unknown>}
   */
  post(url, body, options = {}) {
    return this.fetch(url, { ...options, body, method: POST });
  }

  /**
   * Executes a PUT request on a URL.
   * @param {string} url
   * @param {any} body
   * @param {any} options
   * @return {Promise<unknown>}
   */
  put(url, body, options = {}) {
    return this.fetch(url, { ...options, body, method: PUT });
  }

  /**
   * Sets a header.
   * @param {string} name
   * @param {string} value
   */
  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }
}

export default RestClient;
