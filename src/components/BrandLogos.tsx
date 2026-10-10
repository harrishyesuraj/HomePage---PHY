import React, { useState } from 'react';

// ==========================================
// 1. INLINE HIGH-FIDELITY VECTOR BRAND SVGs
// ==========================================

export function GeminiLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#8AB4F8" />
          <stop offset="65%" stopColor="#C58AF9" />
          <stop offset="100%" stopColor="#FA7B17" />
        </linearGradient>
      </defs>
      <path 
        d="M24 0C24 13.255 13.255 24 0 24C13.255 24 24 34.745 24 48C24 34.745 34.745 24 48 24C34.745 24 24 13.255 24 0Z" 
        fill="url(#gemini-gradient)" 
      />
    </svg>
  );
}

export function DriveLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 6.5H31.5L44.5 29H29.5L16.5 6.5Z" fill="#00AC47" />
      <path d="M3.5 29L16.5 6.5L24 19.5L11 41.5L3.5 29Z" fill="#1A73E8" />
      <path d="M11 41.5H37L44.5 29H18.5L11 41.5Z" fill="#FFBA00" />
    </svg>
  );
}

export function GmailLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14.5V36C6 38.2 7.8 40 10 40H14V21.5L6 14.5Z" fill="#4285F4" />
      <path d="M42 14.5V36C42 38.2 40.2 40 38 40H34V21.5L42 14.5Z" fill="#34A853" />
      <path d="M14 21.5L24 29L34 21.5V11.5C34 9.5 31.7 8.3 30 9.5L24 14.5L18 9.5C16.3 8.3 14 9.5 14 11.5V21.5Z" fill="#EA4335" />
      <path d="M34 11.5L42 14.5L38 9.5C36.8 8.5 35 9.3 34 10.5V11.5Z" fill="#FBBC04" />
      <path d="M14 11.5L6 14.5L10 9.5C11.2 8.5 13 9.3 14 10.5V11.5Z" fill="#C5221F" />
    </svg>
  );
}

export function YouTubeLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="10" width="42" height="28" rx="10" fill="#FF0000" />
      <path d="M20 18L32 24L20 30V18Z" fill="#FFFFFF" />
    </svg>
  );
}

export function MapsLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4C14.06 4 6 12.06 6 22C6 31.2 16.5 41.5 24 46C31.5 41.5 42 31.2 42 22C42 12.06 33.94 4 24 4Z" fill="#34A853" />
      <path d="M24 4C14.06 4 6 12.06 6 22C6 26.5 8.5 32 13 37L24 46V4Z" fill="#4285F4" />
      <path d="M24 4C28 4 33 6.5 36.5 10.5L24 22V4Z" fill="#EA4335" />
      <path d="M36.5 10.5C40 14 42 18 42 22C42 26.5 39.5 31.5 35 37L24 22L36.5 10.5Z" fill="#FBBC04" />
      <circle cx="24" cy="22" r="7.5" fill="#FFFFFF" />
      <circle cx="24" cy="22" r="4.5" fill="#1A73E8" />
    </svg>
  );
}

export function SearchLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.6 24.5C43.6 23.1 43.5 21.7 43.2 20.4H24V28.3H35C34.5 31 32.9 33.3 30.6 34.8V40.2H37.3C41.2 36.6 43.6 31.1 43.6 24.5Z" fill="#4285F4" />
      <path d="M24 44.5C29.5 44.5 34.2 42.7 37.3 40.2L30.6 34.8C28.8 36.1 26.5 36.8 24 36.8C18.7 36.8 14.2 33.2 12.6 28.4H5.8V33.9C9.2 40.4 16.1 44.5 24 44.5Z" fill="#34A853" />
      <path d="M12.6 28.4C12.2 27.1 12 25.7 12 24.2C12 22.7 12.2 21.3 12.6 20H5.8C4.4 22.8 3.6 25.9 3.6 24.2C3.6 22.5 4.4 25.6 5.8 28.4L12.6 28.4Z" fill="#FBBC05" />
      <path d="M24 11.6C27 11.6 29.7 12.6 31.8 14.6L37.5 8.9C34.1 5.8 29.5 3.9 24 3.9C16.1 3.9 9.2 8 5.8 14.5L12.6 20C14.2 15.2 18.7 11.6 24 11.6Z" fill="#EA4335" />
    </svg>
  );
}

