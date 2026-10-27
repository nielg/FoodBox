"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import s from "@/styles/user/profile.module.css";
import type { UserProfileData } from "@/types/user/user.types";

type Props = {
  initData: UserProfileData;
};

export default function UpdateUser({ initData }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputData, setInputData] = useState<UserProfileData>({
    username: initData.username,
    firstname: initData.firstname,
    lastname: initData.lastname,
    email: initData.email,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      const result: { message?: string } = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.location.assign("/user/login");
          return;
        }

        throw new Error(result.message ?? "Failed to update profile.");
      }

      setMessage(result.message ?? "Profile updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={s.profileCard} aria-labelledby="profile-form-heading">
      <div className={s.cardHeading}>
        <span className={s.eyebrow}>Personal information</span>
        <h2 id="profile-form-heading">Update your details</h2>
        <p>These details are used to identify your account.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={s.formGrid}>
          <div className={s.inputBox}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              required
              value={inputData.username}
              onChange={handleChange}
            />
          </div>
          <div className={s.inputBox}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={inputData.email}
              onChange={handleChange}
            />
          </div>
          <div className={s.inputBox}>
            <label htmlFor="firstname">First name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              autoComplete="given-name"
              required
              value={inputData.firstname}
              onChange={handleChange}
            />
          </div>
          <div className={s.inputBox}>
            <label htmlFor="lastname">Last name</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              autoComplete="family-name"
              required
              value={inputData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>

        {message && (
          <p className={s.successMessage} role="status">
            {message}
          </p>
        )}
        {errorMessage && (
          <p className={s.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={s.submitButton}
        >
          {isSubmitting ? "Saving changes..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
