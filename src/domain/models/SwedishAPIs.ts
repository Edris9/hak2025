/**
 * Swedish Public APIs Domain Models
 *
 * This file defines the core data structures for the Swedish Public APIs Explorer.
 * It supports multiple Swedish government and public service APIs.
 */

/**
 * Supported Swedish API types
 */
export type SwedishAPIType = 'smhi' | 'polisen' | 'scb' | 'trafikverket' | 'jobtech' | 'goteborg';

/**
 * HTTP method for API endpoints
 */
export type HTTPMethod = 'GET' | 'POST';

/**
 * Parameter type for endpoint configuration
 */
export type ParamType = 'string' | 'number' | 'date' | 'json';

/**
 * Endpoint parameter definition
 */
export interface EndpointParam {
  name: string;
  type: ParamType;
  required: boolean;
  default?: string;
  description: string;
  options?: string[]; // For enum-like parameters
}

/**
 * API endpoint definition
 */
export interface APIEndpoint {
  id: string;
  name: string;
  description: string;
  method: HTTPMethod;
  path: string;
  params?: EndpointParam[];
  bodyTemplate?: string; // For POST requests with body
  requiresAuth?: boolean;
}

/**
 * API request configuration
 */
export interface APIRequest {
  apiType: SwedishAPIType;
  endpointId: string;
  params?: Record<string, string>;
  body?: string;
}

/**
 * API response structure
 */
export interface APIResponse {
  data: unknown;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timing: number; // Response time in ms
  error?: string;
}

/**
 * Configuration for a Swedish API
 */
export interface SwedishAPIConfig {
  type: SwedishAPIType;
  name: string;
  description: string;
  baseUrl: string;
  docsUrl: string;
  requiresApiKey: boolean;
  apiKeyEnvVar?: string;
  endpoints: APIEndpoint[];
}

/**
 * API status including configuration state
 */
export interface SwedishAPIStatus extends SwedishAPIConfig {
  isConfigured: boolean;
}

/**
 * SMHI Weather API Endpoints
 */
export const SMHI_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'forecast-point',
    name: 'Weather Forecast (Point)',
    description: 'Get weather forecast for specific coordinates in Sweden',
    method: 'GET',
    path: '/api/category/pmp3g/version/2/geotype/point/lon/{lon}/lat/{lat}/data.json',
    params: [
      { name: 'lon', type: 'number', required: true, default: '18.07', description: 'Longitude (e.g., 18.07 for Stockholm)' },
      { name: 'lat', type: 'number', required: true, default: '59.33', description: 'Latitude (e.g., 59.33 for Stockholm)' },
    ],
  },
  {
    id: 'forecast-multipoint',
    name: 'All Forecast Points',
    description: 'Get list of all available forecast points',
    method: 'GET',
    path: '/api/category/pmp3g/version/2/geotype/multipoint.json',
  },
  {
    id: 'approved-time',
    name: 'Approved Time',
    description: 'Get the timestamp of the latest approved forecast',
    method: 'GET',
    path: '/api/category/pmp3g/version/2/approvedtime.json',
  },
  {
    id: 'valid-time',
    name: 'Valid Times',
    description: 'Get all valid forecast times',
    method: 'GET',
    path: '/api/category/pmp3g/version/2/validtime.json',
  },
  {
    id: 'parameters',
    name: 'Available Parameters',
    description: 'Get list of available weather parameters',
    method: 'GET',
    path: '/api/category/pmp3g/version/2/parameter.json',
  },
];

/**
 * Polisen Events API Endpoints
 */
export const POLISEN_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'events-all',
    name: 'All Recent Events',
    description: 'Get the last 500 police events from all of Sweden',
    method: 'GET',
    path: '/api/events',
  },
  {
    id: 'events-location',
    name: 'Events by Location',
    description: 'Get police events for a specific location',
    method: 'GET',
    path: '/api/events',
    params: [
      {
        name: 'locationname',
        type: 'string',
        required: true,
        default: 'Stockholm',
        description: 'City or region name (e.g., Stockholm, Göteborg, Malmö)',
        options: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås', 'Helsingborg', 'Norrköping', 'Jönköping'],
      },
    ],
  },
  {
    id: 'events-type',
    name: 'Events by Type',
    description: 'Get police events of a specific type',
    method: 'GET',
    path: '/api/events',
    params: [
      {
        name: 'type',
        type: 'string',
        required: true,
        default: 'Trafikolycka',
        description: 'Event type',
        options: ['Trafikolycka', 'Stöld', 'Inbrott', 'Misshandel', 'Brand', 'Rån', 'Skottlossning', 'Trafikbrott', 'Narkotikabrott', 'Bedrägeri'],
      },
    ],
  },
  {
    id: 'events-date',
    name: 'Events by Date',
    description: 'Get police events from a specific date',
    method: 'GET',
    path: '/api/events',
    params: [
      {
        name: 'DateTime',
        type: 'date',
        required: true,
        default: new Date().toISOString().split('T')[0],
        description: 'Date in YYYY-MM-DD format',
      },
    ],
  },
  {
    id: 'events-combined',
    name: 'Events (Combined Filters)',
    description: 'Get police events with multiple filters',
    method: 'GET',
    path: '/api/events',
    params: [
      {
        name: 'locationname',
        type: 'string',
        required: false,
        default: 'Stockholm',
        description: 'City or region name',
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        default: '',
        description: 'Event type (leave empty for all)',
      },
    ],
  },
];

