import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs',
  description: 'API documentation for the Countries / States / Cities API, including endpoints, examples, and usage.',
};

function CodeBlock(props: { title?: string; children: string }) {
  return (
    <div className='w-full min-w-0 max-w-full overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
      <div className='flex items-center justify-between border-b bg-(--surface-2) px-4 py-2'>
        <div className='text-xs font-medium text-(--text)'>{props.title ?? 'Example'}</div>
        <div className='text-[11px] text-(--text-muted)'>application/json</div>
      </div>
      <pre className='min-w-0 max-w-full overflow-x-auto whitespace-pre bg-(--surface) p-4 text-xs text-(--text)'>
        <code className='block min-w-0'>{props.children}</code>
      </pre>
    </div>
  );
}

function Pill(props: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full border bg-(--surface) px-2 py-0.5 text-xs text-(--text-muted) shadow-sm'>
      {props.children}
    </span>
  );
}

function SectionCard(props: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={props.id} className='min-w-0 scroll-mt-24 rounded-2xl border bg-(--surface) p-5 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-lg font-semibold text-(--text)'>{props.title}</h2>
        {props.description ? <p className='text-sm text-(--text-muted)'>{props.description}</p> : null}
      </div>
      <div className='mt-4'>{props.children}</div>
    </section>
  );
}

