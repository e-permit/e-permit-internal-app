import FlagIcon from "./icons/flags/FlagIcon";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import i18n from "../lib/i18n";
import { useEffect, useState } from "react";

const langs = [
  {
    code: "en",
    langName: "English"
  },
  {
    code: "tr",
    langName: "Türkçe"
  },
  {
    code: "ru",
    langName: "Russian"
  }
];

export default function SelectLang() {
  const [selectedLang, setSelectedLang] = useState(
    window.localStorage.defaultLanguage || "en"
  );
  useEffect(() => {
    window.localStorage.defaultLanguage = selectedLang;
    i18n.changeLanguage(selectedLang);
  }, [selectedLang]);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <FlagIcon code={selectedLang} />
      </MenuButton>
      <MenuList>
        {langs
          .filter((x) => x.code !== selectedLang)
          .map((lang, i) => {
            return (
              <MenuItem
                key={lang.code}
                icon={<FlagIcon code={lang.code} />}
                onClick={() => {
                  setSelectedLang(lang.code);
                }}
              >
                {lang.langName}
              </MenuItem>
            );
          })}
      </MenuList>
    </Menu>
  );
}
