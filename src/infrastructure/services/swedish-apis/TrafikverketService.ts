/**
 * Trafikverket Service
 *
 * Swedish Transport Administration API service.
 * Provides train and road traffic data.
 * Requires a free API key from https://api.trafikinfo.trafikverket.se/
 */

import {
  SwedishAPIType,
  SWEDISH_APIS,
  APIEndpoint,
  APIResponse,
  getEndpoint,
} from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * Trafikverket Traffic API Service
 */
export class TrafikverketService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'trafikverket';
  readonly name = 'Trafikverket';
  readonly baseUrl = SWEDISH_APIS.trafikverket.baseUrl;

  constructor() {
    super(SWEDISH_APIS.trafikverket);
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!process.env.TRAFIKVERKET_API_KEY;
  }

  /**
   * Get the API key
   */
  private getApiKey(): string {
    return process.env.TRAFIKVERKET_API_KEY || '';
  }

  /**
   * Execute request with API key injection
   */
  async executeRequest(
    endpointId: string,
    params?: Record<string, string>,
    body?: string
  ): Promise<APIResponse> {
    if (!this.isConfigured()) {
      return {
        data: null,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        timing: 0,
        error: 'Trafikverket API key not configured. Add TRAFIKVERKET_API_KEY to your environment.',
      };
    }

    const endpoint = getEndpoint(this.type, endpointId);

    if (!endpoint) {
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        timing: 0,
        error: `Endpoint '${endpointId}' not found`,
      };
    }

    // Prepare the body with API key and parameters
    let requestBody = body || endpoint.bodyTemplate || '';

    // Replace API key placeholder
    requestBody = requestBody.replace('{apiKey}', this.getApiKey());

    // Replace parameter placeholders
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        requestBody = requestBody.replace(`{${key}}`, value);
      });
    }

    return super.executeRequest(endpointId, params, requestBody);
  }

  /**
   * Make request with XML content type
   */
  protected async makeRequest(
    endpoint: APIEndpoint,
    params?: Record<string, string>,
    body?: string
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint.path}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          Accept: 'application/json',
        },
        body: body,
        signal: controller.signal,
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
