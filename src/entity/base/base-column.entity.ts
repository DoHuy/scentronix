import { IsDate, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

const TIMESTAMP_TYPE = "timestamp without time zone";

export abstract class BaseColumn {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  public id: string;

  @Column({ type: TIMESTAMP_TYPE, default: () => "CURRENT_TIMESTAMP" })
  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  public createdAt: Date;

  @Column({ type: TIMESTAMP_TYPE, default: () => "CURRENT_TIMESTAMP" })
  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  public updatedAt: Date;
}
