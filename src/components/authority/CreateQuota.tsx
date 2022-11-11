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
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const onSubmit: SubmitHandler<CreateForm> = (data) => {
    //newAuthority.mutate(data.apiUri);
  };
  return (
    <>
      <IconButton
        aria-label=""
        variant="ghost"
        maxW={50}
        colorScheme="teal"
        onClick={onOpen}
      ><Tooltip label={t("authority:create_quota_button_label")} color='white'><AddIcon /></Tooltip></IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new account
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
                    <FormLabel htmlFor="quota">Quota</FormLabel>
                    <NumberInput min={1}>
                      <NumberInputField />
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
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
