export class Player {
  public static ERROR_NEGATIVE_AMOUNT = 'Amount must be a positive number';

  public name: string;
  public bank: number;

  constructor(name?: string) {
    this.name = name || 'Player';
    this.bank = 0;
  }

  public deposit(amount: number) {
    if (amount <= 0) {
      throw new Error(Player.ERROR_NEGATIVE_AMOUNT);
    }

    this.bank += amount;
  }

  public bet(amount: number) {
    if (amount <= 0) {
      throw new Error(Player.ERROR_NEGATIVE_AMOUNT);
    }

    this.bank -= amount;
  }

  public win(amount: number) {
    this.bank += amount;
  }

  public returnBet(amount: number) {
    this.bank += amount;
  }
}
