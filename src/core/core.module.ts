import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationBootstrapOptions } from "src/common/application-bootstrap-options.interface";
import { EVENT_STORE_CONNECTION } from "./core.constants";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27018/vf-event-store", {
      connectionName: EVENT_STORE_CONNECTION,
      directConnection: true,
    }),
  ],
})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === "orm"
        ? [
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DATABASE_HOST"),
                port: configService.get("DATABASE_PORT"),
                username: configService.get("DATABASE_USERNAME"),
                password: configService.get("DATABASE_PASSWORD"),
                database: configService.get("DATABASE_NAME"),
                logging: true,
                autoLoadEntities: true,
                synchronize: true,
              }),
            }),
            MongooseModule.forRoot("mongodb://localhost:27017/vf-read-db"),
          ]
        : [];
  }
}
