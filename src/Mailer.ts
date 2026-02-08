
import { Transport } from './Contracts/Transport';
import { Mailable } from './Mailable';
import { Message, Attachment, Address } from './Message';

export interface ViewRenderer {
    render(view: string, data: any): Promise<string>;
}

export class Mailer {
    constructor(
        protected name: string,
        protected transport: Transport,
        protected viewRenderer?: ViewRenderer
    ) { }

    to(users: string | Address | (string | Address)[]) {
        return new PendingMail(this).to(users);
    }

    async send(viewPath: string, data: any, callback: (message: Message) => void) {
        const message = new Message();
        callback(message);

        if (viewPath && this.viewRenderer) {
            const html = await this.viewRenderer.render(viewPath, data);
            message.htmlContent(html);
        }

        return this.transport.send(message.getPayload());
    }

    async sendMailable(mailable: Mailable) {
        return this.sendRaw(mailable);
    }

    async sendRaw(message: any) {
        return this.transport.send(message);
    }

    getRenderer() {
        return this.viewRenderer;
    }
}

export class PendingMail {
    protected message: Message;
    protected viewPath?: string;
    protected viewData: any = {};

    constructor(protected mailer: Mailer) {
        this.message = new Message();
    }

    to(users: string | Address | (string | Address)[]) {
        this.message.to(users);
        return this;
    }

    subject(subject: string) {
        this.message.subject(subject);
        return this;
    }

    text(content: string) {
        this.message.textContent(content);
        return this;
    }

    view(path: string, data: any = {}) {
        this.viewPath = path;
        this.viewData = data;
        return this;
    }

    attach(path: string) {
        this.message.attach({ path });
        return this;
    }

    async send(mailable?: Mailable) {
        if (mailable) {
            mailable.build();

            if (mailable.subjectLine) this.message.subject(mailable.subjectLine);
            if (mailable.fromAddress) this.message.from(mailable.fromAddress);
            if (mailable.textContent) this.message.textContent(mailable.textContent);

            if (mailable.viewPath) {
                this.viewPath = mailable.viewPath;
                this.viewData = mailable.viewData;
            }

            if (mailable.attachments) {
                mailable.attachments.forEach(att => this.message.attach(att));
            }
        }

        if (this.viewPath) {
            const renderer = this.mailer.getRenderer();
            if (renderer) {
                const html = await renderer.render(this.viewPath, this.viewData);
                this.message.htmlContent(html);
            }
        }

        return this.mailer.sendRaw(this.message.getPayload());
    }
}
