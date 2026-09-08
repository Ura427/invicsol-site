/**
 * Ukrainian → Latin, following the national standard (KMU 55:2010) with one
 * deliberate simplification: the standard makes є, ї, й, ю and я
 * position-dependent (`ye` at the start of a word, `ie` inside it, and so on).
 * This maps each to a single form regardless of position.
 *
 * That is not laziness — it is what the four location keys already in the
 * database were built with (Брюховичі is stored as `bryukhovychi`, not the
 * standard's `briukhovychi`), and those keys are baked into public URLs. A
 * strictly-conformant table would silently produce a different slug for the same
 * input and break every bookmarked project page.
 *
 * `ь` maps to nothing, which is what turns Львів into `lviv`.
 */
const TRANSLITERATION: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
  ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
  ю: 'yu', я: 'ya',
  // Russian letters with no Ukrainian equivalent, in case a name is typed with
  // them. Cheap to support, and the alternative is silently dropping a
  // character out of the middle of a URL.
  ы: 'y', э: 'e', ъ: '', ё: 'e',
};

/**
 * Turns a human name into a URL segment: `Приватний будинок, Львів` →
 * `pryvatnyy-budynok-lviv`.
 *
 * Always returns something safe for a URL, including an empty string for input
 * that transliterates to nothing at all (an emoji, say) — callers decide what an
 * empty slug means rather than having an exception thrown at them mid-keystroke,
 * since this runs on every character typed into the title field.
 */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((char) => (char in TRANSLITERATION ? TRANSLITERATION[char] : char))
    .join('')
    .normalize('NFD')
    // Strip combining accents so é becomes e rather than being dropped whole.
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** The shape the database's unique column and the public route both require. */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}
