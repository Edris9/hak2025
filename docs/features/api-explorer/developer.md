# API Explorer - Developer Documentation

## Overview

The API Explorer is a dashboard-style interface for testing Swedish public APIs. It provides an interactive way to explore, configure, and execute API requests against multiple Swedish government and public service APIs.

## Architecture

This feature follows Clean Architecture with the following layers:

```
Domain Layer
├── SwedishAPIs.ts          # Types, endpoint configs, API definitions
└── ISwedishAPIService.ts   # Service interface contract

Application Layer
└── swedish-api.dto.ts      # Request/Response DTOs

Infrastructure Layer
├── BaseSwedishAPIService.ts    # Abstract base with common logic
├── SMHIService.ts              # Weather API implementation
├── PolisenService.ts           # Police events implementation
├── SCBService.ts               # Statistics implementation
├── TrafikverketService.ts      # Traffic data implementation
└── SwedishAPIFactory.ts        # Factory pattern for services

Presentation Layer
├── APIExplorerProvider.tsx     # Context provider
├── useSwedishAPIs.ts           # Fetch available APIs hook
├── useExecuteAPI.ts            # Execute requests hook
├── APISelector.tsx             # API selection cards
├── EndpointList.tsx            # Endpoint list component
├── RequestBuilder.tsx          # Request form component
├── ResponseViewer.tsx          # Response display with tabs
└── APISetup.tsx                # Setup instructions component

API Routes
├── /api/swedish-apis           # GET available APIs
└── /api/swedish-apis/execute   # POST execute request
```

## Supported APIs

### 1. SMHI (Weather) - No Auth Required
Swedish Meteorological and Hydrological Institute

**Base URL**: `https://opendata-download-metfcst.smhi.se`

**Endpoints**:
- Weather Forecast - Get forecast for coordinates
- All Forecast Points - List available forecast points
- Approved Time - Latest approved forecast time
- Valid Times - Valid forecast time periods
- Parameters - Available weather parameters

### 2. Polisen (Police Events) - No Auth Required
Swedish Police public events

**Base URL**: `https://polisen.se`

**Endpoints**:
- All Events - Recent 500 events
- Events by Location - Filter by city/region
- Events by Type - Filter by event type
- Events by Date - Filter by date
- Combined Filter - Location + type filter

### 3. SCB (Statistics Sweden) - No Auth Required
Statistics and population data

**Base URL**: `https://api.scb.se/OV0104/v1/doris/sv/ssd`

**Endpoints**:
- Root Navigation - List databases
- Population Category - BE category
- Population Subcategory - BE0101 subcategory
- Population by Region - Detailed data
- Query Population - POST query for data

### 4. Trafikverket (Traffic) - Requires Free API Key
Swedish Transport Administration

**Base URL**: `https://api.trafikinfo.trafikverket.se/v2`

**Endpoints**:
- Train Stations - All stations
- Train Announcements - Arrivals/departures
- Train Messages - Traffic messages
- Road Conditions - Current road status
- Traffic Situations - Incidents
- Traffic Cameras - Camera feeds
- Ferry Announcements - Ferry schedules

## Files Created

### Domain Layer
- `src/domain/models/SwedishAPIs.ts` - Core types and configurations
- `src/domain/interfaces/ISwedishAPIService.ts` - Service interface

### Application Layer
- `src/application/dto/swedish-api.dto.ts` - DTOs

### Infrastructure Layer
- `src/infrastructure/services/swedish-apis/BaseSwedishAPIService.ts`
- `src/infrastructure/services/swedish-apis/SMHIService.ts`
- `src/infrastructure/services/swedish-apis/PolisenService.ts`
- `src/infrastructure/services/swedish-apis/SCBService.ts`
- `src/infrastructure/services/swedish-apis/TrafikverketService.ts`
- `src/infrastructure/services/swedish-apis/SwedishAPIFactory.ts`
- `src/infrastructure/services/swedish-apis/index.ts`

### Presentation Layer
- `src/presentation/providers/APIExplorerProvider.tsx`
- `src/presentation/hooks/useSwedishAPIs.ts`
- `src/presentation/hooks/useExecuteAPI.ts`
- `src/presentation/components/api-explorer/APISelector.tsx`
- `src/presentation/components/api-explorer/EndpointList.tsx`
- `src/presentation/components/api-explorer/RequestBuilder.tsx`
- `src/presentation/components/api-explorer/ResponseViewer.tsx`
- `src/presentation/components/api-explorer/APISetup.tsx`
- `src/presentation/components/api-explorer/index.ts`

### API Routes
- `src/app/api/swedish-apis/route.ts`
- `src/app/api/swedish-apis/execute/route.ts`

### Page
- `src/app/(dashboard)/api-explorer/page.tsx`

### Modified Files
- `src/domain/models/index.ts` - Added exports
- `src/domain/interfaces/index.ts` - Added exports
- `src/application/dto/index.ts` - Added exports
- `src/presentation/providers/index.ts` - Added exports
- `src/presentation/hooks/index.ts` - Added exports
- `src/presentation/components/layout/AppSidebar.tsx` - Added nav item

## API Endpoints

### GET /api/swedish-apis

Returns list of available APIs with their endpoints and configuration status.

**Response**:
```json
{
  "apis": [
    {
      "type": "smhi",
      "name": "SMHI",
      "description": "Swedish weather data",
      "isConfigured": true,
      "endpoints": [...]
    }
  ],
  "configuredCount": 3,
  "totalCount": 4
}
```

### POST /api/swedish-apis/execute

Executes an API request through the server-side proxy.

**Request**:
```json
{
  "apiType": "smhi",
  "endpointId": "forecast-point",
  "params": {
    "lon": "18.07",
    "lat": "59.33"
  }
}
```

**Response**:
```json
{
  "data": {...},
  "status": 200,
  "statusText": "OK",
  "timing": 234,
  "headers": {...}
}
```

## Flow Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser   │────▶│  API Explorer    │────▶│  Server Proxy   │
│             │     │  (React)         │     │  (Next.js API)  │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
                                                      ▼
                    ┌─────────────────────────────────────────────┐
                    │            Swedish APIs                      │
                    │  ┌──────┐ ┌────────┐ ┌─────┐ ┌───────────┐  │
                    │  │ SMHI │ │Polisen │ │ SCB │ │Trafikverket│ │
                    │  └──────┘ └────────┘ └─────┘ └───────────┘  │
                    └─────────────────────────────────────────────┘
```

## Security

- **Rate Limiting**: 30 requests/minute per IP (uses existing security middleware)
- **Server-Side Proxy**: All requests go through server to avoid CORS
- **API Keys**: Stored server-side in environment variables
- **Input Validation**: API type and endpoint ID validated
- **Timeout**: 30 second timeout for external API calls

## Environment Variables

```env
# Optional - Only needed for Trafikverket API
TRAFIKVERKET_API_KEY=your-api-key-here
```

## Adding New APIs

1. Add type to `SwedishAPIType` in `SwedishAPIs.ts`
2. Create endpoint configuration array
3. Add to `SWEDISH_APIS` object
4. Create service class extending `BaseSwedishAPIService`
5. Register in `SwedishAPIFactory`

## Testing

```bash
# Run the development server
npm run dev

# Navigate to /api-explorer
# Select an API (e.g., SMHI)
# Select an endpoint
# Fill in parameters
# Click Execute
```

## Trafikverket API Key Registration

1. Go to https://api.trafikinfo.trafikverket.se/
2. Click "Registrera" to create account
3. Verify email and log in
4. Generate API key from dashboard
5. Add to `.env.local` as `TRAFIKVERKET_API_KEY`
