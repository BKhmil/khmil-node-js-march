import * as bcrypt from "bcrypt";

class PasswordService {
  // метод який хешує пароль
  public async hashPassword(password: string): Promise<string> {
    // він працює так що додає до паролю так звану сіль і потім це все хешує
    // в залежності від того скільки ітерацій ми вкажемо
    // чим більше ітерацій тим довшим буде процес, але й тим надійніший результат
    return await bcrypt.hash(password, 10);
  }

  // метод який перевіряє пароль
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // він працює дуже просто, бере пароль який користувач ввів, хешує його
    // і перевіряє отриманий хеш з тим який зберігає в бд
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();
