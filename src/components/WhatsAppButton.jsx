import React from "react";
import "./WhatsAppButton.css";

export default function WhatsAppButton({
  phoneNumber = "916304620979",
  message = "Hi Ganesh! I visited your portfolio and would like to connect with you.",
}) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-floating-btn"
      aria-label="Chat with Ganesh on WhatsApp"
      data-cursor="WHATSAPP"
    >
      <span className="whatsapp-pulse-ring" aria-hidden="true" />
      <span className="whatsapp-tooltip" role="tooltip">
        Chat with me
      </span>
      <svg
        className="whatsapp-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.27 14.89 13.19C14.67 13.11 14.5 13.07 14.34 13.31C14.18 13.56 13.71 14.11 13.56 14.27C13.42 14.44 13.27 14.46 13.03 14.34C12.78 14.21 11.98 13.95 11.04 13.11C10.31 12.46 9.82 11.65 9.68 11.41C9.54 11.16 9.66 11.03 9.79 10.9C9.9 10.79 10.03 10.61 10.16 10.47C10.29 10.32 10.33 10.22 10.41 10.05C10.5 9.89 10.45 9.75 10.39 9.62C10.33 9.5 9.85 8.32 9.65 7.84C9.45 7.37 9.25 7.43 9.09 7.43C8.94 7.42 8.78 7.33 8.53 7.33Z" />
      </svg>
    </a>
  );
}
