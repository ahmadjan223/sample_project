import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  top: "40%",
  left: "50%",
  
  transform: "translate(-50%, -50%)",
  width: "25%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "32px",
};

export default function InputModal({
  setNewFieldName,
  saveField,
  setOpenInputModal,
  openInputModal,
}) {
  const handleClose = () => {
    setOpenInputModal(false);
    saveField();
  };

  return (
    <div>
      <Modal
        open={openInputModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown={true} // Disable closing on Esc key press
        BackdropProps={{
          onClick: () => {}, // Prevent closing when clicking the backdrop
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={"16px"}>
            Enter the Name of the Field
          </Typography>

          <TextField
            id="standard-basic"
            color="grey"
            sx={{ width: "40%" }}
            label="Required"
            variant="standard"
            onChange={(e) => setNewFieldName(e.target.value)}
            autoFocus
          />
          <Button
            sx={{ marginTop: "16px", color: "green" }}
            variant="text"
            color="primary"
            onClick={handleClose} // Modal only closes when this button is pressed
          >
            Done
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
