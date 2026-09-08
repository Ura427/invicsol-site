'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toSlug } from '@/shared/lib/slug';
import { TextField } from '@/shared/ui/TextField';
import { Textarea } from '@/shared/ui/Textarea';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { ImagePicker } from './ImagePicker';
import { createProject, updateProject, type ProjectFormValues, type ProjectCopy } from './actions';

const EMPTY_COPY: ProjectCopy = {
  title: '',
  locationName: '',
  summary: '',
  challenge: '',
  solution: '',
  result: '',
};

const EMPTY_VALUES: ProjectFormValues = {
  slug: '',
  capacityKw: 0,
  objectType: 'house',
  usage: 'self',
  mountType: 'roof',
  completedAt: new Date().toISOString().slice(0, 10),
  coverImage: '/placeholders/project-placeholder.svg',
  isPlaceholder: true,
  uk: EMPTY_COPY,
  en: EMPTY_COPY,
};

interface ProjectFormProps {
  mode: 'create' | 'edit';
  projectId?: string;
  initialValues?: ProjectFormValues;
}

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const router = useRouter();
  const t = useTranslations('Admin.form');
  const [values, setValues] = useState<ProjectFormValues>(initialValues ?? EMPTY_VALUES);
  const [tab, setTab] = useState<'uk' | 'en'>('uk');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // An existing project keeps whatever address it already has: rederiving it
  // from an edited title would break every link already pointing at the old one.
  // Only a new project tracks the title.
  const [isSlugAuto, setIsSlugAuto] = useState(mode === 'create');
  const slug = isSlugAuto ? toSlug(values.uk.title) : values.slug;

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateCopy(locale: 'uk' | 'en', field: keyof ProjectCopy, value: string) {
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Checked here rather than left to the browser's `required`, because the
    // title may sit on the tab that is not currently showing — a native
    // validation bubble would point at a field nobody can see.
    if (values.uk.title.trim() === '') {
      setTab('uk');
      setError(t('errorTitleRequired'));
      return;
    }

    setIsSubmitting(true);
    const payload = { ...values, slug };

    try {
      const result =
        mode === 'create'
          ? await createProject(payload)
          : projectId
            ? await updateProject(projectId, payload)
            : null;

      if (result && !result.ok) {
        setError(
          result.error === 'duplicate_slug'
            ? t('errorDuplicateAddress', { slug })
            : t('errorGeneric'),
        );
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/projects');
      router.refresh();
    } catch {
      setError(t('errorGeneric'));
      setIsSubmitting(false);
    }
  }

  const copy = values[tab];

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-10">
      <section className="space-y-6">
        <h2 className="text-navy-800 text-xl">{t('sectionBasics')}</h2>

        <ImagePicker
          label={t('coverImage')}
          hint={t('coverImageHelp')}
          value={values.coverImage}
          onChange={(path) => update('coverImage', path)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="project-capacity"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            required
            label={t('capacity')}
            value={values.capacityKw || ''}
            onChange={(e) => update('capacityKw', Number(e.target.value))}
          />
          <TextField
            id="project-completed"
            type="date"
            required
            label={t('completedAt')}
            value={values.completedAt}
            onChange={(e) => update('completedAt', e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Select
            id="project-object-type"
            label={t('objectType')}
            value={values.objectType}
            onChange={(e) => update('objectType', e.target.value as ProjectFormValues['objectType'])}
          >
            <option value="house">{t('objectTypeHouse')}</option>
            <option value="business">{t('objectTypeBusiness')}</option>
          </Select>

          <Select
            id="project-usage"
            label={t('usage')}
            value={values.usage}
            onChange={(e) => update('usage', e.target.value as ProjectFormValues['usage'])}
          >
            <option value="self">{t('usageSelf')}</option>
            <option value="green-tariff">{t('usageGreenTariff')}</option>
            <option value="hybrid-backup">{t('usageHybridBackup')}</option>
          </Select>

          <Select
            id="project-mount"
            label={t('mountType')}
            value={values.mountType}
            onChange={(e) => update('mountType', e.target.value as ProjectFormValues['mountType'])}
          >
            <option value="roof">{t('mountTypeRoof')}</option>
            <option value="ground">{t('mountTypeGround')}</option>
          </Select>
        </div>

        <label className="flex items-start gap-3 text-base sm:text-sm">
          <input
            type="checkbox"
            checked={values.isPlaceholder}
            onChange={(e) => update('isPlaceholder', e.target.checked)}
            className="accent-gold-600 mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            <span className="text-navy-800 font-medium">{t('isPlaceholder')}</span>
            <span className="text-muted mt-1 block text-xs leading-relaxed">
              {t('isPlaceholderHelp')}
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-navy-800 text-xl">{t('sectionCopy')}</h2>

          {/* Tabs rather than two stacked blocks. Ten textareas on one page made
              the form read as far more work than it is, and nothing about the
              two languages needs comparing side by side while typing. */}
          <div
            className="border-border flex rounded-[var(--radius-pill)] border p-0.5"
            role="tablist"
          >
            {(['uk', 'en'] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                role="tab"
                aria-selected={tab === locale}
                onClick={() => setTab(locale)}
                className={`rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === locale ? 'bg-navy-800 text-white' : 'text-muted hover:text-navy-800'
                }`}
              >
                {locale === 'uk' ? t('tabUk') : t('tabEn')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <TextField
            id={`project-title-${tab}`}
            label={t('title')}
            hint={t('titleHelp')}
            required={tab === 'uk'}
            value={copy.title}
            onChange={(e) => updateCopy(tab, 'title', e.target.value)}
          />

          <TextField
            id={`project-location-${tab}`}
            label={t('location')}
            hint={t('locationHelp')}
            value={copy.locationName}
            onChange={(e) => updateCopy(tab, 'locationName', e.target.value)}
          />

          <Textarea
            id={`project-summary-${tab}`}
            label={t('summary')}
            hint={t('summaryHelp')}
            rows={2}
            value={copy.summary}
            onChange={(e) => updateCopy(tab, 'summary', e.target.value)}
          />
          <Textarea
            id={`project-challenge-${tab}`}
            label={t('challenge')}
            hint={t('challengeHelp')}
            rows={2}
            value={copy.challenge}
            onChange={(e) => updateCopy(tab, 'challenge', e.target.value)}
          />
          <Textarea
            id={`project-solution-${tab}`}
            label={t('solution')}
            hint={t('solutionHelp')}
            rows={2}
            value={copy.solution}
            onChange={(e) => updateCopy(tab, 'solution', e.target.value)}
          />
          <Textarea
            id={`project-result-${tab}`}
            label={t('result')}
            hint={t('resultHelp')}
            rows={2}
            value={copy.result}
            onChange={(e) => updateCopy(tab, 'result', e.target.value)}
          />
        </div>
      </section>

      <section className="border-border space-y-3 border-t pt-6">
        <p className="text-muted text-base font-medium sm:text-sm">{t('address')}</p>

        {isSlugAuto ? (
          <div className="flex flex-wrap items-center gap-3">
            <code className="bg-surface text-navy-800 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm">
              /projects/{slug || '…'}
            </code>
            <button
              type="button"
              onClick={() => {
                update('slug', slug);
                setIsSlugAuto(false);
              }}
              className="text-navy-800 hover:text-gold-700 text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t('addressEdit')}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[16rem] flex-1">
              <TextField
                id="project-slug"
                label={t('address')}
                pattern="[a-z0-9-]+"
                value={values.slug}
                onChange={(e) => update('slug', e.target.value)}
              />
            </div>
            {mode === 'create' ? (
              <button
                type="button"
                onClick={() => setIsSlugAuto(true)}
                className="text-navy-800 hover:text-gold-700 pb-3 text-sm font-medium underline underline-offset-4 transition-colors"
              >
                {t('addressAuto')}
              </button>
            ) : null}
          </div>
        )}

        <p className="text-muted text-xs">{t('addressHelp')}</p>
      </section>

      {error ? (
        <p className="text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('saving') : mode === 'create' ? t('create') : t('save')}
      </Button>
    </form>
  );
}
