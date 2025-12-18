import React, { useEffect, useState } from "react";
import { useControls, button } from "leva";
import { useGame } from "../hooks/useGame";

export const GameControls: React.FC = () => {
  const { game, deposit, placeBet, newSpin, runSpin } = useGame();
  const [currentBank, setCurrentBank] = useState(game.table.player.bank);

  // Update bank state when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      const bank = game.table.player.bank;
      setCurrentBank((prevBank) => {
        // Only update if the bank actually changed
        if (bank !== prevBank) {
          return bank;
        }
        return prevBank;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [game]);

  const bankControls = useControls("Bank", {
    bank: {
      value: currentBank,
      disabled: true,
    },
    depositAmount: {
      value: 1000,
      min: 1,
      max: 10000,
      step: 1,
    },
    addBank: button(() => {
      try {
        deposit(bankControls.depositAmount);
        setCurrentBank(game.table.player.bank);
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }),
  });

  const betControls = useControls("Bets", {
    betPosition: "P_1",
    betAmount: {
      value: 1,
      min: 1,
      max: 1000,
      step: 1,
    },
    placeBet: button(() => {
      try {
        placeBet(betControls.betPosition, betControls.betAmount);
        setCurrentBank(game.table.player.bank);
      } catch (error) {
        console.error("Error placing bet:", error);
      }
    }),
  });

  useControls("Round", {
    newRound: button(() => {
      newSpin();
      setCurrentBank(game.table.player.bank);
    }),
    runSpin: button(() => {
      runSpin();
      setCurrentBank(game.table.player.bank);
    }),
  });

  return null;
};
