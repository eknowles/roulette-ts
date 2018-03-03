import { PlayerModel } from './player.model';
export interface IBet {
    [positionId: string]: number;
}
export declare class SpinModel {
    createdAt: number;
    bets: IBet;
    winner: null | number;
    player: PlayerModel;
    constructor(player: PlayerModel);
    removePosition(positionId: string): void;
    placeBet(amount: number, positionId: string): void;
    run(): void;
    private processWin();
    private getNumber();
}
