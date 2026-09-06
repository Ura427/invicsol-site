import type { ArticleBlock } from '@/entities/article/parse';

export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) =>
        block.type === 'heading' ? (
          <h2 key={index} className="text-navy-800 pt-2 text-xl font-bold">
            {block.text}
          </h2>
        ) : (
          <p key={index} className="text-muted leading-relaxed">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
