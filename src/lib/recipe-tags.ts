const MAX_RECIPE_TAG_LENGTH = 32;

export function getRecipeTagOptions(tags: readonly string[], locale = "es"): string[] {
  const uniqueTags = new Map<string, string>();

  for (const tag of tags) {
    const normalizedTag = tag.trim();

    if (!normalizedTag) {
      continue;
    }

    const key = normalizedTag.toLocaleLowerCase(locale);

    if (!uniqueTags.has(key)) {
      uniqueTags.set(key, normalizedTag);
    }
  }

  return [...uniqueTags.values()].sort((left, right) => left.localeCompare(right, "es", { sensitivity: "base" }));
}

export function getCreatedRecipeTag(tags: readonly string[], query: string): string | undefined {
  const candidate = query.trim();

  if (!candidate || candidate.length > MAX_RECIPE_TAG_LENGTH) {
    return undefined;
  }

  const key = candidate.toLocaleLowerCase("en-US");
  const alreadyExists = tags.some((tag) => tag.trim().toLocaleLowerCase("en-US") === key);

  return alreadyExists ? undefined : candidate;
}