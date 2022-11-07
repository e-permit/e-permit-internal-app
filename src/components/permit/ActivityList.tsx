import {
  Box,
  Divider,
  List,
  ListIcon,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  ListItem,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { MdLogin, MdLogout } from "react-icons/md";
import { useTranslation } from "react-i18next";


import FlagIcon from "../icons/flags/FlagIcon";
import React from "react";


function AddActivity() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)
  return (
    <>
      <Box  mt={10}>
      <Button onClick={onOpen} mr={5} colorScheme='green' variant='solid' leftIcon={<MdLogin />}> Enter</Button>
      <Button onClick={onOpen}  colorScheme='red' variant='solid' leftIcon={<MdLogout />}>Exit</Button></Box>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard all of your notes? 44 words will be
            deleted.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button  ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='red' ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function ActivityList() {
  return (
    <Box maxW="md">
      <Text
        fontSize={{ base: "16px", lg: "18px" }}
        color={useColorModeValue("yellow.500", "yellow.300")}
        fontWeight={"400"}
        textTransform={"uppercase"}
        mb={"4"}
        mt={"5"}
      >
        Usage List
      </Text>
      <Divider mb={3} />
      <List spacing={3}>
        <ListItem color="green.500">
          <ListIcon as={MdLogin} /> [ENTER] 2022-09-22T11:00:21
        </ListItem>
        <ListItem color="red.500">
          <ListIcon as={MdLogout} /> [EXIT] 2022-09-22T11:00:21
        </ListItem>
      </List>
      <AddActivity />
    </Box>
  );
}
