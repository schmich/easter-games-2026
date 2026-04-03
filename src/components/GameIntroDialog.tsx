import { Modal, Button, useOverlayState } from "@heroui/react";

interface GameIntroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  description: string;
}

export default function GameIntroDialog({
  isOpen,
  onClose,
  image,
  title,
  description,
}: GameIntroDialogProps) {
  const state = useOverlayState({ isOpen, onOpenChange: () => {} });

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/30 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-2 border-[#e8d5f0]">
            <div className="h-3 w-full animate-gradient-cycle" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              <img
                src={image}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a] to-transparent mb-3" />

              <p className="text-[#6b4c8a] text-2xl mb-1 text-center">
                {title}
              </p>
              <p className="text-[#6b4c8a] text-lg text-center mb-6 leading-relaxed">
                {description}
              </p>

              <Button
                onPress={onClose}
                className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl px-8 py-5 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Continue
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
