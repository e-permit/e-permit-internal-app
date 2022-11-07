import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  HStack,
  List,
  ListItem,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import FlagIcon from "../icons/flags/FlagIcon";
import React, { ReactNode } from "react";

export interface PermitViewProps {
  issuer: string;
  issued_for: string;
  permit_type: string;
  permit_year: number;
  permit_id: string;
  issued_at: string;
  expire_at: string;
  plate_number: string;
  company_id: string;
  company_name: string;
}

function PermitLabel({ children }: { children: ReactNode }) {
  return (
    <Text fontSize={{ base: "16px", md: "17px" }} fontWeight={"600"}>
      {children}
    </Text>
  );
}

export default function PermitView({ permit }: { permit: PermitViewProps }) {
  const { t } = useTranslation(["permit"]);
  return (
    <Box maxW="7xl" mx={"auto"} pt={5}>
      <Box>
        <Text
          fontSize={{ base: "16px", lg: "17px" }}
          color={useColorModeValue("yellow.500", "yellow.300")}
          fontWeight={"500"}
          textTransform={"uppercase"}
          mb={"4"}
        >
          {t("permit_details_label")}
        </Text>
        <Divider mb={"4"} />
        <List spacing={2}>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("issuer_label")}</PermitLabel>
              <Box>
                <HStack spacing="10px">
                  <FlagIcon code={permit.issuer.toLowerCase()} />
                  <Text as={"span"}>
                    {t(`authority_name_${permit.issuer.toLowerCase()}`)}
                  </Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("issued_for_label")}</PermitLabel>
              <Box>
                <HStack spacing="10px">
                  <FlagIcon code={permit.issued_for.toLowerCase()} />
                  <Text as={"span"}>
                    {t(`authority_name_${permit.issued_for.toLowerCase()}`)}
                  </Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("permit_id_label")}</PermitLabel>
              <Text as={"span"}>{permit.permit_id}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("permit_type_label")}</PermitLabel>
              <Text as={"span"}>
                {t(`permit_type_${permit.permit_type.toLowerCase()}_text`)}
              </Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("permit_year_label")}</PermitLabel>
              <Text as={"span"}>{permit.permit_year}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("issued_at_label")}</PermitLabel>
              <Text as={"span"}>{permit.issued_at}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("expire_at_label")}</PermitLabel>
              <Text as={"span"}>{permit.expire_at}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("plate_number_label")}</PermitLabel>
              <Text as={"span"}>{permit.plate_number}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("company_id_label")}</PermitLabel>
              <Text as={"span"}>{permit.company_id}</Text>
            </SimpleGrid>
          </ListItem>
          <ListItem>
            <SimpleGrid columns={4}>
              <PermitLabel>{t("company_name_label")}</PermitLabel>
              <Text as={"span"}>{permit.company_name}</Text>
            </SimpleGrid>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
