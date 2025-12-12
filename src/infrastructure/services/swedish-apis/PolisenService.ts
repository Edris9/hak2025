/**
 * Polisen Service
 *
 * Swedish Police public events API service.
 * Provides access to police events and incidents.
 * No authentication required.
 */

import { SwedishAPIType, SWEDISH_APIS } from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * Polisen Events API Service
 */
export class PolisenService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'polisen';
  readonly name = 'Polisen';
  readonly baseUrl = SWEDISH_APIS.polisen.baseUrl;

  constructor() {
    super(SWEDISH_APIS.polisen);
  }

  /**
   * Polisen doesn't require authentication
   */
  isConfigured(): boolean {
    return true;
  }
}
