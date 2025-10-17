-- CreateTable
CREATE TABLE `SleepLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dateOfSession` DATETIME(3) NOT NULL,
    `timeInBed` DATETIME(3) NOT NULL,
    `wakeUpTime` DATETIME(3) NOT NULL,
    `sleepQuality` INTEGER NOT NULL,
    `mood` VARCHAR(191) NULL,
    `caffeineIntake` BOOLEAN NULL,
    `alcoholIntake` BOOLEAN NULL,
    `workout` BOOLEAN NULL,
    `heavyMeal` BOOLEAN NULL,
    `lateScreenTime` BOOLEAN NULL,
    `stressfulDay` BOOLEAN NULL,
    `notes` VARCHAR(191) NULL,
    `duration` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SleepLog` ADD CONSTRAINT `SleepLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
