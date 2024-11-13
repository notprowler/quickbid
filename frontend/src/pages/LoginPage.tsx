import styles from "./LoginPage.module.css";

function LoginPage() {
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
        <h2 className={styles.title}>Welcome back!</h2>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms" className={styles.checkboxLabel}>
              I agree to the{" "}
              <a href="#" className={styles.link}>
                terms & policy
              </a>
            </label>
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <p className={styles.signInText}>
          Have an account?{" "}
          <a href="#" className={styles.signInLink}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
