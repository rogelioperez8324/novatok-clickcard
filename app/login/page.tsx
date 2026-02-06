const handleSignup = async () => {
  setLoading(true);
  setErrorMsg("");

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  alert("Signup successful. Check your email if confirmation is enabled.");
};

const handleLogin = async () => {
  setLoading(true);
  setErrorMsg("");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  // ✅ Force session refresh
  const session = data.session;

  if (!session) {
    setErrorMsg("Login failed. No session returned.");
    return;
  }

  // ✅ Hard redirect fixes Vercel loop issues
  window.location.href = "/dashboard";
};