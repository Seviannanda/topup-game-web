-- AlterTable
ALTER TABLE `game` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
