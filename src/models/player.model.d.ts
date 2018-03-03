export declare class PlayerModel {
    static ERROR_NEGATIVE_AMOUNT: string;
    name: string;
    bank: number;
    constructor(name?: string);
    deposit(amount: number): void;
    bet(amount: number): void;
    win(amount: number): void;
    returnBet(amount: number): void;
}
