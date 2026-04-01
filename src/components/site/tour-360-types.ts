export type TourScene = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type TourSceneLike = Partial<TourScene> & {
  title?: unknown;
  description?: unknown;
  image?: unknown;
  id?: unknown;
};

function getSceneTitle(index: number) {
  return index === 0 ? "Piscina panorâmica" : `Cena 360 ${index + 1}`;
}

function getSceneDescription(index: number, fallbackDescription?: string) {
  if (index === 0 && fallbackDescription?.trim()) {
    return fallbackDescription.trim();
  }

  return `Cena panorâmica ${index + 1} publicada para apresentar o hotel com uma leitura mais imersiva.`;
}

function normalizeScene(raw: unknown, index: number, fallbackDescription?: string): TourScene | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const scene = raw as TourSceneLike;
  const image = typeof scene.image === "string" ? scene.image.trim() : "";

  if (!image) {
    return null;
  }

  return {
    id:
      typeof scene.id === "string" && scene.id.trim()
        ? scene.id.trim()
        : `tour-scene-${index + 1}`,
    title:
      typeof scene.title === "string" && scene.title.trim()
        ? scene.title.trim()
        : getSceneTitle(index),
    description:
      typeof scene.description === "string" && scene.description.trim()
        ? scene.description.trim()
        : getSceneDescription(index, fallbackDescription),
    image,
  };
}

export function buildTourScenes(
  rawScenes: unknown,
  fallbackImages: Array<string | null | undefined>,
  fallbackDescription?: string,
) {
  const parsedScenes = Array.isArray(rawScenes)
    ? rawScenes
        .map((scene, index) => normalizeScene(scene, index, fallbackDescription))
        .filter((scene): scene is TourScene => Boolean(scene))
    : [];

  const sourceScenes =
    parsedScenes.length > 0
      ? parsedScenes
      : Array.from(new Set(fallbackImages.filter((value): value is string => Boolean(value?.trim())))).map(
          (image, index) => ({
            id: `tour-scene-${index + 1}`,
            title: getSceneTitle(index),
            description: getSceneDescription(index, fallbackDescription),
            image,
          }),
        );

  const seenImages = new Set<string>();

  return sourceScenes.filter((scene) => {
    if (seenImages.has(scene.image)) {
      return false;
    }

    seenImages.add(scene.image);
    return true;
  });
}
