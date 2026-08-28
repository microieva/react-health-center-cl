import { useEffect, useState } from "react";
import { CustomModal } from "./Modal";
import { LoginOptions } from "./LoginOptions";
import { useAuth } from "../utils/AuthProvider";
import { useLogout } from "../hooks/useLogout";
import { Snackbar } from "@mui/material";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isLoggedIn, currentUser } = useAuth();
  const { logout, error, clearError } = useLogout();

  useEffect(() => {
    if (isLoggedIn) setIsLoggingIn(false);
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await logout();
  }

  const links = [
    ["Services", "#services"],
    ["About", "#about"],
    ["Locations", "#locations"],
    ["Contact", "#contact"],
    ["Testimonials", "#testimonials"],
    ["Send feedback", "#feedback"],
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[2]">
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={Boolean(error)}
        onClose={clearError}
        message={`Unexpected issue when trying to log out: ${error}`}
        key="topright"
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'white',
            color: 'orange',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            paddingBlock: '1rem',
            paddingInline: '2rem',
            width: '30rem'
          },
        }}
      />
      <div className="backdrop-blur-[18px] bg-[rgba(15,23,42,0.22)] border-b border-white-08 px-1 py-3">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="font-bold text-2xl text-primary-white">Health Center</div>
          {currentUser && (
            <div className="text-primary-white text-sm">
              Welcome, {currentUser.email}!
            </div>
          )}
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-sm items-center">
            {!isLoggedIn && links.map(([label, href]) => (
              <a key={label} href={href as string} className="text-primary-white no-underline">
                {label}
              </a>
            ))}
            {!isLoggedIn ? <button
              onClick={() => setIsLoggingIn(true)}
              type="button"
              className="border border-accent-purple-border text-primary-white bg-transparent px-[18px] py-[5px] rounded-[5px] cursor-pointer font-semibold"
            >
              Log in
            </button> : <button
              onClick={handleLogout}
              type="button"
              className="border border-accent-purple-border text-primary-white bg-transparent px-[18px] py-[5px] rounded-[5px] cursor-pointer font-semibold"
            >
              Log out
            </button>}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-md text-primary-white focus:outline-none"
            >
              {/* simple hamburger icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden mt-2 px-5">
            <div className="bg-[rgba(15,23,42,0.9)] border border-white-06 rounded-md py-3 px-4 flex flex-col gap-3">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href as string}
                  onClick={() => setOpen(false)}
                  className="text-primary-white no-underline"
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setIsLoggingIn(true)}
                className="border border-accent-purple-border text-primary-white bg-transparent px-[18px] py-[5px] rounded-[5px] cursor-pointer font-semibold w-fit"
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isLoggingIn}
        onClose={() => setIsLoggingIn(false)}
      >
        <LoginOptions />
      </CustomModal>
    </header>
  );
}
