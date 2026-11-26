CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_blocks` (
	`key` text PRIMARY KEY NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`title_bn` text DEFAULT '' NOT NULL,
	`subtitle_en` text DEFAULT '' NOT NULL,
	`subtitle_bn` text DEFAULT '' NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`body_bn` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`data_json` text DEFAULT '{}' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feature_items` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text DEFAULT 'ShieldCheck' NOT NULL,
	`title_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`description_en` text NOT NULL,
	`description_bn` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `footer_columns` (
	`id` text PRIMARY KEY NOT NULL,
	`title_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `footer_links` (
	`id` text PRIMARY KEY NOT NULL,
	`column_id` text NOT NULL,
	`label_en` text NOT NULL,
	`label_bn` text NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `footer_columns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `footer_links_column_idx` ON `footer_links` (`column_id`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`locale` text DEFAULT 'bn' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nav_links` (
	`id` text PRIMARY KEY NOT NULL,
	`label_en` text NOT NULL,
	`label_bn` text NOT NULL,
	`href` text NOT NULL,
	`location` text DEFAULT 'header' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`package_id` text,
	`package_name_en` text NOT NULL,
	`package_name_bn` text NOT NULL,
	`amount_bdt` integer NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_email` text DEFAULT '' NOT NULL,
	`customer_address` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`language` text DEFAULT 'bn' NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`bkash_sender_number` text DEFAULT '' NOT NULL,
	`bkash_trx_id` text DEFAULT '' NOT NULL,
	`ssl_tran_id` text DEFAULT '' NOT NULL,
	`ssl_val_id` text DEFAULT '' NOT NULL,
	`ssl_session_key` text DEFAULT '' NOT NULL,
	`ssl_validation_json` text DEFAULT '' NOT NULL,
	`admin_notes` text DEFAULT '' NOT NULL,
	`paid_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_number_idx` ON `orders` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_bkash_trx_idx` ON `orders` (`bkash_trx_id`) WHERE bkash_trx_id <> '';--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_payment_status_idx` ON `orders` (`payment_status`);--> statement-breakpoint
CREATE TABLE `packages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name_en` text NOT NULL,
	`name_bn` text NOT NULL,
	`description_en` text NOT NULL,
	`description_bn` text NOT NULL,
	`price_bdt` integer NOT NULL,
	`features_en` text DEFAULT '[]' NOT NULL,
	`features_bn` text DEFAULT '[]' NOT NULL,
	`icon` text DEFAULT 'Globe' NOT NULL,
	`tint` text DEFAULT 'mint' NOT NULL,
	`delivery_days` integer DEFAULT 7 NOT NULL,
	`revisions` integer DEFAULT 2 NOT NULL,
	`popular` integer DEFAULT false NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_idx` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `pages` (
	`slug` text PRIMARY KEY NOT NULL,
	`title_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`content_en` text DEFAULT '' NOT NULL,
	`content_bn` text DEFAULT '' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name_en` text NOT NULL,
	`name_bn` text NOT NULL,
	`kind` text DEFAULT 'badge' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`color` text DEFAULT '#e2136e' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_methods_key_idx` ON `payment_methods` (`key`);--> statement-breakpoint
CREATE TABLE `payment_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`ssl_enabled` integer DEFAULT false NOT NULL,
	`ssl_store_id` text DEFAULT '' NOT NULL,
	`ssl_store_password` text DEFAULT '' NOT NULL,
	`ssl_is_live` integer DEFAULT false NOT NULL,
	`bkash_enabled` integer DEFAULT true NOT NULL,
	`bkash_number` text DEFAULT '01712631560' NOT NULL,
	`bkash_instructions_en` text DEFAULT 'Send Money / Payment to the bKash number below, then submit your sender number and TrxID.' NOT NULL,
	`bkash_instructions_bn` text DEFAULT 'নিচের বিকাশ নম্বরে Send Money / Payment করুন, তারপর আপনার সেন্ডার নম্বর ও TrxID জমা দিন।' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`description_bn` text DEFAULT '' NOT NULL,
	`category_en` text DEFAULT 'Business Website' NOT NULL,
	`category_bn` text DEFAULT 'বিজনেস ওয়েবসাইট' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`live_url` text DEFAULT '' NOT NULL,
	`tech_stack` text DEFAULT '[]' NOT NULL,
	`client_name_en` text DEFAULT '' NOT NULL,
	`client_name_bn` text DEFAULT '' NOT NULL,
	`trust_note_en` text DEFAULT '' NOT NULL,
	`trust_note_bn` text DEFAULT '' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `portfolio_featured_idx` ON `portfolio_items` (`featured`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`site_name` text DEFAULT 'tech.silkcitygroup.com.bd' NOT NULL,
	`brand_name` text DEFAULT 'Silk City Tech' NOT NULL,
	`brand_name_bn` text DEFAULT 'সিল্ক সিটি টেক' NOT NULL,
	`logo_url` text DEFAULT '' NOT NULL,
	`favicon_url` text DEFAULT '/icon.svg' NOT NULL,
	`phone` text DEFAULT '01712631560' NOT NULL,
	`whatsapp_url` text DEFAULT 'https://wa.me/8801712631560' NOT NULL,
	`email` text DEFAULT 'info@silkcitygroup.com.bd' NOT NULL,
	`address_en` text DEFAULT 'Mango Tower, Sopura, Boalia, Rajshahi-6203' NOT NULL,
	`address_bn` text DEFAULT 'ম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩' NOT NULL,
	`facebook_url` text DEFAULT 'https://facebook.com/' NOT NULL,
	`instagram_url` text DEFAULT 'https://instagram.com/' NOT NULL,
	`linkedin_url` text DEFAULT 'https://linkedin.com/' NOT NULL,
	`youtube_url` text DEFAULT 'https://youtube.com/' NOT NULL,
	`seo_title_en` text DEFAULT 'Silk City Tech — Website & Web Solution Partner in Rajshahi' NOT NULL,
	`seo_title_bn` text DEFAULT 'সিল্ক সিটি টেক — রাজশাহীর ওয়েবসাইট ও ওয়েব সলিউশন পার্টনার' NOT NULL,
	`seo_description_en` text DEFAULT 'Business websites, e-commerce, custom web apps, SEO and support from Silk City Tech, Rajshahi.' NOT NULL,
	`seo_description_bn` text DEFAULT 'রাজশাহীর সিল্ক সিটি টেক থেকে বিজনেস ওয়েবসাইট, ই-কমার্স, কাস্টম ওয়েব অ্যাপ, এসইও ও সাপোর্ট নিন।' NOT NULL,
	`seo_keywords` text DEFAULT 'website development rajshahi, silk city tech, e-commerce website, web app bangladesh' NOT NULL,
	`og_image_url` text DEFAULT '/og.svg' NOT NULL,
	`google_verification` text DEFAULT '' NOT NULL,
	`footer_text_en` text DEFAULT 'Websites, web apps and digital growth — built with care in Rajshahi.' NOT NULL,
	`footer_text_bn` text DEFAULT 'রাজশাহীতে যত্নে তৈরি ওয়েবসাইট, ওয়েব অ্যাপ ও ডিজিটাল গ্রোথ সলিউশন।' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` text PRIMARY KEY NOT NULL,
	`label_en` text NOT NULL,
	`label_bn` text NOT NULL,
	`value` integer DEFAULT 0 NOT NULL,
	`suffix_en` text DEFAULT '+' NOT NULL,
	`suffix_bn` text DEFAULT '+' NOT NULL,
	`icon` text DEFAULT 'Users' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `why_items` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text DEFAULT 'Sparkles' NOT NULL,
	`title_en` text NOT NULL,
	`title_bn` text NOT NULL,
	`description_en` text NOT NULL,
	`description_bn` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
