import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  // метод який створює новий документ в колекції tokens
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }

  // метод який знаходить документ в колекції tokens за одним з полів
  // оскільки інтерфейс IToken має два поля: accessToken i refreshToken,
  // то зрозуміло що шукати ми можемо за будь-яким з цих полів завдяки Partial
  public async findByParams(params: Partial<IToken>): Promise<IToken | null> {
    return await Token.findOne(params);
  }

  public async deleteByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }

  public async deleteSignByAccessToken(accessToken: string): Promise<void> {
    await Token.deleteOne({ accessToken });
  }

  public async deleteAllSignsByUserId(userId: string): Promise<void> {
    await Token.deleteMany({ _userId: userId });
  }
}

export const tokenRepository = new TokenRepository();
