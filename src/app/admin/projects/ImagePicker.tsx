'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Check, Upload } from 'lucide-react';
import { PROJECT_IMAGES } from '@/shared/lib/generated/project-images';
import { uploadProjectPhoto } from './upload-actions';

interface ImagePickerProps {
  label: string;
  hint: string;
  value: string;
  onChange: (path: string) => void;
}

/**
 * Replaces a text input that asked for "Cover image path (under public/)" — a
 * question only someone who had read the repository could answer, and the field
 * most responsible for the form being unusable by its owner.
 *
 * The listed candidates come from a build-time manifest; see
 * scripts/generate-image-manifest.ts for why that is not an fs.readdir here.
 * Anything uploaded during this session is held in local state and shown
 * alongside them, so the new photo is pickable immediately rather than after a
 * rebuild regenerates the manifest.
 */
export function ImagePicker({ label, hint, value, onChange }: ImagePickerProps) {
  const t = useTranslations('Admin.form');
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadProjectPhoto(formData);

    setIsUploading(false);
    // Cleared either way, so picking the same file twice after a failure still
    // fires a change event.
    if (inputRef.current) inputRef.current.value = '';

    if (!result.ok) {
      setError(t(`uploadError_${result.error}`));
      return;
    }

    setUploaded((prev) => [result.path, ...prev]);
    onChange(result.path);
  }

  const choices = [...uploaded, ...PROJECT_IMAGES];

  return (
    <fieldset className="text-base sm:text-sm">
      <legend className="text-muted mb-1.5 block font-medium">{label}</legend>
      <p className="text-muted mb-3 text-xs">{hint}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {choices.map((path) => {
          const isSelected = path === value;
          return (
            <button
              key={path}
              type="button"
              onClick={() => onChange(path)}
              aria-pressed={isSelected}
              className={`relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${
                isSelected ? 'border-gold-600' : 'hover:border-border border-transparent'
              }`}
            >
              <Image
                src={path}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 200px"
                className="bg-surface object-cover"
              />
              {isSelected ? (
                <span className="bg-gold-600 absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
              ) : null}
              {/* The filename is the only thing separating two similar photos,
                  so it stays visible rather than living in a tooltip. */}
              <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-left text-[10px] text-white">
                {path.split('/').pop()}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="border-border text-muted hover:border-gold-600 hover:text-gold-700 flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-dashed transition-colors disabled:opacity-60"
        >
          <Upload className="h-5 w-5" aria-hidden />
          <span className="px-2 text-center text-xs">
            {isUploading ? t('uploading') : t('uploadPhoto')}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
      />

      {error ? (
        <p className="mt-3 text-xs text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
