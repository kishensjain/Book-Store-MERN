import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = (data: RegisterFormInputs) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (user) {
      navigate("/"); // redirect after successful registration
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Create Account
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

/* 
User types → React Hook Form tracks values → Validation checks → errors object updated
          → Submit button clicked → handleSubmit runs → onSubmit(data)
          → Redux dispatch(registerUser) → API call
          → Redux updates loading/user/error
          → UI reacts: button text, error messages, redirect

*/

/*
Without ...:
<input type="text" register="name" />


This won’t work because register("name") returns an object of props like { onChange, onBlur, ref, name }.

You can’t just put the object as a single prop; React doesn’t know what to do with it.

With ... (spread syntax):
<input type="text" {...register("name")} />


The ... spreads all the properties of the object returned by register("name") into the <input> as individual props.

Equivalent to writing:

const props = register("name");
<input type="text" onChange={props.onChange} onBlur={props.onBlur} ref={props.ref} name={props.name} />


React Hook Form needs all these props to:

Track the value of the input

Trigger validation

Manage errors
*/