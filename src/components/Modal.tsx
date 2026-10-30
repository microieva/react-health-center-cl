import { Box, Modal } from "@mui/material";

export const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{padding:0, overflowX:"hidden"}}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          padding:0,
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          outline: "none",
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Modal>
  );
}