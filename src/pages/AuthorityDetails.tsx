import { useState } from "react";
import {
  Box,
  Divider,
  HStack,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/auth/RequireAuth";
import CreateQuota from "../components/authority/CreateQuota";
import FlagIcon from "../components/icons/flags/FlagIcon";
import PermitList from "../components/permit/PermitList";

export default function AuthorityDetails() {
  const navigate = useNavigate();
  const { resolveAxios, user } = useAuth();
  const { t } = useTranslation();
  const params = useParams();
  const [issuer, setIssuer] = useState(user?.code);
  const [year, setYear] = useState(new Date().getFullYear());
  const authorityTitle = t(`country_title_${user?.code.toLowerCase()}`);
  const selectedAuthorityTitle = t(`country_title_${params.code?.toLowerCase()}`);
  const getAuthority = async (code: string | undefined) => {
    const { data } = await resolveAxios()?.get(`/authorities/${code}`);
    return data;
  };

  const { data, error, isFetching } = useQuery(["authority", params.code], () =>
    getAuthority(params.code)
  );
  if (isFetching) return <Spinner />;
  return (
    <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={4}>
        <Box>
          <HStack spacing="10px">
            <FlagIcon code={data.code.toLowerCase()} />
            <Text
              fontSize={{ base: "16px", lg: "17px" }}
              color={useColorModeValue("gray.500", "gray.300")}
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
            >
              {t(`country_title_${data.code.toLowerCase()}`)}
            </Text>
          </HStack>
        </Box>
        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="200px">
              <option value={user?.code}>{`${authorityTitle} -> ${selectedAuthorityTitle}`}</option>
              <option value={params.code}>{`${selectedAuthorityTitle} -> ${authorityTitle}`} </option>
            </Select>
          </HStack>
        </Box>

        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="130px">
              <option value="BILITERAL">Biliteral</option>
              <option value="TRANSIT">Transit</option>
              <option value="THIRDCOUNTRY">Third Country</option>
            </Select>
          </HStack>
        </Box>
        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="80px">
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </Select>
          </HStack>
        </Box>
      </SimpleGrid>

      <Divider my={"20px"} />
      <List spacing={5} ml={5}>
        <ListItem>
          <SimpleGrid columns={4}>
            <Text as="span" fontWeight={"500"}>
              {"Api Endpoint"}
            </Text>
            <Text as={"span"}>{data.api_uri}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={4}>
            <Text as="span" fontWeight={"500"}>
              {"Quota"}
            </Text>
            <Text as={"span"}>{"1000"}</Text>
            <Text as={"span"}>{"1-100, 101-1000"}</Text>
            <CreateQuota year={2022} typ="BILITERAL" />
          </SimpleGrid>{" "}
        </ListItem>
        <ListItem>
          <SimpleGrid columns={4}>
            <Text as="span" fontWeight={"500"}>
              {"Permits"}
            </Text>
            <Text as={"span"}>{"200"}</Text>
          </SimpleGrid>{" "}
        </ListItem>
        <ListItem>
          <SimpleGrid columns={4}>
            <Text as="span" fontWeight={"500"}>
              {"Usage"}
            </Text>
            <Text as={"span"}>{"1000"}</Text>
          </SimpleGrid>{" "}
        </ListItem>
      </List>

      <PermitList />
    </Box>
  );
}
