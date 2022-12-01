import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/RequireAuth";

type CreateForm = {
  apiUri: string;
  serverError: void;
};

export default function CreateAuthority() {
  const toast = useToast();
  const { resolveAxios } = useAuth();
  const axios = resolveAxios();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation(["authority"]);
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const [isHttps, setIsHttps] = useState(true);
  const createAuthority = async (apiUri: string) => {
    return await axios.post("/authorities", { api_uri: apiUri });
  };
  const newAuthority = useMutation<any, AxiosError, any>(createAuthority, {
    onSuccess: (data) => {
      queryClient.refetchQueries(["profile"]);
      toast({
        title: t("common:success_title"),
        description: t("create_new_authority_success_description"),
        status: "success",
        duration: 9000,
        isClosable: true
      });
      reset();
      onClose();
    },
    onError: (error) => {
      // 400 422 500
      console.log("400 Error: ", JSON.stringify(error), error.response?.data);
      setError("serverError", { message: t("common:server_error_message") });
    }
  });

  const onSubmit: SubmitHandler<CreateForm> = (data) => {
    newAuthority.mutate(`${isHttps ? "https://" : "http://"}${data.apiUri}`);
  };

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        variant="ghost"
        size="sm"
        colorScheme="teal"
        onClick={onOpen}
      ></Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("create_new_authority_header")}
          </DrawerHeader>

          <DrawerBody>
            <form
              id="create-authority"
              onSubmit={handleSubmit(onSubmit)}
              className="p-fluid"
            >
              <Stack spacing="24px">
                <Box mt={10}>
                  <FormControl isInvalid={!!errors.apiUri?.message}>
                    <InputGroup>
                      <InputLeftAddon
                        children={isHttps ? "https://" : "http://"}
                        px={"5px"}
                        onClick={() => setIsHttps(!isHttps)}
                      />
                      <Input
                        placeholder={t("api_uri_title")}
                        {...register("apiUri", {
                          required: t("api_uri_required_message")
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.apiUri && errors.apiUri?.message}
                    </FormErrorMessage>
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
                </Box>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
            >
              {t("common:create_new_cancel")}
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={newAuthority.isLoading}
              form="create-authority"
            >
              {t("common:create_new_submit")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
