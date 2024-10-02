import bcript from "bcrypt";

export class BcriptService {
  private static readonly BCRIPT_SALT_ROUNDS = process.env.BCRIPT_SALT_ROUNDS;

  static async generateHashPassword(password: string): Promise<string> {
    const salt = await this.generateSalt();
    const hash = await this.generateHash(password, salt);
    return hash;
  }

  static async compareHash(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    try {
      return await bcript.compare(password, hashPassword);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private static async generateSalt(): Promise<string> {
    try {
      if (!this.BCRIPT_SALT_ROUNDS) {
        throw new Error("BCRIPT_SALT_ROUNDS is not defined");
      }
      return await bcript.genSalt(Number(this.BCRIPT_SALT_ROUNDS));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private static async generateHash(
    password: string,
    salt: string
  ): Promise<string> {
    try {
      const hash = await bcript.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
