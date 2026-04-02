import { Modal, Button, useOverlayState } from "@heroui/react";
import { images } from "../assets";

interface FailureDialogProps {
  isOpen: boolean;
  onRetry: () => void;
}

export default function FailureDialog({ isOpen, onRetry }: FailureDialogProps) {
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
                src={images.eggfatherLose}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a]/40 to-transparent" />
              <div className="w-44 h-[20px] rounded-[50%] bg-radial-[at_top] from-[#6b4c8a]/20 via-[#6b4c8a]/10 to-transparent blur-[3px] mb-3" />

              <p className="text-[#6b4c8a] text-2xl mb-6 text-center">
                You cracked under pressure,<br />but The Eggfather is merciful
              </p>

              <Button
                onPress={onRetry}
                className="bg-[#6b4c8a] text-white rounded-full px-8 py-3 text-xl font-medium cursor-pointer hover:bg-[#5a3d78] transition-colors"
              >
                Try Again
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
