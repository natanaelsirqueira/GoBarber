import fs from 'fs';
import handlebars from 'handlebars';

import IMailTemplateProvider from '../protocols/IMailTamplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
    const { file, variables } = data;

    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
