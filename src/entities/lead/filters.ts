import type { LeadSource, ContactMethod } from './types';

export type LeadStatus = 'handled' | 'open';
export type LeadNotified = 'sent' | 'failed';
export type LeadSort = 'newest' | 'oldest' | 'name';

export interface LeadFilters {
  source: LeadSource | null;
  contactMethod: ContactMethod | null;
  status: LeadStatus | null;
  notified: LeadNotified | null;
  /** Free text, matched against name and phone. */
  q: string;
  sort: LeadSort;
}

const SOURCES: readonly LeadSource[] = ['calculator', 'contact', 'callback'];
const METHODS: readonly ContactMethod[] = ['phone', 'viber', 'telegram'];
const STATUSES: readonly LeadStatus[] = ['handled', 'open'];
const NOTIFIED: readonly LeadNotified[] = ['sent', 'failed'];
const SORTS: readonly LeadSort[] = ['newest', 'oldest', 'name'];

export const DEFAULT_LEAD_SORT: LeadSort = 'newest';

function readOne<T extends string>(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  allowed: readonly T[],
): T | null {
  const raw = searchParams[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value !== undefined && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * Reads `?source=calculator&status=open&q=0671&sort=name` into typed, validated
 * filters. Mirrors entities/project/filters.ts deliberately, including its most
 * important property: an unrecognised value is treated as "no filter" rather
 * than thrown, so a stray or stale query param can never 500 a page someone
 * bookmarked.
 */
export function parseLeadFilters(
  searchParams: Record<string, string | string[] | undefined>,
): LeadFilters {
  const rawQuery = searchParams['q'];
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery) ?? '';

  return {
    source: readOne(searchParams, 'source', SOURCES),
    contactMethod: readOne(searchParams, 'via', METHODS),
    status: readOne(searchParams, 'status', STATUSES),
    notified: readOne(searchParams, 'notified', NOTIFIED),
    q: q.trim().slice(0, 100),
    sort: readOne(searchParams, 'sort', SORTS) ?? DEFAULT_LEAD_SORT,
  };
}

interface TextMatch {
  contains: string;
  mode: 'insensitive';
}

interface PrismaLeadWhere {
  source?: string;
  contactMethod?: string;
  handledAt?: { not: null } | null;
  notifiedAt?: { not: null } | null;
  OR?: { name?: TextMatch; phone?: TextMatch }[];
}

/** Translates validated filters into a Prisma `where` clause. Pure, no DB access. */
export function toPrismaWhere(filters: LeadFilters): PrismaLeadWhere {
  const where: PrismaLeadWhere = {};

  if (filters.source) where.source = filters.source;
  if (filters.contactMethod) where.contactMethod = filters.contactMethod;

  // handledAt and notifiedAt are nullable timestamps rather than booleans, so
  // "handled" is "has a value" and "open" is "is null" — not true/false.
  if (filters.status === 'handled') where.handledAt = { not: null };
  if (filters.status === 'open') where.handledAt = null;
  if (filters.notified === 'sent') where.notifiedAt = { not: null };
  if (filters.notified === 'failed') where.notifiedAt = null;

  if (filters.q) {
    // Name or phone, because the operator searching has one or the other in
    // front of them — a caller ID, or a name someone mentioned.
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { phone: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function toPrismaOrderBy(sort: LeadSort): Record<string, 'asc' | 'desc'> {
  if (sort === 'oldest') return { createdAt: 'asc' };
  if (sort === 'name') return { name: 'asc' };
  return { createdAt: 'desc' };
}

/** True when anything is narrowing the list — drives whether "Clear" is offered. */
export function hasActiveLeadFilters(filters: LeadFilters): boolean {
  return Boolean(
    filters.source ||
      filters.contactMethod ||
      filters.status ||
      filters.notified ||
      filters.q ||
      filters.sort !== DEFAULT_LEAD_SORT,
  );
}
