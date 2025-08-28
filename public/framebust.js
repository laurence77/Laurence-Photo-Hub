// Best-effort clickjacking defense for static hosting where headers can't be set
try {
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
} catch (e) {
  // ignore cross-origin frame access errors
}

