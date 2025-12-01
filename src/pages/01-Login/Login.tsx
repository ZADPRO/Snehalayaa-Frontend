import React, { useRef, useState } from "react";
import "./Login.css";
import { InputText } from "primereact/inputtext";
import { KeyRound, UserRound } from "lucide-react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

import LoginImage from "../../assets/login/loginImage.png";
import logoImage from "../../assets/logo/invoice.png";
import { handleLogin } from "./Login.function";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const userDetailsStr = localStorage.getItem("userDetails");

  //   if (userDetailsStr) {
  //     try {
  //       const userDetails = JSON.parse(userDetailsStr);

  //       if (userDetails.refUserId && userDetails.refUACUsername) {
  //         toast.current?.show({
  //           severity: "info",
  //           summary: "Auto Login",
  //           detail: `Welcome back, ${userDetails.refUACUsername}!`,
  //           life: 2000,
  //         });
  //         setTimeout(() => navigate("/controlPanel"), 1000);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing stored user details:", error);
  //     }
  //   }
  // }, [navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please enter both username and password.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    const result = await handleLogin(username, password);
    setLoading(false);

    if (result.success) {
      toast.current?.show({
        severity: "success",
        summary: "Login Successful",
        detail: "Welcome to Snehalayaa Silks ERP!",
        life: 3000,
      });
      setTimeout(() => navigate("/controlPanel"), 1000);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Login Failed",
        detail: result.message,
        life: 3000,
      });
    }
  };

  return (
    <div className="loginComponent">
      <Toast ref={toast} position="top-right" />

      <div className="loginLeft">
        <img src={LoginImage} alt="ERP Banner" className="loginImage" />
      </div>

      <div className="loginRight">
        <form className="loginForm" onSubmit={onSubmit}>
          <div className="loginImage flex justify-content-center align-items-center">
            <img src={logoImage} alt="Logo" style={{ width: "150px" }} />
          </div>

          <h2 className="login-title">Welcome to Snehalayaa Silks</h2>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <UserRound strokeWidth={1.25} />
            </span>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full"
              required
            />
          </div>

          <div className="p-inputgroup mt-3">
            <span className="p-inputgroup-addon">
              <KeyRound strokeWidth={1.25} />
            </span>
            <Password
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              toggleMask
              feedback={false}
              className="w-full"
              required
            />
          </div>

          <div className="passwordFeatures justify-content-end mt-4">
            <span
              className="forgot cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <Button
            type="submit"
            label={loading ? "" : "Login"}
            className="w-full mt-3 loginButton uppercase font-bold flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#6f1f5f",
              borderColor: "#6f1f5f",
            }}
            disabled={loading}
          >
            {loading && (
              <ProgressSpinner
                style={{ width: "20px", height: "20px" }}
                strokeWidth="4"
              />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
