import React, { Fragment, useState } from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { signup } from "./../tools";
import TabsButton from "./TabsButton";
import { FaRegSmileBeam } from "react-icons/fa";
import { DateFields, MonthField, DayField, YearField } from "./DateFields";

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
        <TextInput id="displayName" label="Display Name" />
        <TextInput id="photoURL" label="Avatar URL" />
        <TextInput id="email" label="Email" />
        <TextInput id="password" type="password" label="Password" />
        <p>
          <span aria-hidden="true">Start:</span>{" "}
          <DateFields value={startDate} onChange={setStartDate}>
            <MonthField aria-label="Start Month" /> /{" "}
            <DayField aria-label="Start Day" /> /{" "}
            <YearField start={2018} end={2019} aria-label="Start year" />
          </DateFields>
        </p>
        <TabsButton>
          <FaRegSmileBeam />
          <span>{loading ? "Ładowanie..." : "Rejestracja"}</span>
        </TabsButton>
      </form>
    </div>
  );
}