export function CalendarLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="34" rx="9" fill="#4285F4" />
      <path d="M6 16H42V14C42 10.7 39.3 8 36 8H12C8.7 8 6 10.7 6 14V16Z" fill="#1967D2" />
      <text x="24" y="33" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
        31
      </text>
    </svg>
  );
}

export function NewsLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="32" height="28" rx="6" fill="#4285F4" />
      <rect x="14" y="16" width="12" height="8" rx="2" fill="#FFFFFF" />
      <rect x="14" y="27" width="20" height="3" rx="1.5" fill="#FFFFFF" />
      <rect x="14" y="32" width="14" height="3" rx="1.5" fill="#FFFFFF" />
      <path d="M12 10H36V6C36 4.9 35.1 4 34 4H14C12.9 4 12 4.9 12 6V10Z" fill="#EA4335" />
      <path d="M36 10H40C41.1 10 42 10.9 42 12V32C42 33.1 41.1 34 40 34H36V10Z" fill="#FBBC04" />
      <path d="M6 16C6 14.9 6.9 14 8 14V34C6.9 34 6 33.1 6 32V16Z" fill="#34A853" />
    </svg>
  );
}

export function PhotosLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 14C24 8.5 19.5 4 14 4C8.5 4 4 8.5 4 14C4 19.5 8.5 24 14 24H24V14Z" fill="#FBBC05" />
      <path d="M34 24C39.5 24 44 19.5 44 14C44 8.5 39.5 4 34 4C28.5 4 24 8.5 24 14V24H34Z" fill="#EA4335" />
      <path d="M24 34C24 39.5 28.5 44 34 44C39.5 44 44 39.5 44 34C44 28.5 39.5 24 34 24H24V34Z" fill="#4285F4" />
      <path d="M14 24C8.5 24 4 28.5 4 34C4 39.5 8.5 44 14 44C19.5 44 24 39.5 24 34V24H14Z" fill="#34A853" />
    </svg>
  );
}

export function MeetLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="13" width="24" height="22" rx="6" fill="#FFBA00" />
      <circle cx="11" cy="19" r="2" fill="#FFFFFF" />
      <path d="M29 18L41 11V37L29 30V18Z" fill="#00AC47" />
      <path d="M29 18L35 14.5V33.5L29 30V18Z" fill="#00832D" />
      <path d="M41 11L35 14.5V19L41 15V11Z" fill="#EA4335" />
      <path d="M41 37L35 33.5V29L41 33V37Z" fill="#2684FC" />
    </svg>
  );
}

export function TranslateLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="22" height="24" rx="5" fill="#4285F4" />
      <text x="17" y="26" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">G</text>
      <rect x="20" y="15" width="22" height="24" rx="5" fill="#E8EAED" />
      <path d="M26 23H36M31 23V33M28 27C30 30 33 32 34 32M34 27C32.5 30 30 31.5 29 32" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AccountLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 46" className={`${className} object-contain`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="6" y="34" fontFamily="system-ui, -apple-system, 'Product Sans', Roboto, sans-serif" fontWeight="700" fontSize="34" letterSpacing="-1">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  );
}

export function SheetsLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="7" width="30" height="34" rx="5" fill="#0F9D58" />
      <rect x="16" y="16" width="16" height="16" rx="2" fill="#FFFFFF" />
      <path d="M16 24H32M24 16V32" stroke="#0F9D58" strokeWidth="2.5" />
    </svg>
  );
}

export function DocsLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6H28L38 16V40C38 41.1 37.1 42 36 42H12C10.9 42 10 41.1 10 40V8C10 6.9 10.9 6 12 6Z" fill="#4285F4" />
      <path d="M28 6V16H38L28 6Z" fill="#A1C2FA" />
      <rect x="16" y="22" width="16" height="2.5" rx="1.2" fill="#FFFFFF" />
      <rect x="16" y="27" width="16" height="2.5" rx="1.2" fill="#FFFFFF" />
      <rect x="16" y="32" width="10" height="2.5" rx="1.2" fill="#FFFFFF" />
    </svg>
  );
}

