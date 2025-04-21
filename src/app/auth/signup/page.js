"use client";
import Link from "next/link";
import React, { useState } from "react";
import { signup } from "@/services/auth";

const Signup = () => {
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
  const handleSubmit = async (e) => {
    // e.preventDefault();
    // console.log(form);
    // signup(form)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });



    try {
      e.preventDefault();
      const response = await signup({
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
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
        ></input>
        <input
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={handleChange}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <p>
        {" "}
        Already have an Account ? <Link href="/auth/Login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
