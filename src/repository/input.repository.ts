import { EntityRepository, Repository } from "typeorm";
import { Input } from "@/entity";

@EntityRepository(Input)
export class InputRepository extends Repository<Input> {}