/**
 * SCB Statistics API Endpoints
 */
export const SCB_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'root',
    name: 'Database Categories',
    description: 'Get root level categories of available statistics',
    method: 'GET',
    path: '/',
  },
  {
    id: 'population-category',
    name: 'Population Statistics',
    description: 'Get population statistics category',
    method: 'GET',
    path: '/BE',
  },
  {
    id: 'population-subcategory',
    name: 'Population Subcategories',
    description: 'Get population statistics subcategories',
    method: 'GET',
    path: '/BE/BE0101',
  },
  {
    id: 'population-tables',
    name: 'Population Tables',
    description: 'Get available population tables (by region, age, sex)',
    method: 'GET',
    path: '/BE/BE0101/BE0101A',
  },
  {
    id: 'population-query',
    name: 'Query Population Data',
    description: 'Query specific population data (POST with JSON body)',
    method: 'POST',
    path: '/BE/BE0101/BE0101A/BefolkningNy',
    bodyTemplate: JSON.stringify({
      query: [
        { code: 'Region', selection: { filter: 'item', values: ['00'] } },
        { code: 'Civilstand', selection: { filter: 'item', values: ['OG'] } },
        { code: 'Alder', selection: { filter: 'item', values: ['tot'] } },
        { code: 'Kon', selection: { filter: 'item', values: ['1', '2'] } },
      ],
      response: { format: 'json' },
    }, null, 2),
  },
];

/**
 * Trafikverket Traffic API Endpoints
 */
