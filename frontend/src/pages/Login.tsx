import { useNavigate, Link } from "react-router";
import { useAppSelector,useAppDispatch } from "../app/hooks";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { loginUser } from "../features/auth/authSlice";


interface LoginFormInputs{
  email:string,
  password:string,
}
const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {user, loading, error} = useAppSelector((state) => state.auth);

  const{register, handleSubmit, formState:{errors},} = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
      dispatch(loginUser(data));
    };

  useEffect(() => {
    if(user){
      navigate("/");
    }
  },[user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          

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
            {loading ? "Logiging in..." : "Login"}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Signup
          </Link>
        </p>
        </form>
      </div>
    </div>
  )
}

export default Login
