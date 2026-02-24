import React from "react";

export default function UnauthorizedPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized</h1>
      <p>Nemate dozvolu za pristup ovoj stranici.</p>
      <p>Molimo vas da se prijavite sa nalogom koji ima odgovarajuće privilegije.</p>
    </div>
  );
}
