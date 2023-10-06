export class GenerateDbCredentialsService {
    generate (): { db: string, dbUser: string, dbPass: string } {
        return {
            db: '',
            dbUser: '',
            dbPass: ''
        }
    } 
}