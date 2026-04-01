import { Modal, Button, useOverlayState } from "@heroui/react";

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
    "Genius",
    "Magnificent",
    "Impressive",
    "Splendid",
    "Great",
    "Phew",
  ];
  const message = messages[guessCount - 1] || "Nice!";

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
                src="/images/bunny.webp"
                alt=""
                className="w-20 h-auto mb-3 animate-float"
              />

              {/* Success message */}
              <p
                className="text-[#6b4c8a] text-2xl mb-1"
  
              >
                {message}!
              </p>
              <p className="text-[#6b4c8a]/70 text-base mb-1">
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

              <p
                className="text-[#1a1a2e] text-lg mb-6"
  
              >
                Ready for the next challenge?
              </p>

              <Button
                onPress={onNext}
                className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
  
              >
                Bring It On 🐰
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
