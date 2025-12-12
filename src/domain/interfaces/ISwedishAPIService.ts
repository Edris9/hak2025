/**
 * Swedish API Service Interface
 *
 * Defines the contract for Swedish API service implementations.
 */

import {
  SwedishAPIType,
  APIEndpoint,
  APIResponse,
} from '../models/SwedishAPIs';

/**
 * Interface for Swedish API services
 */
export interface ISwedishAPIService {
  /** The API type identifier */
  readonly type: SwedishAPIType;

  /** Human-readable name */
  readonly name: string;

  /** Base URL for API requests */
  readonly baseUrl: string;

  /**
   * Check if the API is configured (has required API key if needed)
   */
  isConfigured(): boolean;

  /**
   * Get all available endpoints for this API
   */
  getEndpoints(): APIEndpoint[];

  /**
   * Execute a request to an endpoint
   *
   * @param endpointId - The endpoint identifier
   * @param params - Optional parameters for the request
   * @param body - Optional body for POST requests
   * @returns Promise resolving to the API response
   */
  executeRequest(
    endpointId: string,
    params?: Record<string, string>,
    body?: string
  ): Promise<APIResponse>;
}
