declare namespace Express {
    export interface Request {
       tenant?: {
            identifier: string
       }
    }
 }