export function KeepLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="34" rx="6" fill="#FBBC04" />
      <circle cx="24" cy="22" r="7" fill="#FFFFFF" />
      <path d="M21 29H27V32H21V29Z" fill="#FFFFFF" />
    </svg>
  );
}

export function ClassroomLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="32" rx="6" fill="#137333" stroke="#F9AB00" strokeWidth="3" />
      <circle cx="24" cy="20" r="5" fill="#FFFFFF" />
      <path d="M17 32C17 28 20 26 24 26C28 26 31 28 31 32" fill="#FFFFFF" />
    </svg>
  );
}

export function ChromeLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="#EA4335" />
      <path d="M24 24L38 24C38 31.7 31.7 38 24 38L24 24Z" fill="#34A853" />
      <path d="M24 24L10 24C10 31.7 16.3 38 24 38L24 24Z" fill="#FBBC05" />
      <circle cx="24" cy="24" r="9" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="6" fill="#4285F4" />
    </svg>
  );
}

export function GitHubLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function SpotifyLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

export function RedditLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#FF4500">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="11.5" r="1.5" fill="#FFFFFF" />
      <circle cx="15" cy="11.5" r="1.5" fill="#FFFFFF" />
      <path d="M9.5 15.5C10.5 16.5 13.5 16.5 14.5 15.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="8" r="1.2" fill="#FFFFFF" />
      <path d="M12 7.5L13.5 4.5L16.8 5.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function GoogleWaffleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="5" cy="5" r="2.2" />
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="19" cy="5" r="2.2" />
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
      <circle cx="5" cy="19" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
      <circle cx="19" cy="19" r="2.2" />
    </svg>
  );
}

// ==========================================
// 2. HIGH QUALITY CDN BRAND IMAGE ASSETS
// ==========================================

export const BRAND_APP_ICONS: Record<string, string> = {
  // Google Suite
  account: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  drive: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
  gmail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
  youtube: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  gemini: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
  maps: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
  search: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
  calendar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
  news: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg',
  photos: 'https://ssl.gstatic.com/images/branding/product/2x/photos_96dp.png',
  meet: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg',
  translate: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg',
  sheets: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
  docs: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg',
  keep: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Google_Keep_icon_%282020%29.svg',
  classroom: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.svg',
  chrome: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg',
  play: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg',
  earth: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Google_Earth_icon.svg',
  contacts: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Google_Contacts_icon.svg',

  // Major Web Apps & Tools
  github: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  reddit: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Reddit_logo_%282023%29.svg',
  spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  netflix: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_N_logo.svg',
  discord: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Discord_logo_%28icon%29.svg',
  x: 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg',
  twitter: 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg',
  notion: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  figma: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  chatgpt: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  openai: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  wikipedia: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Wikipedia_svg_logo.svg',
  linkedin: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  twitch: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg',
  amazon: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
  slack: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
  stackoverflow: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg',
  vite: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg'
};

// Backwards compatibility alias
export const GOOGLE_APP_IMAGES = BRAND_APP_ICONS;

// Helper to extract clean domain from any URL
export function extractDomain(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    const sanitized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(sanitized);
    return parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return rawUrl.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  }
}

