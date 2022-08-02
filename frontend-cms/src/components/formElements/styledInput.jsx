import styles from "./styledInput.module.css";

const StyledInput = ({ className, type, config, labelText, error }) => {
  const inputClasses = `${styles.styledInput} ${className}`;

  if (type === "textarea") {
    return (
      <div>
        <label className={styles.styledLabel}>
          {labelText}
          <textarea className={inputClasses} {...config} />
        </label>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  } else {
    return (
      <div>
        <label className={styles.styledLabel}>
          {labelText} <input type={type} className={inputClasses} {...config} />
        </label>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
};

export default StyledInput;
