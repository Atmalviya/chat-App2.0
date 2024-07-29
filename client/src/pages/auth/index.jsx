import { useState } from "react";
import Victory from "@/assets/victory.svg";
import Background from "@/assets/login2.png";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { apiClient } from "@/lib/apiClient";
import { SIGNUP_ROUTE } from "@/utils/constant";
import { Login, Signup } from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const res = await Signup({ email, password });
        console.log(res)
        if (res.status === 201) {
        setUserInfo(res.data.user);
          navigate("/profile");
        }
      } catch (error) {
        // toast.error("eeeeeeeeeeeeeeeeeeeeeeee");
      }
    }
  };


  const handleLogin = async () => {
    if (validateLogin()) {
      const res = await Login({ email, password });
      console.log(res);
      if (res.data.user._id) {
        setUserInfo(res.data.user);
        if(res.data.user.profileSetup){
          console.log("res.data.user._id")
          setUserInfo(res.data.user);
          navigate("/chat");
        }
        navigate("/profile");
      }
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white border-2 border-white text-opacity-90 shadow-2xl w-full max-w-screen-xl rounded-3xl grid grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center p-6 xl:p-10">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold lg:text-6xl">Welcome</h1>
              <img
                src={Victory}
                alt="Welcome image"
                className="h-[100px] ml-2"
              />
            </div>
            <p className="font-medium text-center mt-4">
              Fill in the details to get started
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-full max-w-md" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex justify-around">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-1/2 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6"
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full p-6"
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
