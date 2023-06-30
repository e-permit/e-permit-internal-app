import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
import { useAuth } from "../../lib/useAuth";

type CreateForm = {
  apiUri: string;
};

export default function CreateAuthority() {
  const toast = useToast();
  const { resolveAxios } = useAuth();
  const axios = resolveAxios();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
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
        title: t("Success"),
        description: t("Authority is created successfully"),
        status: "success",
        duration: 9000,
        isClosable: true
      });
      reset();
      onClose();
    },
    onError: (error) => {
      if (error.response?.status == 400) {
        setError("root", { message: t("Bad Request") });
      } else if (error.response?.status == 422) {
        setError("root", { message: 
          `${t("Validation Error")} Details: ${(error.response!.data as any).details.errorCode}` });
      } else if (error.response?.status == 500) {
        setError("root", { message: t("An error has occured") });
      } else {
        setError("root", { message: t("An error has occured") });
      }
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
            {t("New Authority")}
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
                        placeholder={t("Api Address")}
                        {...register("apiUri", {
                          required: t("Api address is required")
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.apiUri && errors.apiUri?.message}
                    </FormErrorMessage>
                  </FormControl>
                  {errors.root && (
                    <Alert status="error" mt={"20px"}>
                      <AlertIcon />
                      <AlertTitle>{t("Server error")}</AlertTitle>
                      <AlertDescription>
                        {t(errors.root.message!)}
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
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={newAuthority.isLoading}
              form="create-authority"
            >
              {t("Create")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
