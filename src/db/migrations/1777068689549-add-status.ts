import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatus1777068689549 implements MigrationInterface {
    name = 'AddStatus1777068689549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_endpoint" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "path" varchar NOT NULL, "method" varchar NOT NULL, "body" text NOT NULL, "active" boolean NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "status" integer NOT NULL DEFAULT (200))`);
        await queryRunner.query(`INSERT INTO "temporary_endpoint"("id", "name", "path", "method", "body", "active", "sort_order") SELECT "id", "name", "path", "method", "body", "active", "sort_order" FROM "endpoint"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
        await queryRunner.query(`ALTER TABLE "temporary_endpoint" RENAME TO "endpoint"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" RENAME TO "temporary_endpoint"`);
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "path" varchar NOT NULL, "method" varchar NOT NULL, "body" text NOT NULL, "active" boolean NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "endpoint"("id", "name", "path", "method", "body", "active", "sort_order") SELECT "id", "name", "path", "method", "body", "active", "sort_order" FROM "temporary_endpoint"`);
        await queryRunner.query(`DROP TABLE "temporary_endpoint"`);
    }

}
