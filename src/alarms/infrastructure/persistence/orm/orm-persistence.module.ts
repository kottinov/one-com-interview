import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateAlarmRepository } from "src/alarms/application/ports/create-alarm.repository";
import { AlarmEntity } from "./entities/alarm-entity";
import { OrmCreateAlarmRepository } from "./repositories/create-alarm.repository";
import { AlarmItemEntity } from "./entities/alarm-item.entity";
import { FindAlarmsRepository } from "src/alarms/application/ports/find-alarm.repository";
import { OrmFindAlarmsRepository } from "./repositories/find-alarms.repository";
import { UpsertMaterializedAlarmRepository } from "src/alarms/application/ports/upsert-materialized-alarm.repository";
import { OrmUpsertMaterializedAlarmRepository } from "./repositories/upsert-materialized-alarm.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
  MaterializedAlarmView,
  MaterializedAlarmViewSchema,
} from "./schemas/materialized-alarm-view.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmEntity, AlarmItemEntity]),
    MongooseModule.forFeature([
      { name: MaterializedAlarmView.name, schema: MaterializedAlarmViewSchema },
    ]),
  ],
  providers: [
    {
      provide: CreateAlarmRepository,
      useExisting: OrmCreateAlarmRepository,
    },
    {
      provide: FindAlarmsRepository,
      useExisting: OrmFindAlarmsRepository,
    },
    {
      provide: UpsertMaterializedAlarmRepository,
      useExisting: OrmUpsertMaterializedAlarmRepository,
    },
  ],
  exports: [
    CreateAlarmRepository,
    FindAlarmsRepository,
    UpsertMaterializedAlarmRepository,
  ],
})
export class OrmAlarmPersistenceModule {}
