# API Explorer - User Documentation

## Overview

The API Explorer allows you to test Swedish public APIs directly from your browser. It provides an easy-to-use interface for exploring weather data, police events, statistics, and traffic information.

## How to Access

1. Log in to the application
2. Click "API Explorer" in the sidebar navigation

## Available APIs

### SMHI (Weather)
Get current weather forecasts and meteorological data for any location in Sweden.

**No setup required** - Works immediately!

**What you can do**:
- Get weather forecasts for specific coordinates
- View all available forecast points
- Check when forecasts were last updated
- See available weather parameters

### Polisen (Police Events)
Browse recent police events and incidents across Sweden.

**No setup required** - Works immediately!

**What you can do**:
- View all recent events
- Filter by location (city/region)
- Filter by event type (traffic accidents, theft, etc.)
- Filter by date

### SCB (Statistics Sweden)
Explore Swedish statistics and population data.

**No setup required** - Works immediately!

**What you can do**:
- Navigate the statistics database
- Browse population data categories
- Query specific datasets

### Trafikverket (Traffic)
Access real-time traffic and transportation data.

**Requires free API key** - See setup instructions below.

**What you can do**:
- View train station information
- Check train arrivals and departures
- Read traffic messages
- See road conditions
- View traffic cameras
- Check ferry schedules

## Using the API Explorer

### Step 1: Select an API
Click on one of the API cards in the left panel:
- Green icon = Ready to use
- Yellow icon = Requires setup

### Step 2: Choose an Endpoint
After selecting an API, a list of available endpoints appears below. Click on any endpoint to select it.

### Step 3: Configure Parameters
The center panel shows the request builder:
- Fill in any required parameters
- Default values are provided for most fields
- For POST requests, you can edit the JSON body

### Step 4: Execute Request
Click the "Execute Request" button to send the request.

### Step 5: View Response
The right panel shows the response:
- **Response tab**: The formatted JSON data
- **Headers tab**: Response headers from the API
- **Copy**: Copy the response to clipboard
- **Download**: Save as JSON file

## Response Information

Each response shows:
- **Status**: HTTP status code (200 = success)
- **Time**: How long the request took in milliseconds

## Setting Up Trafikverket

Trafikverket requires a free API key:

1. Go to https://api.trafikinfo.trafikverket.se/
2. Click "Registrera" (Register)
3. Fill in your details and create an account
4. Verify your email address
5. Log in to your account
6. Generate an API key from the dashboard
7. Contact your administrator to add the key to the server

## Common Use Cases

### Check Weather for Stockholm
1. Select **SMHI**
2. Choose **Weather Forecast**
3. Use defaults (lon: 18.07, lat: 59.33) or enter coordinates
4. Click **Execute Request**

### Find Police Events in Gothenburg
1. Select **Polisen**
2. Choose **Events by Location**
3. Enter "Göteborg" in the location field
4. Click **Execute Request**

### View Train Stations
1. Select **Trafikverket** (requires API key)
2. Choose **Train Stations**
3. Click **Execute Request**

## Tips

- Start with SMHI or Polisen - they require no setup
- Use the default parameter values to test quickly
- The response viewer supports syntax highlighting for easy reading
- Download responses to analyze data offline

## Troubleshooting

### "Not Configured" Error
The API requires an API key that hasn't been set up. Contact your administrator.

### Timeout Error
The external API took too long to respond. Try again later.

### 400/404 Error
Check that your parameters are correct. Invalid coordinates or non-existent filters can cause errors.

### Empty Response
Some endpoints may return empty results if no data matches your query (e.g., no police events in a small town).
