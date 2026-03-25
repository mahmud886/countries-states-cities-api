export type Region = {
  id: number;
  name: string;
  wikidata_id: string | null;
};

export type Subregion = {
  id: number;
  name: string;
  region_id: number;
  wikidata_id: string | null;
};
