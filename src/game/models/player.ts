export class Player {
  public static ERROR_FLOAT_AMOUNT = 'Amount must be a whole number';
  public static ERROR_NEGATIVE_AMOUNT = 'Amount must be a positive number';
  public static validateAmount(amount: number) {
    if (amount <= 0) {
      throw new Error(Player.ERROR_NEGATIVE_AMOUNT);
    }

    if (!Number.isInteger(amount)) {
      throw new Error(Player.ERROR_FLOAT_AMOUNT);
    }
  }

  public name: string;
  public bank: number;

  constructor(name?: string) {
    this.name = name || 'Player';
    this.bank = 0;
  }

  public deposit(amount: number) {
    Player.validateAmount(amount);
    this.bank += amount;
  }

  public bet(amount: number) {
    Player.validateAmount(amount);
    this.bank -= amount;
  }

  public win(amount: number) {
    this.bank += amount;
  }

  public returnBet(amount: number) {
    this.bank += amount;
  }
}
