export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Countries / States / Cities API",
    version: "1.0.0",
    description:
      "REST API for countries, states/provinces, and cities backed by Supabase (PostgreSQL).",
  },
  servers: [{ url: "/" }],
  components: {
    schemas: {
      SuccessListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: {} },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 20 },
              total: { type: "integer", example: 247 },
            },
            required: ["page", "limit", "total"],
          },
        },
        required: ["success", "data", "meta"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "BAD_REQUEST" },
              message: { type: "string", example: "Invalid request" },
              details: {},
            },
            required: ["code", "message"],
          },
        },
        required: ["success", "error"],
      },
    },
  },
  paths: {
    "/api/regions": {
      get: {
        summary: "List regions",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/regions/{id}": {
      get: {
        summary: "Get region by id (includes subregions)",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/regions/{id}/countries": {
      get: {
        summary: "List countries by region",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id", "population"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/subregions": {
      get: {
        summary: "List subregions",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "region_id", schema: { type: "integer" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/subregions/{id}": {
      get: {
        summary: "Get subregion by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/subregions/{id}/countries": {
      get: {
        summary: "List countries by subregion",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id", "population"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/countries": {
      get: {
        summary: "List countries",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "region_id", schema: { type: "integer" } },
          { in: "query", name: "subregion_id", schema: { type: "integer" } },
          { in: "query", name: "iso2", schema: { type: "string" } },
          { in: "query", name: "iso3", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: {
              type: "string",
              enum: ["name", "id", "iso2", "iso3", "population"],
            },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: {
          200: { description: "OK" },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/countries/{id}": {
      get: {
        summary: "Get country by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/countries/{id}/states": {
      get: {
        summary: "List states by country",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/countries/{id}/cities": {
      get: {
        summary: "List cities by country",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "state_id", schema: { type: "integer" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id", "population"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/states": {
      get: {
        summary: "List states",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "country_id", schema: { type: "integer" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/states/{id}": {
      get: {
        summary: "Get state by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/states/{id}/cities": {
      get: {
        summary: "List cities by state",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id", "population"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/cities": {
      get: {
        summary: "List cities",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 20 },
          },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "country_id", schema: { type: "integer" } },
          { in: "query", name: "state_id", schema: { type: "integer" } },
          {
            in: "query",
            name: "sort",
            schema: { type: "string", enum: ["name", "id", "population"] },
          },
          {
            in: "query",
            name: "order",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/cities/{id}": {
      get: {
        summary: "Get city by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/openapi": {
      get: {
        summary: "OpenAPI spec",
        responses: { 200: { description: "OK" } },
      },
    },
  },
} as const;
