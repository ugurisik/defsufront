"use client";

import { useModalStore } from "@/store/modalStore";
import { DraggableModal } from "./DraggableModal";

export const ModalContainer = () => {
  const { modals, closeModal } = useModalStore();
  
  return (
    <>
      {Object.entries(modals).map(([id, modal]) => {
        const ModalComponent = modal.component;
        
        return (
          <DraggableModal
            key={id}
            id={id}
            title={modal.props?.title || "Modal"}
            initialPosition={modal.position}
            initialSize={modal.size}
            isResizable={modal.isResizable}
            onClose={(result) => closeModal(id, result)}
          >
            <ModalComponent
              {...modal.props}
              onClose={(result?: any) => closeModal(id, result)}
            />
          </DraggableModal>
        );
      })}
    </>
  );
};
