import {
  Box,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/RequireAuth";
import CreateAuthority from "../components/authority/Create";
import FlagIcon from "../components/icons/flags/FlagIcon";

export default function Home() {
  const navigate = useNavigate();
  const { resolveAxios } = useAuth();
  const { t } = useTranslation();
  const getProfile = async () => {
    const { data } = await resolveAxios()?.get(`/`);
    return data;
  };
  const { data, error, isFetching } = useQuery(["profile"], () => getProfile());
  if (isFetching) return <Spinner />;
  if (error) return <div>Error</div>;
  return (
    <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Text
        fontSize={{ base: "16px", lg: "17px" }}
        color={useColorModeValue("gray.500", "gray.300")}
        fontWeight={"500"}
        textTransform={"uppercase"}
        mb={"4"}
      >
        Welcome to e-permit app <CreateAuthority />
      </Text>
      <Divider my={"20px"} />
      <List spacing={3}>
        {data.authorities.map((authority: string) => (
          <ListItem
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/authorities/UZ");
            }}
          >
            <ListIcon
              as={FlagIcon}
              color="green.500"
              code={authority.toLowerCase()}
            />
            <Text ml={"10px"} as="span">
              {t(`country_title_${authority.toLowerCase()}`).toUpperCase()}
            </Text>
          </ListItem>
        ))}
      </List>

      {/*<CreateQuota year={2022} typ="BILITERAL" />
      {t("title")}*/}
    </Box>
  );
}
