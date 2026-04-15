// src/components/Common/Avatar/Avatar.jsx
import styles from "./Avatar.module.css";

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  className = "",
  ...props
}) {
  const initials = name
    ? `${name.split(" ").map((n) => n[0]).join("").slice(0, 2)}`
    : "?";

  const classes = [styles.avatar, styles[size], className].filter(Boolean).join(" ");

  if (src) {
    return (
      <img src={src} alt={alt || name || "Avatar"} className={classes} {...props} />
    );
  }

  return (
    <div className={`${classes} ${styles.fallback}`} {...props}>
      {initials}
    </div>
  );
}
