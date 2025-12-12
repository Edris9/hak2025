/**
 * Base Swedish API Service
 *
 * Abstract base class for Swedish API service implementations.
 * Provides common functionality for making HTTP requests with timing,
 * error handling, and response formatting.
 */

import { ISwedishAPIService } from '@/domain/interfaces';
import {
  SwedishAPIType,
  SwedishAPIConfig,
  APIEndpoint,
  APIResponse,
  buildUrl,
  getEndpoint,
} from '@/domain/models';

/**
 * Default timeout for API requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Abstract base class for Swedish API services
 */
export abstract class BaseSwedishAPIService implements ISwedishAPIService {
  abstract readonly type: SwedishAPIType;
  abstract readonly name: string;
  abstract readonly baseUrl: string;

  protected readonly config: SwedishAPIConfig;

  constructor(config: SwedishAPIConfig) {
    this.config = config;
  }

  /**
   * Check if the API is configured (has required API key if needed)
   * Override in subclasses that require authentication
   */
  isConfigured(): boolean {
    return true; // Most Swedish APIs don't require auth
  }

  /**
   * Get all available endpoints for this API
   */
  getEndpoints(): APIEndpoint[] {
    return this.config.endpoints;
  }

  /**
   * Execute a request to an endpoint
   */
  async executeRequest(
    endpointId: string,
    params?: Record<string, string>,
    body?: string
  ): Promise<APIResponse> {
    const endpoint = getEndpoint(this.type, endpointId);

    if (!endpoint) {
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        timing: 0,
        error: `Endpoint '${endpointId}' not found for API '${this.type}'`,
      };
    }

    const startTime = performance.now();

    try {
      const response = await this.makeRequest(endpoint, params, body);
      const timing = Math.round(performance.now() - startTime);

      // Parse response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Try to parse response as JSON
      let data: unknown;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = await response.text();
      } else {
        // Try JSON first, fallback to text
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        timing,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      const timing = Math.round(performance.now() - startTime);
      const message = error instanceof Error ? error.message : 'Unknown error';

      return {
        data: null,
        status: 0,
        statusText: 'Error',
        headers: {},
        timing,
        error: message,
      };
    }
  }

  /**
   * Make the actual HTTP request
   * Can be overridden in subclasses for custom handling
   */
  protected async makeRequest(
    endpoint: APIEndpoint,
    params?: Record<string, string>,
    body?: string
  ): Promise<Response> {
    const url = buildUrl(this.baseUrl, endpoint.path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: this.getHeaders(endpoint),
        signal: controller.signal,
      };

      // Add body for POST requests
      if (endpoint.method === 'POST') {
        options.body = body || endpoint.bodyTemplate || '';
      }

      const response = await fetch(url, options);
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get headers for the request
   * Can be overridden in subclasses for custom headers
   */
  protected getHeaders(endpoint: APIEndpoint): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (endpoint.method === 'POST') {
      // Check if body looks like XML
      if (endpoint.bodyTemplate?.startsWith('<')) {
        headers['Content-Type'] = 'text/xml';
      } else {
        headers['Content-Type'] = 'application/json';
      }
    }

    return headers;
  }
}
