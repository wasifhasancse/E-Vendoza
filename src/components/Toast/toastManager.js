let toastContainer = null;
let toastCounter = 0;

export const createToast = (message, type = "success", duration = 3000) => {
  if (toastContainer) {
    toastContainer.addToast(message, type, duration);
  }
};

export const registerToastContainer = (container) => {
  toastContainer = container;
};
