-- CreateEnum
CREATE TYPE "CustomOrderStatus" AS ENUM ('PENDING', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "custom_orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "servings" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "flavors" TEXT,
    "colors" TEXT,
    "theme" TEXT,
    "specialRequests" TEXT,
    "referenceImages" TEXT[],
    "status" "CustomOrderStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "quotedPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "custom_orders" ADD CONSTRAINT "custom_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
