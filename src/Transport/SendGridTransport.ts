
import { Transport } from '../Contracts/Transport';
import nodemailer, { Transporter } from 'nodemailer';
const sgTransport = require('nodemailer-sendgrid-transport');

export class SendGridTransport implements Transport {
    protected transporter: Transporter;

    constructor(config: any) {
        this.transporter = nodemailer.createTransport(sgTransport({
            auth: {
                api_key: config.key,
            },
        }));
    }

    async send(message: any): Promise<void> {
        return await this.transporter.sendMail(message);
    }
}
