import { useNavigate } from "react-router-dom";
import { Modal, Button, useOverlayState } from "@heroui/react";
import bunnyImg from "../assets/bunny.webp";

export default function Intro() {
  const navigate = useNavigate();
  const state = useOverlayState({ isOpen: true, onOpenChange: () => {} });

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/10 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-2 border-[#e8d5f0]">
            <div className="h-3 w-full bg-gradient-to-r from-[#f6c443] via-[#77c572] to-[#b07fd0]" />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              <img
                src={bunnyImg}
                alt=""
                className="w-24 h-auto mb-4 animate-float"
              />

              <h1 className="text-[#6b4c8a] text-2xl text-center mb-3">
                Welcome to Mr. Bunny's
                <br />
                Easter Games 2026
              </h1>

              <p className="text-[#1a1a2e]/70 text-base text-center mb-6 leading-relaxed">
                You are about to embark on a series of high-stakes games. Stay sharp, stay clever, and whatever you do, don't disappoint Mr. Bunny.
              </p>

              {/* Egg divider */}
              <div className="flex gap-2 mb-6">
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

              <Button
                onPress={() => navigate("/wordle")}
                className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Let's Go 🐰
              </Button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
