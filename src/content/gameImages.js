const modules = import.meta.glob("../assets/game/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

export const GAME_IMAGES = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const key = path.split("/").pop().replace(/\.[^.]+$/, "");
    return [key, url];
  }),
);
