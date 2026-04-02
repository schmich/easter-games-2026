import { Modal, Button, useOverlayState } from "@heroui/react";
import type { ConneggtionsGroup } from "../../lib/conneggtionsData";
import { images } from "../../assets";

const DIFFICULTY_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "#f6c443", text: "#1a1a2e" },
  1: { bg: "#77c572", text: "#ffffff" },
  2: { bg: "#7eb8da", text: "#ffffff" },
  3: { bg: "#b07fd0", text: "#ffffff" },
};

interface EndDialogProps {
  isOpen: boolean;
  won: boolean;
  solvedGroups: ConneggtionsGroup[];
  mistakesRemaining: number;
  onRetry: () => void;
}

export default function EndDialog({
  isOpen,
  won,
  solvedGroups,
  mistakesRemaining,
  onRetry,
}: EndDialogProps) {
  const state = useOverlayState({
    isOpen,
    onOpenChange: () => {},
  });

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/30 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-2 border-[#e8d5f0]">
            {/* Easter egg pattern top bar */}
            <div className="h-3 w-full bg-gradient-to-r from-[#f6c443] via-[#77c572] to-[#b07fd0]" />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              {/* Bunny image */}
              <img
                src={won ? images.eggfatherWin : images.eggfatherLose}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a] to-transparent mb-3" />

              {/* Result message */}
              <p className="text-[#6b4c8a] text-2xl mb-1 text-center">
                {won
                  ? [
                      "Barely hatched it",
                      "Not bad, little egg",
                      "Some-bunny's smart!",
                      "Un-bunny-lievable!",
                      "Egg-straordinary!",
                    ][mistakesRemaining]
                  : "You cracked under pressure!"}
              </p>
              {!won && (
                <p className="text-[#6b4c8a] text-lg mb-4 text-center">
                  Lucky for you, The Eggfather is merciful
                </p>
              )}
              {won && <div className="mb-3" />}

              {won ? (
                <>
                  {/* Solved groups summary */}
                  <div className="flex flex-col gap-2 w-full mb-4">
                    {[...solvedGroups].map((group) => {
                      const colors = DIFFICULTY_COLORS[group.difficulty];
                      return (
                        <div
                          key={group.category}
                          className="rounded-lg py-2 px-3 text-center"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          <p className="text-sm uppercase">
                            {group.category}
                          </p>
                          <p className="text-xs mt-0.5 opacity-80">
                            {group.words.join(", ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Egg divider */}
                  <div className="flex gap-2 my-2">
                    {["#f6c443", "#77c572", "#7eb8da", "#b07fd0"].map(
                      (color, i) => (
                        <div
                          key={i}
                          className="w-3 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </div>
                </>
              ) : (
                <Button
                  onPress={onRetry}
                  className="bg-[#6b4c8a] text-white rounded-full px-8 py-3 text-xl font-medium cursor-pointer hover:bg-[#5a3d78] transition-colors mt-2"
                >
                  Try Again
                </Button>
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
