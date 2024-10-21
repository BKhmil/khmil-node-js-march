import { AggregateOptions, PipelineStage } from "mongoose";

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

  public async findManyByParams(
    params: Partial<IToken>,
  ): Promise<IToken[] | null> {
    return await Token.find(params);
  }

  public async deleteOneByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }

  public async deleteManyByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }

  public async deleteBeforeDate(date: Date): Promise<number> {
    const { deletedCount } = await Token.deleteMany({
      createdAt: { $lt: date },
    });
    return deletedCount;
  }

  public async aggregate(
    pipeline: PipelineStage[],
    options: AggregateOptions = {},
  ): Promise<any[]> {
    return await Token.aggregate(pipeline, options);
  }
}

export const tokenRepository = new TokenRepository();
