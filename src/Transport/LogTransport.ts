import { Transport } from '../Contracts/Transport';

export class LogTransport implements Transport {
    async send(message: any): Promise<void> {
        console.log('--- Email Sent ---');
        console.log(JSON.stringify(message, null, 2));
        console.log('------------------');
    }
}
