import { PartialType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { Company } from "@db/app/entities/company/company.entity";

export class CreatedCompanyDto extends PartialType(Company) {
    @Exclude()
    id: number;

    constructor(partial: Partial<Company>) {
        super();
        Object.assign(this, partial);
    }
}
