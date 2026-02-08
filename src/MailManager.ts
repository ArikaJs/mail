
import { Mailer, ViewRenderer } from './Mailer';
import { SmtpTransport } from './Transport/SmtpTransport';

export class MailManager {
    private mailers: Map<string, Mailer> = new Map();

    private customCreators: Map<string, (config: any) => any> = new Map();

    constructor(private config: any, private viewRenderer?: ViewRenderer) { }

    public extend(driver: string, callback: (config: any) => any) {
        this.customCreators.set(driver, callback);
        return this;
    }

    public mailer(name?: string): Mailer {
        const mailerName = name || this.config.default;

        if (!this.mailers.has(mailerName)) {
            this.mailers.set(mailerName, this.resolve(mailerName));
        }

        return this.mailers.get(mailerName)!;
    }

    protected resolve(name: string): Mailer {
        const config = this.config.mailers[name];

        if (!config) {
            throw new Error(`Mailer [${name}] is not defined.`);
        }

        let transport;

        if (this.customCreators.has(config.transport)) {
            transport = this.customCreators.get(config.transport)!(config);
        } else {
            switch (config.transport) {
                case 'smtp':
                    transport = new SmtpTransport(config);
                    break;
                default:
                    throw new Error(`Unsupported transport driver [${config.transport}].`);
            }
        }

        return new Mailer(name, transport, this.viewRenderer);
    }

    public to(users: any) {
        return this.mailer().to(users);
    }
}
