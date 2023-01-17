/*
  Warnings:

  - You are about to drop the `ExpenseType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `expense_type_id` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `expense_category_id` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ExpenseType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExpenseType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expense_category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "reference_month" TEXT NOT NULL,
    "reference_year" TEXT NOT NULL,
    CONSTRAINT "Expense_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "ExpenseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("id", "reference_month", "reference_year", "title", "value") SELECT "id", "reference_month", "reference_year", "title", "value" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON "ExpenseCategory"("name");
