@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0e1210;
  color: #F3F5F0;
}

::selection {
  background-color: #C6FF3D;
  color: #0e1210;
}

/* Visible keyboard focus everywhere */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #C6FF3D;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

.macro-ring {
  --ring-size: 96px;
  width: var(--ring-size);
  height: var(--ring-size);
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: conic-gradient(#C6FF3D calc(var(--pct, 0) * 1%), rgba(243, 245, 240, 0.12) 0);
}

.font-tabular {
  font-variant-numeric: tabular-nums;
}
