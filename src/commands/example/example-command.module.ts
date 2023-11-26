import { Module } from '@nestjs/common';
import { ExampleCommandService } from './example.command.service';

@Module({
    providers: [ExampleCommandService],
})
export class ExampleCommandModule {}
