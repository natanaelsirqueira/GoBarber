import IMailTemplateProvider from '../protocols/IMailTamplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
