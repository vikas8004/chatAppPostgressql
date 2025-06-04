import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        email: "",
        password: "",
    };

    const { isLogging, login } = useAuthStore();
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(5, "Minimum 5 characters")
            .required("Password is required"),
    });

    const handleSubmit = (values, { resetForm }) => {

        login(values).then((data) => {
            console.log("Login successful:", data);
            resetForm();
            toast.success("Login successful!");
            navigate("/");
        }).catch((error) => {
            console.error("Login error:", error);
            toast.error(error.response?.data?.error || "Login failed. Please try again.");
        })

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Email */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    className="input input-bordered w-full"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Password */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full pr-12"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </div>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>


                            {/* Submit */}
                            <div className="form-control w-full mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isLogging}
                                >
                                    {isLogging ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            {/* Redirect */}
                            <div className="text-center mt-4">
                                <span className="text-sm">Don't have an account?</span>{" "}
                                <span
                                    className="text-primary cursor-pointer hover:underline"
                                    onClick={() => navigate("/register")}
                                >
                                    Register
                                </span>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
