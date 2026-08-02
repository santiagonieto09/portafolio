import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Newspaper,
  Twitter,
  Youtube,
} from "lucide-react";
import type { SocialLink } from "@/domain/github/types";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
  blog: Newspaper,
  email: Mail,
} as const;

export function SocialButtons({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Redes y enlaces externos">
      {links.map((link) => {
        const Icon = ICONS[link.kind] ?? Globe;
        return (
          <li key={link.url}>
            <a
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer me"
              className="skeu-btn"
              aria-label={`Abrir ${link.label}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
