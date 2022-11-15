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
  FormLabel,
  IconButton,
  Input,
  Select,
  Stack,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PermitFilterProps } from "../../lib/PermitFilterProps";
import { useAuth } from "../auth/RequireAuth";

type CreateForm = {
  plate_number: string;
  company_name: string;
  company_id: string;
  serverError: void;
};

export default ({ props }: { props: PermitFilterProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { resolveAxios } = useAuth();
  const toast = useToast();
  const { t } = useTranslation("permit");
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const createPermit = async (form: CreateForm) => {
    return await resolveAxios().post("/permits", {
      issued_for: props.selectedAuthorityCode,
      permit_type: props.permitType,
      permit_year: props.permitYear,
      plate_number: form.plate_number,
      company_name: form.company_name,
      company_id: form.company_id
    });
  };
  const newPermit = useMutation<any, AxiosError, any>(createPermit, {
    onSuccess: (data) => {
      queryClient.refetchQueries(["permits"]);
      toast({
        title: t("common:success_title"),
        description: t("create_new_permit_success_description"),
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
    newPermit.mutate(data);
  };


  return (
    <>
      <IconButton
        aria-label=""
        variant="ghost"
        maxW={50}
        colorScheme="teal"
        onClick={onOpen}
      ><Tooltip label={t("permit:create_permit_button_label")} color='white'><AddIcon /></Tooltip></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("permit:create_permit_button_label")}
          </DrawerHeader>

          <DrawerBody>
            <form
              id="create-permit"
              onSubmit={handleSubmit(onSubmit)}
              className="p-fluid"
            >
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="plate_number">{t("permit:plate_number_label")}</FormLabel>
                  <Input id="plate_number" {...register("plate_number", { required: t("plate_number_required_message") })} />
                </Box>
                <Box>
                  <FormLabel htmlFor="company_name">{t("permit:company_name_label")}</FormLabel>
                  <Input id="company_name" {...register("company_name", { required: t("company_name_required_message") })} />
                </Box>
                <Box>
                  <FormLabel htmlFor="company_id">{t("permit:company_id_label")}</FormLabel>
                  <Input id="company_id" {...register("company_id", { required: t("company_id_required_message") })} />
                </Box>
              </Stack>
              {errors.serverError && (
                <Alert status="error" mt={"20px"}>
                  <AlertIcon />
                  <AlertTitle>Server Error</AlertTitle>
                  <AlertDescription>
                    {errors.serverError.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={() => { reset(); onClose(); }} >
              {t("common:create_new_cancel")}
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={newPermit.isLoading} form="create-permit">
              {t("common:create_new_submit")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
