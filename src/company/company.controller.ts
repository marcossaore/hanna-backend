import {
    Controller,
    Post,
    Get,
    Render,
    Res,
    Query,
    Body,
    ConflictException,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatedCompanyDto } from './dto/created-company.dto';
import { InfoMessageInterceptor } from '../_common/interceptors/info-message-interceptor';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CompanyService } from './company.service';
import { configAppPrefix } from '../app/application.prefixes';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';


@Controller(`${configAppPrefix}/companies`)
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly generateUuidService: GenerateUuidService,
        @InjectQueue('create-company')
        private readonly createCompanyQueue: Queue,
    ) {}

    @UseInterceptors(
        new InfoMessageInterceptor(
            'Em breve você receberá um email com instruções de login!',
        ),
        ClassSerializerInterceptor,
    )
    @Post()
    @HttpCode(202)
    async create(
        @Body() createCompanyDto: CreateCompanyDto,
    ): Promise<CreatedCompanyDto> {
        const companyAlreadyExists = await this.companyService.exists(createCompanyDto.document);
        if (companyAlreadyExists) {
            throw new ConflictException('A empresa já está cadastrada!');
        }
        const companyIdentifierAlreadyExists = await this.companyService.existsIdentifier(createCompanyDto.companyIdentifier);
        if (companyIdentifierAlreadyExists) {
            throw new ConflictException('A identificação já está cadastrada!');
        }

        const uuid = this.generateUuidService.generate();

        const newCompany = await this.companyService.create({
            ...createCompanyDto,
            uuid
        });

        try {
            this.createCompanyQueue.add({ uuid });
        } catch (error) {}

        return new CreatedCompanyDto(newCompany);
    }

    @Get('render')
    renderFirstPassword(@Res() res: Response, @Query('token') token: string) {
      const data = jsonwebtoken.verify(token, 'teste') as JwtPayload;
      
      console.log('data',data)

        return res.render(
            'first-password', 
            {
                nome: data.userName,
                token: token
            },
        );
    }

    @Post('newPassword')
    createNewPassword(@Res() res: Response, @Body('token') token: string, @Body('password') password: string) {
        
        console.log('token recebido Post', token);
        console.log('senha recebida Post', password);
    }

}
