import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import { z } from "zod";
import { createAdminClient } from "../utils/supabase/admin";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

const CSV_DIR = path.join(process.cwd(), "csv");

function trimToNull(value: unknown): string | null {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function toIntOrNull(value: unknown): number | null {
  const str = trimToNull(value);
  if (!str) return null;
  const n = Number.parseInt(str, 10);
  return Number.isFinite(n) ? n : null;
}

function toBigintStringOrNull(value: unknown): string | null {
  const str = trimToNull(value);
  if (!str) return null;
  if (!/^-?\d+$/.test(str)) return null;
  return str;
}

function toNumberOrNull(value: unknown): number | null {
  const str = trimToNull(value);
  if (!str) return null;
  const n = Number(str);
  return Number.isFinite(n) ? n : null;
}

async function readCsv(fileName: string) {
  const fullPath = path.join(CSV_DIR, fileName);
  const raw = await readFile(fullPath, "utf8");
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  }) as Record<string, string>[];
  return records;
}

async function upsertInChunks<T extends Record<string, unknown>>(params: {
  table: string;
  rows: T[];
  chunkSize?: number;
}) {
  const { table, rows, chunkSize = 500 } = params;
  const supabase = createAdminClient();

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(chunk, {
      onConflict: "id",
    });
    if (error) {
      throw new Error(
        `Upsert failed for table "${table}" (rows ${i}..${i + chunk.length - 1}): ${error.message}`,
      );
    }
  }
}

const RegionRow = z.object({
  id: z.string(),
  name: z.string(),
  wikiDataId: z.string().optional(),
});

const SubregionRow = z.object({
  id: z.string(),
  name: z.string(),
  region_id: z.string(),
  wikiDataId: z.string().optional(),
});

const CountryRow = z.object({
  id: z.string(),
  name: z.string(),
  iso3: z.string().optional(),
  iso2: z.string().optional(),
  numeric_code: z.string().optional(),
  phonecode: z.string().optional(),
  capital: z.string().optional(),
  currency: z.string().optional(),
  currency_name: z.string().optional(),
  currency_symbol: z.string().optional(),
  tld: z.string().optional(),
  native: z.string().optional(),
  population: z.string().optional(),
  gdp: z.string().optional(),
  region_id: z.string().optional(),
  subregion_id: z.string().optional(),
  nationality: z.string().optional(),
  area_sq_km: z.string().optional(),
  postal_code_format: z.string().optional(),
  postal_code_regex: z.string().optional(),
  timezones: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  emoji: z.string().optional(),
  emojiU: z.string().optional(),
  wikiDataId: z.string().optional(),
});

const StateRow = z.object({
  id: z.string(),
  name: z.string(),
  country_id: z.string(),
  iso2: z.string().optional(),
  iso3166_2: z.string().optional(),
  fips_code: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  parent_id: z.string().optional(),
  native: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  timezone: z.string().optional(),
  wikiDataId: z.string().optional(),
  population: z.string().optional(),
});

const CityRow = z.object({
  id: z.string(),
  name: z.string(),
  state_id: z.string(),
  country_id: z.string(),
  native: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  parent_id: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  population: z.string().optional(),
  timezone: z.string().optional(),
  wikiDataId: z.string().optional(),
});

