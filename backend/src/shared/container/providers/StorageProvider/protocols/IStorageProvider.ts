export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
  getFile?(file: string): Promise<string | undefined>;
}