export const TRAFIKVERKET_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'train-stations',
    name: 'Train Stations',
    description: 'Get all train stations in Sweden',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="TrainStation" schemaversion="1">
    <FILTER/>
    <INCLUDE>AdvertisedLocationName</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
    <INCLUDE>Geometry.WGS84</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'train-announcements',
    name: 'Train Arrivals/Departures',
    description: 'Get train arrivals and departures for a station',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    params: [
      {
        name: 'station',
        type: 'string',
        required: true,
        default: 'Cst',
        description: 'Station signature (e.g., Cst for Stockholm Central)',
        options: ['Cst', 'G', 'M', 'U', 'Nr', 'Gä'],
      },
    ],
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="TrainAnnouncement" schemaversion="1.6" orderby="AdvertisedTimeAtLocation">
    <FILTER>
      <EQ name="LocationSignature" value="{station}"/>
      <EQ name="Advertised" value="true"/>
      <GT name="AdvertisedTimeAtLocation" value="$dateadd(-0:30:00)"/>
      <LT name="AdvertisedTimeAtLocation" value="$dateadd(2:00:00)"/>
    </FILTER>
    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
    <INCLUDE>TrackAtLocation</INCLUDE>
    <INCLUDE>ToLocation</INCLUDE>
    <INCLUDE>FromLocation</INCLUDE>
    <INCLUDE>ActivityType</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'train-messages',
    name: 'Train Traffic Messages',
    description: 'Get current train traffic messages and disruptions',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="TrainMessage" schemaversion="1.7">
    <FILTER>
      <GT name="LastUpdateDateTime" value="$dateadd(-24:00:00)"/>
    </FILTER>
    <INCLUDE>ExternalDescription</INCLUDE>
    <INCLUDE>ReasonCode</INCLUDE>
    <INCLUDE>StartDateTime</INCLUDE>
    <INCLUDE>EndDateTime</INCLUDE>
    <INCLUDE>Header</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'road-conditions',
    name: 'Road Conditions',
    description: 'Get current road conditions across Sweden',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="RoadCondition" schemaversion="1.2">
    <FILTER>
      <GT name="ModifiedTime" value="$dateadd(-1:00:00)"/>
    </FILTER>
    <INCLUDE>Cause</INCLUDE>
    <INCLUDE>ConditionText</INCLUDE>
    <INCLUDE>CountyNo</INCLUDE>
    <INCLUDE>LocationText</INCLUDE>
    <INCLUDE>RoadNumber</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'traffic-situations',
    name: 'Traffic Incidents',
    description: 'Get current traffic incidents and disruptions',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="Situation" schemaversion="1.5">
    <FILTER>
      <GT name="Deviation.StartTime" value="$dateadd(-24:00:00)"/>
    </FILTER>
    <INCLUDE>Deviation.Message</INCLUDE>
    <INCLUDE>Deviation.IconId</INCLUDE>
    <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
    <INCLUDE>Deviation.StartTime</INCLUDE>
    <INCLUDE>Deviation.EndTime</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'traffic-cameras',
    name: 'Traffic Cameras',
    description: 'Get list of traffic cameras',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="Camera" schemaversion="1">
    <FILTER>
      <EQ name="Active" value="true"/>
    </FILTER>
    <INCLUDE>Name</INCLUDE>
    <INCLUDE>Description</INCLUDE>
    <INCLUDE>PhotoUrl</INCLUDE>
    <INCLUDE>Geometry.WGS84</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
  {
    id: 'ferry-announcements',
    name: 'Ferry Schedules',
    description: 'Get ferry arrivals and departures',
    method: 'POST',
    path: '/data.json',
    requiresAuth: true,
    bodyTemplate: `<REQUEST>
  <LOGIN authenticationkey="{apiKey}"/>
  <QUERY objecttype="FerryAnnouncement" schemaversion="1.2">
    <FILTER>
      <GT name="DepartureTime" value="$dateadd(-1:00:00)"/>
      <LT name="DepartureTime" value="$dateadd(12:00:00)"/>
    </FILTER>
    <INCLUDE>FromHarbor</INCLUDE>
    <INCLUDE>ToHarbor</INCLUDE>
    <INCLUDE>DepartureTime</INCLUDE>
    <INCLUDE>Route</INCLUDE>
  </QUERY>
</REQUEST>`,
  },
];

/**
 * JobTech (Arbetsförmedlingen) Job Search API Endpoints
 */
export const JOBTECH_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'search-jobs',
    name: 'Search Jobs',
    description: 'Search for jobs with free text query',
    method: 'GET',
    path: '/search',
    params: [
      { name: 'q', type: 'string', required: false, default: 'developer', description: 'Free text search query' },
      { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of results (max 100)' },
      { name: 'offset', type: 'number', required: false, default: '0', description: 'Result offset for pagination' },
    ],
  },
  {
    id: 'search-location',
    name: 'Jobs by Location',
    description: 'Search for jobs in a specific municipality',
    method: 'GET',
    path: '/search',
    params: [
      { name: 'municipality', type: 'string', required: true, default: 'Stockholm', description: 'Municipality name' },
      { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of results' },
    ],
  },
  {
    id: 'search-remote',
    name: 'Remote Jobs',
    description: 'Search for remote-friendly jobs',
    method: 'GET',
    path: '/search',
    params: [
      { name: 'remote', type: 'string', required: true, default: 'true', description: 'Filter for remote positions' },
      { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of results' },
    ],
  },
  {
    id: 'job-details',
    name: 'Job Details',
    description: 'Get details of a specific job ad by ID',
    method: 'GET',
    path: '/ad/{id}',
    params: [
      { name: 'id', type: 'string', required: true, default: '', description: 'Job ad ID (get from search results)' },
    ],
  },
  {
    id: 'autocomplete',
    name: 'Autocomplete',
    description: 'Get autocomplete suggestions for job search',
    method: 'GET',
    path: '/complete',
    params: [
      { name: 'q', type: 'string', required: true, default: 'prog', description: 'Partial search text' },
      { name: 'limit', type: 'number', required: false, default: '10', description: 'Number of suggestions' },
    ],
  },
];

/**
 * Gothenburg City Open Data API Endpoints
 */
export const GOTEBORG_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'parking',
    name: 'Parking Availability',
    description: 'Get real-time parking lot availability in Gothenburg',
    method: 'GET',
    path: '/ParkingService/v2.1/PublicTimeParkings/{apiKey}?format=json',
    requiresAuth: true,
  },
  {
    id: 'bike-pumps',
    name: 'Bicycle Pumps',
    description: 'Get locations of bicycle pump stations',
    method: 'GET',
    path: '/BikeService/v1.0/BicyclePumps/{apiKey}?format=json',
    requiresAuth: true,
  },
  {
    id: 'bridge-status',
    name: 'Bridge Status',
    description: 'Get current status of Hisingsbron bridge (open/closed)',
    method: 'GET',
    path: '/BridgeService/v2.0/GetBridgeStatus/{apiKey}?format=json',
    requiresAuth: true,
  },
  {
    id: 'river-level',
    name: 'River Water Level',
    description: 'Get water level data for Göta Älv river',
    method: 'GET',
    path: '/RiverService/v1.0/WaterLevel/{apiKey}?format=json',
    requiresAuth: true,
  },
  {
    id: 'traffic-info',
    name: 'Traffic Information',
    description: 'Get traffic impact notifications and roadwork info',
    method: 'GET',
    path: '/TrafficInformation/v2.0/Messages/{apiKey}?format=json',
    requiresAuth: true,
  },
];

