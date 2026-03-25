'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export function SearchForm(props: { placeholder: string; paramKey?: string }) {
  const { placeholder, paramKey = 'search' } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValue = useMemo(() => searchParams?.get(paramKey) ?? '', [searchParams, paramKey]);
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className='flex gap-2'
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(searchParams?.toString() ?? '');
        if (value.trim()) next.set(paramKey, value.trim());
        else next.delete(paramKey);
        next.delete('page');
        router.push(`${pathname}?${next.toString()}`);
      }}
    >
      <div className='relative w-full'>
        <input
          className='w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-9 text-sm outline-none ring-gray-200 focus:ring-2'
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value.trim().length ? (
          <button
            className='absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100'
            type='button'
            onClick={() => {
              setValue('');
              const next = new URLSearchParams(searchParams?.toString() ?? '');
              next.delete(paramKey);
              next.delete('page');
              router.push(`${pathname}?${next.toString()}`);
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
      <button
        className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50'
        type='submit'
      >
        Search
      </button>
    </form>
  );
}
