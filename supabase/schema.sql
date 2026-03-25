create table if not exists public.regions (
  id integer primary key,
  name text not null,
  wikidata_id text
);

create table if not exists public.subregions (
  id integer primary key,
  name text not null,
  region_id integer not null references public.regions (id) on delete restrict,
  wikidata_id text
);

create index if not exists subregions_region_id_idx on public.subregions (region_id);

create table if not exists public.countries (
  id integer primary key,
  name text not null,
  iso3 text,
  iso2 text,
  numeric_code text,
  phonecode text,
  capital text,
  currency text,
  currency_name text,
  currency_symbol text,
  tld text,
  native text,
  population bigint,
  gdp numeric,
  region_id integer references public.regions (id) on delete set null,
  subregion_id integer references public.subregions (id) on delete set null,
  nationality text,
  area_sq_km numeric,
  postal_code_format text,
  postal_code_regex text,
  timezones_raw text,
  latitude double precision,
  longitude double precision,
  emoji text,
  emoji_u text,
  wikidata_id text
);

create unique index if not exists countries_iso2_uniq on public.countries (iso2) where iso2 is not null;
create unique index if not exists countries_iso3_uniq on public.countries (iso3) where iso3 is not null;
create index if not exists countries_region_id_idx on public.countries (region_id);
create index if not exists countries_subregion_id_idx on public.countries (subregion_id);

create table if not exists public.states (
  id integer primary key,
  name text not null,
  country_id integer not null references public.countries (id) on delete cascade,
  iso2 text,
  iso3166_2 text,
  fips_code text,
  type text,
  level integer,
  parent_id integer references public.states (id) on delete set null,
  native text,
  latitude double precision,
  longitude double precision,
  timezone text,
  wikidata_id text,
  population bigint
);

create index if not exists states_country_id_idx on public.states (country_id);
create index if not exists states_iso2_idx on public.states (iso2);

create table if not exists public.cities (
  id integer primary key,
  name text not null,
  state_id integer not null references public.states (id) on delete cascade,
  country_id integer not null references public.countries (id) on delete cascade,
  native text,
  type text,
  level integer,
  parent_id integer,
  latitude double precision,
  longitude double precision,
  population bigint,
  timezone text,
  wikidata_id text
);

create index if not exists cities_country_id_idx on public.cities (country_id);
create index if not exists cities_state_id_idx on public.cities (state_id);
create index if not exists cities_name_idx on public.cities (name);

alter table public.regions enable row level security;
alter table public.subregions enable row level security;
alter table public.countries enable row level security;
alter table public.states enable row level security;
alter table public.cities enable row level security;

drop policy if exists public_select_regions on public.regions;
create policy public_select_regions on public.regions for select using (true);

drop policy if exists public_select_subregions on public.subregions;
create policy public_select_subregions on public.subregions for select using (true);

drop policy if exists public_select_countries on public.countries;
create policy public_select_countries on public.countries for select using (true);

drop policy if exists public_select_states on public.states;
create policy public_select_states on public.states for select using (true);

drop policy if exists public_select_cities on public.cities;
create policy public_select_cities on public.cities for select using (true);

grant select on public.regions to anon;
grant select on public.subregions to anon;
grant select on public.countries to anon;
grant select on public.states to anon;
grant select on public.cities to anon;
