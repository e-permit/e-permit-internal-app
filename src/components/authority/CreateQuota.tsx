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
  FormLabel,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/RequireAuth";

type CreateForm = {
  quota: number;
  serverError: void;
};

type CreateQuotaProps = {
  permitYear: number;
  permitType: string;
  authorityCode: string;
}

export default function CreateQuota({ props }: { props: CreateQuotaProps }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { resolveAxios } = useAuth();
  const toast = useToast();
  const { t } = useTranslation("authority");
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const createQuota = async (quota: number) => {
    return await resolveAxios().post("/authority_quotas/add", {
      quantity: quota,
      authority_code: props.authorityCode,
      permit_type: props.permitType,
      permit_year: props.permitYear
    });
  };
  const newQuota = useMutation<any, AxiosError, any>(createQuota, {
    onSuccess: (data) => {
      queryClient.refetchQueries(["authority"]);
      toast({
        title: t("common:success_title"),
        description: t("create_new_quota_success_description"),
        status: "success",
        duration: 9000,
        isClosable: true
      });
      reset();
      onClose();
    },
    onError: (error) => {
      console.log("400 Error: ", JSON.stringify(error), error.response?.data);
      setError("serverError", { message: t("common:server_error_message") });
    }
  });

  const onSubmit: SubmitHandler<CreateForm> = (data) => {
    newQuota.mutate(data.quota);
  };

  return (
    <>
      <IconButton
        aria-label=""
        variant="ghost"
        maxW={50}
        colorScheme="teal"
        onClick={onOpen}
      ><Tooltip label={t("create_quota_button_label")} color='white'><AddIcon /></Tooltip></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("create_new_quota_header")}
          </DrawerHeader>

          <DrawerBody>
            <form
              id="create-quota"
              onSubmit={handleSubmit(onSubmit)}
              className="p-fluid"
            >
              <Stack spacing="24px">
                <Box mt={10}>
                  <FormControl isInvalid={!!errors.quota?.message}>
                    <FormLabel htmlFor="quota">{t("quota_input_label")}</FormLabel>
                    <NumberInput min={1} >
                      <NumberInputField {...register("quota", { required: t("quota_required_message") })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.quota && errors.quota?.message}
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
            <Button variant="outline" mr={3} onClick={() => { reset(); onClose(); }} >
              {t("common:create_new_cancel")}
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={newQuota.isLoading} form="create-quota">
              {t("common:create_new_submit")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
