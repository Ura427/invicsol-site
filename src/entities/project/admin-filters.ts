import { parseProjectFilters, toPrismaWhere as toPublicWhere, type ProjectFilters } from './filters';

export type ProjectStatus = 'real' | 'demo';
export type ProjectSort = 'newest' | 'oldest' | 'capacity-desc' | 'capacity-asc' | 'title';

export interface AdminProjectFilters extends ProjectFilters {
  /** Free text, matched against the slug and every translated title. */
  q: string;
  status: ProjectStatus | null;
  sort: ProjectSort;
}

const STATUSES: readonly ProjectStatus[] = ['real', 'demo'];
const SORTS: readonly ProjectSort[] = [
  'newest',
  'oldest',
  'capacity-desc',
  'capacity-asc',
  'title',
];

export const DEFAULT_PROJECT_SORT: ProjectSort = 'newest';

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
 * The admin's superset of the public gallery filters.
 *
 * Built on parseProjectFilters rather than beside it, so type/usage/capacity
 * cannot drift between the two surfaces — the public page and the admin list
 * agree on what "?usage=green-tariff" means by construction.
 */
export function parseAdminProjectFilters(
  searchParams: Record<string, string | string[] | undefined>,
): AdminProjectFilters {
  const rawQuery = searchParams['q'];
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery) ?? '';

  return {
    ...parseProjectFilters(searchParams),
    q: q.trim().slice(0, 100),
    status: readOne(searchParams, 'status', STATUSES),
    sort: readOne(searchParams, 'sort', SORTS) ?? DEFAULT_PROJECT_SORT,
  };
}

interface TextMatch {
  contains: string;
  mode: 'insensitive';
}

interface PrismaAdminProjectWhere {
  objectType?: string;
  usage?: string;
  capacityKw?: { gte?: number; lt?: number };
  isPlaceholder?: boolean;
  OR?: ({ slug: TextMatch } | { translations: { some: { title: TextMatch } } })[];
}

export function toPrismaWhere(filters: AdminProjectFilters): PrismaAdminProjectWhere {
  const where: PrismaAdminProjectWhere = { ...toPublicWhere(filters) };

  if (filters.status === 'real') where.isPlaceholder = false;
  if (filters.status === 'demo') where.isPlaceholder = true;

  if (filters.q) {
    // Searching titles goes through the relation because titles live on the
    // translation rows — matching `some` means finding a project by either its
    // Ukrainian or its English name, whichever the operator happens to recall.
    where.OR = [
      { slug: { contains: filters.q, mode: 'insensitive' } },
      { translations: { some: { title: { contains: filters.q, mode: 'insensitive' } } } },
    ];
  }

  return where;
}

export function toPrismaOrderBy(sort: ProjectSort): Record<string, 'asc' | 'desc'> {
  switch (sort) {
    case 'oldest':
      return { completedAt: 'asc' };
    case 'capacity-desc':
      return { capacityKw: 'desc' };
    case 'capacity-asc':
      return { capacityKw: 'asc' };
    // There is no title column on Project — it lives on the translations — so
    // ordering by slug is the closest stable approximation the database can do
    // without a join that would reorder on every language switch.
    case 'title':
      return { slug: 'asc' };
    default:
      return { completedAt: 'desc' };
  }
}

export function hasActiveProjectFilters(filters: AdminProjectFilters): boolean {
  return Boolean(
    filters.type ||
      filters.usage ||
      filters.capacity ||
      filters.status ||
      filters.q ||
      filters.sort !== DEFAULT_PROJECT_SORT,
  );
}
