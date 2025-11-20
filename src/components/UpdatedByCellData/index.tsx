import type { DefaultServerCellComponentProps } from 'payload';

export default async function UpdatedByCellData({ cellData, payload }: DefaultServerCellComponentProps) {
  if (!cellData || (Array.isArray(cellData) && cellData.length === 0)) {
    return <span />;
  }

  // helper to resolve value (string ID or object) to a label
  const resolveLabel = async (v: unknown): Promise<String | undefined> => {
    // if it's an object (populated), prefer email, fallback to id
    if (typeof v === 'object' && v !== null) {
      const obj = v as { email?: string; id?: string }
      return obj.email ?? obj.id;
    }

    // if it's a string, treat as user ID and fetch
    if (typeof v === 'string' || typeof v === 'number') {
      const id = String(v);
      try {
        const user = await payload.findByID({
          collection: 'users',
          id,
        });
        return user?.email ?? user?.id;
      } catch {
        // if fetch fails fall back to the raw value
        return id;
      }
    }

    return undefined;
  }

  if (Array.isArray(cellData)) {
    const labels = await Promise.all(cellData.map(resolveLabel));
    return <span>{labels.filter(Boolean).join(', ')}</span>;
  }

  const label = await resolveLabel(cellData);
  return <span>{label ?? ''}</span>;
}
