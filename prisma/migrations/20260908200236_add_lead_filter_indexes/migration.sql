-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_contactMethod_idx" ON "Lead"("contactMethod");

-- CreateIndex
CREATE INDEX "Lead_handledAt_idx" ON "Lead"("handledAt");

-- CreateIndex
CREATE INDEX "Lead_notifiedAt_idx" ON "Lead"("notifiedAt");