async function main() {
  const regionsCsv = await readCsv("regions.csv");
  const subregionsCsv = await readCsv("subregions.csv");
  const countriesCsv = await readCsv("countries.csv");
  const statesCsv = await readCsv("states.csv");
  const citiesCsv = await readCsv("cities.csv");

  const regions = regionsCsv.map((r) => {
    const parsed = RegionRow.parse(r);
    return {
      id: Number.parseInt(parsed.id, 10),
      name: parsed.name,
      wikidata_id: trimToNull(parsed.wikiDataId),
    };
  });

  const subregions = subregionsCsv.map((r) => {
    const parsed = SubregionRow.parse(r);
    return {
      id: Number.parseInt(parsed.id, 10),
      name: parsed.name,
      region_id: Number.parseInt(parsed.region_id, 10),
      wikidata_id: trimToNull(parsed.wikiDataId),
    };
  });

  const countries = countriesCsv.map((r) => {
    const parsed = CountryRow.parse(r);
    return {
      id: Number.parseInt(parsed.id, 10),
      name: parsed.name,
      iso3: trimToNull(parsed.iso3),
      iso2: trimToNull(parsed.iso2),
      numeric_code: trimToNull(parsed.numeric_code),
      phonecode: trimToNull(parsed.phonecode),
      capital: trimToNull(parsed.capital),
      currency: trimToNull(parsed.currency),
      currency_name: trimToNull(parsed.currency_name),
      currency_symbol: trimToNull(parsed.currency_symbol),
      tld: trimToNull(parsed.tld),
      native: trimToNull(parsed.native),
      population: toBigintStringOrNull(parsed.population),
      gdp: toNumberOrNull(parsed.gdp),
      region_id: toIntOrNull(parsed.region_id),
      subregion_id: toIntOrNull(parsed.subregion_id),
      nationality: trimToNull(parsed.nationality),
      area_sq_km: toNumberOrNull(parsed.area_sq_km),
      postal_code_format: trimToNull(parsed.postal_code_format),
      postal_code_regex: trimToNull(parsed.postal_code_regex),
      timezones_raw: trimToNull(parsed.timezones),
      latitude: toNumberOrNull(parsed.latitude),
      longitude: toNumberOrNull(parsed.longitude),
      emoji: trimToNull(parsed.emoji),
      emoji_u: trimToNull(parsed.emojiU),
      wikidata_id: trimToNull(parsed.wikiDataId),
    };
  });

  const states = statesCsv.map((r) => {
    const parsed = StateRow.parse(r);
    return {
      id: Number.parseInt(parsed.id, 10),
      name: parsed.name,
      country_id: Number.parseInt(parsed.country_id, 10),
      iso2: trimToNull(parsed.iso2),
      iso3166_2: trimToNull(parsed.iso3166_2),
      fips_code: trimToNull(parsed.fips_code),
      type: trimToNull(parsed.type),
      level: toIntOrNull(parsed.level),
      parent_id: toIntOrNull(parsed.parent_id),
      native: trimToNull(parsed.native),
      latitude: toNumberOrNull(parsed.latitude),
      longitude: toNumberOrNull(parsed.longitude),
      timezone: trimToNull(parsed.timezone),
      wikidata_id: trimToNull(parsed.wikiDataId),
      population: toBigintStringOrNull(parsed.population),
    };
  });

  const cities = citiesCsv.map((r) => {
    const parsed = CityRow.parse(r);
    return {
      id: Number.parseInt(parsed.id, 10),
      name: parsed.name,
      state_id: Number.parseInt(parsed.state_id, 10),
      country_id: Number.parseInt(parsed.country_id, 10),
      native: trimToNull(parsed.native),
      type: trimToNull(parsed.type),
      level: toIntOrNull(parsed.level),
      parent_id: toIntOrNull(parsed.parent_id),
      latitude: toNumberOrNull(parsed.latitude),
      longitude: toNumberOrNull(parsed.longitude),
      population: toBigintStringOrNull(parsed.population),
      timezone: trimToNull(parsed.timezone),
      wikidata_id: trimToNull(parsed.wikiDataId),
    };
  });

  console.log(`regions: ${regions.length}`);
  await upsertInChunks({ table: "regions", rows: regions });

  console.log(`subregions: ${subregions.length}`);
  await upsertInChunks({ table: "subregions", rows: subregions });

  console.log(`countries: ${countries.length}`);
  await upsertInChunks({ table: "countries", rows: countries });

  console.log(`states: ${states.length}`);
  const stateIds = new Set(states.map((s) => s.id));

  const statesWithoutParent = states.map((s) => ({
    ...s,
    parent_id: null,
  }));

  await upsertInChunks({
    table: "states",
    rows: statesWithoutParent,
    chunkSize: 1000,
  });

  const parentUpdates = states.map((s) => ({
    ...s,
    parent_id:
      typeof s.parent_id === "number" && stateIds.has(s.parent_id)
        ? s.parent_id
        : null,
  }));

  await upsertInChunks({
    table: "states",
    rows: parentUpdates,
    chunkSize: 1000,
  });

  console.log(`cities: ${cities.length}`);
  await upsertInChunks({ table: "cities", rows: cities, chunkSize: 1000 });

  console.log("Import completed.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
