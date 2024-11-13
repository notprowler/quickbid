import { useAuth0 } from "@auth0/auth0-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.container}>
      {/* Left Image Side */}
      <div className={styles.imageContainer}>
        <img
          src="../../auth_page_pic.jpg"
          alt="Shopping bag"
          className={styles.image}
        />
      </div>

      {/* Right Form Side */}
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Welcome!</h2>

        <div className={styles.form}>
          {/* Login Button */}
          <button
            type="button"
            className={styles.button}
            onClick={() => loginWithRedirect()}
          >
            Sign in
          </button>
        </div>

        <p className={styles.signInText}>
          Don't have an account?{" "}
          <a
            href="#"
            className={styles.signInLink}
            onClick={() => loginWithRedirect()}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
