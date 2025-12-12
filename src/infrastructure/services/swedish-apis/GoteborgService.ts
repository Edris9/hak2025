/**
 * Göteborg Stad (City of Gothenburg) API Service
 *
 * Gothenburg city open data API for parking, traffic, bridges, etc.
 * Requires a free API key from data.goteborg.se
 */

import { SwedishAPIType, SWEDISH_APIS, APIEndpoint, buildUrl } from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * Göteborg Stad API service
 */
export class GoteborgService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'goteborg';
  readonly name = 'Göteborg Stad';
  readonly baseUrl = 'https://data.goteborg.se';

  private readonly apiKey: string | undefined;

  constructor() {
    super(SWEDISH_APIS.goteborg);
    this.apiKey = process.env.GOTEBORG_API_KEY;
  }

  /**
   * Check if the Gothenburg API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Override makeRequest to inject API key into the URL
   */
  protected async makeRequest(
    endpoint: APIEndpoint,
    params?: Record<string, string>,
    body?: string
  ): Promise<Response> {
    if (!this.apiKey) {
      throw new Error('Göteborg API key not configured. Set GOTEBORG_API_KEY environment variable.');
    }

    // Replace {apiKey} in the path with actual key
    const pathWithKey = endpoint.path.replace('{apiKey}', this.apiKey);
    const url = buildUrl(this.baseUrl, pathWithKey, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: this.getHeaders(endpoint),
        signal: controller.signal,
      };

      if (endpoint.method === 'POST' && body) {
        options.body = body;
      }

      const response = await fetch(url, options);
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
