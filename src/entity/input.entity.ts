import { Column, Entity } from "typeorm";
import { BaseColumn } from "./base";
import { IsJSON, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Value {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}

@Entity()
export class Input extends BaseColumn {
  constructor(partial?: Partial<Input>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: "jsonb", nullable: false, default: () => "'[]'" })
  @IsJSON()
  public values: Array<Value>;
}
