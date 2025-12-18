import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import { Game } from "../../game";

export const GAME_PHASE = {
  LOADING: "LOADING",
  BET: "BET",
} as const;

export type GamePhase = (typeof GAME_PHASE)[keyof typeof GAME_PHASE];

export interface GameContextValue {
  game: Game;
  phase: GamePhase;
  selectedChipValue: number;
  setSelectedChipValue: (value: number) => void;
  placeBet: (positionId: string, amount?: number) => void;
  deposit: (amount: number) => void;
  newSpin: () => void;
  runSpin: () => void;
}

type Action =
  | { type: "TICK" }
  | { type: "SET_CHIP_VALUE"; value: number }
  | { type: "SET_PHASE"; phase: GamePhase };

interface State {
  version: number;
  selectedChipValue: number;
  phase: GamePhase;
}

const initialState: State = {
  version: 0,
  selectedChipValue: 1,
  phase: GAME_PHASE.LOADING,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TICK":
      return { ...state, version: state.version + 1 };
    case "SET_CHIP_VALUE":
      return { ...state, selectedChipValue: action.value };
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

/**
 * useGameManager - Internal hook to manage game state
 */
function useGameManager(): GameContextValue {
  const [state, dispatch] = useReducer(reducer, initialState);

  const game = useMemo(() => {
    const instance = new Game();
    // Give the player an initial bank like the original warm-up
    instance.table.player.deposit(5000);
    return instance;
  }, []);

  useEffect(() => {
    // Simulate a short loading / warm-up phase
    const timeout = setTimeout(() => {
      dispatch({ type: "SET_PHASE", phase: GAME_PHASE.BET });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const setSelectedChipValue = (value: number) => {
    dispatch({ type: "SET_CHIP_VALUE", value });
  };

  const placeBet = (positionId: string, amount?: number) => {
    const betAmount = amount ?? state.selectedChipValue;

    game.table.currentSpin.placeBet(betAmount, positionId);

    // Trigger re-render for any consumers
    dispatch({ type: "TICK" });
  };

  const deposit = (amount: number) => {
    game.table.player.deposit(amount);
    dispatch({ type: "TICK" });
  };

  const newSpin = () => {
    game.table.newSpin();
    dispatch({ type: "TICK" });
  };

  const runSpin = () => {
    game.table.currentSpin.run();
    dispatch({ type: "TICK" });
  };

  // Expose state; `version` is only used to force updates
  void state.version;

  return {
    game,
    phase: state.phase,
    selectedChipValue: state.selectedChipValue,
    setSelectedChipValue,
    placeBet,
    deposit,
    newSpin,
    runSpin,
  };
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = useGameManager();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
