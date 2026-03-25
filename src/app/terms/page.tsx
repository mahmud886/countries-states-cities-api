import Link from 'next/link';

export default function TermsPage() {
  return (
    <main>
      <div className='rounded-2xl border bg-[var(--surface)] p-6 shadow-sm sm:p-10'>
        <h1 className='text-2xl font-semibold text-[var(--text)]'>Terms of Service</h1>
        <p className='mt-2 text-sm text-[var(--text-muted)]'>
          These Terms govern access to and use of this Countries / States / Cities API and associated UI. If you do not
          agree, do not use the service.
        </p>

        <div className='mt-8 space-y-8'>
          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>1. Usage</h2>
            <ul className='mt-2 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]'>
              <li>Free to use for personal and commercial projects.</li>
              <li>Use the API responsibly and respect reasonable rate limits.</li>
              <li>
                Do not attempt to bypass security controls, probe for vulnerabilities, or disrupt service availability.
              </li>
              <li>Do not use the API for unlawful, harmful, or abusive activities.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>2. Rate Limiting and Abuse</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              To keep the service reliable, rate limiting may be applied. Excessive requests, scraping, or automation
              that degrades performance may be blocked without notice.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>3. Attribution</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              Attribution is recommended when you publish or redistribute the API/product. See the{' '}
              <Link className='underline text-[var(--text)]' href='/docs'>
                Docs
              </Link>{' '}
              page for a copy-ready attribution snippet.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>4. No Warranty</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              The service and data are provided “as is” without warranties of any kind. Data may be incomplete, out of
              date, or inaccurate.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>5. Limitation of Liability</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              To the maximum extent permitted by law, the author and contributors will not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from
              your use of the service.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>6. Changes</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              These Terms may be updated from time to time. Continued use of the service after changes means you accept
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-[var(--text)]'>7. Contact</h2>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              GitHub:{' '}
              <a
                className='underline text-[var(--text)]'
                href='https://github.com/mahmud886'
                target='_blank'
                rel='noreferrer'
              >
                https://github.com/mahmud886
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
