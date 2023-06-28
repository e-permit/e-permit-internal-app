import { useAuth } from "../lib/useAuth";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputLeftAddon
} from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SelectLang from "../components/SelectLang";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios, { AxiosInstance } from "axios";
import axiosTauriAdapter from 'axios-tauri-api-adapter';
import { Navigate } from "react-router-dom";
type LoginForm = {
  username: string;
  password: string;
  apiUri: string;
  serverError: void;
};


export default function Login() {
  const { t } = useTranslation(["signin", "common"]);
  const [isHttps, setIsHttps] = useState(true);
  const { user, setUser } = useAuth();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>();
  async function signIn(form: LoginForm) {
    const accessToken =
      window.btoa(form.username + ":" + form.password);
    const httpPrefix = isHttps ? "https://" : "http://";
    const apiUri = httpPrefix + form.apiUri;
    const axiosInstance = axios.create({
      baseURL: apiUri,
      headers: {
        Authorization: "Basic " + accessToken
      }
    });
    if ((window as any).__TAURI_IPC__) {
      axiosInstance.defaults.adapter = axiosTauriAdapter;
    }
    try {
      const res = await axiosInstance.get("/");
      if (res.status == 200) {
        let user = {
          accessToken,
          apiUri: apiUri,
          code: res.data.authority,
          roles: res.data.roles,
        };
        setUser(user);
      } else {
        alert(JSON.stringify(res));
        setError("serverError", { message: "Login attempt failed!" + JSON.stringify(res) });
      }
    } catch (e) {
      alert("Error occured!" + JSON.stringify(e));
    }

  }
  const onSubmit: SubmitHandler<LoginForm> = (data) => signIn(data);
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div >
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} minW={"md"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>{t("page_title")}</Heading>
            <Text fontSize={"lg"} color={"gray.600"} as="span">
              {t("page_description")} <SelectLang />
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="api_uri">
                  <InputGroup size="md">
                    <InputLeftAddon
                      children={isHttps ? "https://" : "http://"}
                      px={"5px"}
                      onClick={() => setIsHttps(!isHttps)}
                    />
                    <Input
                      placeholder={t("authority:api_uri_title")}
                      {...register("apiUri", { required: true })}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="username">
                  <FormLabel> {t("username_title")}</FormLabel>
                  <Input {...(register("username", { required: true }))} />
                </FormControl>
                <FormControl id="password">
                  <FormLabel> {t("password_title")}</FormLabel>
                  <Input
                    type="password"
                    {...(register("password", { required: true }))}
                  />
                </FormControl>
                {errors.serverError && (
                  <Alert status="error" mt={"20px"}>
                    <AlertIcon />
                    <AlertTitle>Server Error</AlertTitle>
                    <AlertDescription>
                      {errors.serverError.message}
                    </AlertDescription>
                  </Alert>
                )}
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    leftIcon={<Icon as={MdLogin} />}
                    isLoading={isSubmitting}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500"
                    }}
                  >
                    {t("signin_title")}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
}
