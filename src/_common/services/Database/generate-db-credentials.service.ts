import { Injectable } from "@nestjs/common";
import { generateRandomString, generateRandomInteger } from "../../../../src/_common/helpers/general";

@Injectable()
export class GenerateDbCredentialsService {

    private readonly intervalGenerate = {
        min: 1000,
        max: 9999
    }

    generate (user: string): { dbUser: string, dbPass: string } {
        return {
            dbUser: this.generateUserDb(user),
            dbPass: this.generateUserPass()
        }
    }

    private generateUserDb (user: string): string {
        const splitAndJoinName = user.split(' ').join('');
        const useOnlyChars = splitAndJoinName.length >= 6 ? splitAndJoinName.substring(0, 6) : splitAndJoinName;
        const randomInteger = generateRandomInteger(
            this.intervalGenerate.min,
            this.intervalGenerate.max,
        );
        return `${useOnlyChars}_${randomInteger}`;
    }

    private generateUserPass (): string {
        return generateRandomString(10);
    }
}