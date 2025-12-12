import { NextRequest, NextResponse } from 'next/server';
import { SwedishAPIFactory } from '@/infrastructure/services/swedish-apis';
import {
  ExecuteAPIRequest,
  ExecuteAPIResponse,
  APIErrorResponse,
} from '@/application/dto';
import {
  SwedishAPIType,
  SWEDISH_API_PRIORITY,
  getEndpoint,
} from '@/domain/models';
import { generateRequestId } from '@/infrastructure/security';

/**
 * POST /api/swedish-apis/execute
 *
 * Proxy endpoint to execute requests to Swedish public APIs.
 * This avoids CORS issues by making server-side requests.
 *
 * Request body:
 * - apiType: Which API to call (smhi, polisen, scb, trafikverket)
 * - endpointId: Which endpoint to use
 * - params: Optional parameters for the request
 * - body: Optional body for POST requests
 *
 * Response:
 * - JSON with API response data and metadata
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    // Parse request body
    const body: ExecuteAPIRequest = await request.json();
    const { apiType, endpointId, params, body: requestBody } = body;

    // Validate API type
    if (!apiType || !SWEDISH_API_PRIORITY.includes(apiType as SwedishAPIType)) {
      const errorResponse: APIErrorResponse = {
        error: {
          code: 'INVALID_API_TYPE',
          message: `Invalid API type. Must be one of: ${SWEDISH_API_PRIORITY.join(', ')}`,
          requestId,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate endpoint
    const endpoint = getEndpoint(apiType as SwedishAPIType, endpointId);
    if (!endpoint) {
      const errorResponse: APIErrorResponse = {
        error: {
          code: 'INVALID_ENDPOINT',
          message: `Endpoint '${endpointId}' not found for API '${apiType}'`,
          requestId,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get the service
    const service = SwedishAPIFactory.getService(apiType as SwedishAPIType);

    // Check if service is configured
    if (!service.isConfigured()) {
      const errorResponse: APIErrorResponse = {
        error: {
          code: 'API_NOT_CONFIGURED',
          message: `API '${apiType}' requires configuration. Please add the required API key.`,
          requestId,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Execute the request
    const response = await service.executeRequest(endpointId, params, requestBody);

    // Return the response
    const successResponse: ExecuteAPIResponse = {
      response,
      apiType: apiType as SwedishAPIType,
      endpointId,
      requestId,
    };

    return NextResponse.json(successResponse, {
      status: response.error ? 502 : 200,
      headers: {
        'X-Request-ID': requestId,
      },
    });
  } catch (error) {
    console.error(`[${requestId}] Swedish API execution error:`, error);

    const errorResponse: APIErrorResponse = {
      error: {
        code: 'EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to execute API request',
        requestId,
      },
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'X-Request-ID': requestId,
      },
    });
  }
}
