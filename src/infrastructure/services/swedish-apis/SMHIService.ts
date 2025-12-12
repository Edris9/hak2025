/**
 * SMHI Service
 *
 * Swedish Meteorological and Hydrological Institute API service.
 * Provides weather forecasts and meteorological observations.
 * No authentication required.
 */

import { SwedishAPIType, SWEDISH_APIS } from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * SMHI Weather API Service
 */
export class SMHIService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'smhi';
  readonly name = 'SMHI';
  readonly baseUrl = SWEDISH_APIS.smhi.baseUrl;

  constructor() {
    super(SWEDISH_APIS.smhi);
  }

  /**
   * SMHI doesn't require authentication
   */
  isConfigured(): boolean {
    return true;
  }
}
