import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, isRegistering } = useAuthStore();

    const initialValues = {
        fullName: "",
        email: "",
        password: "",
        profilePic: null,
    };

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
        profilePic: Yup.mixed()
            .required("Profile picture is required")
            .test("fileType", "Only image files are allowed", (value) => {
                return value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }),
    });

    const handleSubmit = (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("full_name", values.fullName);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("file", values.profilePic);

        console.log("Submitted", values);
        // send formData to backend
        register(formData).then((data) => {
            console.log(data);
            toast.success("Registration successful! Please login.");
            resetForm();
            // redirect to login page
            navigate("/login");
        }).catch((err) => {
            console.log("registration error", err)
            toast.error(err.response.data.error)
        });

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 mt-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form className="space-y-4">
                            {/* Full Name */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <Field
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full"
                                />
                                <ErrorMessage
                                    name="fullName"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

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

                            {/* Password with toggle */}
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

                            {/* Profile Picture */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Profile Picture</span>
                                </label>
                                <input
                                    type="file"
                                    name="profilePic"
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full"
                                    onChange={(event) => {
                                        setFieldValue("profilePic", event.currentTarget.files[0]);
                                    }}
                                />
                                <ErrorMessage
                                    name="profilePic"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="form-control w-full mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                {/* Already have an account */}
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </span>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default Register;
