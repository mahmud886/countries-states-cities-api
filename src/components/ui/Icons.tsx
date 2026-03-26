import type { ComponentProps } from 'react';

export type IconName =
  | 'dashboard'
  | 'countries'
  | 'regions'
  | 'states'
  | 'cities'
  | 'docs'
  | 'terms'
  | 'swagger'
  | 'search'
  | 'map'
  | 'focus'
  | 'chevron-right'
  | 'sparkle'
  | 'list';

type IconProps = ComponentProps<'svg'> & { name: IconName };

export function Icon({ name, className, ...props }: IconProps) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: className ?? 'h-4 w-4',
    ...props,
  } as const;

  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <path
            d='M4 13.5V7.2C4 6.537 4.537 6 5.2 6h4.3c.663 0 1.2.537 1.2 1.2v6.3c0 .663-.537 1.2-1.2 1.2H5.2c-.663 0-1.2-.537-1.2-1.2Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
          <path
            d='M13.3 18V10.2c0-.663.537-1.2 1.2-1.2h4.3c.663 0 1.2.537 1.2 1.2V18c0 .663-.537 1.2-1.2 1.2h-4.3c-.663 0-1.2-.537-1.2-1.2Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
        </svg>
      );
    case 'countries':
      return (
        <svg {...common}>
          <path d='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' stroke='currentColor' strokeWidth='1.6' />
          <path d='M3 12h18' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path
            d='M12 3c2.5 2.6 4 5.9 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.9-4-9s1.5-6.4 4-9Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
        </svg>
      );
    case 'regions':
      return (
        <svg {...common}>
          <path
            d='M4.5 7.5 12 3l7.5 4.5V16.5L12 21l-7.5-4.5V7.5Z'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinejoin='round'
          />
          <path d='M12 3v18' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M4.5 7.5 12 12l7.5-4.5' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' />
        </svg>
      );
    case 'states':
      return (
        <svg {...common}>
          <path
            d='M7 4h10a2 2 0 0 1 2 2v12.2a1.8 1.8 0 0 1-1.8 1.8H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
          <path d='M8 8h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8 12h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8 16h5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'cities':
      return (
        <svg {...common}>
          <path d='M4.5 20V9.2c0-.663.537-1.2 1.2-1.2H10v12H4.5Z' stroke='currentColor' strokeWidth='1.6' />
          <path d='M10 20V4.8c0-.663.537-1.2 1.2-1.2H17a2 2 0 0 1 2 2V20H10Z' stroke='currentColor' strokeWidth='1.6' />
          <path d='M7 12h1.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M13 8h1.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M13 12h1.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M13 16h1.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'docs':
      return (
        <svg {...common}>
          <path
            d='M7 3.8h8.6c.9 0 1.4.5 1.4 1.4V20.2c0 .9-.5 1.4-1.4 1.4H7c-.9 0-1.4-.5-1.4-1.4V5.2c0-.9.5-1.4 1.4-1.4Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
          <path d='M8.5 8h6' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8.5 11.5h6' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8.5 15h4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'terms':
      return (
        <svg {...common}>
          <path
            d='M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H9.4a2 2 0 0 1-1.4-.6L5.6 20A2 2 0 0 1 5 18.6V6a2 2 0 0 1 2-2Z'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinejoin='round'
          />
          <path d='M8 9h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8 13h6' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'swagger':
      return (
        <svg {...common}>
          <path
            d='M6.5 16.5c2.2 2.2 8.8 2.2 11 0s2.2-8.8 0-11-8.8-2.2-11 0-2.2 8.8 0 11Z'
            stroke='currentColor'
            strokeWidth='1.6'
          />
          <path d='M8.5 15.5 15.5 8.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M9.5 9.5h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
          <path d='M14.5 14.5h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <path d='M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z' stroke='currentColor' strokeWidth='1.6' />
          <path d='M16.5 16.5 21 21' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'map':
      return (
        <svg {...common}>
          <path
            d='M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinejoin='round'
          />
          <path d='M12 10.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z' fill='currentColor' />
        </svg>
      );
    case 'focus':
      return (
        <svg {...common}>
          <path d='M9 3H5.6C4.7 3 4 3.7 4 4.6V8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M15 3h3.4c.9 0 1.6.7 1.6 1.6V8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M9 21H5.6c-.9 0-1.6-.7-1.6-1.6V16' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M15 21h3.4c.9 0 1.6-.7 1.6-1.6V16' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M12 8.5v7' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8.5 12h7' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...common}>
          <path d='M9 6l6 6-6 6' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d='M12 2l1.3 4.2L18 7.5l-4.1 1.4L12 13l-1.9-4.1L6 7.5l4.7-1.3L12 2Z' fill='currentColor' />
          <path d='M19 11l.7 2.3L22 14l-2.3.7L19 17l-.7-2.3L16 14l2.3-.7L19 11Z' fill='currentColor' />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <path d='M8 7h12' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8 12h12' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M8 17h12' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          <path d='M4 7h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
          <path d='M4 12h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
          <path d='M4 17h.01' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
        </svg>
      );
  }
}
