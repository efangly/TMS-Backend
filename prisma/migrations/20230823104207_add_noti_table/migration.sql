-- CreateTable
CREATE TABLE `Notification` (
    `NotiId` VARCHAR(191) NOT NULL,
    `NotiName` VARCHAR(191) NOT NULL,
    `NotiDetail` VARCHAR(191) NOT NULL,
    `NotiStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`NotiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
