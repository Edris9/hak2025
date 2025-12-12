/**
 * Swedish API Factory
 *
 * Factory for creating and managing Swedish API service instances.
 * Supports lazy initialization and caching.
 */

import { ISwedishAPIService } from '@/domain/interfaces';
import {
  SwedishAPIType,
  SwedishAPIStatus,
  SWEDISH_APIS,
  SWEDISH_API_PRIORITY,
} from '@/domain/models';
import { SMHIService } from './SMHIService';
import { PolisenService } from './PolisenService';
import { SCBService } from './SCBService';
import { TrafikverketService } from './TrafikverketService';
import { JobTechService } from './JobTechService';
import { GoteborgService } from './GoteborgService';

/**
 * Factory for Swedish API services
 */
export class SwedishAPIFactory {
  private static services: Map<SwedishAPIType, ISwedishAPIService> = new Map();

  /**
   * Get a specific service instance
   */
  static getService(type: SwedishAPIType): ISwedishAPIService {
    if (!this.services.has(type)) {
      const service = this.createService(type);
      this.services.set(type, service);
    }
    return this.services.get(type)!;
  }

  /**
   * Get all services
   */
  static getAllServices(): ISwedishAPIService[] {
    return SWEDISH_API_PRIORITY.map((type) => this.getService(type));
  }

  /**
   * Get all services with their configuration status
   */
  static getServicesWithStatus(): SwedishAPIStatus[] {
    return SWEDISH_API_PRIORITY.map((type) => {
      const service = this.getService(type);
      const config = SWEDISH_APIS[type];
      return {
        ...config,
        isConfigured: service.isConfigured(),
      };
    });
  }

  /**
   * Get only configured services
   */
  static getConfiguredServices(): ISwedishAPIService[] {
    return this.getAllServices().filter((service) => service.isConfigured());
  }

  /**
   * Check if any service is configured
   */
  static hasAnyConfigured(): boolean {
    return this.getAllServices().some((service) => service.isConfigured());
  }

  /**
   * Get count of configured services
   */
  static getConfiguredCount(): number {
    return this.getConfiguredServices().length;
  }

  /**
   * Reset the factory (useful for testing)
   */
  static reset(): void {
    this.services.clear();
  }

  /**
   * Create a new service instance
   */
  private static createService(type: SwedishAPIType): ISwedishAPIService {
    switch (type) {
      case 'smhi':
        return new SMHIService();
      case 'polisen':
        return new PolisenService();
      case 'scb':
        return new SCBService();
      case 'trafikverket':
        return new TrafikverketService();
      case 'jobtech':
        return new JobTechService();
      case 'goteborg':
        return new GoteborgService();
      default:
        throw new Error(`Unknown Swedish API type: ${type}`);
    }
  }
}
