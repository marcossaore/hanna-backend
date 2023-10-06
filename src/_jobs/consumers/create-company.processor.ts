import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('create-company')
export class CreateCompanyProcessor {
  @Process()
  async handleJob(job: Job) {
    console.log('Processing job', job.data);
    // Implement your processing logic here
  }
}