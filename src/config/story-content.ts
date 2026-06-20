import { links } from "@/src/config/links";
import { stories } from "@/src/data/stories";

export const behindTheDream = [
  {
    image: "/images/portfolio/portfolio-02.jpg",
  },
  {
    image: "/images/portfolio/portfolio-12.jpg",
  },
  {
    image: "/images/story-akaza-process.jpg",
  },
  {
    image: "/images/portfolio/portfolio-08.jpg",
  },
] as const;

export const collectorStories = stories.map((story) => ({
  slug: story.slug,
  image: story.heroImage,
  heroImage: story.galleryImages[1] ?? story.heroImage,
  gallery: story.galleryImages,
  story,
}));

export const videoGallery = [
  {
    image: "/images/portfolio/portfolio-24.jpg",
    href: links.youtube,
    embedUrl: "",
  },
  {
    image: "/images/height-comparison.png",
    href: links.youtube,
    embedUrl: "",
  },
  {
    image: "/images/room-preview.png",
    href: links.youtube,
    embedUrl: "",
  },
] as const;

export const instagramFeed = [
  {
    image: "/images/portfolio/portfolio-25.jpg",
    href: links.instagram,
  },
  {
    image: "/images/portfolio/portfolio-23.jpg",
    href: links.instagram,
  },
  {
    image: "/images/portfolio/portfolio-17.jpg",
    href: links.instagram,
  },
  {
    image: "/images/portfolio/portfolio-24.jpg",
    href: links.instagram,
  },
] as const;
