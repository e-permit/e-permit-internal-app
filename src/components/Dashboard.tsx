import { Navigate, Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import {
  Box,
  Flex,
  HStack,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  InputRightElement,
  Avatar
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import FlagIcon from "./icons/flags/FlagIcon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@chakra-ui/icons";
import { useAuth } from "../lib/useAuth";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  const [validPermitId, setValidPermitId] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const code = user?.code?.toLowerCase();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex
          maxW="5xl"
          mx={"auto"}
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              {code && (
                <HStack
                  onClick={() => navigate("/")}
                  _hover={{ cursor: "pointer" }}
                >
                  <FlagIcon code={code} />{" "}
                  <Text as="b" display={{ base: "none", md: "flex" }}>
                    {t(`country.name.${code}`).toUpperCase()}
                  </Text>
                </HStack>
              )}
            </Box>

          </HStack>
          <HStack spacing={3} alignItems="center">
            <FormControl>
              <InputGroup ml="auto">
                <InputLeftElement pointerEvents="none">
                  <MdSearch />
                </InputLeftElement>
                <Input
                  textTransform={searchValue ? "uppercase" : "initial"}
                  placeholder={`${t("Permit Number")}`}
                  onChange={(e) => {
                    const permitIdReg = /^([A-Z]{2}-[A-Z]{2}-20(2[2-9]|[3-9][0-9])-[1-6]-[1-9]{1}[0-9]*)$/;
                    const r = permitIdReg.test(
                      e.currentTarget.value.toUpperCase()
                    );
                    setValidPermitId(r);
                    setSearchValue(e.currentTarget.value.toUpperCase());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && validPermitId) {
                      navigate(`/permits/${searchValue}`, { replace: true });
                      queryClient.invalidateQueries(["permit"]);
                    }
                  }}
                />
                {validPermitId && (
                  <InputRightElement
                    children={<CheckIcon color="green.500" />}
                  />
                )}
              </InputGroup>
            </FormControl>
          </HStack>
          <Flex alignItems={"center"}>

            <Menu placement="bottom-end">
              <MenuButton><Avatar size='sm' /></MenuButton>
              <MenuList>
                <MenuItem icon={<MdLogout />} onClick={() => {
                  setUser(null);
                  navigate("/");
                }}>
                  {t("Sign Out")}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <Box mx={"auto"} p={5} shadow="md" borderWidth="1px" mt={5} maxW="5xl">
        <Outlet />
      </Box>
    </>
  );
}
