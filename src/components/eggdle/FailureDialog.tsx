import { Modal, Button, useOverlayState } from "@heroui/react";
import { images } from "../../assets";

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
            <div className="h-3 w-full animate-gradient-cycle" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              {/* Bunny image */}
              <img
                src={images.bugsyLose}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a] to-transparent mb-3" />

              <p className="text-[#6b4c8a] text-2xl mb-1 text-center">
                You cracked under pressure!
              </p>
              <p className="text-[#6b4c8a] text-lg mb-6 text-center">
                Lucky for you, Bugsy is merciful
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
