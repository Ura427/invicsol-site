'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { PROJECT_IMAGES } from '@/shared/lib/generated/project-images';

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
 * The candidate list is generated at build time; see
 * scripts/generate-image-manifest.ts for why it is not an fs.readdir here.
 */
export function ImagePicker({ label, hint, value, onChange }: ImagePickerProps) {
  return (
    <fieldset className="text-base sm:text-sm">
      <legend className="text-muted mb-1.5 block font-medium">{label}</legend>
      <p className="text-muted mb-3 text-xs">{hint}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PROJECT_IMAGES.map((path) => {
          const isSelected = path === value;
          return (
            <button
              key={path}
              type="button"
              onClick={() => onChange(path)}
              aria-pressed={isSelected}
              className={`relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${
                isSelected ? 'border-gold-600' : 'border-transparent hover:border-border'
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
              {/* The filename is the only thing distinguishing two similar
                  photos, so it stays visible rather than living in a tooltip. */}
              <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-left text-[10px] text-white">
                {path.split('/').pop()}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
