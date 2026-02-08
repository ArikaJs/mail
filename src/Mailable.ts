
export abstract class Mailable {
    public subjectLine?: string;
    public viewPath?: string;
    public viewData: any = {};
    public textContent?: string;
    public attachments: any[] = [];
    public fromAddress?: string | { name: string; address: string };

    abstract build(): this;

    public subject(subject: string) {
        this.subjectLine = subject;
        return this;
    }

    public view(path: string, data: any = {}) {
        this.viewPath = path;
        this.viewData = data;
        return this;
    }

    public text(content: string) {
        this.textContent = content;
        return this;
    }

    public attach(path: string) {
        this.attachments.push({ path });
        return this;
    }

    public from(address: string | { name: string; address: string }) {
        this.fromAddress = address;
        return this;
    }
}
