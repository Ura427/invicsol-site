-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "powerKw" REAL,
    "systemType" TEXT NOT NULL,
    "accent" TEXT NOT NULL DEFAULT 'default',
    "sortOrder" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "StationTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "suitableFor" TEXT NOT NULL,
    "outcomes" TEXT NOT NULL,
    "kitMain" TEXT NOT NULL,
    "kitExtra" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "specPurpose" TEXT NOT NULL,
    "specScalability" TEXT NOT NULL,
    CONSTRAINT "StationTranslation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "capacityKw" REAL NOT NULL,
    "objectType" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "mountType" TEXT NOT NULL,
    "locationKey" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL,
    "coverImage" TEXT NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ProjectTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "notifiedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_slug_key" ON "Station"("slug");

-- CreateIndex
CREATE INDEX "Station_sortOrder_idx" ON "Station"("sortOrder");

-- CreateIndex
CREATE INDEX "StationTranslation_locale_idx" ON "StationTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "StationTranslation_stationId_locale_key" ON "StationTranslation"("stationId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_objectType_idx" ON "Project"("objectType");

-- CreateIndex
CREATE INDEX "Project_usage_idx" ON "Project"("usage");

-- CreateIndex
CREATE INDEX "Project_capacityKw_idx" ON "Project"("capacityKw");

-- CreateIndex
CREATE INDEX "Project_completedAt_idx" ON "Project"("completedAt");

-- CreateIndex
CREATE INDEX "ProjectTranslation_locale_idx" ON "ProjectTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_locale_key" ON "ProjectTranslation"("projectId", "locale");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_sortOrder_idx" ON "ProjectImage"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
