import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1776943203077 implements MigrationInterface {
    name = 'Initialize1776943203077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "path" varchar NOT NULL, "method" varchar NOT NULL, "body" text NOT NULL, "active" boolean NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "endpoint"`);
    }

}