// True Logo identification key
export function resolveAppKey(name: string, title: string = '', url: string = ''): string {
  const icon = (name || '').toLowerCase().trim();
  const t = (title || '').toLowerCase().trim();
  const domain = extractDomain(url);
  const u = (url || '').toLowerCase();

  // 1. Google Suite Matching
  if (icon === 'gemini' || t === 'gemini' || domain.includes('gemini.google')) return 'gemini';
  if (icon === 'drive' || t === 'drive' || domain.includes('drive.google')) return 'drive';
  if (icon === 'gmail' || t === 'gmail' || domain.includes('mail.google')) return 'gmail';
  if (icon === 'youtube' || t === 'youtube' || domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
  if (icon === 'maps' || t === 'maps' || domain.includes('maps.google')) return 'maps';
  if (icon === 'calendar' || t === 'calendar' || domain.includes('calendar.google')) return 'calendar';
  if (icon === 'news' || t === 'news' || domain.includes('news.google')) return 'news';
  if (icon === 'photos' || t === 'photos' || domain.includes('photos.google')) return 'photos';
  if (icon === 'meet' || t === 'meet' || domain.includes('meet.google')) return 'meet';
  if (icon === 'translate' || t === 'translate' || domain.includes('translate.google')) return 'translate';
  if (icon === 'sheets' || t === 'sheets' || u.includes('/spreadsheets') || domain.includes('sheets.google')) return 'sheets';
  if (icon === 'docs' || t === 'docs' || (domain.includes('docs.google') && !u.includes('/spreadsheets'))) return 'docs';
  if (icon === 'keep' || t === 'keep' || domain.includes('keep.google')) return 'keep';
  if (icon === 'classroom' || t === 'classroom' || domain.includes('classroom.google')) return 'classroom';
  if (icon === 'chrome' || t === 'chrome' || domain.includes('chrome.google')) return 'chrome';
  if (icon === 'account' || t === 'account' || domain.includes('myaccount.google')) return 'account';
  if (icon === 'play' || t.includes('play store') || domain.includes('play.google')) return 'play';
  if (icon === 'earth' || t === 'earth' || domain.includes('earth.google')) return 'earth';
  if (icon === 'contacts' || t === 'contacts' || domain.includes('contacts.google')) return 'contacts';

  // 2. Major Popular Apps Matching
  if (icon === 'github' || t === 'github' || domain.includes('github.com')) return 'github';
  if (icon === 'reddit' || t === 'reddit' || domain.includes('reddit.com')) return 'reddit';
  if (icon === 'spotify' || t === 'spotify' || domain.includes('spotify.com')) return 'spotify';
  if (icon === 'netflix' || t === 'netflix' || domain.includes('netflix.com')) return 'netflix';
  if (icon === 'discord' || t === 'discord' || domain.includes('discord.com') || domain.includes('discord.gg')) return 'discord';
  if (icon === 'x' || icon === 'twitter' || t === 'x' || t === 'twitter' || domain.includes('x.com') || domain.includes('twitter.com')) return 'x';
  if (icon === 'notion' || t === 'notion' || domain.includes('notion.so') || domain.includes('notion.site')) return 'notion';
  if (icon === 'figma' || t === 'figma' || domain.includes('figma.com')) return 'figma';
  if (icon === 'chatgpt' || icon === 'openai' || t === 'chatgpt' || domain.includes('chatgpt.com') || domain.includes('openai.com')) return 'chatgpt';
  if (icon === 'wikipedia' || t === 'wikipedia' || domain.includes('wikipedia.org')) return 'wikipedia';
  if (icon === 'linkedin' || t === 'linkedin' || domain.includes('linkedin.com')) return 'linkedin';
  if (icon === 'twitch' || t === 'twitch' || domain.includes('twitch.tv')) return 'twitch';
  if (icon === 'amazon' || t === 'amazon' || domain.includes('amazon.')) return 'amazon';
  if (icon === 'slack' || t === 'slack' || domain.includes('slack.com')) return 'slack';
  if (icon === 'stackoverflow' || t === 'stackoverflow' || domain.includes('stackoverflow.com')) return 'stackoverflow';
  if (icon === 'vite' || t === 'vite' || domain.includes('vite.dev')) return 'vite';

  // 3. Exact Google Search ONLY if explicitly requested or domain is pure google.com
  if (
    (domain === 'google.com' || domain === 'google.co.in' || domain === 'google.co.uk') && 
    (t === 'search' || t === 'google' || t === 'google search' || !t)
  ) {
    return 'search';
  }

  // If icon is an explicit preset key in our library
  if (icon && BRAND_APP_ICONS[icon]) {
    return icon;
  }

  // Return domain or empty
  return domain;
}

// Backwards compatibility alias
export const resolveGoogleAppKey = resolveAppKey;

// ==========================================
// 3. TRUE APP LOGO COMPONENT
// ==========================================

export function GoogleAppImage({
  name,
  title = '',
  url = '',
  className = "w-10 h-10"
}: {
  name: string;
  title?: string;
  url?: string;
  className?: string;
}) {
  const [stage, setStage] = useState<'primary' | 'secondary' | 'svg' | 'fallback'>('primary');
  
  const key = resolveAppKey(name, title, url);
  const domain = extractDomain(url);
  const knownBrandUrl = BRAND_APP_ICONS[key];

  // Derive high-res favicon for custom domains
  const faviconUrl = domain 
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` 
    : '';
  const secondaryFaviconUrl = domain 
    ? `https://icons.duckduckgo.com/ip3/${domain}.ico` 
    : '';

  // Account shortcut: render pristine Google wordmark vector with guaranteed zero clipping
  if (key === 'account') {
    return (
      <AccountLogo className="w-11 h-6 object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-105" />
    );
  }

  // 1. Try Known Brand High-Res Image (or Favicon if not in static dictionary)
  if (stage === 'primary') {
    const srcToTry = knownBrandUrl || faviconUrl;
    if (srcToTry) {
      return (
        <img
          src={srcToTry}
          alt={title || name}
          className={`${className} object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-105 ${
            key === 'account' ? 'w-full max-w-[48px] max-h-8 object-contain px-0.5' : ''
          }`}
          loading="eager"
          decoding="async"
          draggable={false}
          onError={() => {
            if (knownBrandUrl) {
              setStage('svg');
            } else if (secondaryFaviconUrl) {
              setStage('secondary');
            } else {
              setStage('fallback');
            }
          }}
        />
      );
    }
  }

  // 2. Secondary Favicon Attempt for custom URLs
  if (stage === 'secondary' && secondaryFaviconUrl) {
    return (
      <img
        src={secondaryFaviconUrl}
        alt={title || name}
        className={`${className} object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-105`}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setStage('fallback')}
      />
    );
  }

  // 3. Inline Vector SVG Fallback for matched brands
  switch (key) {
    case 'gemini': return <GeminiLogo className={className} />;
    case 'drive': return <DriveLogo className={className} />;
    case 'gmail': return <GmailLogo className={className} />;
    case 'youtube': return <YouTubeLogo className={className} />;
    case 'maps': return <MapsLogo className={className} />;
    case 'search': return <SearchLogo className={className} />;
    case 'calendar': return <CalendarLogo className={className} />;
    case 'news': return <NewsLogo className={className} />;
    case 'photos': return <PhotosLogo className={className} />;
    case 'meet': return <MeetLogo className={className} />;
    case 'translate': return <TranslateLogo className={className} />;
    case 'account': return <AccountLogo className={className} />;
    case 'sheets': return <SheetsLogo className={className} />;
    case 'docs': return <DocsLogo className={className} />;
    case 'keep': return <KeepLogo className={className} />;
    case 'classroom': return <ClassroomLogo className={className} />;
    case 'chrome': return <ChromeLogo className={className} />;
    case 'github': return <GitHubLogo className={className} />;
    case 'spotify': return <SpotifyLogo className={className} />;
    case 'reddit': return <RedditLogo className={className} />;
    default:
      break;
  }

  // 4. True Monogram Badge for any unknown custom site (NEVER the Google 'G' icon!)
  const label = title || domain || name || 'App';
  const initial = label.replace(/^https?:\/\//i, '').replace(/^www\./i, '').charAt(0).toUpperCase() || 'A';
  
  // Deterministic soft color generation from string
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600'
  ];
  const charCode = (label.charCodeAt(0) || 0) + (label.charCodeAt(1) || 0);
  const gradientClass = colors[charCode % colors.length];

  return (
    <div 
      className={`${className} rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold text-white shadow-md text-base select-none pointer-events-none transition-transform duration-200 group-hover:scale-105`}
    >
      {initial}
    </div>
  );
}
