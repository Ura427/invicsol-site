-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "commercialIsPlaceholder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inStock" BOOLEAN,
ADD COLUMN     "priceEquipmentUah" INTEGER,
ADD COLUMN     "priceInstallMaxUah" INTEGER,
ADD COLUMN     "priceInstallMinUah" INTEGER,
ADD COLUMN     "ratingCount" INTEGER,
ADD COLUMN     "ratingValue" DOUBLE PRECISION;
