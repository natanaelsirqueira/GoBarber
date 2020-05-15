import IStorageProvider from '../protocols/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const foundIndex = this.storage.findIndex(
      storedFile => storedFile === file,
    );

    this.storage.splice(foundIndex, 1);
  }

  public async getFile(file: string): Promise<string | undefined> {
    return this.storage.find(storedFile => storedFile === file);
  }
}
