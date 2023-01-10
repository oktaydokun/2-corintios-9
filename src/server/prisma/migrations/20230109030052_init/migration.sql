-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "congregated" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Tithe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "reference_month" TEXT NOT NULL,
    "reference_year" TEXT NOT NULL,
    CONSTRAINT "Tithe_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "reference_month" TEXT NOT NULL,
    "reference_year" TEXT NOT NULL,
    CONSTRAINT "Offer_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpenseType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expense_type_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "reference_month" TEXT NOT NULL,
    "reference_year" TEXT NOT NULL,
    CONSTRAINT "Expense_expense_type_id_fkey" FOREIGN KEY ("expense_type_id") REFERENCES "ExpenseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseType_name_key" ON "ExpenseType"("name");
