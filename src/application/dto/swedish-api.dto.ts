/**
 * Swedish API DTOs
 *
 * Data Transfer Objects for the Swedish APIs Explorer endpoints.
 */

import {
  SwedishAPIType,
  SwedishAPIStatus,
  APIResponse,
} from '@/domain/models';

/**
 * Request to execute an API call
 */
export interface ExecuteAPIRequest {
  /** Which API to call */
  apiType: SwedishAPIType;
  /** Which endpoint to use */
  endpointId: string;
  /** Parameters for the request */
  params?: Record<string, string>;
  /** Body for POST requests */
  body?: string;
}

/**
 * Response from API execution
 */
export interface ExecuteAPIResponse {
  /** API response data */
  response: APIResponse;
  /** Which API was called */
  apiType: SwedishAPIType;
  /** Which endpoint was used */
  endpointId: string;
  /** Request ID for tracking */
  requestId: string;
}

/**
 * Error response from API execution
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

/**
 * Response from available APIs endpoint
 */
export interface AvailableAPIsResponse {
  /** List of all APIs with their status */
  apis: SwedishAPIStatus[];
  /** Count of configured APIs */
  configuredCount: number;
  /** Total number of APIs */
  totalCount: number;
}
