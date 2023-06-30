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
  Input,
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
import { useAuth } from "../../lib/useAuth";

type CreateForm = {
  quota: string;
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const createQuota = async (quota: string) => {
    let url = "";
    let data: any = {
      authority_code: props.authorityCode,
      permit_type: props.permitType,
      permit_year: props.permitYear
    };
    if (quota.includes("-")) {
      const parts = quota.split("-");
      data.start_number = Number(parts[0]);
      data.end_number = Number(parts[1]);
      url = "/authority_quotas";
    } else {
      data.quantity = Number(quota);
      url = "/authority_quotas/add";
    }
    return await resolveAxios().post(url, data);
  };
  const newQuota = useMutation<any, AxiosError, any>(createQuota, {
    onSuccess: (data) => {
      queryClient.refetchQueries(["authority"]);
      toast({
        title: t("Success"),
        description: t("Quota is created successfully"),
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
    const quotaReg = /^\d+(?:-\d+)?$/;
    const r = quotaReg.test(data.quota);
    if (!r) {
      setError("quota", { message: t("Quota should be number or range") });
    }else{
      newQuota.mutate(data.quota);
    }
  };

  return (
    <>
      <IconButton
        aria-label=""
        variant="ghost"
        maxW={50}
        colorScheme="teal"
        onClick={onOpen}
      ><Tooltip label={t("New Quota")} color='white'><AddIcon /></Tooltip></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("New Quota")}
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
                    <FormLabel htmlFor="quota">{t("Quota")}</FormLabel>
                    <Input id="quota" {...register("quota", { required: t("Quota is required") })} />
                    <FormErrorMessage>
                      {errors.quota && errors.quota?.message}
                    </FormErrorMessage>
                  </FormControl>
                  {errors.root && (
                    <Alert status="error" mt={"20px"}>
                      <AlertIcon />
                      <AlertTitle>{t("Server Error")}</AlertTitle>
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
            <Button variant="outline" mr={3} onClick={() => { reset(); onClose(); }} >
              {t("Cancel")}
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={newQuota.isLoading} form="create-quota">
              {t("Create")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
