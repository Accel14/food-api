import { Builder } from 'xml2js';

export class XmlConverter {
    private builder: Builder;

    constructor() {
        this.builder = new Builder({
            rootName: 'response',
            headless: true,
            renderOpts: { pretty: false }
        });
    }

    async convertToXml(obj: any): Promise<string> {
        try {
            return this.builder.buildObject(obj);
        } catch (error) {
            throw new Error(`XML conversion failed: ${error.message}`);
        }
    }
}