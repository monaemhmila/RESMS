/* eslint-disable */
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { AbsoluteCenter, Box, Divider, Flex, HStack, Text, Tooltip, useColorModeValue, useDisclosure } from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("brand.600", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.600", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let sidebarBgColor = useColorModeValue("gray.200", "brand.200");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = JSON.parse(localStorage.getItem("user"))

  const { routes, setOpenSidebar, openSidebar } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname ===  routeName;
  };


  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    const activeBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.15)");
    const activeShadow = useColorModeValue("0px 8px 32px rgba(112, 144, 176, 0.15)", "none");
    const activeHoverBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.25)");
    const inactiveHoverBg = useColorModeValue("rgba(0, 0, 0, 0.04)", "rgba(255, 255, 255, 0.08)");

    return routes?.map((route, index) => {
      const active = activeRoute(route.path.toLowerCase());
      if (route?.category) {
        return (
          <Box key={index}>
            <Text
              fontSize={"xs"}
              color={activeColor}
              fontWeight='800'
              textTransform="uppercase"
              letterSpacing="1px"
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='24px'
              pb='12px'
            >
              {route?.name}
            </Text>
            {createLinks(route?.items)}
          </Box>
        );
      } else if (!route?.under && user?.role && route?.layout?.includes(`/${user?.role}`)) {
        return (
          <NavLink key={index} to={route.path}>
            {route?.separator &&
              <Box position='relative' margin='20px 0'>
                <Divider />
                <AbsoluteCenter textTransform={'capitalize'} bg={useColorModeValue("white", "navy.900")} width={'max-content'} padding='0 10px' textAlign={'center'}>
                  {route?.separator}
                </AbsoluteCenter>
              </Box>
            }
            <Box
              mx="10px"
              borderRadius="16px"
              transition="all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
              bg={active ? activeBg : "transparent"}
              boxShadow={active ? activeShadow : "none"}
              border={active ? useColorModeValue("1px solid rgba(255, 255, 255, 0.5)", "1px solid rgba(255, 255, 255, 0.1)") : "1px solid transparent"}
              _hover={{
                bg: active ? activeHoverBg : inactiveHoverBg,
                transform: "translateX(5px) scale(1.02)",
                boxShadow: useColorModeValue("0px 8px 32px rgba(112, 144, 176, 0.15)", "none")
              }}
            >
              <HStack
                spacing="20px"
                py='12px'
                ps='15px'
              >
                <Flex w='100%' alignItems='center' justifyContent='start'>
                  <Box
                    color={active ? activeIcon : textColor}
                    me='12px'
                  >
                    {route.icon}
                  </Box>
                  {openSidebar && (
                    <Text
                      me='auto'
                      color={active ? activeColor : textColor}
                      fontWeight={active ? "700" : "500"}
                      fontSize="sm"
                    >
                      <Tooltip hasArrow label={route.name}>
                        {route.name}
                      </Tooltip>
                    </Text>
                  )}
                </Flex>
                {active && (
                  <Box
                    w='4px'
                    h='20px'
                    bg={brandColor}
                    borderRadius='5px'
                    me="-10px"
                  />
                )}
              </HStack>
            </Box>
          </NavLink>
        );
      }
    });
  };

  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
