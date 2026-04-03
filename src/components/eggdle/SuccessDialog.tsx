import { Modal, useOverlayState } from "@heroui/react";
import { images, playEnter } from "../../assets";

interface SuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  guessCount: number;
  onNext: () => void;
}

export default function SuccessDialog({
  isOpen,
  onOpenChange,
  guessCount,
  onNext,
}: SuccessDialogProps) {
  const state = useOverlayState({ isOpen, onOpenChange });

  const messages = [
    "Egg-straordinary!",
    "Un-bunny-lievable!",
    "Egg-cellent!",
    "Some-bunny's smart!",
    "Not bad, little egg",
    "Barely hatched it",
  ];
  const message = messages[guessCount - 1] || "Nice!";

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/30 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-white rounded-2xl p-0 overflow-hidden animate-shadow-cycle">
            {/* Easter egg pattern top bar */}
            <div className="h-3 w-full animate-gradient-cycle" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              {/* Bunny image */}
              <img
                src={images.bugsyEggdleWin}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a] to-transparent mb-3" />

              {/* Success message */}
              <p className="text-[#6b4c8a] text-2xl mb-1">
                {message}
              </p>
              <p className="text-[#6b4c8a] text-lg mb-1">
                Solved in {guessCount} {guessCount === 1 ? "guess" : "guesses"}
              </p>

              {/* Egg divider */}
              <div className="flex gap-2 my-4">
                {["#f6c443", "#b07fd0", "#5aad55", "#f6c443", "#b07fd0"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-3 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>

              <p className="text-[#6b4c8a] text-xl mb-6">
                Ready for the next challenge?
              </p>

              <button
                onClick={() => { playEnter(); onNext(); }}
                className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Bring It On 🐰
              </button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
