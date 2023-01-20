type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hideCloseButton?: boolean;
  wrapperStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
};

function Modal(props: React.PropsWithChildren<ModalProps>) {
  return (
    <>
      {props.isOpen && (
        <div className="modal-screen" style={props.wrapperStyle}>
          <div
            className="modal-container bg-base-200"
            style={props.containerStyle}
          >
            {!props.hideCloseButton && (
              <button
                className="close-button"
                onClick={() => props.setIsOpen(false)}
              >
                ✕
              </button>
            )}
            <div className="modal-content" style={props.contentStyle}>
              {props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
