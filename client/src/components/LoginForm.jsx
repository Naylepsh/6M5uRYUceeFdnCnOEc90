import React, { useState, useRef } from "react";
import { login } from "./../tools";
import VisuallyHidden from "@reach/visually-hidden";
import { FaSignInAlt } from "react-icons/fa";
import TabsButton from "./TabsButton";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const handleShowPassword = (event) => {
    setShowPassword(event.target.checked);
  };

  return (
    <div>
      {error && (
        <div>
          <p>Nastąpił błąd logowania.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <VisuallyHidden>
          <label htmlFor="login:email">Email:</label>
        </VisuallyHidden>
        <input
          ref={emailRef}
          id="login:email"
          className="inputField"
          placeholder="Twój email"
          required
          type="text"
        />

        <VisuallyHidden>
          <label htmlFor="login:password">Hasło:</label>
        </VisuallyHidden>
        <input
          ref={passwordRef}
          id="login:password"
          type={showPassword ? "text" : "password"}
          className="inputField"
          required
          placeholder="Twoje hasło"
        />
        <div>
          <label>
            <input
              className="passwordCheckbox"
              type="checkbox"
              onChange={handleShowPassword}
              defaultChecked={showPassword}
            />{" "}
            pokaż hasło
          </label>
        </div>

        <TabsButton>
          <FaSignInAlt />
          <span>{loading ? "Ładowanie..." : "Zaloguj"}</span>
        </TabsButton>
      </form>
    </div>
  );
}
