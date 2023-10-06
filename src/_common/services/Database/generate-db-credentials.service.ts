export class GenerateDbCredentialsService {
    generate (): { dbUser: string, dbPass: string } {
        return {
            dbUser: '',
            dbPass: ''
        }
    } 
}