-- CreateTable
CREATE TABLE "FolderShare" (
    "id" TEXT NOT NULL,
    "folderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FolderShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FolderShare_folderId_idx" ON "FolderShare"("folderId");

-- AddForeignKey
ALTER TABLE "FolderShare" ADD CONSTRAINT "FolderShare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
