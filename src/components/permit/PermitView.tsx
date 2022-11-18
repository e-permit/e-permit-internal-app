import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import FlagIcon from "../icons/flags/FlagIcon";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../auth/RequireAuth";
import { useQuery } from "@tanstack/react-query";
import { ViewIcon } from "@chakra-ui/icons";
import ActivityList from "./ActivityList";
import { AiOutlineFilePdf } from "react-icons/ai";

export interface PermitActivity {
  activity_type: string;
  activity_timestamp: string;
  activity_details: string;
}

export interface PermitViewProps {
  inModal: boolean;
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
  used: boolean;
  activities: PermitActivity[]
}

const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });
function PermitLabel({ children }: { children: ReactNode }) {
  return (
    <Text fontSize={{ base: "16px", md: "17px" }} fontWeight={"600"}>
      {children}
    </Text>
  );
}

export function PermitViewModal({ id }: { id: string | undefined }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return <>

    <IconButton
      aria-label="open"
      onClick={onOpen}
      variant="link"
      icon={<ViewIcon />}
      m={4}
    ></IconButton>

    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <PermitView id={id} inModal={true} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
}

export default function PermitView({ id, inModal }: { id: string | undefined, inModal: boolean }) {

  const { resolveAxios } = useAuth();

  const getPermit = async (id: string | undefined) => {
    const { data } = await resolveAxios()?.get(`/permits/find/${id}`);
    return data;
  };
  const getPdf = async (id: string | undefined) => {
    const { data } = await resolveAxios()?.get(`/permits/${id}/pdf`, { responseType: "blob" });
    return `data:application/pdf;base64,${data}`;
  };
  const { data, error, isFetching } = useQuery(["permit", id], () =>
    getPermit(id)
  );
  const pdf = useQuery(["pdf", id], () =>
    getPdf(id)
  );

  if (error) return <div>Request Failed</div>;
  if (isFetching || pdf.isFetching) return <Spinner />;
  return <>
    <PermitInfo permit={{ ...data, inModal }} />
    {pdf.data && <Link color='teal.500' href={pdf.data} download={`${id}.pdf`}>
      <HStack spacing='4px' my={5}><AiOutlineFilePdf /><Text>Download Pdf</Text></HStack>
    </Link>}
    <ActivityList activities={data.activities} /></>;
}

export function PermitInfo({ permit }: { permit: PermitViewProps }) {
  const { t } = useTranslation(["permit", "common"]);
  const columns = permit.inModal ? 2 : 4;
  return <Box maxW="7xl" mx={"auto"} pt={5}>
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
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("issuer_label")}</PermitLabel>
            <Box>
              <HStack spacing="10px">
                <FlagIcon code={permit.issuer.toLowerCase()} />
                <Text as={"span"}>
                  {t(`common:country_name_${permit.issuer.toLowerCase()}`)}
                </Text>
              </HStack>
            </Box>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("issued_for_label")}</PermitLabel>
            <Box>
              <HStack spacing="10px">
                <FlagIcon code={permit.issued_for.toLowerCase()} />
                <Text as={"span"}>
                  {t(`common:country_name_${permit.issued_for.toLowerCase()}`)}
                </Text>
              </HStack>
            </Box>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("permit_id_label")}</PermitLabel>
            <Text as={"span"}>{permit.permit_id}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("plate_number_label")}</PermitLabel>
            <Text as={"span"}>{permit.plate_number}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("permit_type_label")}</PermitLabel>
            <Text as={"span"}>
              {t(`permit_type_${permit.permit_type.toLowerCase()}_text`)}
            </Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("permit_year_label")}</PermitLabel>
            <Text as={"span"}>{permit.permit_year}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("issued_at_label")}</PermitLabel>
            <Text as={"span"}>{permit.issued_at}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("expire_at_label")}</PermitLabel>
            <Text as={"span"}>{permit.expire_at}</Text>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("company_name_label")}</PermitLabel>
            <Text as={"span"}>{permit.company_name}</Text>
          </SimpleGrid>
        </ListItem>
        {permit.company_id && <ListItem>
          <SimpleGrid columns={columns}>
            <PermitLabel>{t("company_id_label")}</PermitLabel>
            <Text as={"span"}>{permit.company_id}</Text>
          </SimpleGrid>
        </ListItem>}
      </List>
    </Box>
  </Box>
}