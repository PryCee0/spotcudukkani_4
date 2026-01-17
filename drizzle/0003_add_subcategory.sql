-- Migration: Add subCategory column to products table
ALTER TABLE `products` ADD COLUMN `subCategory` varchar(100) DEFAULT NULL;
