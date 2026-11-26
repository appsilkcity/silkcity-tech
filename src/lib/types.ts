export type Lang = "bn" | "en";

export type BlockKey = "hero" | "why" | "services" | "features" | "cta" | "stats" | "portfolio" | "payments";

export interface BlockData {
  badgeEn?: string;
  badgeBn?: string;
  primaryEn?: string;
  primaryBn?: string;
  secondaryEn?: string;
  secondaryBn?: string;
}

export interface ContentBlockView {
  key: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  bodyEn: string;
  bodyBn: string;
  imageUrl: string;
  data: BlockData;
  updatedAt: Date;
}

export interface PackageView {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  priceBdt: number;
  featuresEn: string[];
  featuresBn: string[];
  icon: string;
  tint: "pink" | "lavender" | "mint" | "cream" | "cyan" | "peach" | "rose" | "sky";
  deliveryDays: number;
  revisions: number;
  popular: boolean;
  visible: boolean;
  sortOrder: number;
}

export interface PortfolioView {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  categoryEn: string;
  categoryBn: string;
  imageUrl: string;
  liveUrl: string;
  techStack: string[];
  clientNameEn: string;
  clientNameBn: string;
  trustNoteEn: string;
  trustNoteBn: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
}

export interface PublicPaymentSettings {
  sslEnabled: boolean;
  bkashEnabled: boolean;
  bkashNumber: string;
  bkashInstructionsEn: string;
  bkashInstructionsBn: string;
}

export interface FooterColumnView {
  id: string;
  titleEn: string;
  titleBn: string;
  sortOrder: number;
  visible: boolean;
  links: {
    id: string;
    labelEn: string;
    labelBn: string;
    href: string;
    sortOrder: number;
    visible: boolean;
  }[];
}
