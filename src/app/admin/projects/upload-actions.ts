'use server';

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { requireAdmin } from '@/shared/lib/admin-session';
import { toSlug } from '@/shared/lib/slug';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const TARGET_DIR = join(process.cwd(), 'public', 'projects');

export type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: 'not_available' | 'too_large' | 'wrong_type' | 'failed' };

/**
 * Writes an uploaded photo into public/projects/ and returns its site path.
 *
 * Deliberately refuses to run in production. A deployed Next app serves
 * public/ from a CDN and its filesystem is read-only, so this would either
 * throw or — worse — appear to succeed and produce a path that 404s forever.
 * Failing loudly and early is the honest behaviour; adding photos from a phone
 * after deploy needs blob storage, which is a separate decision with a vendor
 * and a bill attached.
 *
 * sharp is imported dynamically rather than at module scope so it is never
 * pulled into the production server bundle, where this function cannot run.
 */
export async function uploadProjectPhoto(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  if (process.env.NODE_ENV === 'production') return { ok: false, error: 'not_available' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'failed' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'too_large' };

  // Trust the sniffed bytes, not the declared type: the browser's MIME string
  // is caller-controlled. sharp refuses to parse anything that is not actually
  // an image, so a renamed .exe fails at decode rather than landing on disk.
  if (!ALLOWED.includes(file.type)) return { ok: false, error: 'wrong_type' };

  try {
    const sharp = (await import('sharp')).default;
    const input = Buffer.from(await file.arrayBuffer());

    const optimised = await sharp(input)
      // Honour the EXIF orientation phones write, then drop the tag — without
      // this a portrait photo lands sideways on the public site.
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    // The filename comes from the user, so it is rebuilt rather than trusted:
    // toSlug strips path separators, dots and everything else that could climb
    // out of the target directory.
    const base = toSlug(file.name.replace(/\.[^.]+$/, '')) || 'photo';
    const name = `${base}-${Date.now().toString(36)}.jpg`;

    await mkdir(TARGET_DIR, { recursive: true });
    await writeFile(join(TARGET_DIR, name), optimised);

    return { ok: true, path: `/projects/${name}` };
  } catch {
    return { ok: false, error: 'failed' };
  }
}
