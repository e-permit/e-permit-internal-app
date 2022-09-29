import {
  Box,
  Divider,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { MdLogin, MdLogout } from "react-icons/md";

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
    </Box>
  );
}
