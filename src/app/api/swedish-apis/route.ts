import { NextResponse } from 'next/server';
import { SwedishAPIFactory } from '@/infrastructure/services/swedish-apis';
import { AvailableAPIsResponse } from '@/application/dto';

/**
 * GET /api/swedish-apis
 *
 * Returns the list of available Swedish APIs,
 * their endpoints, and configuration status.
 *
 * Response:
 * - apis: Array of API configs with isConfigured flag
 * - configuredCount: Number of configured APIs
 * - totalCount: Total number of APIs
 */
export async function GET() {
  const apis = SwedishAPIFactory.getServicesWithStatus();
  const configuredCount = SwedishAPIFactory.getConfiguredCount();

  const response: AvailableAPIsResponse = {
    apis,
    configuredCount,
    totalCount: apis.length,
  };

  return NextResponse.json(response);
}