function EndpointList(props: { items: Array<{ method: string; path: string; desc: string }> }) {
  return (
    <div className='overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
      <ul className='divide-y'>
        {props.items.map((it) => (
          <li
            key={`${it.method}-${it.path}`}
            className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex items-center gap-2'>
              <span className='inline-flex w-14 justify-center rounded-md border bg-(--surface-2) px-2 py-1 text-xs font-semibold text-(--text)'>
                {it.method}
              </span>
              <span className='font-mono text-sm text-(--text)'>{it.path}</span>
            </div>
            <div className='text-sm text-(--text-muted)'>{it.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DocsPage() {
  return (
    <main>
      <div className='rounded-2xl border bg-(--surface) p-6 shadow-sm sm:p-10'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0'>
            <h1 className='text-2xl font-semibold text-(--text)'>API Docs</h1>
            <p className='mt-2 max-w-2xl text-sm text-(--text-muted)'>
              Developer-friendly documentation for the Countries / States / Cities API. For interactive Swagger UI, open{' '}
              <Link className='underline text-(--text)' href='/api/docs'>
                /api/docs
              </Link>
              .
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Pill>OpenAPI 3.0</Pill>
              <Pill>Pagination</Pill>
              <Pill>Search</Pill>
              <Pill>Filtering</Pill>
              <Pill>Sorting</Pill>
            </div>
          </div>

          <div className='w-full max-w-xl rounded-2xl border bg-(--surface-2) p-4 shadow-sm'>
            <div className='text-sm font-semibold text-(--text)'>Quick links</div>
            <div className='mt-3 grid gap-2 sm:grid-cols-2'>
              <Link
                className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                href='/regions'
              >
                Browse Regions →
              </Link>
              <Link
                className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                href='/countries'
              >
                Browse Countries →
              </Link>
              <Link
                className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                href='/terms'
              >
                Terms of Service →
              </Link>
              <Link
                className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                href='/api/openapi'
              >
                OpenAPI JSON →
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10 grid gap-6 lg:grid-cols-12'>
          <aside className='lg:col-span-4'>
            <div className='sticky top-24 rounded-2xl border bg-(--surface) p-5 shadow-sm'>
              <div className='text-sm font-semibold text-(--text)'>On this page</div>
              <nav className='mt-3 space-y-2 text-sm'>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#attribution'>
                  Attribution
                </a>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#usage'>
                  API Usage Terms
                </a>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#regions'>
                  Regions API
                </a>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#subregions'>
                  Subregions API
                </a>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#relationships'>
                  Relationships
                </a>
                <a className='block rounded-md px-2 py-1 text-(--text) hover:bg-(--surface-2)' href='#license'>
                  License
                </a>
              </nav>
            </div>
          </aside>

          <div className='min-w-0 grid gap-6 lg:col-span-8'>
            <SectionCard
              id='attribution'
              title='Attribution'
              description='A copy-ready attribution section for README or product docs.'
            >
              <div className='rounded-xl border bg-(--surface-2) p-4'>
                <div className='text-sm font-semibold text-(--text)'>Iqbal Mahmud</div>
                <div className='mt-1 text-sm text-(--text-muted)'>Software Engineer</div>
                <p className='mt-3 text-sm text-(--text-muted)'>
                  I build full-stack products with a focus on clean architecture and DRY, maintainable code.
                </p>
                <div className='mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4'>
                  <a
                    className='underline text-(--text)'
                    href='https://github.com/mahmud886'
                    target='_blank'
                    rel='noreferrer'
                  >
                    GitHub
                  </a>
                  <a
                    className='underline text-(--text)'
                    href='https://www.linkedin.com/in/mahmud886/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id='usage'
              title='API Usage Terms (Summary)'
              description='A simple, developer-friendly policy.'
            >
              <div className='rounded-xl border bg-(--surface) p-4 shadow-sm'>
                <ul className='list-disc space-y-2 pl-5 text-sm text-(--text-muted)'>
                  <li>Free to use for personal and commercial projects.</li>
                  <li>No abuse: rate limit your clients and avoid excessive scraping.</li>
                  <li>No illegal or harmful usage.</li>
                  <li>Attribution is recommended when you publish or redistribute the product.</li>
                  <li>No warranty: use at your own risk.</li>
                </ul>
                <div className='mt-4 text-sm text-(--text-muted)'>
                  Full terms:{' '}
                  <Link className='underline text-(--text)' href='/terms'>
                    /terms
                  </Link>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id='regions'
              title='Regions API'
              description='Endpoints for regions and countries grouped by region.'
            >
              <EndpointList
                items={[
                  { method: 'GET', path: '/api/regions', desc: 'List regions' },
                  { method: 'GET', path: '/api/regions/:id', desc: 'Region details (includes subregions)' },
                  { method: 'GET', path: '/api/regions/:id/countries', desc: 'Countries in region' },
                ]}
              />
              <div className='mt-4'>
                <CodeBlock
                  title='GET /api/regions (example)'
                  children={JSON.stringify(
                    {
                      success: true,
                      data: [
                        { id: 1, name: 'Africa', wikidata_id: 'Q15' },
                        { id: 2, name: 'Americas', wikidata_id: 'Q828' },
                      ],
                      meta: { page: 1, limit: 20, total: 6 },
                    },
                    null,
                    2,
                  )}
                />
              </div>
            </SectionCard>

            <SectionCard
              id='subregions'
              title='Subregions API'
              description='Endpoints for subregions and countries grouped by subregion.'
            >
              <EndpointList
                items={[
                  { method: 'GET', path: '/api/subregions', desc: 'List subregions (supports ?region_id=)' },
                  { method: 'GET', path: '/api/subregions/:id', desc: 'Subregion details' },
                  { method: 'GET', path: '/api/subregions/:id/countries', desc: 'Countries in subregion' },
                ]}
              />
              <div className='mt-4'>
                <CodeBlock
                  title='GET /api/subregions (example)'
                  children={JSON.stringify(
                    {
                      success: true,
                      data: [
                        {
                          id: 14,
                          name: 'Southern Asia',
                          region_id: 3,
                          region: { id: 3, name: 'Asia' },
                        },
                      ],
                      meta: { page: 1, limit: 20, total: 22 },
                    },
                    null,
                    2,
                  )}
                />
              </div>
            </SectionCard>

            <SectionCard id='relationships' title='Relationships' description='How the data is structured.'>
              <CodeBlock
                title='Data model'
                children={[
                  'regions (1) ── (many) subregions',
                  'regions (1) ── (many) countries',
                  'subregions (1) ── (many) countries',
                  'countries (1) ── (many) states',
                  'states (1) ── (many) cities',
                ].join('\\n')}
              />
            </SectionCard>

            <SectionCard id='license' title='License' description='Open-source licensing and reuse.'>
              <div className='rounded-xl border bg-(--surface) p-4 text-sm text-(--text-muted) shadow-sm'>
                MIT License. See{' '}
                <a className='underline text-(--text)' href='/LICENSE' target='_blank' rel='noreferrer'>
                  LICENSE
                </a>
                .
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
