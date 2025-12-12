/**
 * SCB Service
 *
 * Statistics Sweden (Statistiska centralbyrån) API service.
 * Provides population statistics and other statistical data.
 * No authentication required.
 */

import { SwedishAPIType, SWEDISH_APIS } from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * SCB Statistics API Service
 */
export class SCBService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'scb';
  readonly name = 'SCB';
  readonly baseUrl = SWEDISH_APIS.scb.baseUrl;

  constructor() {
    super(SWEDISH_APIS.scb);
  }

  /**
   * SCB doesn't require authentication
   */
  isConfigured(): boolean {
    return true;
  }
}
