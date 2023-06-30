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
import { useAuth } from "../../lib/useAuth";

type CreateForm = {
  plate_number: string;
  company_name: string;
  company_id: string;
};

export default ({ props }: { props: PermitFilterProps }) => {
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
        title: t("Success"),
        description: t("Permit is created successfully"),
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
      ><Tooltip label={t("New Permit")} color='white'><AddIcon /></Tooltip></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("New Permit")}
          </DrawerHeader>

          <DrawerBody>
            <form
              id="create-permit"
              onSubmit={handleSubmit(onSubmit)}
              className="p-fluid"
            >
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="plate_number">{t("permit.label.plate_number")}</FormLabel>
                  <Input id="plate_number" {...register("plate_number", { required: t("Plate number is required") })} />
                </Box>
                <Box>
                  <FormLabel htmlFor="company_name">{t("permit.label.company_name")}</FormLabel>
                  <Input id="company_name" {...register("company_name", { required: t("Company name is required") })} />
                </Box>
                <Box>
                  <FormLabel htmlFor="company_id">{t("permit.label.company_id")}</FormLabel>
                  <Input id="company_id" {...register("company_id", { required: t("Company id is required") })} />
                </Box>
              </Stack>
              {errors.root && (
                <Alert status="error" mt={"20px"}>
                  <AlertIcon />
                  <AlertTitle>{t("Server Error")}</AlertTitle>
                  <AlertDescription>
                    {t(errors.root.message!)}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={() => { reset(); onClose(); }} >
              {t("Cancel")}
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={newPermit.isLoading} form="create-permit">
              {t("Create")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
