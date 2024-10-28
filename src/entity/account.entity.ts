import { Column, Entity } from "typeorm";
import { BaseColumn } from "./base";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class Account extends BaseColumn {
  constructor(partial?: Partial<Account>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: "varchar", length: 255, unique: true })
  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "The email is required" })
  public email!: string;

  @Column({ type: "varchar", length: 255 })
  @IsNotEmpty({ message: "The password is required" })
  public password!: string;

  @Column({ type: "varchar", length: 50 })
  @IsNotEmpty({ message: "The zodiacSign is required" })
  public zodiacSign!: string;
}
