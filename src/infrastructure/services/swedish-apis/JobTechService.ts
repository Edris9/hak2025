/**
 * JobTech (Arbetsförmedlingen) API Service
 *
 * Swedish Employment Agency job search API.
 * No authentication required.
 */

import { SwedishAPIType, SWEDISH_APIS } from '@/domain/models';
import { BaseSwedishAPIService } from './BaseSwedishAPIService';

/**
 * JobTech API service for Swedish job listings
 */
export class JobTechService extends BaseSwedishAPIService {
  readonly type: SwedishAPIType = 'jobtech';
  readonly name = 'JobTech';
  readonly baseUrl = 'https://jobsearch.api.jobtechdev.se';

  constructor() {
    super(SWEDISH_APIS.jobtech);
  }

  /**
   * JobTech API is open - no authentication required
   */
  isConfigured(): boolean {
    return true;
  }
}
