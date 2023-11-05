declare namespace Express {
    export interface Request {
       session?: {
            auth?: {
                tenant?: {
                    identifier: string
                }
            }
       }
    }
 }