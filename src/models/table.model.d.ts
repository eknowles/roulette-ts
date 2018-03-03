import { PlayerModel } from './player.model';
import { SpinModel } from './spin.model';
export declare class TableModel {
    numbers: {
        number: number;
        color: string;
    }[];
    positions: {
        id: string;
        betType: string;
        winners: number[];
    }[];
    types: {
        id: string;
        payout: number;
        name: string;
        desc: string;
    }[];
    player: PlayerModel;
    currentSpin: SpinModel;
    previousSpins: SpinModel[];
    constructor(player: PlayerModel);
    newSpin(): void;
}
