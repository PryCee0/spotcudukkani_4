-- v4.0 Migration: Add images JSON field for multiple product photos
ALTER TABLE `products` ADD COLUMN `images` json DEFAULT NULL;
