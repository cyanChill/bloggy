import styles from "./index.module.css";

const LoadingSpinner = ({ size, thickness }) => {
  let additionalStyles = {};
  if (size) additionalStyles["--size"] = size;
  if (thickness) additionalStyles["--thickness"] = thickness;

  return <div className={styles.spinner} style={additionalStyles} />;
};

export default LoadingSpinner;
