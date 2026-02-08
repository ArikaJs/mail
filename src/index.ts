
import { MailManager } from './MailManager';

export { MailManager } from './MailManager';
export { Mailer, PendingMail, ViewRenderer } from './Mailer';
export { Mailable } from './Mailable';
export { Message, Attachment, Address } from './Message';
export { Transport } from './Contracts/Transport';
export { SmtpTransport } from './Transport/SmtpTransport';

let mailManager: MailManager;

export class Mail {
    static setManager(manager: MailManager) {
        mailManager = manager;
    }

    static extend(driver: string, callback: (config: any) => any) {
        if (!mailManager) {
            throw new Error('Mail system not configured. Please use Mail.setManager() to configure.');
        }
        return mailManager.extend(driver, callback);
    }

    static to(users: any) {
        if (!mailManager) {
            throw new Error('Mail system not configured. Please use Mail.setManager() to configure.');
        }
        return mailManager.to(users);
    }

    static mailer(name?: string) {
        if (!mailManager) {
            throw new Error('Mail system not configured. Please use Mail.setManager() to configure.');
        }
        return mailManager.mailer(name);
    }
}
