import { useState } from "react";
import {
  Box,
  Code,
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
import QuotaList from "../components/authority/QuotaList";

export default function AuthorityDetails() {
  const navigate = useNavigate();
  const { resolveAxios, user } = useAuth();
  const { t } = useTranslation(["common", "permit"]);
  const params = useParams();
  const [year, setYear] = useState(new Date().getFullYear());
  const [permitListProps, setPermitListProps] = useState({ issuer: user?.code, issued_for: params.code, permit_type: "BILITERAL", permit_year: year });

  const authorityTitle = t(`country_name_${user?.code.toLowerCase()}`);
  const selectedAuthorityTitle = t(`country_name_${params.code?.toLowerCase()}`);
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
            {t(`country_name_${data.code.toLowerCase()}`)}
          </Text>
          <Code>{data.api_uri}</Code>
        </HStack>
      </Box>
      <Divider my={"20px"} />
      <SimpleGrid columns={4}>
        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="200px"
              onChange={(e) => { setPermitListProps({ ...permitListProps, issuer: permitListProps.issued_for, issued_for: permitListProps.issuer }) }}>
              <option value={user?.code}>{`${authorityTitle} -> ${selectedAuthorityTitle}`}</option>
              <option value={params.code}>{`${selectedAuthorityTitle} -> ${authorityTitle}`} </option>
            </Select>
          </HStack>
        </Box>

        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="130px"
              onChange={(e) => { setPermitListProps({ ...permitListProps, permit_type: e.target.value }) }}>
              <option value="BILITERAL">{t("permit:permit_type_biliteral_text")}</option>
              <option value="TRANSIT">{t("permit:permit_type_transit_text")}</option>
              <option value="THIRDCOUNTRY">{t("permit:permit_type_thirdcountry_text")}</option>
            </Select>
          </HStack>
        </Box>
        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="80px"
              onChange={(e) => { setPermitListProps({ ...permitListProps, permit_year: Number.parseInt(e.target.value) }) }}>
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </Select>
          </HStack>
        </Box>
      </SimpleGrid>

      <Divider my={"20px"} />
      <QuotaList quotas={[]} />
      <PermitList props={permitListProps} />
    </Box>
  );
}