/**
 * Configuration for all supported Swedish APIs
 */
export const SWEDISH_APIS: Record<SwedishAPIType, SwedishAPIConfig> = {
  smhi: {
    type: 'smhi',
    name: 'SMHI',
    description: 'Swedish Meteorological and Hydrological Institute - Weather forecasts and observations',
    baseUrl: 'https://opendata-download-metfcst.smhi.se',
    docsUrl: 'https://opendata.smhi.se/apidocs/',
    requiresApiKey: false,
    endpoints: SMHI_ENDPOINTS,
  },
  polisen: {
    type: 'polisen',
    name: 'Polisen',
    description: 'Swedish Police - Public events and incidents across Sweden',
    baseUrl: 'https://polisen.se',
    docsUrl: 'https://polisen.se/om-polisen/om-webbplatsen/oppna-data/api-over-polisens-handelser/',
    requiresApiKey: false,
    endpoints: POLISEN_ENDPOINTS,
  },
  scb: {
    type: 'scb',
    name: 'SCB',
    description: 'Statistics Sweden - Population and statistical data',
    baseUrl: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
    docsUrl: 'https://www.scb.se/en/services/open-data-api/',
    requiresApiKey: false,
    endpoints: SCB_ENDPOINTS,
  },
  trafikverket: {
    type: 'trafikverket',
    name: 'Trafikverket',
    description: 'Swedish Transport Administration - Train and road traffic data',
    baseUrl: 'https://api.trafikinfo.trafikverket.se/v2',
    docsUrl: 'https://api.trafikinfo.trafikverket.se/',
    requiresApiKey: true,
    apiKeyEnvVar: 'TRAFIKVERKET_API_KEY',
    endpoints: TRAFIKVERKET_ENDPOINTS,
  },
  jobtech: {
    type: 'jobtech',
    name: 'JobTech',
    description: 'Swedish Employment Agency - Job listings and labor market data',
    baseUrl: 'https://jobsearch.api.jobtechdev.se',
    docsUrl: 'https://jobsearch.api.jobtechdev.se/',
    requiresApiKey: false,
    endpoints: JOBTECH_ENDPOINTS,
  },
  goteborg: {
    type: 'goteborg',
    name: 'Göteborg Stad',
    description: 'City of Gothenburg - Parking, traffic, bridges and city services',
    baseUrl: 'https://data.goteborg.se',
    docsUrl: 'https://data.goteborg.se/',
    requiresApiKey: true,
    apiKeyEnvVar: 'GOTEBORG_API_KEY',
    endpoints: GOTEBORG_ENDPOINTS,
  },
};

/**
 * Priority order for displaying APIs
 */
export const SWEDISH_API_PRIORITY: SwedishAPIType[] = ['smhi', 'polisen', 'jobtech', 'scb', 'trafikverket', 'goteborg'];

/**
 * Get endpoint by API type and endpoint ID
 */
export function getEndpoint(apiType: SwedishAPIType, endpointId: string): APIEndpoint | undefined {
  const api = SWEDISH_APIS[apiType];
  return api?.endpoints.find((e) => e.id === endpointId);
}

/**
 * Build URL with path parameters replaced
 */
export function buildUrl(baseUrl: string, path: string, params?: Record<string, string>): string {
  let url = `${baseUrl}${path}`;

  if (params) {
    // Replace path parameters like {lon}, {lat}
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    });

    // Add query parameters for remaining params that aren't in the path
    const queryParams = Object.entries(params)
      .filter(([key]) => !path.includes(`{${key}}`))
      .filter(([, value]) => value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    if (queryParams) {
      url += `?${queryParams}`;
    }
  }

  return url;
}
