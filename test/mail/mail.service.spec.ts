import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../src/mail/mail.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

const createEmailSenderMock = () => ({
    to: 'any_email',
    subject: 'any_subject',
    template: 'any_template'
});

describe('Service: MailService', () => {
    let sutMailService: MailService;
    let mailerService: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MailerModule],
            providers: [
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn()
                    }
                },
                MailService
            ],
        }).compile();

        sutMailService = module.get<MailService>(MailService);
        mailerService = module.get<MailerService>(MailerService);
    });

    it('should call MailerService.sendMail with correct values', async () => {
        const data = createEmailSenderMock();
        await sutMailService.send(data);
        expect(mailerService.sendMail).toBeCalledTimes(1);
        expect(mailerService.sendMail).toBeCalledWith({
            context: new Object(),
            ...data
        });
    });

    it('should call MailerService.sendMail with correct values includes data', async () => {
        const data = {
            ...createEmailSenderMock(),
            data: {
                name: 'any_name'
            }
        }
        await sutMailService.send(data);
        expect(mailerService.sendMail).toBeCalledTimes(1);
        expect(mailerService.sendMail).toBeCalledWith({
            context: new Object({
                name: 'any_name'
            }),
            subject: "any_subject",
            template: "any_template",
            to: "any_email"
        });
    });

    it('should throws if MailerService.sendMail throws', async () => {
        jest.spyOn(mailerService, 'sendMail').mockImplementationOnce(() => {
            throw new Error();
        });
        const promise = sutMailService.send(createEmailSenderMock());
        await expect(promise).rejects.toThrow();
    });

    it('should returns true when succeds', async () => {
        const response = await sutMailService.send(createEmailSenderMock());
        expect(response).toBe(true);
    });
});
