-- Backfills locationName for rows written before the column existed, from the
-- display names that until now lived only in messages/*.json under
-- Projects.locations. A data migration rather than a seed edit: the seed
-- deliberately does not overwrite translation rows on re-run, because those are
-- admin-editable and re-seeding must not clobber someone's edits.
--
-- Guarded on locationName = '' so it is idempotent and can never overwrite a
-- name typed in the admin panel.
UPDATE "ProjectTranslation" AS t
SET "locationName" = v.name
FROM (
  VALUES
    ('bryukhovychi', 'uk', 'Брюховичі'),
    ('bryukhovychi', 'en', 'Bryukhovychi'),
    ('lviv',         'uk', 'Львів'),
    ('lviv',         'en', 'Lviv'),
    ('horodok',      'uk', 'Городоцький р-н'),
    ('horodok',      'en', 'Horodok district'),
    ('sokilnyky',    'uk', 'Сокільники'),
    ('sokilnyky',    'en', 'Sokilnyky')
) AS v(location_key, locale, name)
JOIN "Project" AS p ON p."locationKey" = v.location_key
WHERE t."projectId" = p.id
  AND t.locale = v.locale
  AND t."locationName" = '';
