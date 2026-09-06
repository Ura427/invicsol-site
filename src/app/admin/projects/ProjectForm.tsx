'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject, type ProjectFormValues } from './actions';

const OBJECT_TYPES = ['house', 'business'] as const;
const USAGE_TYPES = ['self', 'green-tariff', 'hybrid-backup'] as const;
const MOUNT_TYPES = ['roof', 'ground'] as const;

const EMPTY_VALUES: ProjectFormValues = {
  slug: '',
  capacityKw: 0,
  objectType: 'house',
  usage: 'self',
  mountType: 'roof',
  locationKey: '',
  completedAt: new Date().toISOString().slice(0, 10),
  coverImage: '/placeholders/project-placeholder.svg',
  isPlaceholder: true,
  uk: { title: '', summary: '', challenge: '', solution: '', result: '' },
  en: { title: '', summary: '', challenge: '', solution: '', result: '' },
};

interface ProjectFormProps {
  mode: 'create' | 'edit';
  projectId?: string;
  initialValues?: ProjectFormValues;
}

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>(initialValues ?? EMPTY_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateTranslation(
    locale: 'uk' | 'en',
    field: keyof ProjectFormValues['uk'],
    value: string,
  ) {
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createProject(values);
      } else if (projectId) {
        await updateProject(projectId, values);
      }
      router.push('/admin/projects');
      router.refresh();
    } catch {
      setError('Could not save. Check the fields and try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Facts</h2>

        <label className="block text-sm">
          <span className="font-medium text-gray-700">Slug (URL, unique, no spaces)</span>
          <input
            type="text"
            required
            pattern="[a-z0-9-]+"
            value={values.slug}
            onChange={(e) => update('slug', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Capacity (kW)</span>
            <input
              type="number"
              required
              min={0}
              step={0.1}
              value={values.capacityKw}
              onChange={(e) => update('capacityKw', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Completed on</span>
            <input
              type="date"
              required
              value={values.completedAt}
              onChange={(e) => update('completedAt', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Object type</span>
            <select
              value={values.objectType}
              onChange={(e) => update('objectType', e.target.value as ProjectFormValues['objectType'])}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {OBJECT_TYPES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Usage</span>
            <select
              value={values.usage}
              onChange={(e) => update('usage', e.target.value as ProjectFormValues['usage'])}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {USAGE_TYPES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Mount</span>
            <select
              value={values.mountType}
              onChange={(e) => update('mountType', e.target.value as ProjectFormValues['mountType'])}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {MOUNT_TYPES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-medium text-gray-700">
            Location key (locale-neutral, e.g. &quot;lviv&quot; — add its translated name to
            messages/*.json under Projects.locations)
          </span>
          <input
            type="text"
            required
            value={values.locationKey}
            onChange={(e) => update('locationKey', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-gray-700">Cover image path (under public/)</span>
          <input
            type="text"
            required
            value={values.coverImage}
            onChange={(e) => update('coverImage', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isPlaceholder}
            onChange={(e) => update('isPlaceholder', e.target.checked)}
          />
          <span className="font-medium text-gray-700">
            Placeholder (shows a &quot;demo content&quot; badge on the public site — uncheck once
            this is real, verified work)
          </span>
        </label>
      </section>

      {(['uk', 'en'] as const).map((locale) => (
        <section key={locale} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">
            {locale === 'uk' ? 'Ukrainian copy' : 'English copy'}
          </h2>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Title</span>
            <input
              type="text"
              required
              value={values[locale].title}
              onChange={(e) => updateTranslation(locale, 'title', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Summary (card blurb)</span>
            <textarea
              required
              rows={2}
              value={values[locale].summary}
              onChange={(e) => updateTranslation(locale, 'summary', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Challenge</span>
            <textarea
              required
              rows={2}
              value={values[locale].challenge}
              onChange={(e) => updateTranslation(locale, 'challenge', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Solution</span>
            <textarea
              required
              rows={2}
              value={values[locale].solution}
              onChange={(e) => updateTranslation(locale, 'solution', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Result</span>
            <textarea
              required
              rows={2}
              value={values[locale].result}
              onChange={(e) => updateTranslation(locale, 'result', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
        </section>
      ))}

      {error ? (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-gray-900 px-6 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create project' : 'Save changes'}
      </button>
    </form>
  );
}
