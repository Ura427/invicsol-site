-- Station.ratingValue / ratingCount held demo figures (4.8 / 12 and so on) that
-- could never become real, because there was no review system. The rating is now
-- computed from approved Review rows, so the columns go rather than drift.
--
-- StationTranslation.badge held four invented tier labels (Стартова, Популярна,
-- Розширена, Комерційна) that the company's owner had to ask the meaning of.
-- The catalogue card now shows the system type instead, which is information.

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "ratingCount",
DROP COLUMN "ratingValue";

-- AlterTable
ALTER TABLE "StationTranslation" DROP COLUMN "badge";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_stationId_status_idx" ON "Review"("stationId", "status");

-- CreateIndex
CREATE INDEX "Review_status_createdAt_idx" ON "Review"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

