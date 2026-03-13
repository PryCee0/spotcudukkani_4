-- v6.0 Migration: Add viewCount column to products table for statistics
ALTER TABLE `products` ADD COLUMN `viewCount` int NOT NULL DEFAULT 0;
