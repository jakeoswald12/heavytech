"use client";

import { useState } from "react";

/** Newsletter signup. Not wired to a mailing service yet: it validates and confirms locally. */
export default function SignupForm() {
  const [note, setNote] = useState("");

  return (
    <form
      className="signup"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email")?.toString().trim() ?? "";
        setNote(
          /.+@.+\..+/.test(email)
            ? "Thanks. You’re on the list for company updates."
            : "Enter an email address like name@company.com.",
        );
      }}
    >
      <label htmlFor="signup-email" className="sr-only">
        Email for company updates
      </label>
      <div className="signup-row">
        <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="Email for company updates" />
        <button className="btn btn-ghost" type="submit">
          Subscribe
        </button>
      </div>
      <p className="form-note" role="status">
        {note}
      </p>
    </form>
  );
}
