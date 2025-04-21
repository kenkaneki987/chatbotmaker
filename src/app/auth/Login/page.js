"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { login } from "@/services/auth";


const Page = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  function handleChange(e) {
    e.preventDefault();
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setForm({
      ...form,
      [fieldName]: fieldValue,
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(form);
    // login(form)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const response = await login({
      email: form.email,
      password: form.password,

    });
    localStorage.setItem("token",response.token)


    try {
      const response = await login({
        email: form.email,
        password: form.password,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  return (
    <div>
      <h1 className="login-heading">Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <p>
        Dont have an account? <Link href="/auth/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Page;
