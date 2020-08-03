import React, { Fragment, useState } from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { signup } from "./../tools";
import TabsButton from "./TabsButton";
import { FaRegSmileBeam } from "react-icons/fa";


function TextInput({ id, label, type = "text" }) {
  return (
    <Fragment>
      <VisuallyHidden>
        <label htmlFor={id}>{label}</label>
      </VisuallyHidden>
      <input id={id} placeholder={label} type={type} required />
    </Fragment>
  );
}

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date("March 1, 2019"));

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    const [displayName, photoURL, email, password] = event.target.elements;
    try {
      await signup({
        displayName: displayName.value,
        email: email.value,
        password: password.value,
        photoURL: photoURL.value,
        startDate,
      });
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <div>
      {error && (
        <div>
          <p>Nastąpił problem z logowaniem.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      <form onSubmit={handleSignup}>
        <TextInput id="displayName" label="imię i nazwisko" />
        <TextInput id="photoURL" label="avatar URL" />
        <TextInput id="email" label="email" />
        <TextInput id="password" type="password" label="hasło" />
        <TabsButton>
          <FaRegSmileBeam />
          <span>{loading ? "Ładowanie..." : "Rejestracja"}</span>
        </TabsButton>
      </form>
    </div>
  );
}
