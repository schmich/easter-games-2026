import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, useOverlayState } from "@heroui/react";
import { images, audio } from "../assets";

export default function Intro() {
  const navigate = useNavigate();
  const state = useOverlayState({ isOpen: true, onOpenChange: () => {} });

  useEffect(() => {
    const t = setTimeout(() => {
      audio.bugsyIntro.currentTime = 0;
      audio.bugsyIntro.play();
      audio.bugsyIntro.onended = () => {
        setTimeout(() => {
          audio.announcerIntro.currentTime = 0;
          audio.announcerIntro.play();
        }, 1000);
      };
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/10 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden ">
            <div className="h-3 w-full animate-gradient-cycle" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center px-8 pt-6 pb-8">
              <img
                src={images.bugsy}
                alt=""
                className="h-40 w-auto"
              />
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#6b4c8a] to-transparent mb-3" />

              <h1 className="text-[#6b4c8a] text-2xl text-center mb-3">
                Welcome to Bugsy Bunnelli's
                <br />
                2026 Easter Games
              </h1>

              <p className="text-[#6b4c8a] text-lg text-center mb-6 leading-relaxed">
                You are about to embark on a series of high-stakes games. Stay sharp, stay clever, and whatever you do, don't disappoint Bugsy. Godspeed, egg hunter.
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
                onPress={() => navigate("/eggdle")}
                className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
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
